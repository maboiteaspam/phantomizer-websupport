'use strict';

module.exports = function(grunt) {

  var ProgressBar = require("progress");
  var ph_libutil = require("phantomizer-libutil");
  var phantomizer_helper = ph_libutil.phantomizer_helper;

  grunt.registerMultiTask("phantomizer-dir-inject-html-extras",
    "Scans a directory and inject extra html into all html / htm files", function () {

      var options = this.options();

      var in_dir = options.in_dir;

      var requirejs_src = options.requirejs.src;
      var requirejs_baseUrl = options.requirejs.baseUrl;
      var requirejs_paths = options.requirejs.paths;

      var files = grunt.file.expand(in_dir+"**/*.{html,htm}");
      grunt.log.ok("Files Count "+files.length);


// initialize a progress bar
      var bar = new ProgressBar(' done=[:current/:total] elapsed=[:elapseds] sprint=[:percent] eta=[:etas] [:bar]', {
        complete: '#'
        , incomplete: '-'
        , width: 80
        , total: files.length
      });

      for( var n in files ){
        var file = files[n];
        var retour = grunt.file.read(file);
        retour = inject_extras(retour,requirejs_baseUrl,requirejs_src, requirejs_paths);
        grunt.file.write(file, retour);
        grunt.verbose.ok("Extras inject in "+file);
        bar.tick();
      }
    });
  function inject_extras(buf,requirejs_baseUrl,requirejs_src, requirejs_paths){
    buf = phantomizer_helper.inject_requirejs(requirejs_baseUrl, requirejs_src, requirejs_paths, buf, null)

    var injected = '/js/vendors/go-phantomizer/extras-loader.js';
    buf = phantomizer_helper.inject_after_requirejs(requirejs_baseUrl,requirejs_src, requirejs_paths, buf, injected)
    return buf;
  };
};