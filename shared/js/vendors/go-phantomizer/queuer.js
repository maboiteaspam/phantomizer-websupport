"use strict";

define([],function () {
    var queuer = function(is_building){
        this.is_built = window.is_built;
        this.is_building = is_building;
    }
    queuer.prototype.is_built = null;
    queuer.prototype.is_building = null;
//  list handlers to execute
    queuer.prototype.items = [];
// queue an handler, to be rendered statically during the build
    queuer.prototype.render_static = function(handler, first){
        if( first == true ) this.items.unshift({'type':'static','handler':handler});
        else this.items.push({'type':'static','handler':handler});
    }
// queue an handler, to be rendered on client side
    queuer.prototype.render = function(handler, first){
        if( first == true ) this.items.unshift({'type':'dynamic','handler':handler});
        else this.items.push({'type':'dynamic','handler':handler});
    }
// run all handlers and fix the build by adding global variable
    queuer.prototype.run = function(){
        if( this.items.length == 0 ){
// inject phantom_proof : a script indicating that the build is done
            if( !document.getElementById("phantom_proof") ){
                var h = document.getElementsByTagName("html")[0];
                var c = h.getAttribute("class");
                c = c?c+" ":"";
                if( h ) h.setAttribute("class", c+"stryked");

                var s = document.createElement("script");
                s.setAttribute("id", "phantom_proof");

                var st = "\n";
                st += "window.is_built = true;\n";
                st = st.replace("<"+"/script>", "<\\/script>");

                try{
                    s.innerHTML = st;
                }catch(e){
                    // ie6 hack
                    s.text = st;
                }
                var tgt_script = document.getElementsByTagName("script")[0] || document.getElementsByTagName("")[0];
                tgt_script.parentNode.insertBefore(s,tgt_script);
            }
        }else{
            // next_ will call the next handler in the queue
            var that = this;
            var item = this.items.shift();
            var next = function(){
                return that.run();
            };
            if( item.type == 'static' ){
                this.is_built ? // if, already build
                    next() : // then, just pass without executing handler
                    item.handler(next); // otherwise, execute handler, pass it next to manage next iteration occurrence
            }else if( !this.is_building ){ // are we currently building ?
                item.handler(next); // if not, then execute handler
            }else{ // otherwise, we are building, do not render dynamic handler, just pass
                next();
            }
        }
    }

    return queuer;
});
