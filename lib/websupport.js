'use strict';

// External libs.
var path = require('path');

(function(exports) {
    exports.www_vendors_path = path.resolve(__dirname+"/../shared/")+"/";
    exports.directory_template_path = path.resolve(__dirname+"/../template/")+"/directory.ejs";

}(typeof exports === 'object' && exports || this));