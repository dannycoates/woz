var asyncMap = require('./async_map'),
    chain = require('./chain'),
    inspect = require('util').inspect

function Breakpoint(obj, manager, client) {
  this.manager = manager
  this.client = client
  var keys = Object.keys(obj)
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i]
    this[key] = obj[key]
  }
}

exports.Breakpoint = Breakpoint

function evaluateWatch(expression, callback) {
  this.client.evaluate(expression, 0, function(err, result) {
    callback(err, result.value)
  })
}

function print(foo, cb) {
  console.log(inspect(foo, false, 5, true))
  cb(null, foo)
}

function defaultAction(cp, cb) {
  var watchKeys = Object.keys(cp.watch),
      client = this.client,
      res = []

  if (watchKeys.length > 0) {
    watchKeys.forEach(function(key) {
      console.log(key + ' = ' + cp.watch[key])
    })
    cb()
  }
  else {
    //TODO: get first 2 scopes of variables
    chain(
      [[client, 'scope', 0, 0]
      ,[print, chain.last]
      ]
      ,res
      ,cb)
  }
}

Breakpoint.prototype.clear = function() {
  this.manager.clearBreakpoint(this.number)
}

Breakpoint.prototype.change = function(enabled, condition) {
  this.manager.changeBreakpoint(this.number, enabled, condition)
}

Breakpoint.prototype.handleBreak = function() {
  var cp = {},
      self = this

  asyncMap(
    this.watch || [],
    evaluateWatch.bind(this),
    function(err, results) {
      // TODO: check err
      cp.watch = results
      var action = self.action || defaultAction.bind(self)
      action(cp, function(err) {
        if (err) console.log(err)
        self.client.continue(null, null, function(){})
      })
    }
  )
}
