"use strict";

// deferrer helps you to emulate a jQuery.Deferrer object


var phantomizer_dfrer = (function(){
    var deferred = function(){
        this.is_resolved = null;
        this.args = null;
        this._hdl = [];
        this._type = [];
        this.call_handler = function(fn){
            fn.apply(undefined,this.args);
        }
    }
    deferred.prototype.isRejected = function(){
        return this.is_resolved == false;
    }
    deferred.prototype.isResolved = function(){
        return this.is_resolved == true;
    }
    deferred.prototype.reject = function(){
        this.args = arguments;
        this.is_resolved = false;
        for(var n in this._hdl){
            if( this._type[n] =="fail" || this._type[n] =="always" ){
                this.call_handler(this._hdl[n]);
            }
        }
        return this;
    }
    deferred.prototype.resolve = function(){
        this.args = arguments;
        this.is_resolved = true;
        for(var n in this._hdl){
            if( this._type[n] =="done" || this._type[n] =="always" ){
                this.call_handler(this._hdl[n]);
            }
        }
        return this;
    }
    deferred.prototype.then = function(fn){
        this.call_handler(fn);
        return this;
    }
    deferred.prototype.done = function(fn){
        if( this.isResolved() ){
            this.call_handler(fn);
        }else{
            this._hdl.push(fn)
            this._type.push("done")
        }
        return this;
    }
    deferred.prototype.fail = function(fn){
        if( this.isRejected() ){
            this.call_handler(fn);
        }else{
            this._hdl.push(fn)
            this._type.push("fail")
        }
        return this;
    }
    deferred.prototype.always = function(fn){
        if( this.isResolved() || this.isRejected() ){
            this.call_handler(fn);
        }else{
            this._hdl.push(fn)
            this._type.push("always")
        }
        return this;

    }
    return deferred;
})();

define ? define([],function(){return phantomizer_dfrer;}) : null;
