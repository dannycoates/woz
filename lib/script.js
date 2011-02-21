function Script(obj, manager) {
  this.manager = manager;
  var keys = Object.keys(obj);
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    this[key] = obj[key];
  }
}

exports.Script = Script;

Script.prototype.setCheckpoint = function(name, line) {
  this.manager.setCheckpoint(name, this.id, line);
}
