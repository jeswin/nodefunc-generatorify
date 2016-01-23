require("should");
var co = require("co");
var generatorify = require("../lib/nodefunc-generatorify");

var sayHello = function(str, cb) {
  return cb(null, "Hello " + str);
};

var throwError = function(str, cb) {
  return cb("Some error", "Hello " + str);
};

describe("Nodefunc Generatorify", function() {
  it(`Convert a node func to a generator func returning a promise`, function() {
    var generatorFn = generatorify(sayHello);
    var gen = generatorFn("world");
    var result = gen.next();
    return result.value.then(function(val) {
      val.should.equal("Hello world");
    });
  });

  it(`Work with co`, function() {
    var generatorFn = generatorify(sayHello);
    var fn = function*() {
      var result = yield generatorFn("world");
      result.should.equal("Hello world");
    };
    return co(fn);
  });

  it(`Should throw an error`, function() {
    var generatorFn = generatorify(throwError);
    var fn = function*() {
      var error;
      try {
        var result = yield generatorFn("world");
      } catch (e) {
        error = e;
      }
      error.message.should.equal("Some error");
    };
    return co(fn);
  });
});
