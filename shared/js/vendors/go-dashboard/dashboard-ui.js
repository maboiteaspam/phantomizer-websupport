"use strict";

define([
    "vendors/go-dashboard/dashboard",
    "vendors/go-jquery/jquery.qrcode.min"
], function(Dashboard, qrcode) {

    $.fn.dashboard = function (options) {
        var el = $(this).find(".dashboard");
        if (!$(el).data("dashboard")) {
            $(el).data("dashboard", true);

            var DashboardViewModel = new Dashboard();
            var __has_loaded = false;
            // catch click tab title
            $(el).find(".dashboard-scene>ul").click(function (event) {
                if ($(event.target).is("a")) {

                    if (!__has_loaded) {
                        var base_dir = window.location.pathname;
                        base_dir = base_dir.substring(0, base_dir.lastIndexOf("/") + 1)
                        $("html script[src]").each(function (i, e) {
                            var src = $(e).attr("src");
                            if (src) {
                                src = src.replace(/\\/g,"/");
                                src = src.replace("//","/");
                                src = src.replace("//","/");
                                if (src.substr(0, 1) != "/") {
                                    src = base_dir + src;
                                }
                                DashboardViewModel.availableScripts.push(src);
                            }
                        });
                        $("html link[href]").each(function (i, e) {
                            if ($(e).attr("rel") == "stylesheet" || $(e).attr("type") == "text/css") {
                                var src = $(e).attr("href");
                                if (src) {
                                    src = src.replace(/\\/g,"/");
                                    src = src.replace("//","/");
                                    src = src.replace("//","/");
                                    if (src.substr(0, 1) != "/") {
                                        src = base_dir + src;
                                    }
                                    DashboardViewModel.availableStyles.push(src);
                                }
                            }
                        });


                        var clean_html = function(_content){
                            var re = /<script([^>]*)>([\S\s]*?)<\/script>/gim
                            var myArray;
                            while ((myArray = re.exec(_content)) != null) {
                                _content = _content.replace(myArray[0], "")
                            }
                            if ((myArray = re.exec(_content)) != null) {
                                _content = _content.replace(myArray[0], "")
                            }
                            re = /<style([^>]*)>([\S\s]*?)<\/style>/gim
                            while ((myArray = re.exec(_content)) != null) {
                                _content = _content.replace(myArray[0], "")
                            }
                            if ((myArray = re.exec(_content)) != null) {
                                _content = _content.replace(myArray[0], "")
                            }
                            return _content;
                        }
                        var get_specs = function (loc, fn_found) {
                            $.get(loc, function (content) {
                                var _h_doc = $("<div></div>");
                                _h_doc.hide().appendTo("body");
                                _h_doc.append(clean_html(content));
                                _h_doc.find("a").each(function (i, v) {
                                    var x = $(v).attr("href");
                                    if (x.substring(x.indexOf('.js'), x.length).toLowerCase() == ".js") {
                                        x = x.replace(/\\/g,"/");
                                        x = x.replace("//","/");
                                        x = x.replace("//","/");
                                        if(x.substring(0,loc.length) != loc ){
                                            x = loc+x;
                                        }
                                        fn_found(x);
                                    }
                                });
                                _h_doc.remove();
                            });
                        }

                        var loc = "/js/tests/";
                        get_specs(loc, function (found_loc) {
                            DashboardViewModel.availableSpecifications.push(found_loc);
                        });
                        loc = "/js/tests" + window.location.pathname.replace(/\.[^/.]+$/, "/")
                        get_specs(loc, function (found_loc) {
                            DashboardViewModel.availableSpecifications.push(found_loc);
                        });

                    }
                    __has_loaded = true;

                    var index = $(event.target).parent().index();
                    $(el).dashboard_open(index);
                    return false;
                }
            });

            // catch click close button
            $(el).find(".dashboard-scene>.close").click(function () {
                $(el).dashboard_close();
                return false;
            });
            $(el).find(".half-opac-bg").click(function () {
                $(el).dashboard_close();
                return false;
            });

            // catch inject holmes
            $(el).find(".dashboard-scene .holmes_inject").click(function () {
                inject_holmes();
                return false;
            });

            // catch cache clean
            $(el).find(".dashboard-scene #cache_clean").click(function () {
                $.get("/stryke_clean");
                return false;
            });

            // catch report jslint
            $(el).find(".dashboard-scene .jslint_btn_report").click(function () {
                var src = DashboardViewModel.chosenScript()[0];
                if (src.match(/\.js/)) {
                    $.ajax({
                        url: src,
                        dataType: "text"
                    }).done(function (content) {
                        create_jslint_report(el, content).done(function (messages) {
                            var view = $(el).dashboard_add_view("JsLint Report");
                            var id = $(view).attr("id");
                            $(view).html('<h2>Report about <span data-bind="text: ' + id + '.src"></span></h2>' +
                                '<div class="jslint_report">' +
                                '   <table>' +
                                '       <tbody data-bind="foreach: ' + id + '.messages">' +
                                '           <tr data-bind="attr: { title: evidence }">' +
                                '               <td data-bind="text: id"></td>' +
                                '               <td data-bind="text: message"></td>' +
                                '               <td>line: <span data-bind="text: line"></span>, col: <span data-bind="text: col"></span></td>' +
                                '           </tr>' +
                                '       </tbody>' +
                                '   </table>' +
                                '</div>');
                            var report = {src: src, messages: messages};
                            report[id] = report;
                            ko.applyBindings(report, $(view)[0]);
                        });
                    });
                }
                return false;
            });

            // catch report jshint
            $(el).find(".dashboard-scene .jshint_btn_report").click(function () {
                var src = DashboardViewModel.chosenScript()[0];
                if (src.match(/\.js/)) {
                    $.ajax({
                        url: src,
                        dataType: "text"
                    }).done(function (content) {
                        create_jshint_report(el, content, function (messages) {
                            var view = $(el).dashboard_add_view("JsHint Report");
                            var id = $(view).attr("id");
                            $(view).html('<h2>Report about <span data-bind="text: ' + id + '.src"></span></h2>' +
                                '<div class="jshint_report">' +
                                '   <table>' +
                                '       <tbody data-bind="foreach: ' + id + '.messages">' +
                                '           <tr data-bind="attr: { title: evidence }">' +
                                '               <td data-bind="text: id"></td>' +
                                '               <td data-bind="text: message"></td>' +
                                '               <td>line: <span data-bind="text: line"></span>, col: <span data-bind="text: col"></span></td>' +
                                '           </tr>' +
                                '       </tbody>' +
                                '   </table>' +
                                '</div>');
                            var report = {src: src, messages: messages};
                            report[id] = report;
                            ko.applyBindings(report, $(view)[0]);
                        });
                    });
                }
                return false;
            });
            // catch report csslint
            $(el).find(".dashboard-scene .csslint_report").click(function () {
                var src = DashboardViewModel.chosenStyle()[0];
                if (src.match(/\.css/)) {
                    $.get(src).done(function (content) {
                        create_csslint_report(el, content).done(function (messages) {
                            var view = $(el).dashboard_add_view("CssLint Report");
                            var id = $(view).attr("id");
                            $(view).html('<h2>Report about <span data-bind="text: ' + id + '.src"></span></h2>' +
                                '<div>' +
                                '<div data-bind="foreach: ' + id + '.messages">' +
                                '<span data-bind="text: message"></span>' +
                                '<br/>' +
                                '</div>' +
                                '</div>');
                            var report = {src: src, messages: messages};
                            report[id] = report;
                            ko.applyBindings(report, $(view)[0]);
                        });
                    });
                }
                return false;
            });
            // catch report csslint
            $(el).find(".tab-qrcode").click(function () {
                $('#qrcode').children().remove();
                $('#qrcode').qrcode({
                    text: window.location.origin+""+DashboardViewModel.previewNowUrl(),
                    correctLevel: 1,
                    width: 128,
                    height: 128,
                    foreground: '#77953b'
                });
            });

            ko.applyBindings({dashboard: DashboardViewModel}, $(el)[0]);
        }
        return $(this);
    };
    $.fn.dashboard_close = function () {
        var el = this;
        $(el).find(".dashboard-activeview").removeClass("dashboard-activeview");
        $(el).addClass("dashboard-closed");
    };
    $.fn.dashboard_open = function (index) {
        var el = this;
        $(el).find(".dashboard-activeview").removeClass("dashboard-activeview");
        $($(el).find(".dashboard-view").get(index)).addClass("dashboard-activeview");
        $(el).removeClass("dashboard-closed");
    };
    $.fn.dashboard_add_view = function (title) {
        var el = this;
        var index = $("html .dashboard-report").length;
        $(el).find(".dashboard-scene ul").append('<li><a href="#">' + title + '</a></li>');
        $(el).find(".dashboard-scene").append('<div class="dashboard-view dashboard-report" id="report' + index + '"></div>');
        return $("#report" + index);
    };

    $.fn.load_dashboard = function (url, done) {
        var el = this;
        $.get(url, function(data){
            $(el).html(data);
            if( done ) done(data)
        })
        return $
    };

    var inject_holmes = function () {
        if ($("body").hasClass("holmes-debug")) {
            //$(this).html("Inspect your code");
            $("body").removeClass("holmes-debug");
        } else {
            var lib_src = "/js/vendors/go-holmes/holmes.min.css";
            if ($("body").find("link[href='" + lib_src + "']").length == 0) {
                $("body").append("<link rel='stylesheet' style='text/css' href='" + lib_src + "'/>");
            }
            $("*[class='']").removeAttr("class");
            /* avoid un-interesting errors */
            $("body").addClass("holmes-debug");
            //$(this).html("Recall Sherlock");
        }
        return false;
    };
    var create_jslint_report = function (el, script_content) {

        var lib_src = "/js/vendors/go-jslint/jslint.js";
        if ($("body").find("script[src='" + lib_src + "']").length == 0) {
            $("<script type='text/javascript' src='" + lib_src + "'></script>").appendTo(el);
        }
        var dfd = jQuery.Deferred();
        window.setTimeout(function(){
            /*
             //     anon       true, if the space may be omitted in anonymous function declarations
             //     bitwise    true, if bitwise operators should be allowed
             //     browser    true, if the standard browser globals should be predefined
             //     'continue' true, if the continuation statement should be tolerated
             //     css        true, if CSS workarounds should be tolerated
             //     debug      true, if debugger statements should be allowed
             //     devel      true, if logging should be allowed (console, alert, etc.)
             //     eqeq       true, if == should be allowed
             //     es5        true, if ES5 syntax should be allowed
             //     evil       true, if eval should be allowed
             //     forin      true, if for in statements need not filter
             //     fragment   true, if HTML fragments should be allowed
             //     indent     the indentation factor
             //     maxerr     the maximum number of errors to allow
             //     maxlen     the maximum length of a source line
             //     newcap     true, if constructor names capitalization is ignored
             //     node       true, if Node.js globals should be predefined
             //     nomen      true, if names may have dangling _
             //     on         true, if HTML event handlers should be allowed
             //     passfail   true, if the scan should stop on first error
             //     plusplus   true, if increment/decrement should be allowed
             //     properties true, if all property names must be declared with / *properties* /
             //     regexp     true, if the . should be allowed in regexp literals
             //     rhino      true, if the Rhino environment globals should be predefined
             //     undef      true, if variables can be declared out of order
             //     unparam    true, if unused parameters should be tolerated
             //     sloppy     true, if the 'use strict'; pragma is optional
             //     stupid     true, if really stupid practices are tolerated
             //     sub        true, if all forms of subscript notation are tolerated
             //     todo       true, if TODO comments are tolerated
             //     vars       true, if multiple var statements per function should be allowed
             //     white      true, if sloppy whitespace is tolerated
             //     windows    true, if MS Windows-specific globals should be predefined

             //      to be configured
             */

            var myResult = JSLINT(script_content, {"predef": []});
            if (myResult == false) {
                var myReport = JSLINT.errors;
                //var myErrorReport = JSLINT.error_report(data);
                //var myPropertyReport = JSLINT.properties_report(JSLINT.property);

                var messages = new Array();
                for (var i = 0, len = myReport.length; i < len; i++) {
                    var m = myReport[i];
                    if (m != null) {
                        messages.push({
                            "message": m.reason,
                            "id": m.id,
                            "line": m.line,
                            "col": m.character,
                            "evidence": m.evidence
                        });
                    }
                }
                dfd.resolve(messages);
            } else {
                dfd.resolve([]);
            }
        },10)
        return dfd;
    };
    var create_jshint_report = function(el, script_content, callback){
        require(["vendors/go-jshint/jshint-1.1.0"], function(  ){
            var options = {};
            var globals = {};
            var success = JSHINT(script_content, options, globals);
            if (success == false) {
                var myReport = JSHINT.errors;
                //var myErrorReport = JSLINT.error_report(data);
                //var myPropertyReport = JSLINT.properties_report(JSLINT.property);

                var messages = new Array();
                for (var i = 0, len = myReport.length; i < len; i++) {
                    var m = myReport[i];
                    if (m != null) {
                        messages.push({
                            "message": m.reason,
                            "id": m.id,
                            "line": m.line,
                            "col": m.character,
                            "evidence": m.evidence
                        });
                    }
                }
                callback(messages);
            }
        });
    }
    var create_csslint_report = function (el, css_content) {

        var lib_src = "/js/vendors/go-csslint/csslint.js";
        if ($("body").find("script[src='" + lib_src + "']").length == 0) {
            $("<script type='text/javascript' src='" + lib_src + "'></script>").appendTo(el);
        }
        var dfd = jQuery.Deferred();
        window.setTimeout(function(){
            var results = CSSLint.verify(css_content);
            var messages = new Array();

            for (var i = 0, len = results.messages.length; i < len; i++) {
                var m = results.messages[i];
                messages.push({
                    "message": m.message + " (line " + m.line + ", col " + m.col + ")",
                    "level": m.type
                });
            }

            dfd.resolve(messages);
        },10)
        return dfd;
    };

    return $
});
