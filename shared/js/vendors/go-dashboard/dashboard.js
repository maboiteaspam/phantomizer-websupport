define(["vendors/go-device-preview/device-preview"], function(DevicePreviewFacade) {
    return function Dashboard() {
        var that = this;

        var current_location = window.location;
        var loc = location.pathname;
        if (location.search != "") {
            loc += location.search;
        }

        var val_def = ['Choose one..'];

        that.previewNowUrl = ko.observable(loc);

        that.availableScripts = ko.observableArray(val_def.slice(0));
        that.chosenScript = ko.observable(val_def.slice(0));
        that.contentScript = ko.observable("");

        that.availableStyles = ko.observableArray(val_def.slice(0));
        that.chosenStyle = ko.observable(val_def.slice(0));
        that.contentStyle = ko.observable("");

        that.availableSpecifications = ko.observableArray(val_def.slice(0));
        that.chosenSpecification = ko.observable([]);

        that.previewNoDashboard = ko.observable(false);

        that.networkMinCongestion = ko.observable("0ms");
        that.networkMaxCongestion = ko.observable("0ms");
        that.devicePreview = ko.observable("");
        that.deviceMode = ko.observable("");
        that.networkBandwidth = ko.observable("");
        that.testSpeed = ko.observable("0.5");
        that.DocumentationStatus = ko.observable("");
        that.Optimizations = ko.observable("");


        function update_preview_now_loc(param_to_update) {
            var loc = that.previewNowUrl();
            loc = loc.replace(param_to_update + "&", "");

            if (loc.indexOf("?") == -1) {
                loc += "?" + param_to_update + "";
            } else {
                loc += "&" + param_to_update + "";
            }

            that.previewNowUrl(loc);
        }
        function get_param(param_name) {
            var pattern = ".*[&?]"+param_name+"=([^&]*)"
            pattern = new RegExp(pattern,"i");
            var matches = that.previewNowUrl().match(pattern)
            var param = "";
            if ( matches ) {
                param = matches[1];
            }
            return param
        }

        function less_preview_now_loc(param_to_update) {
            var loc = that.previewNowUrl();
            var params = param_to_update.split("=");

            if( params[1] == "" ){
                var pattern = ".*[&?]"+params[0]+"=([^&]*)"
                pattern = new RegExp(pattern,"i");
                var matches = that.previewNowUrl().match(pattern)
                if ( matches ) {
                    param_to_update = params[0]+"="+matches[1];
                } else {
                    param_to_update = "";
                }
            }

            if( param_to_update != "" ){
                loc = loc.replace(param_to_update + "&", "");
                loc = loc.replace(param_to_update + "", "");

                if (loc.slice(loc.length - 1) == "&")
                    loc = loc.slice(0, loc.length - 1);
                else if (loc.slice(loc.length - 1) == "?")
                    loc = loc.slice(0, loc.length - 1);

                that.previewNowUrl(loc);
            }
        }

        that.SetCurrentLocation = function (location) {
            var loc = location.pathname;
            if (location.search != "") {
                loc += location.search;
            }
            that.previewNowUrl(loc);
        };

        that.GenerateDocumentation = function () {
            that.DocumentationStatus("");
            $.get("/sryke_generate_documentation").done(function (content) {
                that.DocumentationStatus("Ok, documentation is ready.");
            });
        };
        that.goPreview = function () {
            window.location.href = that.previewNowUrl();
        }
        that.goPreviewNoDashBoard = function () {
            that.previewNoDashboard(true);
            window.location.href = that.previewNowUrl();
        }
        that.previewNoDashboard.subscribe(function (newValue) {
            if (newValue == true) {
                update_preview_now_loc("no_dashboard=true");
            } else {
                less_preview_now_loc("no_dashboard=true");
            }
        });
        that.chosenScript.subscribe(function (newValue) {
            if (newValue[0] == val_def[0]) {
                that.contentScript("                Input your code here");
            } else {
                that.contentScript("                Please wait...");
                $.get_raw_script_content(newValue[0]).done(function (content) {
                    that.contentScript(content);
                });
            }
        });
        that.chosenStyle.subscribe(function (newValue) {
            if (newValue[0] == val_def[0]) {
                that.contentStyle("                Input your code here");
            } else {
                that.contentStyle("                Please wait...");
                $.get_raw_script_content(newValue[0]).done(function (content) {
                    that.contentStyle(content);
                });
            }
        });
        that.chosenSpecification.subscribe(function (newValue) {
            if( newValue[0] == "" || newValue[0] == val_def[0] ){
                less_preview_now_loc("spec_files=");
            }else{
                less_preview_now_loc("spec_files=");
                update_preview_now_loc("spec_files="+newValue[0]);
            }
        });
        that.testSpeed.subscribe(function (newValue) {
            if( newValue != "0.5" ){
                less_preview_now_loc("speed=");
                update_preview_now_loc("speed="+newValue);
            }else{
                less_preview_now_loc("speed=");
            }
        });





        var device = get_param("device")
        var device_mode = get_param("device_mode")
        that.devicePreview(device);
        that.deviceMode(device_mode);

        if( $(".device").length == 0 ){
            $("#stryke-db").before("<div class='device'></div>")
        }
        var DevicePreview = new DevicePreviewFacade($(".device"));
        if( device ){
            DevicePreview.EnableDevice(device)
            if( device_mode ) DevicePreview.EnableDeviceMode(device_mode)
        }

        that.devicePreview.subscribe(function (newValue) {
            less_preview_now_loc("device=");
            if( newValue != "" ){
                DevicePreview.EnableDevice(newValue)
                update_preview_now_loc("device="+newValue);
            }else{
                less_preview_now_loc("device_mode=");
                DevicePreview.DisableDevice()
            }
        });
        that.deviceMode.subscribe(function (newValue) {
            less_preview_now_loc("device_mode=");
            if( newValue != "" ){
                DevicePreview.EnableDeviceMode(newValue)
                update_preview_now_loc("device_mode="+newValue);
            }
        });
        that.Optimizations.subscribe(function (newValue) {
            less_preview_now_loc("build_profile=");
            if( newValue != "" ){
                update_preview_now_loc("build_profile="+newValue);
            }
        });

        var spec_loc = get_param("spec_files")
        that.chosenSpecification([spec_loc]);

        var build_profile = get_param("build_profile")
        that.Optimizations([build_profile]);

        var speed = get_param("speed")
        if( speed != "" ){
            that.testSpeed(speed);
        }

        that.previewNoDashboard(current_location.href.indexOf("no_dashboard=true") > -1);


        $.get("/stryke_get_bdw", function (newValue) {
            that.networkBandwidth(newValue);
            that.networkBandwidth.subscribe(function (newValue) {
                $.get("/stryke_bdw/" + newValue);
            });
        });

        function disable_previous_options( select, value ){
            var options = $(select).find("option")
            options.removeAttr("disabled");
            var index = options.filter("[value='" + value + "']").index();
            options.each(function(k,v){
                if( v < index ){
                    $(v).attr("disabled", "disabled");
                }
            })
        }

        function disable_next_options( select, value ){
            var options = $(select).find("option")
            options.removeAttr("disabled");
            var index = options.filter("[value='" + value + "']").index();
            options.each(function(k,v){
                if( v > index ){
                    $(v).attr("disabled", "disabled");
                }
            })
        }

        $.get("/get_stryke_min_congestion", function (newValue) {
            that.networkMinCongestion(newValue);
            disable_previous_options($("#network_congestion_max"), newValue);
            that.networkMinCongestion.subscribe(function (newValue) {
                disable_previous_options($("#network_congestion_max"), newValue);
                $.get("/stryke_min_congestion/" + newValue);
            });
        });

        $.get("/stryke_get_max_congestion", function (newValue) {
            that.networkMaxCongestion(newValue);
            disable_next_options($("#network_congestion_min"), newValue);
            that.networkMaxCongestion.subscribe(function (newValue) {
                disable_next_options($("#network_congestion_min"), newValue);
                $.get("/stryke_max_congestion/" + newValue);
            });
        });

        
    };
});


