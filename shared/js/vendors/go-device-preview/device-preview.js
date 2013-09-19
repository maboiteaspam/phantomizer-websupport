define([], function() {
    var DevicePreviewFacade = function(top_node, devices, excludes){

        var that = this;
        var base_url = "/js/vendors/go-device-preview/device-preview/"
        that.default_devices = {
            "ipad":{
                "portrait":{
                    "background":base_url+"ipad.png",
                    "width":1141,
                    "height":1482 ,
                    "screen":{
                        "top":"164px",
                        "left":"185px",
                        "width":"768px",
                        "height":"1024px"
                    }
                },
                "landscape":{
                    "background":base_url+"ipad-landscape.png",
                    "width":1482 ,
                    "height":1141 ,
                    "screen":{
                        "top":"186px",
                        "left":"165px",
                        "width":"1024px",
                        "height":"768px"
                    }
                }
            },
            "iphone-3g":{
                "portrait":{
                    "background":base_url+"iphone-3g.png",
                    "height":"698px",
                    "width":"392px",
                    "screen":{
                        "top":"109px",
                        "left":"35px",
                        "width":"321px",
                        "height":"486px"
                    }
                },
                "landscape":{
                    "background":base_url+"iphone-3g-landscape.png",
                    "width":"698px",
                    "height":"392px",
                    "screen":{
                        "top":"35px",
                        "left":"109px",
                        "width":"486px",
                        "height":"321px"
                    }
                }
            },
            "iphone-3gs":{
                "portrait":{
                    "background":base_url+"iphone-3gs.png",
                    "height":"698px",
                    "width":"392px",
                    "screen":{
                        "top":"121px",
                        "left":"35px",
                        "width":"329px",
                        "height":"462px"
                    }
                },
                "landscape":{
                    "background":base_url+"iphone-3gs-landscape.png",
                    "width":"698px",
                    "height":"392px",
                    "screen":{
                        "top":"25px",
                        "left":"119px",
                        "width":"463px",
                        "height":"333px"
                    }
                }
            },
            "iphone-4":{
                "portrait":{
                    "background":base_url+"iphone-4.png",
                    "height":"698px",
                    "width":"392px",
                    "screen":{
                        "top":"125px",
                        "left":"34px",
                        "width":"326px",
                        "height":"471px"
                    }
                },
                "landscape":{
                    "background":base_url+"iphone-4-landscape.png",
                    "width":"698px",
                    "height":"392px",
                    "screen":{
                        "top":"32px",
                        "left":"124px",
                        "width":"472px",
                        "height":"328px"
                    }
                }
            },
            "iphone-5":{
                "portrait":{
                    "background":base_url+"iphone-5.png",
                    "height":"698px",
                    "width":"392.796875px",
                    "screen":{
                        "top":"101px",
                        "left":"31px",
                        "width":"336px",
                        "height":"498px"
                    }
                },
                "landscape":{
                    "background":base_url+"iphone-5-landscape.png",
                    "width":"698px",
                    "height":"392.796875px",
                    "screen":{
                        "top":"26px",
                        "left":"100px",
                        "width":"497px",
                        "height":"337px"
                    }
                }
            },
            "htc-one":{
                "portrait":{
                    "background":base_url+"htc-one.png",
                    "height":"771.01px",
                    "width":"395.70px",
                    "screen":{
                        "top":"76px",
                        "left":"28px",
                        "width":"341px",
                        "height":"588px"
                    }
                },
                "landscape":{
                    "background":base_url+"htc-one-landscape.png",
                    "width":"771.01px",
                    "height":"395.70px",
                    "screen":{
                        "top":"28px",
                        "left":"76px",
                        "width":"588px",
                        "height":"341px"
                    }
                }
                /*
                 <div style="position:absolute;top:0;left:0;width:10;height:10;background-color:blue;"></div>
                 */
            },
            "samsung-s4":{
                "portrait":{
                    "background":base_url+"galaxy-s4.png",
                    "height":"771.01px",
                    "width":"395.70px",
                    "screen":{
                        "top":"66px",
                        "left":"15px",
                        "width":"369px",
                        "height":"669px"
                    }
                },
                "landscape":{
                    "background":base_url+"galaxy-s4-landscape.png",
                    "width":"771.01px",
                    "height":"395.70px",
                    "screen":{
                        "top":"12px",
                        "left":"67px",
                        "width":"668px",
                        "height":"369px"
                    }
                }
            }
        };
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
        that.devices = {};
        that.excludes = [];
        $.extend(that.devices, that.default_devices, devices);
        that.excludes = merge(that.default_excludes, excludes);

        that.current_screen_width = function(){
            var retour = that.devices[that.device].screen_h;
            if( that.mode == "portrait" ){
                retour = that.devices[that.device].screen_w;
            }
            return retour
        }
        that.current_screen_height = function(){
            var retour = that.devices[that.device].screen_w;
            if( that.mode == "portrait" ){
                retour = that.devices[that.device].screen_h;
            }


            return retour
        }
        that.wrap_nodes = function(top_node){
            if( $(top_node).children(".device-preview-wrap").length == 0 ){
                var nodes = $("body").children();
                for(var n in that.excludes ){
                    nodes = nodes.not( that.excludes[n] );
                }
                $("<div class='device-preview-wrap'><img class='device-decoration device-background' /><div class='device-screen'></div></div>")
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
            that.mode = that.mode=="portrait"?"landscape":"portrait";
            that.EnableDevice(that.device)
        }
        that.EnableDeviceMode = function(mode){
            if( mode != that.mode && (mode == "portrait" || mode == "landscape") ){
                that.mode = mode;
                that.EnableDevice(that.device)
            }else if (mode==""){
                that.DisableDevice()
            }
        }
        that.EnableDevice = function(device){

            that.device = device;
            if( device == "" ) return ;
            var top_node = that.top_node
            var wrap_node = that.wrap_nodes( top_node )

            var device_data = that.devices[that.device][that.mode];
            $(top_node).css("margin-top", "30px")
            $(top_node).css("margin-bottom", "30px")
            $(top_node).css("text-align", "center")
            $("html").css("background-color", "darkslategray")

            $(top_node).css("width", "100%")
            $(top_node).css("height", "100%")

            $(wrap_node).css("position", "relative")
            $(wrap_node).css("margin", "0px auto")
            $(wrap_node).css("text-align", "left")
            $(wrap_node).css("width", device_data.width )
            $(wrap_node).css("height", device_data.height )
            $('.device-background').css("position", "absolute")

            $('.device-screen').css("position", "absolute")
            $('.device-screen').css("overflow", "hidden")
            $('.device-screen').css("background-color", "white")
            $('.device-screen').css("top", device_data.screen.top)
            $('.device-screen').css("left", device_data.screen.left)
            $('.device-screen').css("width", device_data.screen.width)
            $('.device-screen').css("height", device_data.screen.height)

            function hideScrollBar(ev){
                var t = $('.device-screen').data("w")
                $('.device-screen').css("overflow-y", "hidden")
                $('.device-screen').width( t )
            }
            function showScrollBar(){
                var t = $('.device-screen').width()
                $('.device-screen').data("w",t)
                $('.device-screen').width( t+15)
                $('.device-screen').css("overflow-y", "scroll")
            }
            $('.device-screen').off("mouseleave")
            $(".device-screen").on("mouseleave",hideScrollBar)
            $('.device-screen').off("mouseenter")
            $(".device-screen").on("mouseenter",showScrollBar)

            $(".device-decoration").show();
            $('.device-background').css("width", device_data.width)
            $('.device-background').css("height", device_data.height)
            $(".device-background").one("load", function(){

            })
            $(".device-background").attr("src", device_data.background)
        }
        that.DisableDevice = function(){
            if( that.device == "" ) return ;
            that.device = "";
            var top_node = that.top_node
            var wrap_node = that.unwrap_nodes(top_node)

            $(".device-decoration").hide()
            $(".device-decoration").not(".device-flip").attr("src", "")

            $(top_node).css("text-align", "")
            $("html").css("background-color", "")

            $(wrap_node).css("position", "")
            $(wrap_node).css("background-color", "")
            $(wrap_node).css("margin", "")
            $(wrap_node).css("width", "")
            $(wrap_node).css("height", "")
            $(top_node).css("text-align", "")

            $(".device-screen").css("width", "")
            $(".device-screen").css("height", "")

            $(".device-screen").css("top", "")
            $(".device-screen").css("left", "")

            $(".device-screen").css("position", "relative")
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
