'use strict';

var is_phantom;
require(["vendors/utils/waitFor","vendors/utils/getVar",'vendors/go-qunit/phantomjs-bridge','vendors/go-qunit/qunit-1.12.0'],function(waitFor, getVar, bridge){

    var QUnit = window.QUnit;
    QUnit.config.autostart = false;
    QUnit.config.reorder = false
    QUnit.config.autorun = false;
    if( is_phantom == true ){
        QUnit = bridge(QUnit);
    }

    // Don't re-order tests.
    //QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    //QUnit.config.autorun = false;

    var spec_files = getVar("spec_files");
    var no_dashboard = getVar("no_dashboard");
    var device = getVar("device-enabled");
    if( spec_files.length > 0 ){

        var to_wait = "app-ready";
        if( ! no_dashboard ){
            to_wait += " dashboard-ready";
        }
        if( device ){
            to_wait += " device-enabled";
        }
        waitFor("html",to_wait,function(){
            require([],function(){

                spec_files = spec_files.split(",");

                $("head").append("<link rel=\"stylesheet\" href=\"/js/vendors/go-qunit/qunit-1.11.0.css\">");


                $("<div id=\"qunit\"></div>").prependTo("body")
                $("<div id=\"qunit-fixture\"></div>").prependTo("body")

                require(spec_files,function(){
                    window.setTimeout(function(){
                        QUnit.load();
                        //QUnit.begin();
                        QUnit.start();
                    },1000);
                });
            });
        })
    }

})