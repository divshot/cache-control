var path = require('path');
var _ = require('lodash');
var minimatch = require('minimatch');
var slash = require('slasher');
var url = require('fast-url-parser');
var regular = require('regular');

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
        else if (isNumber(val)) res.setHeader('Cache-Control', 'public, max-age=' + val.toString());
        else if (_.isString(val)) res.setHeader('Cache-Control', val);
      }
    });

    if (!matched) res.setHeader('Cache-Control', 'public, max-age=300');
    
    next();
    
    function isNumber (val) {
      return _.isNumber(val) || regular.number.test(val);
    }
  };
};