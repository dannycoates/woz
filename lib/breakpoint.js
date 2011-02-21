function Breakpoint(obj, manager) {
  this.manager = manager;
  var keys = Object.keys(obj);
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    this[key] = obj[key];
  }
}

exports.Breakpoint = Breakpoint;

Breakpoint.prototype.clear = function() {
  this.manager.clearBreakpoint(this.number);
}

Breakpoint.prototype.change = function(enabled, condition) {
  this.manager.changeBreakpoint(this.number, enabled, condition);
}
