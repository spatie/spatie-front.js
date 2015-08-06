$ = require("jquery");

// the object
var s_ = {};

// Get language from DOM or default to 'en'
s_.lang = document.documentElement.lang ? document.documentElement.lang : 'en';

// NPM module export
module.exports = s_ ;