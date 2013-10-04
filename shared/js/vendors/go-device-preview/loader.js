define(["vendors/utils/getVar","vendors/go-device-preview/device-preview"], function(getVar,DevicePreviewFacade){
    var DeviceLoader = function(){
        this.device = getVar("device") || false;
        this.device_mode = getVar("device_mode") || "portrait";

        var no_dashboard = getVar("no_dashboard");


    }
    DeviceLoader.prototype.device = "";
    DeviceLoader.prototype.device_mode = "";
    DeviceLoader.prototype.load = function(next){
        var that = this;
        if( $(".device").length == 0 ){
            if( $("#stryke-db").length > 0 ){
                $("#stryke-db").before("<div class=\'device\'></div>")
            }else{
                $("body").append("<div class=\'device\'></div>")
            }
        }
        if( next ) next();
    }
    DeviceLoader.prototype.start = function(next){
        var that = this;
        if( that.device ){
            var DevicePreview = new DevicePreviewFacade($(".device"));
            DevicePreview.EnableDevice(that.device);
            DevicePreview.EnableDeviceMode(that.device_mode);
            if( next ) next();
        }else{
            if( next ) next();
        }
    }
    return DeviceLoader;
})