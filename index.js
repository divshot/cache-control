var url = require('fast-url-parser');
var regular = require('regular');
var onHeaders = require('on-headers');
var globject = require('globject');
var slasher = require('glob-slasher');
var setCacheHeader = require('cache-header');

module.exports = function (cachePaths) {
  
  return function (req, res, next) {
    
    var pathname = url.parse(req.url).pathname;
    var cacheValues = globject(slasher(cachePaths || {}, {value: false}));
    var cacheValue = cacheValues(slasher(pathname));
    
    onHeaders(res, function () {
      
      // Default value
      res.setHeader('Cache-Control', 'public, max-age=300');
      setCacheHeader(res, cacheValue);
    });
    
    next();
  };
};