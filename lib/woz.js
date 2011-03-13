var Client = require('./client').Client,
    ScriptManager = require('./script_manager').ScriptManager,
    BreakpointManager = require('./breakpoint_manager').BreakpointManager,
    inherits = require('util').inherits,
    events = require('events'),
    repl = require('repl')

function Woz() {
  this.client = new Client()
}
inherits(Woz, events.EventEmitter)

Woz.prototype.attach = function(port, handler) {
  var self = this;
  this.client.connect(port)
  this.client.once('ready', function() {
    self.break_manager = new BreakpointManager(self.client)
    self.scripts = new ScriptManager(self.client, self)
    self.scripts.once('ready', function() {
      self.emit('ready')
    })
  })
  if (typeof(handler) === 'function') {
    this.once('ready', handler.bind(this))
  }
}

Woz.prototype.detach = function() {
  //TODO remove all breakpoints
  this.client.disconnect()
}

Woz.prototype.resume = function() {
  this.client.continue(null, null, function() {})
}

Woz.prototype.repl = function() {
  var r = repl.start('woz> ')
  r.context.woz = this
  return r
}

Woz.prototype.setCheckpoint = function(checkpoint) {
  this.break_manager.setBreakpoint(checkpoint);
}

module.exports = new Woz()
