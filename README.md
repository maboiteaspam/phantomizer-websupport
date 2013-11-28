# phantomizer-websupport v0.1.x

> Provides embedded client-side libraries for Phantomizer application

phantomizer-websupport adds a virtual /vendors/ directory url path to your phantomizer webserver.
It contains various supported libraries that you are invited to use.
It contains also the dashboard, the device previewer, phantomizer client side libraries to use and various extra utilities.
Only phantomizer is mandatory to your client side application.
Others libraries are here so that you are ready-to-develop


# Phantomizer client side libraries
Following code is mandatory to your page bootstrap
```javascript
"use strict";
require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer){

    phantomizer.render(function(next){
        //- here is the main entry point function
        //- on the client side
        //- it is unique by page
        next();
    });
});

```

some more details about the build workflow you could take advantage to build your app.
```javascript
"use strict";
require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer){

    phantomizer.beforeRender(function(next){
        // it happens before the static rendering of your app == the first
        next();
    }); // on client side, only when not built, otherwise skipped
    // static rendering would occur here == mandatory, resolves your include
    phantomizer.afterStaticRender(function(next){
        // it happens after the static rendering of your app
        next();
    }); // on client side, only when not built, otherwise skipped
    phantomizer.afterStaticRender(function(next){
        // it happens after the static rendering of your app, but only on the client side == before render
        next();
    },var target="client"); // only on client side, always executed

    phantomizer.render(function(next){
        //- here is the main entry point function
        //- on the client side
        next();
    }); // only on client side, always executed

    phantomizer.afterClientRender(function(next){
        // it happens after the main render
        next();
    });

    phantomizer.afterRender(function(next){
        // it happens after the whole render == the last
        next();
    });

    // handlers not expressively attached to the client side, or intended to produce static part of UI, are executed only if the app is not built
});

```




# Embedded, thanks to all of them

    jquery
    zepto
    knockout
    almond
    require
    jshint
    csslint
    modernizer
    qunit
    holmes
    jasmine, but deprecated for the moment
    underscore


# Why ?

To provide an easy-to-develop environment.

## Release History


---
