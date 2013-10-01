define([],function () {

    var now = new Date();

    function inject_directive(directive, data){
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
            $(n).insertAfter($(directive));
        })

        return scripts;
    }
    function get_src(el){
        var src = "";
        if( $(el).attr("src") ){
            src = $(el).attr("src");
        }else{
            var found = false;
            $(el).find("div[src]").each(function(k,v){
                found = $(v);
                if( $(v).attr("since") ){
                    var since = $(v).attr("since");

                    if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$") ){
                        since += ":00";
                    }else if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}$") ){
                        since += ":00:00";
                    }else if( since.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$") ){
                        since += " 00:00:00";
                    }
                    since = since.split(" ")
                    since = since[0]+"T"+since[1]+"Z";
                    var p_since = new Date(since);
                    if( ! p_since ){
                        throw "wrong date parsed "+since;
                    }
                    if( p_since.getTime() >= now.getTime()){
                        found = null;
                    }
                }
                if( $(v).attr("until") && true ){
                    var until = $(v).attr("until");

                    if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$") ){
                        until += ":59";
                    }else if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}$") ){
                        until += ":59:59";
                    }else if( until.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$") ){
                        until += " 23:59:59";
                    }
                    until = until.split(" ")
                    until = until[0]+"T"+until[1]+"Z";
                    var p_until = new Date(until);
                    if( ! p_until ){
                        throw "wrong date parsed "+until;
                    }
                    if( p_until.getTime() <= now.getTime()){
                        found = null;
                    }
                }
            });

            if( found ){
                src = $(found).attr("src");
            }
        }
        return src;
    }
    function load_directives(directives, cb){
        $(directives).each(function(k,v){
            $(v).removeClass("include");
            $(v).addClass("included");
            var src = get_src(v);
            if( !src ){
                cb([]);
            }else{
                $.get(src,function(data){
                    var scripts = inject_directive($(v),data);
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
        var directives = $("[class^='include']").not("[target='client']");
        if( directives.length == 0 ){
            cb();
        }else{
            this.length += directives.length;
            var that = this;
            load_directives(directives,function(scripts){
                for(var n in scripts ) that.scripts.push(scripts[n])
                that. cur_length++;
                if( that.cur_length == that.length ){
                    cb();
                }
            });
        }
    };
    template.prototype.render_client = function(cb){
        var directives = $("[class^='include']").not("[target='build']");
        if( directives.length == 0 ){
            cb();
        }else{
            this.length += directives.length;
            var that = this;
            load_directives(directives,function(scripts){
                for(var n in scripts ) that.scripts.push(scripts[n])
                that. cur_length++;
                if( that.cur_length == that.length ){
                    cb();
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