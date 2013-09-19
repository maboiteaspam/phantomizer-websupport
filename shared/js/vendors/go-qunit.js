'use strict';

var is_phantom;
require(['vendors/go-qunit/qunit-1.11.0'],function(){

    var spec_files = [];
    QUnit.config.autostart = false;
    QUnit.config.reorder = false
    QUnit.config.autorun = false;

    // Don't re-order tests.
    //QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    //QUnit.config.autorun = false;

    if( QUnit.urlParams.spec_files ){

        spec_files = QUnit.urlParams.spec_files
        spec_files = spec_files.split(",")

        if( is_phantom == true ){
// Send messages to the parent PhantomJS process via alert! Good times!!
            var sendMessage = function() {
                var args = [].slice.call(arguments);
                alert(JSON.stringify(args));
            }

// These methods connect QUnit to PhantomJS.
            QUnit.log(function(obj) {
                // What is this I don’t even
                if (obj.message === '[object Object], undefined:undefined') { return; }
                // Parse some stuff before sending it.
                var actual = QUnit.jsDump.parse(obj.actual);
                var expected = QUnit.jsDump.parse(obj.expected);
                // Send it.
                sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
            });

            QUnit.testStart(function(obj) {
                sendMessage('qunit.testStart', obj.name);
            });

            QUnit.testDone(function(obj) {
                sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total);
            });

            QUnit.moduleStart(function(obj) {
                sendMessage('qunit.moduleStart', obj.name);
            });

            QUnit.moduleDone(function(obj) {
                sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
            });

            QUnit.begin(function() {
                sendMessage('qunit.begin');
            });

            QUnit.done(function(obj) {
                sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
            });
        }


        $("<div id=\"qunit\"></div>").prependTo("body")
        $("<div id=\"qunit-fixture\"></div>").prependTo("body")

        require(spec_files,function(){
            window.setTimeout(function(){
                QUnit.load();
                //QUnit.begin();
                QUnit.start();
            },500)
            // increase this value if you have error such // Uncaught TypeError: Cannot set property 'className' of null
        });
    }

})