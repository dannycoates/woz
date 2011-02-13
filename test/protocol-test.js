var assert = require('assert'),
		Buffer = require('buffer').Buffer,
		Protocol = require('../lib/protocol').Protocol;

var message = '{"seq":1,"type":"response","request_seq":1,"command":"v8flags","running":true,"success":true}';
var request = '{"seq":1,"type":"request","command":"v8flags","arguments":{"flags":"--t®ace_gc"}}';
var header = 'Content-Length: 93\r\n\r\n';
var packet = header + message;


exports['appending a message in many chunks emits the message once'] = function() {
	var protocol = new Protocol();

	protocol.on('message', function(msg) {
		assert.strictEqual(JSON.stringify(msg.body), message);
	});
	protocol.append(packet.slice(0,5));
	protocol.append(packet.slice(5, 34));
	protocol.append(packet.slice(34, 45));
	protocol.append(packet.slice(45, 56));
	protocol.append(packet.slice(56) + 'foo');

}

exports['protocol can parse multibyte utf8 characters'] = function() {
	var protocol = new Protocol();
	var utf = '{"®12":true}';
	protocol.on('message', function(msg) {
		assert.strictEqual(JSON.stringify(msg.body), utf);
	});
	protocol.append('Content-Length: 13\r\n\r\n');
	protocol.append(utf + 'XXX');
}

exports['appending two messages at once will emit two messages'] = function() {
	var protocol = new Protocol(),
			count = 0;

	protocol.on('message', function(msg) {
		assert.strictEqual(JSON.stringify(msg.body), message);
		count++;
	});
	setTimeout(function() {
		assert.strictEqual(count, 2);
	}, 100);

	protocol.append(packet + packet);
}

exports['the Content-Length of a serialized message is correct'] = function() {
	var protocol = new Protocol();

	var json = JSON.parse(request);
	var serial = protocol.serialize(json);
	var byteLength = +(/Content-Length: (\d+)/.exec(serial)[1]);
	assert.strictEqual(byteLength, Buffer.byteLength(request));
}

exports['the seq of serialized messages increments by 1'] = function() {
	var protocol = new Protocol();

	var json = JSON.parse(request);
	var serial1 = protocol.serialize(json);
	var serial2 = protocol.serialize(json);

	var seq1 = +(/seq..(\d+)/.exec(serial1)[1]);
	var seq2 = +(/seq..(\d+)/.exec(serial2)[1]);

	assert.strictEqual(seq1, seq2 - 1);
}
