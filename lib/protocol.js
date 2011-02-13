var inherits = require('util').inherits,
		events = require('events'),
		Buffer = require('buffer').Buffer;

function Protocol() {
	this.msg = '';
	this.state = 'head';
	this.seq = 1;
	this.headers = {};
	this.contentLength = 0;
}
inherits(Protocol, events.EventEmitter);
exports.Protocol = Protocol;

Protocol.prototype.append = function(data) {
	var	buffer, body, headEnd, lines, body, obj, kv, i;
	this.msg += (data || '');
	
	if (this.state === 'head') {
		headEnd = this.msg.indexOf('\r\n\r\n');
		if (headEnd < 0) return;

		lines = this.msg.slice(0, headEnd).split('\r\n');
		for (i = 0; i < lines.length; i++) {
			kv = lines[i].split(/: +/);
			this.headers[kv[0]] = kv[1];
		}

		this.contentLength = +this.headers['Content-Length'];
		this.bodyStart = headEnd + 4;
		this.state = 'body';
	}

	if (Buffer.byteLength(this.msg) - this.bodyStart < this.contentLength)
		return;

	if (this.state === 'body') {
		buffer = new Buffer(this.msg.slice(this.bodyStart));
		body = buffer.slice(0, this.contentLength);

		obj = this.contentLength ? JSON.parse(body.toString('utf8')) : {};
		this.emit('message', { headers: this.headers, body: obj });

		this.headers = {};
		this.state = 'head';
		this.msg = '';
		this.append(buffer.slice(this.contentLength).toString('utf8'));
	}
}

Protocol.prototype.serialize = function(msg) {
	msg.seq = this.seq++;
	msg.type = 'request';
	var serial = JSON.stringify(msg);
	return 'Content-Length: ' + Buffer.byteLength(serial) + '\r\n\r\n' + serial;
}
