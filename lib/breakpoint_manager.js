function BreakpointManager(client) {
  this.client = client;
  this.breakOnExceptions = false;
  this.breakOnUncaughtExceptions = false;
  this.breakpoints = {};
}

exports.BreakpointManager = BreakpointManager;

BreakpointManager.prototype.listBreakpoints = function() {
  var self = this;
  this.client.listBreakpoints(function(breakInfo) {
    self.breakOnExceptions = breakInfo.breakOnExceptions;
    self.breakOnUncaughtExceptions = breakInfo.breakOnUncaughtExceptions;
    self.breakpoints = {};
    breakInfo.breakpoints.forEach(function(breakpoint) {
      self.breakpoints[breakpoint.number] = breakpoint;
    });
  });
}

BreakpointManager.prototype.setExceptionBreak = function(type, enabled) {
  var self = this;
  this.client.setExceptionBreak(type, enabled, function(result) {
    if (result.type === 'all') {
      self.breakOnExceptions = result.enabled;
    }
    else {
      self.breakOnUncaughtExceptions = result.enabled;
    }
  });
}
