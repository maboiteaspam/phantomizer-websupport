define(["vendors/utils/url_util","vendors/go-device-preview/device-preview"], function(url_util,DevicePreviewFacade){
    url_util = new url_util();

    var DeviceLoader = function(){
        this.device = url_util.get_param(window.location.search,"device") || false;
        this.device_mode = url_util.get_param(window.location.search,"device_mode") || "portrait";

        if(self!=top)
            this.device = false;
    }
    DeviceLoader.prototype.device = "";
    DeviceLoader.prototype.device_mode = "";
    DeviceLoader.prototype.load = function(next){
        var that = this;
        var loaded = false;
        if( that.device ){
            if( $(".device").length == 0 ){
                if( $("#stryke-db").length > 0 ){
                    $("#stryke-db").before("<div class=\'device\'></div>")
                }else{
                    $("body").append("<div class=\'device\'></div>")
                }
                loaded = true;
            }
        }
        if( next ) next(loaded);
    }
    DeviceLoader.prototype.start = function(next){
        var that = this;
        var started = false;
        if( that.device ){
            var DevicePreview = new DevicePreviewFacade($(".device"));
            DevicePreview.EnableDevice(that.device);
            DevicePreview.EnableDeviceMode(that.device_mode);
            started = true;
        }
        if( next ) next(started);
    }
    return DeviceLoader;
})