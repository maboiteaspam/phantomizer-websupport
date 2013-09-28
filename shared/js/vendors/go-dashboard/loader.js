require(["vendors/utils/waitFor","vendors/utils/getVar","vendors/go-dashboard/dashboard-ui"], function(waitFor,getVar,$){
    var to_wait = "app-ready";
    if( ! getVar("no_dashboard") ){
        waitFor("html",to_wait,function(){
            if( $("#stryke-db").length == 0 ) $("body").append("<div id='stryke-db'></div>")
            $("#stryke-db").hide().load_dashboard("/js/vendors/go-dashboard/dashboard.html", function(){
                $("#stryke-db").dashboard().css("opacity",0).show().animate({opacity:100},1000);
                $("html").addClass("dashboard-ready");
            });
        })
    }
})