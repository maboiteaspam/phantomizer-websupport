"use strict";

define([],function () {

  function url_util () {
  }
  url_util.prototype.less_param = function(loc,param_to_update){
    var params = param_to_update.split("=");

    if( params[1] == "" ){
      var pattern = ".*[&?]"+params[0]+"=([^&]*)"
      pattern = new RegExp(pattern,"i");
      var matches = loc.match(pattern)
      if ( matches ) {
        param_to_update = params[0]+"="+matches[1];
      } else {
        param_to_update = "";
      }
    }

    if( param_to_update != "" ){
      loc = loc.replace(param_to_update + "&", "");
      loc = loc.replace(param_to_update + "", "");

      if (loc.slice(loc.length - 1) == "&")
        loc = loc.slice(0, loc.length - 1);
      else if (loc.slice(loc.length - 1) == "?")
        loc = loc.slice(0, loc.length - 1);

    }
    return loc;
  }
  url_util.prototype.more_param = function(loc,param_to_update){
    loc = loc.replace(param_to_update + "&", "");

    if (loc.indexOf("?") == -1) {
      loc += "?" + param_to_update + "";
    } else {
      loc += "&" + param_to_update + "";
    }
    return loc;
  }
  url_util.prototype.get_param = function(loc,param_name){
    var pattern = ".*[&?]"+param_name+"=([^&]*)"
    pattern = new RegExp(pattern,"i");
    var matches = loc.match(pattern)
    var param = "";
    if ( matches ) {
      param = matches[1];
    }
    return decodeURIComponent(param);
  }
  return url_util;
});
