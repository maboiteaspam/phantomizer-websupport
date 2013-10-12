'use strict';

// External libs.
var path = require('path');

(function(exports) {
    exports.www_vendors_path = path.resolve(__dirname+"/../shared/")+"/";

}(typeof exports === 'object' && exports || this));