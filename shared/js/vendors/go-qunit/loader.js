'use strict';

var is_phantom;
require(["vendors/utils/waitFor",'vendors/go-qunit/phantomjs-bridge','vendors/go-qunit/qunit-1.11.0'],function(waitFor, bridge){

    // Don't re-order tests.
    //QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    //QUnit.config.autorun = false;

    if( QUnit.urlParams.spec_files ){

        $("head").append("<link rel=\"stylesheet\" href=\"/js/vendors/go-qunit/qunit-1.11.0.css\">");

        var spec_files = [];
        QUnit.config.autostart = false;
        QUnit.config.reorder = false
        QUnit.config.autorun = false;

        var to_wait = "app-ready";
        if( ! QUnit.urlParams.no_dashboard ){
            to_wait += " dashboard-ready";
        }
        if( QUnit.urlParams.device ){
            to_wait += " device-enabled";
        }
        waitFor("html",to_wait,function(){
            spec_files = QUnit.urlParams.spec_files
            spec_files = spec_files.split(",")

            if( is_phantom == true ){
                bridge(QUnit);
            }

            $("<div id=\"qunit\"></div>").prependTo("body")
            $("<div id=\"qunit-fixture\"></div>").prependTo("body")

            require(spec_files,function(){
                    QUnit.load();
                    //QUnit.begin();
                    QUnit.start();
                // increase this value if you have error such // Uncaught TypeError: Cannot set property 'className' of null
            });
        })
    }

})