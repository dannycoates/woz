var assert = require('assert'),
    Client = require('../lib/client').Client;

var createClient = function() {
  var client = new Client();
  client.connect(5858);
  return client;
}

exports['client emits "ready" when a message with "connect" type is received'] =
  function() {
    var client = new Client();
    var tid = setTimeout(function() {
      assert.ok(false, "didn't receive 'ready'");
    }, 100);
    client.on('ready', function() {
      clearTimeout(tid);
    });
    client.handleMessage({
      headers: { Type: 'connect' },
      body: {}
    });
  }

/* Version response body
 * body: { "V8Version" : "" }
 */
exports['client can get version info from host'] = function() {
  var client = new Client();
  client.write = function() {};
  var tid = setTimeout(function() {
      assert.ok(false, "didn't get version");
    }, 100);

  client.version(function(e, v) {
    clearTimeout(tid);
    assert.equal(e, undefined);
    assert.ok(/\d+\.\d+\.\d+/.test(v));
  });
  client.handleMessage({
    headers: {},
    body: { 
      type: 'response',
      request_seq: 1,
      success: true,
      running: true,
      body: { V8Version: '3.2.1'}}
  });
}

/* Scripts response body
 * body:
 *
 * [ { "name" :
 *      "id" :
 *      "lineOffset" :
 *      "columnOffset" :
 *      "lineCount" :
 *      "data" :
 *      "source" :
 *      "sourceStart" :
 *      "sourceLength" :
 *      "scriptType" :
 *      "compilationType" :
 *      "evalFromScript" :
 *      "evalFromLocation" :
 *      }]
 */
exports['client can get the list of scripts from the host'] = function() {
  var client = new Client();
  client.write = function() {};
  var tid = setTimeout(function() {
      assert.ok(false, "didn't get scripts");
    }, 100);
  var script = { id: 1, handle: 2, type: 'script', name: 'test.js' };

  client.getScripts(function(e, scripts) {
    clearTimeout(tid);
    assert.equal(e, undefined);
    assert.strictEqual(scripts[0], script);
  });
  client.handleMessage({
    headers: {},
    body: {
      type: 'response',
      request_seq: 1,
      success: true,
      running: true,
      body: [ script ]
    }
  });
}

exports['client can set and clear breakpoints'] = function() {

}
