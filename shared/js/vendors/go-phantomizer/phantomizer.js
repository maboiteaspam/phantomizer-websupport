// deferrer helps you to emulate a jQuery.Deferrer object
define(["vendors/go-phantomizer/queuer","vendors/go-phantomizer/template","vendors/utils/dfrer"],function (queuer, template, dfrer) {
    var phantomizer = function(){
        var that = this;
        // Using render_static, this function will be called only for the build
        this.queuer.render_static(function(next){
            that.template.render_build(next);
        });
    }
    phantomizer.prototype.template = new template();
    phantomizer.prototype.queuer = new queuer(window.phantomatic || false);
    phantomizer.prototype.render_static = function(fn){
        var that = this;
        this.queuer.render_static(function(next){
            fn(next);
        });
    };
    phantomizer.prototype.render = function(fn){
        var that = this;
        this.queuer.render(function(next){
            that.template.render_client(next);
        });
        this.queuer.render(function(next){
            fn(next);
        });
        this.queuer.render(function(next){
            that.template.inject_scripts();
            $("html").addClass(" app-ready ");
            next();
        });
        this.queuer.run();
    };
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
