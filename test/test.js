require("should");
var co = require("co");
var generatorify = require("../lib/nodefunc-generatorify");

var sayHello = function(str, cb) {
  return cb(null, "Hello " + str);
};

var sayHelloWithoutError = function(str, cb) {
  return cb("Hello " + str);
};

var sayHelloAndMaster = function(str, cb) {
  return cb(null, "Hello " + str, "Master");
};

var sayHelloAndMasterWithoutError = function(str, cb) {
  return cb("Hello " + str, "Master");
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

  it(`If callback has multiple parameters, return an array`, function() {
    var generatorFn = generatorify(sayHelloAndMaster);
    var gen = generatorFn("world");
    var result = gen.next();
    return result.value.then(function(val) {
      val[0].should.equal("Hello world");
      val[1].should.equal("Master");
    });
  });

  it(`Convert a node func (without err param) to a generator func returning a promise`, function() {
    var generatorFn = generatorify(sayHelloWithoutError, true);
    var gen = generatorFn("world");
    var result = gen.next();
    return result.value.then(function(val) {
      val.should.equal("Hello world");
    });
  });

  it(`If callback (without err param) has multiple parameters, return an array`, function() {
    var generatorFn = generatorify(sayHelloAndMasterWithoutError, true);
    var gen = generatorFn("world");
    var result = gen.next();
    return result.value.then(function(val) {
      val[0].should.equal("Hello world");
      val[1].should.equal("Master");
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
