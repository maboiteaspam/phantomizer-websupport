'use strict';

var is_phantom;
define(["vendors/utils/getVar",'vendors/go-qunit/phantomjs-bridge','vendors/go-qunit/qunit-1.12.0'],function( getVar, bridge){

    var QUnit = window.QUnit;
    QUnit.config.autostart = false;
    // Don't re-order tests.
    QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    QUnit.config.autorun = false;
    if( is_phantom == true ){
        QUnit = bridge(QUnit);
    }

    var QUnitLoader = function(){
        var spec_files = getVar("spec_files");
        if( spec_files.length > 0 ){
            this.spec_files = spec_files.split(",");
        }

        var no_dashboard = getVar("no_dashboard");
        var device = getVar("device-enabled");

    }
    QUnitLoader.prototype.spec_files = [];
    QUnitLoader.prototype.tests = [];
    QUnitLoader.prototype.load = function(next){
        var that = this;

        if( that.spec_files.length > 0 ){
            $("head").append("<link rel=\"stylesheet\" href=\"/js/vendors/go-qunit/qunit-1.11.0.css\">");

            $("<div id=\"qunit\"></div>").prependTo("body");
            $("<div id=\"qunit-fixture\"></div>").prependTo("body");
            $("#qunit").css("position","fixed")
            $("#qunit").css("z-index","2")
            $("#qunit").css("width","100%")
            QUnit.load();
            require(that.spec_files,function(){
                that.tests = [];
                for(var n=0;n<arguments.length;n++){
                    that.tests.push(arguments[n])
                }
                var n = -1;
                var d = that.tests.length;
                var iter = function(){
                    n++;
                    if( that.tests[n] != null ){
                        that.tests[n].init(iter);
                    }
                    if(n==d){
                        if( next ) next(true);
                    }
                }
                iter();
            });
        }else if( next ){
            next(false);
        }
    }
    QUnitLoader.prototype.start = function(next){
        var that = this;
        var started=false;
        if( that.spec_files.length > 0 ){
            for( var n in that.tests){
                that.tests[n].run();
            }
            QUnit.start();
            started=true;
        }
        if( next ) next(started);
    }

    return QUnitLoader;
})