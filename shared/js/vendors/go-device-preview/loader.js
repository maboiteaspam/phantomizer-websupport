require(["vendors/utils/waitFor","vendors/utils/getVar","vendors/go-device-preview/device-preview"], function(waitFor,getVar,DevicePreviewFacade){
    var device = getVar("device") || false;
    var device_mode = getVar("device_mode") || "portrait";
    if( device ){
        var to_wait = "app-ready";
        if( ! getVar("no_dashboard") ){
            to_wait += " dashboard-ready";
        }
        waitFor("html",to_wait,function(){
            if( $(".device").length == 0 ){
                if( $("#stryke-db").length > 0 ){
                    $("#stryke-db").before("<div class=\'device\'></div>")
                }else{
                    $("body").append("<div class=\'device\'></div>")
                }
            }
            var DevicePreview = new DevicePreviewFacade($(".device"));
            DevicePreview.EnableDevice(device);
            DevicePreview.EnableDeviceMode(device_mode);
        })
    }
})