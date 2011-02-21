var inherits = require('util').inherits,
    events = require('events'),
    Script = require('./script').Script;

function ScriptManager(client) {
  this.client = client;
  this.scripts = [];
}

inherits(ScriptManager, events.EventEmitter);
exports.ScriptManager = ScriptManager;

ScriptManager.prototype.getScripts = function() {
  var self = this;
  this.client.getScripts(function(scripts) {
    scripts.forEach(function(script) {
      self.scripts.push(new Script(script, self));
    });
    self.ready = true;
    self.emit('ready');
  });
}

ScriptManager.prototype.get = function(name) {
  var match = (name.constructor == RegExp) ?
                name :
                new RegExp(name);
  var script = null;
  for(var i = this.scripts.length - 1; i >= 0; i--) {
    console.log(this.scripts[i].name);
    if (match.test(this.scripts[i].name)) {
      script = this.scripts[i];
      break;
    }
  }
  return script;
}

ScriptManager.prototype.setCheckpoint = function(name, scriptId, line) {

}
