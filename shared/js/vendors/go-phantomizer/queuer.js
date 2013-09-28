define([],function () {
    var queuer = function(is_building){
        this.is_built = window.is_built;
        this.is_building = is_building;
    }
    //  list handlers to execute
    queuer.prototype.is_built = null;
    queuer.prototype.is_building = null;
    queuer.prototype.items = []
    // queue an handler, rendered only for the build
    queuer.prototype.render_static = function(handler){
        this.items.push({'type':'static','handler':handler})
    }
    // queue an handler, rendered only for the client
    queuer.prototype.render = function(handler){
        this.items.push({'type':'dynamic','handler':handler})
    }
    // call it when you finished to enqueue new handlers
    queuer.prototype.run = function(){
        if( this.items.length == 0 ){
            // phantom_proof is a script indicating that the build is done
            if( !document.getElementById("phantom_proof") ){
                var h = document.getElementsByTagName("html")[0];
                var c = h.getAttribute("class");
                c = c?" "+c:"";
                if( h ) h.setAttribute("class", c+" stryked")

                var s = document.createElement("script")
                s.setAttribute("id", "phantom_proof")

                var st = "\n"
                st += "window.is_built = true;\n";
                st = st.replace("<"+"/script>", "<\\/script>")
                s.innerHTML = st
                var tgt_script = document.getElementsByTagName("script")[0] || document.getElementsByTagName("")[0];
                tgt_script.parentNode.insertBefore(s,tgt_script)
            }
        }else{
            // next will call the next handler in the queue
            var next = (function(ph){return function(){return ph.run();}})(this)
            var item = this.items.shift();
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
