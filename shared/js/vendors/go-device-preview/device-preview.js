define([], function() {
    var DevicePreviewFacade = function(top_node, devices, excludes){

        var that = this;
        var base_url = "/js/vendors/go-device-preview/img/";

        that.default_excludes = [
            ".device",
            "#stryke-db",
            "#qunit",
            "#qunit-fixture",
            "script"
        ];


        that.top_node = $(top_node).length==0?$("body"):$(top_node).first();
        that.device = "";
        that.mode = "landscape";
        that.excludes = [];
        that.excludes = merge(that.default_excludes, excludes);


        function more_param(loc, param_to_update) {
            loc = loc.replace(param_to_update + "&", "");

            if (loc.indexOf("?") == -1) {
                loc += "?" + param_to_update + "";
            } else {
                loc += "&" + param_to_update + "";
            }
            return loc;
        }
        function less_param(loc, param_to_update) {
            var params = param_to_update.split("=");

            if( params[1] == "" ){
                var pattern = ".*[&?]"+params[0]+"=([^&]*)"
                pattern = new RegExp(pattern,"i");
                var matches = loc.match(pattern)
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
            }
            return loc;
        }


        that.wrap_nodes = function(top_node){
            if( $(top_node).children(".device-preview-wrap").length == 0 ){
                var nodes = $("body").children();
                for(var n in that.excludes ){
                    nodes = nodes.not( that.excludes[n] );
                }
                nodes.remove();

                var location = window.location.href;
                location = less_param(location,"device=")
                location = less_param(location,"device_mode=")
                location = less_param(location,"no_dashboard=")
                location = more_param(location,"no_dashboard=true")
                $("style, link").remove();
                $("<link rel='stylesheet' type='text/css' href='/js/vendors/go-device-preview/device-preview.css' /><div class='device-preview-wrap'><iframe class='device-screen' src='"+location+"'></iframe></div>")
                    .appendTo(top_node);
            }
        }
        that.unwrap_nodes = function(top_node){
        }
        that.DoFlip = function(){
            $('.device-screen').css("overflow-y", "");
            $('.device-screen').css( "width", "" );
            $('.device-screen').data("w", null);
            $(".device").removeClass(that.mode);
            that.mode = that.mode=="portrait"?"landscape":"portrait";
            that.EnableDevice(that.device)
        }
        that.EnableDeviceMode = function(mode){
            $('.device-screen').css("overflow-y", "");
            $('.device-screen').css( "width", "" );
            $('.device-screen').data("w", null);
            if( mode != that.mode && (mode == "portrait" || mode == "landscape") ){
                $(".device").removeClass(that.mode);
                that.mode = mode;
                that.EnableDevice(that.device)
            }else if (mode==""){
                that.DisableDevice()
            }
        }
        that.EnableDevice = function(device){

            $("html").removeClass("device-enabled");
            $(".device").removeClass(that.device)
            $(".device").removeClass(that.mode);
            that.device = device;
            if( device == "" ) return ;
            var top_node = that.top_node;
            that.wrap_nodes( top_node );

            $("html").removeClass("device-disabled");
            $("html").addClass("device-enabled");
            $(".device").addClass(that.device)
            $(".device").addClass(that.mode);

            $(".device-decoration").show();
        }
        that.DisableDevice = function(){
            $('.device-screen').css("overflow-y", "");
            $('.device-screen').css( "width", "" );
            $('.device-screen').data("w", null);
            $(".device").removeClass(that.device)
            $(".device").removeClass(that.mode);
            $("html").removeClass("device-enabled");
            $("html").addClass("device-disabled");
            if( that.device == "" ) return ;
            that.device = "";
        }

        function merge(arr,arr1){
            var retour = []
            for(var n in arr){
                if( in_array(retour,arr[n]) == false ){
                    retour.push(arr[n])
                }
            }
            for(var n in arr1){
                if( in_array(retour,arr1[n]) == false ){
                    retour.push(arr1[n])
                }
            }
            return retour;
        }
        function in_array(arr,v){
            for(var n in arr){
                if( arr[n] == v ){
                    return true;
                }
            }
            return false;
        }
    }

    return DevicePreviewFacade;
});
