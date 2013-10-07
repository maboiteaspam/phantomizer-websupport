// deferrer helps you to emulate a jQuery.Deferrer object
define(["vendors/go-phantomizer/queuer","vendors/go-phantomizer/template","vendors/utils/dfrer"],function (queuer, template, dfrer) {
    var phantomizer = function(){
    }
    phantomizer.prototype.template = new template();
    phantomizer.prototype.queuer = new queuer(window.phantomatic || false);

    phantomizer.prototype.before_render = [];
    phantomizer.prototype.after_static_render = [];
    phantomizer.prototype.after_client_render = [];
    phantomizer.prototype.after_render = [];

    function add_to_queuer(queuer,render_list){
        for(var n in render_list ){
            var render = render_list[n].render;
            if(render=="client"){
                queuer.render_client(render_list[n].fn);
            }else if(render=="static"){
                queuer.render_static(render_list[n].fn);
            }else{
                queuer.render(render_list[n].fn);
            }
        }
    }
    phantomizer.prototype.render = function(main_fn){
        var that = this;
        add_to_queuer(that.queuer, that.before_render);
        // Using render_static, this function will be called only for the build
        that.queuer.render_static(function(next){
            that.template.render_build(next);
        });
        add_to_queuer(that.queuer, that.after_static_render);
        that.queuer.render(function(next){
            that.template.render_client(next);
        });
        that.queuer.render(main_fn);

        add_to_queuer(that.queuer, that.after_client_render);
        that.queuer.render(function(next){
            that.template.inject_scripts();
            next();
        });
        add_to_queuer(that.queuer, that.after_render);

        that.queuer.run();
    };
    phantomizer.prototype.afterStaticRender = function(fn,render){
        render= render?render:"static";
        this.after_static_render.push({fn:fn,render:render});
    }
    phantomizer.prototype.afterClientRender = function(fn,render){
        render= render?render:"render";
        this.after_client_render.push({fn:fn,render:render});
    }
    phantomizer.prototype.afterRender = function(fn,render){
        render= render?render:"render";
        this.after_render.push({fn:fn,render:render});
    }
    phantomizer.prototype.beforeRender = function(fn,render){
        render= render?render:"render";
        this.before_render.push({fn:fn,render:render});
    }
    phantomizer.prototype.when = function(){
        var dfd = new dfrer();
        var dfrers = arguments;
        var todo_cnt = dfrers.length;
        var done_cnt = 0;
        for( var n=0;n<todo_cnt;n++){
            dfrers[n].always(function(){
                done_cnt++;
                if( done_cnt == todo_cnt ){
                    dfd.resolve();
                }
            });
        }
        return dfd;
    }
    return new phantomizer();
});
