var url = require('fast-url-parser');
var regular = require('regular');
var onHeaders = require('on-headers');
var globject = require('globject');
var slasher = require('glob-slasher');
var setCacheHeader = require('cache-header');
var isSuccess = require('is-success')

module.exports = function (cachePaths) {

  return function (req, res, next) {

    var pathname = url.parse(req.url).pathname;
    var cacheValues = globject(slasher(cachePaths || {}, {value: false}));
    var cacheValue = cacheValues(slasher(pathname));

    onHeaders(res, function () {
      if (res.statusCode && isSuccess(res.statusCode)) {
        setCacheHeader(res, cacheValue);
      }
    });

    next();
  };
};
