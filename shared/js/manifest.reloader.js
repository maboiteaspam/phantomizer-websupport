/* http://appcachefacts.info/ */
(function(window){
    if (window.applicationCache) {
    /*
     window.applicationCache.onobsolete = function(e) {
     window.location.reload();
     }
     window.applicationCache.addEventListener('onobsolete', function(e) {
     window.location.reload();
     }, false);
    */
        var appCache = window.applicationCache
        console.log("----------------- ff")
        appCache.addEventListener('updateready', function(e) {
            console.log("----------------- gg", appCache.status, appCache.UPDATEREADY)
            if (appCache.status == appCache.UPDATEREADY) {
                window.location.reload();
            }
        }, false);
        appCache.addEventListener('onobsolete', function(e) {
            console.log("----------------- jjj")
            appCache.swapCache();
            window.location.reload();
        }, false);

        appCache.updateready = function(e) {
            console.log("----------------- gghh")
            if (appCache.status == appCache.UPDATEREADY) {
                window.location.reload();
            }
        }

        appCache.onobsolete = function(e) {
            console.log("----------------- jjjhh")
            appCache.swapCache();
            window.location.reload();
        }

    }
})(window)
