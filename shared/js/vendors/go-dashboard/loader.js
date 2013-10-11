define(["vendors/utils/getVar","vendors/go-dashboard/dashboard-ui"], function(getVar,$){
    var DashBoardLoader = function(){
        var no_dashboard = getVar("no_dashboard");

        if( no_dashboard != false )
            this.enabled = false;
        else if( window.no_dashboard!= undefined && window.no_dashboard != true )
            this.enabled = false;


    }
    DashBoardLoader.prototype.enabled = true;
    DashBoardLoader.prototype.load = function(next){
        var that = this;
        var loaded = false;
        if( that.enabled ){
            if( $("#stryke-db").length == 0 ){
                $("body").append("<div id='stryke-db'></div>")
            }
            loaded = true;
        }
        if( next ) next(loaded);
    }
    DashBoardLoader.prototype.start = function(next){
        var that = this;
        if( that.enabled ){
            $("#stryke-db").hide().load_dashboard("/js/vendors/go-dashboard/dashboard.html", function(){
                $("#stryke-db").dashboard().css("opacity",0).show().animate({opacity:100},1000);
                if( next ) next();
            });
        }else{
            if( next ) next();
        }
    }
    return DashBoardLoader;
})