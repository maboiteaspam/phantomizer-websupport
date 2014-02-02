"use strict";

define([
    "vendors/go-dashboard/dashboard",
    "vendors/go-jquery/jquery.qrcode.min",
    "vendors/go-knockout/knockout-3.0.0.min"
], function(
    Dashboard,
    qrcode,
    ko_) {

    var ko = ko_ || window.ko;

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

            if( ! $(".half-opac-bg").length ){
                $("<div class='half-opac-bg'></div>").appendTo("body");
            }
            // catch click close button
            $(el).find(".dashboard-scene>.close").click(function () {
                $(el).dashboard_close();
                return false;
            });
            $(".half-opac-bg").click(function () {
                $(el).dashboard_close();
                return false;
            });

            // catch inject holmes
            $(el).find(".dashboard-scene .holmes_inject").click(inject_holmes);

            // catch cache clean
            $(el).find(".dashboard-scene #cache_clean").click(function () {
                $.get("/stryke_clean");
                return false;
            });

            // qrcode
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
        $(el).find("ul li").removeClass("dashboard-activetab");
        $(el).find(".dashboard-activeview").removeClass("dashboard-activeview");
        $(el).addClass("dashboard-closed");
        $("#stryke-db").css("bottom","40px");
        $("#stryke-db").css("left", "auto");
        $("#stryke-db").css("top", "auto");
        $(".half-opac-bg").css("display","none");
        $(".dashboard").css("top","auto");
        $(".dashboard").css("left","auto");
    };
    $.fn.dashboard_open = function (index) {
        var el = this;
        $("#stryke-db").css("bottom", "auto");
        $("#stryke-db").css("left", "50%");
        $("#stryke-db").css("top", "50%");
        $(".half-opac-bg").css("display","block");
        $(el).find(".dashboard-activeview").removeClass("dashboard-activeview");
        $(el).find("ul li").removeClass("dashboard-activetab");
        $($(el).find(".dashboard-view").get(index)).addClass("dashboard-activeview");
        $($(el).find("ul li").get(index)).addClass("dashboard-activetab");
        $(el).removeClass("dashboard-closed");

        $(".dashboard").css("top","-"+parseInt($(".dashboard").height()/2)+"px");
        $(".dashboard").css("left","-"+parseInt($(".dashboard").width()/2)+"px");
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

    return $
});
