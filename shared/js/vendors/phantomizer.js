

// phantomizer is a function queuer
// that can skip some calls depending on the status of
// window.phantomized

// declare only once
if( ! phantomizer ){
    //
    var phantomizer = (function(){
        // search for global variables to guess what is current execution status
        var phantomized = window.phantomized || false; // already built
        var phantomizing = window.phantomatic || false; // currently building

        var queuer = function(){}
        //  list handlers to execute
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
        queuer.prototype.done = function(){
            if( this.items.length == 0 ){
                // phantom_proof is a script indicating that the build is done
                if( !document.getElementById("phantom_proof") ){
                    var h = document.getElementsByTagName("html")[0];
                    var c = h.getAttribute("class");
                    c = c?" "+c:"";
                    if( h ) h.setAttribute("class", c+"stryked")

                    var s = document.createElement("script")
                    s.setAttribute("id", "phantom_proof")

                    var st = "\n"
                    st += "window.phantomized = true;\n";
                    st = st.replace("<"+"/script>", "<\\/script>")
                    s.innerHTML = st
                    var tgt_script = document.getElementsByTagName("script")[0] || document.getElementsByTagName("")[0];
                    tgt_script.parentNode.insertBefore(s,tgt_script)
                }
            }else{
                // next will call the next handler in the queue
                var next = (function(ph){return function(){return ph.done();}})(this)
                var item = this.items.shift();
                if( item.type == 'static' ){
                    phantomized ? // if, already build
                        next() : // then, just pass without executing handler
                        item.handler(next); // otherwise, execute handler, pass it next to manage next iteration occurrence
                }else if( !phantomizing ){ // are we currently building ?
                    item.handler(next); // if not, then execute handler
                }else{ // otherwise, we are building, do not render dynamic handler, just pass
                    next();
                }
            }
        }

        return {queue: new queuer() };
    })();

    if ( typeof define === "function" && define.amd ) {
        define( function () { return phantomizer; } );
    }
}