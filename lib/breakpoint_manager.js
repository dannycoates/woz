var inherits = require('util').inherits,
    Breakpoint = require('./breakpoint').Breakpoint,
    inspect = require('util').inspect,
    events = require('events');

function BreakpointManager(client) {
  this.client = client
  this.breakOnExceptions = false
  this.breakOnUncaughtExceptions = false
  this.breakpoints = {}

  this.client.on('break', this.handleBreak.bind(this))
}

inherits(BreakpointManager, events.EventEmitter)
exports.BreakpointManager = BreakpointManager

BreakpointManager.prototype.handleBreak = function(event) {
  var self = this
  var breaks = event.body.breakpoints.filter(function(bp) {
    return self.breakpoints[bp] !== undefined
  })
  if (breaks.length > 0) {
    breaks.forEach(function(bp) {
      self.breakpoints[bp].handleBreak()
    })
  }
  else {
    // emit something...
  }
}

BreakpointManager.prototype.setBreakpoint = function(options, callback) {
  var self = this
  this.client.setBreakpoint(
    options.scriptId,
    options.line,
    true,
    options.condition,
    function(err, obj) {
      var bp =
       new Breakpoint({
        number: obj.breakpoint,
        scriptId: options.scriptId,
        type: 'scriptId',
        actualLocations: obj.actual_locations,
        watch: options.watch,
        action: options.action
      }, self, self.client)
      self.breakpoints[obj.breakpoint] = bp
      if (typeof(callback) === 'function') callback(err, bp)
  })
}

BreakpointManager.prototype.listBreakpoints = function() {
  var self = this
  this.client.listBreakpoints(function(err, breakInfo) {
    self.breakOnExceptions = breakInfo.breakOnExceptions
    self.breakOnUncaughtExceptions = breakInfo.breakOnUncaughtExceptions
    self.breakpoints = {}
    breakInfo.breakpoints.forEach(function(breakpoint) {
      self.breakpoints[breakpoint.number] = new Breakpoint(breakpoint, self, self.client)
    })
    self.emit('breakpoints')
  })
}

BreakpointManager.prototype.setExceptionBreak = function(type, enabled) {
  var self = this
  this.client.setExceptionBreak(type, enabled, function(err, result) {
    if (result.type === 'all') {
      self.breakOnExceptions = result.enabled
    }
    else {
      self.breakOnUncaughtExceptions = result.enabled
    }
  })
}
