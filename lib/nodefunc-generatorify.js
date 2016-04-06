(function() {

  "use strict";

  module.exports = function(fn, options) {
    options = options || {};
    var noErrorParameter = options.noErrorParameter || false;
    var hasMultipleResults = options.hasMultipleResults || false;

    return function*() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);

      var promise = new Promise(function(resolve, reject) {
        var thunkFn = function() {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 0) {
            resolve();
          } else {
            if (!noErrorParameter && (args[0] !== null && (typeof args[0] !== "undefined"))) {
              reject(args[0]);
            } else {
              var resultIndex = noErrorParameter ? 0 : 1;
              if(!hasMultipleResults) {
                resolve(args[resultIndex]);
              } else {
                resolve(args.slice(resultIndex));
              }
            }
          }
        };
        fn.apply(self, args.concat(thunkFn));
      });


      try {
        var result = yield promise;
        return result;
      } catch(e) {
        var newE = (e instanceof Error) ? e : new Error(e);
        newE._innerStack = new Error().stack;
        throw newE;
      }
    };
  };
})();
