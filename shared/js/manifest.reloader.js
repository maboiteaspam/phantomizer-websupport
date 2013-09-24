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
        var appCache = window.applicationCache;
        appCache.addEventListener('updateready', function(e) {
            if (appCache.status == appCache.UPDATEREADY) {
                window.location.reload();
            }
        }, false);
        appCache.addEventListener('onobsolete', function(e) {
            appCache.swapCache();
            window.location.reload();
        }, false);

        appCache.updateready = function(e) {
            if (appCache.status == appCache.UPDATEREADY) {
                window.location.reload();
            }
        }

        appCache.onobsolete = function(e) {
            appCache.swapCache();
            window.location.reload();
        }

    }
})(window)
