define([],function () {
    /**
     * This script is responsible to provide the correct domain name to use
     * for webservices consumption according to the browsed domain name
     */

    var domain_switcher = function(){
        this.items = [];
        this.forced = false;
    };
    domain_switcher.prototype.reference = function(browsed, consumed){
        this.items.push({
            browsed:browsed,
            consumed:consumed
        });
    };
    domain_switcher.prototype.get = function(browsed){
        if( this.forced ){
            return this.forced;
        }
        browsed = !browsed?window.location.hostname:browsed;
        for(var n in this.items ){
            var b = this.items[n];
            if(b.browsed.indexOf){ // is it a string ?
                if(b.browsed == browsed ){
                    var ret = b.consumed;
                    if( window.location.port != "80" ){
                        ret += ":"+window.location.port;
                    }
                    return ret;
                }
            }else{  // then it is a function handler
                if( b.browsed(browsed) ){
                    var ret = b.consumed;
                    if( window.location.port != "80" ){
                        ret += ":"+window.location.port;
                    }
                    return ret;
                }
            }
        }
    };
    domain_switcher.prototype.force = function(consumed){
        this.forced = consumed;
    };

    return new domain_switcher();
});