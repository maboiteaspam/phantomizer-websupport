// lets you mock any jQuery / Zepto ajax call
define(["vendors/utils/dfrer"],function(dfrer){
    (function($) {
        var mocks = [];
        var mock_delay = 1;
        // save original ajax handler and overwrite it
        var _ajax = $.ajax;

        // match a mock given a plain obect and the url / type / dataType keys
        function mock_match(mock,options){
            if( mock.url && options.url && mock.url != options.url ) return false;
            if( mock.type && options.type && mock.type != options.type ) return false;
            if( mock.dataType && options.dataType && mock.dataType != options.dataType ) return false;
            return true;
        }

        function find_mock(options){
            for( var n in mocks ){
                if( mock_match(mocks[n],options) ){
                    return mocks[n];
                }
            }
            return false;
        }

        function find_mock_index(options){
            for( var n in mocks ){
                if( mock_match(mocks[n],options) ){
                    return n;
                }
            }
            return -1;
        }

        // overwrite original ajax handler
        $.ajax = function(options){
            var mock = find_mock(options)

            if( mock ){
                var delay = mock.delay?mock.delay:mock_delay;
                var dfd = new dfrer();
                if(mock.respond.code == 200 ){
                    var data = clone(mock.respond.data);
                    window.setTimeout(function(){
                        if( options.success ) options.success(data);
                        dfd.resolve(data);
                    },delay);
                }else{
                    window.setTimeout(function(){
                        if( options.error ) options.error(data);
                        dfd.reject(data);
                    },delay);
                }
                return dfd;
            }else{
                return _ajax(options)
            }
        };

        // mock an ajax call
        $.setMockDelay = function(delay){
            mock_delay = delay
        };

        // mock an ajax call
        $.mock = function(options){
            mocks.push(options)
        };

        // remove a mock
        $.removeMock = function(options){
            var found = false;
            var mock_index = find_mock_index(options)
            while( mock_index > -1 ){
                found = true;
                if( mock_index == 0 ) mocks.shift();
                if( mock_index == mocks.length-1 ) mocks.pop();
                else{
                    mocks = [].concat(mocks.slice(mock_index-1, mock_index), mocks.slice(mock_index+1, mocks.length-1))
                }
                mock_index = find_mock_index(options)
            }
            return found;
        };

        function clone(src) {
            function mixin(dest, source, copyFunc) {
                var name, s, i, empty = {};
                for(name in source){
                    // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
                    // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
                    // don't overwrite it with the toString() method that source inherited from Object.prototype
                    s = source[name];
                    if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                        dest[name] = copyFunc ? copyFunc(s) : s;
                    }
                }
                return dest;
            }

            if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
                // null, undefined, any non-object, or function
                return src;	// anything
            }
            if(src.nodeType && "cloneNode" in src){
                // DOM Node
                return src.cloneNode(true); // Node
            }
            if(src instanceof Date){
                // Date
                return new Date(src.getTime());	// Date
            }
            if(src instanceof RegExp){
                // RegExp
                return new RegExp(src);   // RegExp
            }
            var r, i, l;
            if(src instanceof Array){
                // array
                r = [];
                for(i = 0, l = src.length; i < l; ++i){
                    if(i in src){
                        r.push(clone(src[i]));
                    }
                }
                // we don't clone functions for performance reasons
                //		}else if(d.isFunction(src)){
                //			// function
                //			r = function(){ return src.apply(this, arguments); };
            }else{
                // generic objects
                r = src.constructor ? new src.constructor() : {};
            }
            return mixin(r, src, clone);

        }
    })(window.Zepto || window.jQuery || $);
})
