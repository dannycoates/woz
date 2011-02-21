function Breakpoint(number, manager) {
  this.number = number;
  this.manager = manager;
}

exports.Breakpoint = Breakpoint;

Breakpoint.prototype.clear = function() {
  this.manager.clearBreakpoint(this.number);
}

Breakpoint.prototype.change = function(enabled, condition) {
  this.manager.changeBreakpoint(this.number, enabled, condition);
}
