module.exports = asyncMap

function asyncMap(list, fn, callback) {
  var n = list.length,
      results = {}
      errState = null;

  function wrap(x) {
    return function(err, data) {
      if (errState) return
      if (err) return callback(errState = err, results)
      results[x] = data
      if (--n === 0) return callback(null, results)
    }
  }

  if (list.length === 0) return callback(null, {})
  list.forEach(function(x) {
    fn(x, wrap(x))
  })
}

