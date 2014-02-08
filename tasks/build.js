'use strict';

module.exports = function(grunt) {

  var ProgressBar = require("progress");
  var ph_libutil = require("phantomizer-libutil");
  var phantomizer_helper = ph_libutil.phantomizer_helper;

  var router_factory    = ph_libutil.router;
  grunt.registerMultiTask("phantomizer-dir-inject-html-extras",
    "Scans a directory and inject extra html into all html / htm files", function () {

      var options = this.options();

      var in_dir = options.in_dir;

      var requirejs_src = options.requirejs.src;
      var requirejs_baseUrl = options.requirejs.baseUrl;
      var requirejs_paths = options.requirejs.paths;


      var done = this.async();

      var config = grunt.config();
      var router = new router_factory(config.routing);
      router.load(function(){

        // fetch urls to build
        var not_added = [];
        var urls = router.collect_urls(function(route){
          if( route.export == false ){
            not_added.push(route);
            return false;
          }
          return true;
        });
        grunt.log.ok("URL to patch: "+urls.length+"/"+(urls.length+not_added.length));

// initialize a progress bar
        var bar = new ProgressBar(' done=[:current/:total] elapsed=[:elapseds] sprint=[:percent] eta=[:etas] [:bar]', {
          complete: '#'
          , incomplete: '-'
          , width: 80
          , total: urls.length
        });

        for( var n in urls ){
          var file = in_dir+urls[n];
          var retour = grunt.file.read(file);
          if( retour ){
            retour = inject_extras(retour,requirejs_baseUrl,requirejs_src, requirejs_paths);
            grunt.file.write(file, retour);
            grunt.verbose.ok("Extras inject in "+file);
          }else{
            grunt.log.error("File is missing: "+file)
          }
          bar.tick();
        }

        done();
      });

    });


  function inject_extras(buf,requirejs_baseUrl,requirejs_src, requirejs_paths){
    buf = phantomizer_helper.inject_requirejs(requirejs_baseUrl, requirejs_src, requirejs_paths, buf, null)

    var injected = '/js/vendors/go-phantomizer/extras-loader.js';
    buf = phantomizer_helper.inject_after_requirejs(requirejs_baseUrl,requirejs_src, requirejs_paths, buf, injected)
    return buf;
  };
};