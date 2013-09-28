define([],function () {
    var q = window.location.search;
    if(q[0]=="?") q = q.substr(1, q.length)
    q = q.split("&");
    var params = {};
    for(var n in q){
        var t = q[n].split("=")[0]
        params[t] = q[n].split("=")[1];
    }

    function getVar (sVar) {
        sVar = encodeURI(sVar)
        for(var n in params){
            if( n == sVar ){
                return decodeURI(params[n]);
            }
        }
        return false;
    }
    return getVar;
});
