function Backtrace(obj) {
  var keys = Object.keys(obj)
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i]
    this[key] = obj[key]
  }
}

exports.Backtrace = Backtrace

Backtrace.prototype.pp = function() {

}
