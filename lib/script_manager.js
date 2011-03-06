var inherits = require('util').inherits,
    events = require('events'),
    Script = require('./script').Script;

function ScriptManager(client, parent) {
  var self = this
  this.client = client
  this.scripts = []
  this.parent = parent
  this.getScripts()
  this.once('scripts', function() {
    self.emit('ready')
  })
}

inherits(ScriptManager, events.EventEmitter)
exports.ScriptManager = ScriptManager

ScriptManager.prototype.getScripts = function() {
  var self = this
  this.client.getScripts(function(err, scripts) {
    scripts.forEach(function(script) {
      self.scripts.push(new Script(script, self))
    })
    self.emit('scripts')
  })
}

ScriptManager.prototype.get = function(name) {
  var match = (name.constructor == RegExp) ?
                name :
                new RegExp(name)
  var script = null
  for(var i = this.scripts.length - 1; i >= 0; i--) {
    if (match.test(this.scripts[i].name)) {
      script = this.scripts[i]
      break
    }
  }
  return script
}

ScriptManager.prototype.setCheckpoint = function(options) {
  this.parent.setCheckpoint(options)
}
