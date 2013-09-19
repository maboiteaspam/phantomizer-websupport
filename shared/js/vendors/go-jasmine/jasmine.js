var jasmine;
(function(window){

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 10;

    var Reporter = new jasmine.HtmlReporter();
    var JsReporter = new jasmine.JsApiReporter();
    jasmineEnv.addReporter(Reporter);
    jasmineEnv.addReporter(JsReporter);

    jasmineEnv.specFilter = function(spec) {
        return Reporter.specFilter(spec);
    };

    function execJasmine() {
        jasmineEnv.execute();
    }

    window.setTimeout(function(){
        execJasmine();
        $("#HTMLReporter").prependTo("body").fadeTo( "", 0.4 ).show();
        var f = window.setInterval(function(){
            if(JsReporter.finished){
                $("#HTMLReporter").fadeTo("",1);
                clearInterval(f);
            }
        },100);
    },750);
})(window);