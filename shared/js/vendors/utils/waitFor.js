// deferrer helps you to emulate a jQuery.Deferrer object
define([],function () {
    function check(el,classes){
        el = document.getElementById(el) || document.getElementsByTagName(el)[0];
        var el_class = el.getAttribute("class");
        if( el_class ){
            for( var n in classes ){
                var c = classes[n];
                if( el_class.indexOf(c) == -1 ){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    var waitFor = function(el,classes,fn,speed){
        if( classes.match ) classes = classes.split(" ");
        (function(fn,el,classes){
            var interval = null;
            var timeout = window.setTimeout(function(){
                console.log("waitFor timed out..", classes)
                if( interval ) window.clearInterval(interval);
            }, 15000);
            interval = window.setInterval(function(){
                if( check(el,classes) ){
                    window.clearInterval(interval);
                    window.clearTimeout(timeout);
                    fn();
                }
            }, speed || 500);
        })(fn,el,classes);
    }
    return waitFor;
});
