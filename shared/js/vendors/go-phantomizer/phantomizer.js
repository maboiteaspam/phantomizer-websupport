// deferrer helps you to emulate a jQuery.Deferrer object
define(["vendors/go-phantomizer/queuer","vendors/go-phantomizer/template","vendors/utils/dfrer"],function (queuer, template, dfrer) {
    var phantomizer = function(){}
    phantomizer.prototype.template = new template();
    phantomizer.prototype.queuer = new queuer(window.phantomatic || false);
    phantomizer.prototype.render = function(fn){
        var that = this;
        // get the queue to register to
        // Using render_static, this function will be called only for the build
        this.queuer.render_static(function(next){
            that.template.render_build(next);
        });
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
        for(var n in dfrers ){
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
