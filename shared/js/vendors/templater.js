
// declare only once
if( ! templater ){
    //
    var templater = (function(){
        // loads all includes directive, execute handler when they are loaded
        var template = function (next){
            // render the config to the theme's template
            var length = $(".include").length;
            var cur_length = 0;
            $(".include").each(function(k,v){
                $(v).removeClass("include");
                $.get($(v).attr("src"),function(data){
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
                        $(n).insertAfter($(v));
                    })
                    // remove include directive
                    $(v).remove();
                    // append scripts to the body
                    $(scripts).appendTo("body");
                    cur_length++;
                    if( cur_length == length ) next();
                })
            });
        };
        return template;
    })();

    if ( typeof define === "function" && define.amd ) {
        define( function () { return templater; } );
    }
}