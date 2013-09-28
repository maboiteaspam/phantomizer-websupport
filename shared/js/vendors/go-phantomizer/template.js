define([],function () {
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
        // remove include directive
        $(directive).remove();

        return scripts;
    }
    function load_directives(directives, cb){
        $(directives).each(function(k,v){
            $(v).removeClass("include");
            var src = $(v).attr("src");
            $.get(src,function(data){
                var scripts = inject_directive($(v),data);
                cb(scripts);
            })
            .fail(function() {
                cb([]);
            });
        });
    }

    // loads all includes directive, execute handler when they are loaded
    var template = function (){
    };
    template.prototype.scripts = [];
    template.prototype.length = 0;
    template.prototype.cur_length = 0;
    template.prototype.render_build = function(cb){
        var directives = $(".include[target!='client']");
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
        var directives = $(".include[target='client']");
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