define([],function () {
    /**
     * This script is responsible to provide the correct domain name to use
     * for webservices consumption according to the browsed domain name
     */

    var domain_switcher = function(){
        this.items = [];
        this.forced = false;
    };
    domain_switcher.prototype.reference = function(browsed, consumed,allow_ssl){
        this.items.push({
            browsed:browsed,
            consumed:consumed,
            allow_ssl:allow_ssl
        });
    };
    domain_switcher.prototype.get_consumed = function(browsed){
        if( this.forced ){
            return this.forced;
        }
        browsed = !browsed?window.location.hostname:browsed;
        for(var n in this.items ){
            var b = this.items[n];
            if(b.browsed.indexOf){ // is it a string ?
                if(b.browsed == browsed ){
                    return b;
                }
            }else{  // then it is a function handler
                if( b.browsed(browsed) ){
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
    domain_switcher.prototype.force = function(consumed){
        this.forced = consumed;
    };

    return new domain_switcher();
});