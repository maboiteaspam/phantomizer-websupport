"use strict";

define(["vendors/go-device-preview/device-preview",
    "vendors/utils/mockajax",
    "vendors/utils/url_util"
], function(DevicePreviewFacade,
            mockajax,
            url_util) {
    return function Dashboard() {
        var that = this;
        url_util = new url_util();

        var current_location = window.location;
        var loc = location.pathname;
        if (location.search != "") {
            loc += location.search;
        }

        var val_def = ['Choose one..'];

        that.previewNowUrl = ko.observable(loc);
        that.previewNowAbsUrl = ko.observable(window.location.origin+""+loc);
        that.previewNowUrl.subscribe(function(loc){
            that.previewNowAbsUrl(window.location.origin+""+loc);
        });

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
        that.delay = ko.observable(null);

        var no_dashboard_enabled = true;
        var doc_gen_enabled = true;

        that.SetCurrentLocation = function (location) {
            var loc = location.pathname;
            if (location.search != "") {
                loc += location.search;
            }
            that.previewNowUrl(loc);
        };

        that.GenerateDocumentation = function () {
            if( doc_gen_enabled ){
                that.DocumentationStatus("");
                $.get("/sryke_generate_documentation").done(function (content) {
                    that.DocumentationStatus("Ok, documentation is ready.");
                });
            }
        };
        that.goPreview = function () {
            window.location.href = that.previewNowUrl();
        }
        that.goPreviewNoDashBoard = function () {
            if(no_dashboard_enabled){
                that.previewNoDashboard(true);
                window.location.href = that.previewNowUrl();
            }
        }
        that.previewNoDashboard.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            if (newValue == true) {
                loc = url_util.more_param(loc,"no_dashboard=true");
            } else {
                loc = url_util.less_param(loc,"no_dashboard=true");
            }
            that.previewNowUrl(loc);
        });
        that.chosenScript.subscribe(function (newValue) {
            if (newValue[0] == val_def[0]) {
                that.contentScript("                Input your code here");
            } else {
                that.contentScript("                Please wait...");
                $.ajax({
                    url: newValue[0],
                    dataType: "text"
                }).done(function (content) {
                    that.contentScript(content);
                });
            }
        });
        that.chosenStyle.subscribe(function (newValue) {
            if (newValue[0] == val_def[0]) {
                that.contentStyle("                Input your code here");
            } else {
                that.contentStyle("                Please wait...");
                $.ajax({
                    url: newValue[0],
                    dataType: "text"
                }).done(function (content) {
                    that.contentStyle(content);
                });
            }
        });
        that.chosenSpecification.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            if( newValue[0] == "" || newValue[0] == val_def[0] ){
                loc = url_util.less_param(loc,"spec_files=");
            }else{
                loc = url_util.less_param(loc,"spec_files=");
                loc = url_util.more_param(loc,"spec_files="+newValue[0]);
            }
            that.previewNowUrl(loc);
        });
        that.testSpeed.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            if( newValue != "0.5" ){
                loc = url_util.less_param(loc,"speed=");
                loc = url_util.more_param(loc,"speed="+newValue);
            }else{
                loc = url_util.less_param(loc,"speed=");
            }
            that.previewNowUrl(loc);
        });




        var delay = url_util.get_param(that.previewNowUrl(),"delay");
        that.delay.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            $.setMockDelay(newValue[0]);
            if( newValue[0] == "" ){
                loc = url_util.less_param(loc,"delay=");
            }else{
                loc = url_util.less_param(loc,"delay=");
                loc = url_util.more_param(loc,"delay="+newValue[0]);
            }
            that.previewNowUrl(loc);
        });
        that.delay([delay]);


        var device = url_util.get_param(that.previewNowUrl(),"device");
        var device_mode = url_util.get_param(that.previewNowUrl(),"device_mode")
        that.devicePreview(device);
        if(device && !device_mode)device_mode="landscape";
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
            var loc = that.previewNowUrl();
            loc = url_util.less_param(loc,"device=");
            if( newValue != "" ){
                DevicePreview.EnableDevice(newValue)
                loc = url_util.more_param(loc,"device="+newValue);
            }else{
                loc = url_util.less_param(loc,"device_mode=");
                DevicePreview.DisableDevice()
                that.deviceMode("")
            }
            that.previewNowUrl(loc);
        });
        that.deviceMode.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            loc = url_util.less_param(loc,"device_mode=");
            if( newValue != "" ){
                DevicePreview.EnableDeviceMode(newValue)
                loc = url_util.more_param(loc,"device_mode="+newValue);
            }
            that.previewNowUrl(loc);
        });
        that.Optimizations.subscribe(function (newValue) {
            var loc = that.previewNowUrl();
            loc = url_util.less_param(loc,"build_profile=");
            if( newValue != "" ){
                loc = url_util.more_param(loc,"build_profile="+newValue);
            }
            that.previewNowUrl(loc);
        });

        var spec_loc = url_util.get_param(that.previewNowUrl(),"spec_files")
        that.chosenSpecification([spec_loc]);

        var build_profile = url_util.get_param(that.previewNowUrl(),"build_profile")
        that.Optimizations([build_profile]);

        var speed = url_util.get_param(that.previewNowUrl(),"speed")
        if( speed != "" ){
            that.testSpeed(speed);
        }

        that.previewNoDashboard(current_location.href.indexOf("no_dashboard=true") > -1);


        $.get("/stryke_get_bdw", function (newValue) {
            that.networkBandwidth(newValue);
            that.networkBandwidth.subscribe(function (newValue) {
                $.get("/stryke_bdw/" + newValue);
            });
        }).fail(function(){
            $("#network_bandwidth").attr("disabled","disabled");
            $("#build_profile").attr("disabled","disabled");
            $("#no_dashboard_cb").hide();
            $("#no_dashboard").css("opacity",0.5);
            $("#cache_clean").css("opacity",0.5).unbind("click");
            no_dashboard_enabled = false;
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
                $.get("/stryke_min_congestion/" + newValue)
            });
        }).fail(function(){
                $("#network_congestion_min").attr("disabled","disabled");
                $("#build_profile").attr("disabled","disabled");
                $("#no_dashboard_cb").hide();
                $("#no_dashboard").css("opacity",0.5);
                $("#cache_clean").css("opacity",0.5).unbind("click");
                no_dashboard_enabled = false;
        });

        $.get("/stryke_get_max_congestion", function (newValue) {
            that.networkMaxCongestion(newValue);
            disable_next_options($("#network_congestion_min"), newValue);
            that.networkMaxCongestion.subscribe(function (newValue) {
                disable_next_options($("#network_congestion_min"), newValue);
                $.get("/stryke_max_congestion/" + newValue)
            });
        }).fail(function(){
                $("#network_congestion_max").attr("disabled","disabled");
                $("#build_profile").attr("disabled","disabled");
                $("#no_dashboard_cb").hide();
                $("#no_dashboard").css("opacity",0.5);
                $("#cache_clean").css("opacity",0.5).unbind("click");
                no_dashboard_enabled = false;
        });

        
    };
});


