var net = require('net'),
		Protocol = require('./protocol').Protocol,
		inherits = require('util').inherits;

function Client() {
	net.Stream.call(this);
	var protocol = this.protocol = new Protocol();
	this.callbacks = [];
	var socket = this;

	this.handles = {};
	this.scripts = {};
	this.running = false;

	socket.setEncoding('utf8');
	socket.on('data', function(data) {
		protocol.append(data);
	});

	protocol.on('message', this.handleMessage.bind(this));
}

inherits(Client, net.Stream);
exports.Client = Client;

Client.prototype.handleMessage = function(msg) {
	var obj = msg.body || {};
	if (msg.headers.Type === 'connect') {
		this.emit('ready');
	}
	else if (obj.type === 'response') {
		this.running = obj.running;
		for (var i = 0; i < this.callbacks.length; i++) {
			if (this.callbacks[i].request_seq === obj.request_seq) {
				var cb = this.callbacks[i];
				break;
			}
		}

		if (cb) {
			this.callbacks.splice(i, 1);
			cb(obj);
		}
	}
	else if (obj.type === 'event') {
		this.emit(obj.event, obj);
	}
}

Client.prototype._addHandle = function(desc) {
  if (typeof desc != 'object' || typeof desc.handle != 'number') {
    return;
  }

  this.handles[desc.handle] = desc;

  if (desc.type == 'script') {
    this._addScript(desc);
  }
};

Client.prototype._addScript = function(desc) {
  this.scripts[desc.id] = desc;
};

Client.prototype.request = function(req, cb) {
	this.write(this.protocol.serialize(req));
	cb.request_seq = req.seq;
	this.callbacks.push(cb);
}

Client.prototype.version = function(callback) {
	var req = { command: 'version' };
	this.request(req, function(res) {
		if (res.success) {
			callback(res.body.V8Version);
		}
	});
}

Client.prototype.getScripts = function(callback) {
	var self = this;
	this.request({ command: 'scripts' }, function(res) {
		for (var i = 0; i < res.body.length; i++) {
			self._addHandle(res.body[i]);
		}
		if (callback) callback();
	});
}

