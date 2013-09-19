// lets you mock any jQuery / Zepto ajax call
define(["vendors/utils/dfder"],function(dfder){
    (function($) {
        var mocks = [];
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
                var dfd = new dfder();
                if(mock.respond.code == 200 ){
                    var data = mock.respond.data;
                    window.setTimeout(function(){
                        if( options.success ) options.success(data);
                        dfd.resolve(data);
                    },1);
                }else{
                    window.setTimeout(function(){
                        if( options.error ) options.error(data);
                        dfd.reject(data);
                    },1);
                }
                return dfd;
            }else{
                return _ajax(options)
            }
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
    })(window.Zepto || window.jQuery || $);
})
