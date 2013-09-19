define(["jquery"], function($) {

    if( window.DomainFactory && window.DomainFactory != undefined && window.DomainFactory != null ){
        return window.DomainFactory
    }

    function superDfd(){
        var o = {};
        o._hdl = [];
        o.Accept = function(Message){
            if( ! o._hdl[Message] ){
                o._hdl[Message] = [];
                this[Message] = function(hdl){
                    o._hdl[Message].push(hdl);
                    return o;
                };
            }
            return o;
        };
        o.When = function(Message, hdl){
            o.Accept(Message);
            o._hdl[Message].push(hdl);
            return o;
        };
        o.Resolve = function(Message, data){
            var found = false;
            if( o._hdl[Message] ){
                for(var k2 in o._hdl[Message] ){
                    o._hdl[Message][k2](data);
                    found = true;
                }
            }
            return found;
        };
        o.Clear = function(Message){
            o._hdl[Message] = []
        };
        return o;
    };
    function forgeSuperDfd(){
        var dfd = superDfd();
        dfd.Accept("Always");
        dfd.Accept("Unavailable");
        dfd.Accept("Recover");
        dfd.Accept("Success");
        dfd.Accept("Failure");
        dfd.Accept("Notify");
        return dfd;
    }
    /**
     * A ServiceReference
     * has a Name (Customer / Basket / WhatEverElse )
     * it certainly holds a list of reference to functions that handles
     * connect / receipt with
     * the server for each method exposed by this one
     *
     *  Service                 =   Server
     *      Method1(args...)    =        URL?params...
     *      Method2(args...)    =        URL?params...
     *
     *
     * It exposes methods thru few accessors
     *  - Service
     *      The raw function that composes the service
     *      If there is a mock up, they are covered (it is not safe to use it or rely on it outside this scope)
     *  - Deferred
     *      Provide access to inner super deferred (it is not safe to use it or rely on it outside this scope)
     *  - Promise
     *      Provide access to method resolution promise (it is safe to use it)
     *  - Resolver
     *      Provide access to a response resolver (it is not safe to use it or rely on it outside this scope)
     *  - Caller
     *      Provide access to a method invoker (it is safe to use it)
     *
     *  Thus, you will use mainly Promise && Caller
     *      Promise let you make a contract with Service
     *          Service will Promise that
     *          Everytime Method() is invoked
     *              your handler will be called
     *      Example : SomeService.Promise().SomeMethod(my_handler);
     *      You will mainly bind your view handler there
     *      and probably declare on load, once time
     *      my_handler is a function such as
     *      function(arg...){
     *          // treatment
     *          // void()
     *      }
     *
     *      Caller let tou invoke the desired Method of a Service
     *      Example :SomeService.Caller().SomeMethod(my_arg...)
     *      This will mainly be called during loading or interaction
     *      This method will return a deferred to let catch smoothly the request execution
     *
     *      Up to the service to transform provided arguments
     *      into the correctly intelligible request to the
     *      corresponding server uri
     *
     * Mock-up
     * Each Service can be covered with a ServiceBodyMockUp object
     * This Mock Object is a function such as
     *  function(UnderlyingServiceBody){
     *      return {
     *          Methode1:function(){
     *              // do something, return a deferred
     *              // you can mmake use of the original ServiceBody Definition
     *              // with UnderlyingServiceBody object
     *          }
     *      };
     *  }
     *  Each method of the Mock Object will cover it s equivalent into
     *  exposed ServiceBody
     *
     * @param Name
     * @param ServiceBody
     * @constructor
     */
    var ServiceReference = function(Name, ServiceBody){
        var that = this;

        that.Name = Name;
        that.ServiceBody = ServiceBody;
        that.ServiceBodyMockUp = null;

        that.Service = {};
        that.Deferred = {};
        that.Promise = {};
        that.Resolver = {};
        that.Caller = {};
        that.Once = {};
        that.NextTime = {};
        that.LastStatus = "";

        this.InitService(that.ServiceBody, that.ServiceBodyMockUp);
    };
    ServiceReference.prototype.Export = function(){
        var that = this;
        return {
            Name:that.Name,
            Promise:that.Promise,
            NextTime:that.NextTime,
            Resolver:that.Resolver,
            Caller:that.Caller
        };
    };
    ServiceReference.prototype.InitService = function(ServiceBody, ServiceBodyMockUp){
        var that = this;
        var Service = ServiceBody;
        that.Service = $.extend({},Service);
        if( ServiceBodyMockUp ){
            var StubService = ServiceBodyMockUp(Service);
            for( var k in StubService ){
                that.Service[k] = StubService[k]
            }
        }

        for( var k in Service ){
            that.LastStatus = "";
            if( !that.Deferred[k] ){
                that.Deferred[k] = forgeSuperDfd();
            }
            if( !that.Once[k] ){
                that.Once[k] = forgeSuperDfd();
            }
            if( !that.NextTime[k] ){
                that.NextTime[k] = (function(instance, method_name){
                    return function ( ) {
                        return instance.Once[method_name];
                    };
                })(that, k);
            }
            if( !that.Promise[k] ){
                that.Promise[k] = (function ( instance, method_name ) {
                    return function ( ) {
                        return instance.Deferred[method_name];
                    };
                })( that, k );
            }
            if( !that.Resolver[k] ){
                that.Resolver[k] = (function ( instance, method_name ) {
                    return function ( Message, data ) {
                        var d = instance.Deferred[method_name];
                        var once = instance.Once[method_name];
                        if( instance.LastStatus == "Unavailable" &&
                            Message != "Unavailable" && Message != "Recover" ){
                            d.Resolve("Recover", data);
                            if( once ){
                                once.Resolve("Recover", data);
                                once.Clear("Recover");
                            }
                        }
                        var retour = d.Resolve(Message, data);
                        if( once ){
                            once.Resolve(Message, data);
                            once.Clear(Message);
                        }
                        if( Message != "Always" ){
                            d.Resolve("Always", data);
                            if( once ){
                                once.Resolve("Always", data);
                                once.Clear("Always");
                            }
                        }
                        that.LastStatus = Message;
                        return retour;
                    };
                })( that, k );
            }
            if( !that.Caller[k] ){
                that.Caller[k] = (function ( instance, method_name ) {
                    return function () {
                        var embedded = instance.Service[method_name];
                        var promise = instance.Deferred[method_name];
                        var resolver = instance.Resolver[method_name];
                        var dfd = $.Deferred();
                        if( promise.Notify && promise.Notify != undefined ){
                            for (var n in promise._hdl.Notify) {
                                dfd.progress(promise._hdl.Notify[n]);
                            }
                        }

                        function is_defer(response){
                            return response.done != undefined && response.fail != undefined;
                        };
                        function is_request_response(response){
                            return response.status != undefined && response != undefined;
                        };
                        function pipe_to_dfd(dfd,response, resolver){
                            response.done(function(data){
                                connect(dfd, data, resolver);
                            });
                            response.fail(function(data, reason){
                                pipe_to_resolve(dfd, {status:"Unavailable", data:{}, errors:{reason:reason}}, resolver);
                            });
                            response.progress(dfd.notify);
                        };
                        function pipe_to_resolve(dfd, response, resolver){
                            if( resolver(response.status, response) ){
                                dfd.resolve(response.status, response);
                            }else{
                                dfd.reject(response.status, response);
                            }
                        };
                        function connect(dfd, response, resolver){
                            if( is_defer(response) ){
                                pipe_to_dfd(dfd,response, resolver);
                            }else if( is_request_response(response) ){
                                pipe_to_resolve(dfd,response, resolver);
                            }else{
                                console.log(response);
                                throw "Cannot handle this kind of response";
                            }
                            return dfd;
                        };
                        var response = embedded.apply(null, arguments);
                        connect(dfd, response, resolver);

                        return dfd;
                    };
                })( that, k );
            }
        }
        return that;
    };
    ServiceReference.prototype.MockUp = function(ServiceBodyMockUp){
        var that = this;
        that.ServiceBodyMockUp = ServiceBodyMockUp;
        return that.InitService(that.ServiceBody, that.ServiceBodyMockUp);
    };


    /**
     * A DomainFactory knows how to build
     * ServiceFactory
     * @constructor
     */
    var DomainFactory = function(){
        var that = this;
        that.instances = {};
    };
    /**
     * Returns instance of a service
     *
     * @param Name
     * @returns {*}
     * @constructor
     */
    DomainFactory.prototype.Instance = function(Name){
        var that = this;
        return that.instances[Name];
    };
    /**
     * Returns export of a service
     *
     * @param Name
     * @returns {*}
     * @constructor
     */
    DomainFactory.prototype.Get = function(Name){
        var that = this;
        return that.instances[Name].Export();
    };
    DomainFactory.prototype.Has = function(Name){
        var that = this;
        return that.instances[Name] != undefined && that.instances[Name] != null;
    };
    /**
     * Initialize a service
     * given a Name and a ServiceBody
     *
     * Returns a ServiceFactory, ie a function, that let you pass
     * a ServiceBodyMockUp to cover
     * current service
     * It returns an
     * Export of Service of name Name
     *
     * @param Name
     * @param ServiceBody
     * @returns {Function}
     */
    DomainFactory.prototype.InitializeDomain = function(Name, ServiceBody){
        var that = this;
        if( that.Has(Name) == false ){
            that.instances[Name] = new ServiceReference(Name, ServiceBody);
        }
        return function(ServiceBodyMockUp){
            var that_ = that;
            var m = that_.Instance(Name);
            if( ServiceBodyMockUp ) m.MockUp(ServiceBodyMockUp);
            return m.Export();
        };
    };
    window.DomainFactory = new DomainFactory();
    
    return window.DomainFactory;
});
