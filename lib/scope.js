var Ref = require('./ref').Ref

function Scope(obj, refs) {
  var handles = {},
      self = this
  this.properties = {}
  this.type = getType(obj.type)

  if(Array.isArray(refs)) {
    refs.forEach(function(r) {
      handles[r.handle] = new Ref(r)
    })
  }
  obj.object.properties.forEach(function(p) {
    self.properties[p.name] = handles[p.value.ref]
  })
}

exports.Scope = Scope

function getType(x) {
  var t = 'Unknown'
  switch(x) {
    case 0:
      t = 'Global'
      break
    case 1:
      t = 'Local'
      break
    case 2:
      t = 'With'
      break
    case 3:
      t = 'Closure'
      break
    case 4:
      t = 'Catch'
      break
  }
  return t
}

Scope.prototype.pp = function() {
  
}
