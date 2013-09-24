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

        that.wrap_nodes = function(top_node){
            if( $(top_node).children(".device-preview-wrap").length == 0 ){
                var nodes = $("body").children();
                for(var n in that.excludes ){
                    nodes = nodes.not( that.excludes[n] );
                }
                $("<link rel='stylesheet' type='text/css' href='/js/vendors/go-device-preview/device-preview.css' /><div class='device-preview-wrap'><div class='device-screen'></div></div>")
                    .appendTo(top_node)

                $(nodes).each(function(n, node){
                    if( node.id == "" )
                        node.id = "auto-"+n
                    $("<div id='anchor-device-"+(node.id)+"' class='anchor-device'></div>").insertAfter(node);
                })
                nodes.appendTo(".device-screen")
            }else{
                $(".anchor-device").each(function(n, node){
                    var id = node.id.substring(("anchor-device-").length)
                    $("#"+id).appendTo(".device-screen")
                })
            }
            return $(top_node).children(".device-preview-wrap").first()
        }
        that.unwrap_nodes = function(top_node){
            var nodes = $(".device-screen").children();
            if( nodes.length > 0 ){
                $(nodes).each(function(n, node){
                    var id = "anchor-device-"+node.id
                    $(node).insertBefore("#"+id)
                })
            }
            return $(top_node).children(".device-preview-wrap").first()
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
            var wrap_node = that.wrap_nodes( top_node );

            $("html").addClass("device-enabled");
            $(".device").addClass(that.device)
            $(".device").addClass(that.mode);

            $(".device-decoration").show();

            function hideScrollBar(ev){
                var t = $('.device-screen').data("w")
                $('.device-screen').css("overflow-y", "")
                $('.device-screen').css( "width", t+"px" )
            }
            function showScrollBar(){
                var t = $('.device-screen').css("width");
                t = parseInt(t);
                $('.device-screen').data("w",t)
                $('.device-screen').css( "width", (t+15)+"px" )
                $('.device-screen').css("overflow-y", "scroll")
            }
            $('.device-screen').off("mouseleave")
            $(".device-screen").on("mouseleave",hideScrollBar)
            $('.device-screen').off("mouseenter")
            $(".device-screen").on("mouseenter",showScrollBar)
        }
        that.DisableDevice = function(){
            $('.device-screen').css("overflow-y", "");
            $('.device-screen').css( "width", "" );
            $('.device-screen').data("w", null);
            $(".device").removeClass(that.device)
            $(".device").removeClass(that.mode);
            $("html").removeClass("device-enabled");
            if( that.device == "" ) return ;
            that.device = "";
            var top_node = that.top_node
            var wrap_node = that.unwrap_nodes(top_node)
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
