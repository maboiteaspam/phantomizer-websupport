"use strict";

define([],function () {
    /**
     * This script is responsible to provide the correct domain name to use
     * for webservices consumption according to the browsed domain name
     *
     */

    var domain_switcher = function(){
        this.items = [];
        this.forced = false;
        this.default = null;
    };
    /**
     * Set the options for unreferenced domains
     * @param consumed
     * @param options
     */
    domain_switcher.prototype.default_options = function(consumed,options){
        this.default = {
            consumed:consumed,
            options:options
        };
    };
    /**
     * Given browsed domain name,
     * set its options specifcally
     * @param browsed
     * @param consumed
     * @param options
     */
    domain_switcher.prototype.reference = function(browsed, consumed, options){
        this.items.push({
            browsed:browsed,
            consumed:consumed,
            options:options
        });
    };
    /**
     * get the string domain name to consume
     * if currently_browsed is null,
     * returns default options if exists
     * otherwise,
     * fallback to window.location.host default value
     *
     * @param currently_browsed|window.location.host
     * @returns {*}
     */
    domain_switcher.prototype.get_consumed = function(currently_browsed){
        if( this.forced ){
            return this.forced;
        }
        if(!currently_browsed && this.default){
            return this.default;
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
        console.log("datasource : not found "+currently_browsed);
        return false;
    };
    /**
     * Get a FQDN url to the consumed url in clear text
     * @param url_append
     * @returns {string}
     */
    domain_switcher.prototype.get = function(url_append){
        var domain = this.get_consumed();
        return "http://"+domain.consumed+url_append;
    };
    /**
     * Get a FQDN url to the consumed url in ssl
     * if the referenced domain does not allow ssl, it will return a clear text version
     * @param url_append
     * @returns {string}
     */
    domain_switcher.prototype.getSsl = function(url_append){
        var domain = this.get_consumed();
        return "http"+(domain.options.ssl?"s":"")+"://"+domain.consumed+url_append;
    };
    /**
     * options for the currently browsed domain
     * @returns {}
     */
    domain_switcher.prototype.options = function(){
        return this.get_consumed().options;
    };
    /**
     * Explicitly force the currently browsed domain
     *
     * @param consumed
     */
    domain_switcher.prototype.force = function(consumed){
        this.forced = consumed;
    };

    return new domain_switcher();
});