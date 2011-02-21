var Client = require('./client').Client,
    BreakpointManager = require('./breakpoint_manager').BreakpointManager,
    ScriptManager = require('./script_manager').ScriptManager,
    inherits = require('util').inherits,
    events = require('events'),
    repl = require('repl');

function Woz() {
  this.client = new Client();
  this.breakpoints = new BreakpointManager(this.client);
  this.script_manager = new ScriptManager(this.client);
}
inherits(Woz, events.EventEmitter);
exports.Woz = Woz;

Woz.prototype.attach = function(port) {
  this.client.connect(port);
  //TODO listen for 'ready', get scripts, send scripts to callback
  this.client.on('ready', this.script_manager.getScripts.bind(this.script_manager));
  this.client.on('ready', this.breakpoints.listBreakpoints.bind(this.breakpoints));
  this.breakpoints.on('ready', this._isReady.bind(this));
  this.script_manager.on('ready', this._isReady.bind(this));
}

Woz.prototype._isReady = function(type) {
  if(this.breakpoints.ready && this.script_manager.ready) {
    this.emit('ready');
  }
}

Woz.prototype.detach = function() {
  this.client.disconnect();
}

Woz.prototype.resume = function() {

}

Woz.prototype.repl = function() {
  var context = repl.start('woz> ').context;
  context.woz = this;
}
