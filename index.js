var path = require('path');
var _ = require('lodash');
var minimatch = require('minimatch');
var slash = require('slasher');
var url = require('fast-url-parser');

module.exports = function (options) {
  options = options || {};
  
  return function (req, res, next) {
    var pathname = url.parse(req.url).pathname;
    var matched = false;
    var _rel = slash(pathname);

    _.each(Object.keys(options), function (globKey) {
      var _glob = slash(globKey);
     
      if (minimatch(_rel, _glob) && !matched) {
        var val = options[globKey];
        matched = true;
       
        if (val === false) res.setHeader('Cache-Control', 'no-cache');
        if (_.isNumber(val)) res.setHeader('Cache-Control', 'public, max-age=' + val.toString());
        if (_.isString(val)) res.setHeader('Cache-Control', val);
      }
    });

    if (!matched) res.setHeader('Cache-Control', 'public, max-age=300');
    
    next();
  };
};