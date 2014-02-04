/* http://appcachefacts.info/ */
(function(window){
  if (window.applicationCache) {
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
})(window);
