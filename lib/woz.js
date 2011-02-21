var Client = require('./client').Client,
    BreakpointManager = require('./breakpoint_manager').BreakpointManager,
    ScriptManager = require('./script_manager').ScriptManager,
    inherits = require('util').inherits,
    events = require('events');

function Woz() {
  this.client = new Client();
  this.breakpoints = new BreakpointManager(this.client);
  this.scripts = new ScriptManager(this.client);
}
inherits(Woz, events.EventEmitter);
exports.Woz = Woz;

Woz.prototype.attach = function(port) {
  this.client.connect(port);
  //TODO listen for 'ready', get scripts, send scripts to callback
}

Woz.prototype.detach = function() {
  this.client.disconnect();
}

Woz.prototype.resume = function() {

}

Woz.prototype.scripts = function() {

}
