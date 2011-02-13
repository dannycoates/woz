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


exports['client can get version info from host'] = function() {
	var client = new Client();
	client.write = function() {};
	var tid = setTimeout(function() {
			assert.ok(false, "didn't get version");
		}, 100);

	client.version(function(v) {
		clearTimeout(tid);
		assert.ok(/\d+\.\d+\.\d+/.test(v));
		assert.strictEqual(client.callbacks.length, 0);
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

exports['client can get the list of scripts from the host'] = function() {
	var client = new Client();
	client.write = function() {};
	var tid = setTimeout(function() {
			assert.ok(false, "didn't get scripts");
		}, 100);
	var script = { id: 1, handle: 2, type: 'script', name: 'test.js' };

	client.getScripts(function() {
		clearTimeout(tid);
		assert.strictEqual(client.handles[2], script);
		assert.strictEqual(client.scripts[1], script);
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
