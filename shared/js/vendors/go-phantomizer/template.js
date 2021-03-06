"use strict";

define([],function () {

  var now = new Date();

  function get_attributes(include_el){
    var retour={};
    var attrs = include_el.attributes;
    for (var i=0, l=attrs.length; i<l; i++){
      var attr = attrs.item(i)
      retour[attr.nodeName] = attr.nodeValue;
    }
    return retour;
  }
  function inject_directive(directive, data, attrs){
    var scripts = [];
    var data_t = $(data);
    // iterate over tops node of the html tree, lookup for scripts
    $(data_t).each(function(i,n){
      if( $(n).is("script") ){
        $(n).remove();
        scripts.push(n); // stack it for later insertion on bottom of the document
      }else{
        $(n).find("script").each(function(ii,nn){
          $(nn).remove();
          scripts.push(nn); // stack it for later insertion on bottom of the document
        });
      }
    });
    // insert in place all nodes which are not scripts
    $(data_t).not("script").each(function(k,n){
      for( var attr_name in attrs){
        var c_attr = $(n).attr(attr_name);
        if( !!c_attr && attrs[attr_name] != "") c_attr+=" "+attrs[attr_name];
        else c_attr = attrs[attr_name];

        if( c_attr ) $(n).attr(attr_name,c_attr);
      }
      $(n).insertBefore($(directive));
    })

    return scripts;
  }

  function get_since(el){
    var ret_date = false;
    if( $(el).attr("since") ){
      var since = $(el).attr("since");

      if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$") ){
        since += ":00";
      }else if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}$") ){
        since += ":00:00";
      }else if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$") ){
        since += " 00:00:00";
      }
      since = since.split(" ")
      since = since[0]+" "+since[1]+"";
      var p_since = new Date(since);
      if( ! p_since ){
        throw "wrong date parsed "+since;
      }else{
        ret_date = p_since;
      }
    }
    return ret_date;
  }

  function get_until(el){
    var ret_date = false;
    if( $(el).attr("until") ){
      var until = $(el).attr("until");

      if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$") ){
        until += ":59";
      }else if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}$") ){
        until += ":59:59";
      }else if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$") ){
        until += " 23:59:59";
      }
      until = until.split(" ")
      until = until[0]+" "+until[1]+"";
      var p_until = new Date(until);
      if( ! p_until ){
        throw "wrong date parsed "+until;
      }else{
        ret_date = p_until;
      }
    }
    return ret_date;
  }

  function get_src(el){
    var src = $(el).attr("src") || "";

    var since = get_since(el);
    var until = get_until(el);

    if( since !== false && since.getTime() >= now.getTime() ){
      src = "";
    }

    if( until !== false && until.getTime() < now.getTime() ){
      src = "";
    }

    return src;
  }
  function load_directives(directives, cb){
    $(directives).each(function(k,v){
      var src = get_src(v);
      $(v).removeAttr("src");
      $(v).removeClass("include");
      var attrs = get_attributes($(v).get(0))
      if( !src ){
        cb([]);
      }else{
        $.get(src,function(data){
          var scripts = inject_directive($(v),data,attrs);
          // remove include directive
          $(v).remove();
          cb(scripts);
        })
          .fail(function() {
            // remove include directive
            cb([]);
          });
      }
    });
  }

  // loads all includes directive, execute handler when they are loaded
  var template = function (){
  };
  template.prototype.scripts = [];
  template.prototype.length = 0;
  template.prototype.cur_length = 0;
  template.prototype.render_build = function(cb){
    var directives = $("[class*='include']").not("[target='client']"); /* target any class containing include */
    if( directives.length == 0 ){
      if( cb ) cb();
    }else{
      this.length += directives.length;
      var that = this;
      directives.removeAttr("target");
      load_directives(directives,function(scripts){
        for(var n in scripts ) that.scripts.push(scripts[n])
        that.cur_length++;
        if( that.cur_length == that.length ){
          that.render_build(cb);
        }
      });
    }
  };
  template.prototype.render_client = function(cb){
    var directives = $("[class*='include']").not("[target='build']"); /* target any class containing include */
    if( directives.length == 0 ){
      if( cb ) cb();
    }else{
      this.length += directives.length;
      var that = this;
      directives.removeAttr("target");
      load_directives(directives,function(scripts){
        for(var n in scripts ) that.scripts.push(scripts[n])
        that. cur_length++;
        if( that.cur_length == that.length ){
          that.render_client(cb);
        }
      });
    }
  };
  template.prototype.inject_scripts = function(){
    // append scripts to the body
    $(this.scripts).appendTo("body");
  };

  return template;
});