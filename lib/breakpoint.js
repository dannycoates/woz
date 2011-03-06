var asyncMap = require('./async_map')

function Breakpoint(obj, manager, client) {
  this.manager = manager;
  this.client = client;
  var keys = Object.keys(obj);
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    this[key] = obj[key];
  }
}

exports.Breakpoint = Breakpoint;

function evaluateWatch(expression, callback) {
  this.client.evaluate(expression, 0, function(err, result) {
    callback(err, result.value)
  })
}

Breakpoint.prototype.clear = function() {
  this.manager.clearBreakpoint(this.number);
}

Breakpoint.prototype.change = function(enabled, condition) {
  this.manager.changeBreakpoint(this.number, enabled, condition);
}

Breakpoint.prototype.handleBreak = function() {
  var cp = {},
      self = this

  asyncMap(this.watch, evaluateWatch.bind(this),
  function(err, results) {
    // TODO: check err
    cp.watch = results;
    self.action(cp, function(err) {
      if(err) console.log(err)
      self.client.continue(null, null, function(){})
    });
  })
}
