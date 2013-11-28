define([],function () {
    /**
     * This script is responsible to provide the correct domain name to use
     * for webservices consumption according to the browsed domain name
     */

    var domain_switcher = function(){
        this.items = [];
        this.forced = false;
    };
    domain_switcher.prototype.reference = function(browsed, consumed,allow_ssl,allow_tracking){
        this.items.push({
            browsed:browsed,
            consumed:consumed,
            allow_ssl:allow_ssl,
            allow_tracking:allow_tracking
        });
    };
    domain_switcher.prototype.get_consumed = function(currently_browsed){
        if( this.forced ){
            return this.forced;
        }
        currently_browsed = !currently_browsed?window.location.host:currently_browsed;
        for(var n in this.items ){
            var b = this.items[n];
            if(b.browsed.indexOf){ // is it a string ?
                if(b.browsed == currently_browsed ){
                    return b;
                }
            }else{  // then it is a function handler
                if( b.browsed(currently_browsed) ){
                    return b;
                }
            }
        }
    };
    domain_switcher.prototype.get = function(url){
        var domain = this.get_consumed();
        return "http://"+domain.consumed+url;
    };
    domain_switcher.prototype.getSsl = function(url){
        var domain = this.get_consumed();
        return "http"+(domain.allow_ssl?"s":"")+"://"+domain.consumed+url;
    };
    domain_switcher.prototype.trackingAllowed = function(){
        return this.get_consumed().allow_tracking==true;
    };
    domain_switcher.prototype.force = function(consumed){
        this.forced = consumed;
    };

    return new domain_switcher();
});