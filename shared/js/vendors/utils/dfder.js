// deferrer helps you to emulate a jQuery.Deferrer object
define([],function () {
    var dfder = (function(){
        var deferred = function(){
            this.is_resolved = null;
            this._hdl = [];
            this._type = [];
        }
        deferred.prototype.isRejected = function(){
            this.is_resolved == false;
        }
        deferred.prototype.isResolved = function(){
            this.is_resolved == true;
        }
        deferred.prototype.reject = function(){
            this.is_resolved = false;
            for(var n in this._hdl){
                if( this._type[n] =="fail" || this._type[n] =="always" ){
                    this._hdl[n].apply(null,arguments);
                }
            }
            return this;
        }
        deferred.prototype.resolve = function(){
            this.is_resolved = true;
            for(var n in this._hdl){
                if( this._type[n] =="done" || this._type[n] =="always" ){
                    this._hdl[n].apply(null,arguments);
                }
            }
            return this;
        }
        deferred.prototype.then = function(fn){
            fn();
            return this;
        }
        deferred.prototype.done = function(fn){
            if( this.isResolved() ) fn();
            else{
                this._hdl.push(fn)
                this._type.push("done")
            }
            return this;
        }
        deferred.prototype.fail = function(fn){
            if( this.isRejected() ) fn();
            else{
                this._hdl.push(fn)
                this._type.push("fail")
            }
            return this;
        }
        deferred.prototype.always = function(fn){
            if( this.isResolved() || this.isRejected() ) fn();
            else{
                this._hdl.push(fn)
                this._type.push("always")
            }
            return this;

        }
        return deferred;
    })();
    return dfder;
});
