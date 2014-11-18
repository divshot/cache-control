var path = require('path');
var minimatch = require('minimatch');
var url = require('fast-url-parser');
var regular = require('regular');
var onHeaders = require('on-headers');
var globSlash = require('glob-slash');
var _isNumber = require('lodash.isnumber');

module.exports = function (options) {
  
  options = options || {};
  
  return function (req, res, next) {
    
    var pathname = url.parse(req.url).pathname;
    var matched = false;
    var _rel = globSlash(pathname);
    
    onHeaders(res, function () {
      
      res.setHeader('Cache-Control', 'public, max-age=300');
      
      Object.keys(options).forEach(function (globKey) {
        
        var _glob = globSlash(globKey);
       
        if (minimatch(_rel, _glob) && !matched) {
          var val = options[globKey];
          matched = true;
         
          if (val === false) {
            res.setHeader('Cache-Control', 'no-cache');
          }
          else if (isNumber(val)) {
            res.setHeader('Cache-Control', 'public, max-age=' + val.toString());
          }
          else if (typeof val === 'string') {
            res.setHeader('Cache-Control', val);
          }
        }
      });
    });
    
    next();
  };
};

function isNumber (val) {
  
  return _isNumber(val) || regular.number.test(val);
}