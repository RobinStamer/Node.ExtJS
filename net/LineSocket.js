var net = require('net'); Ext('Ext.Ext-more', 'Ext.util.Observable').ns('Ext.net')

function onBind(self) {
	function onData(d) {
		self._buffer += d

		var arr = self._buffer.split(/\r?\n/);

		while (1 < arr.length) {
			self.fireEvent('line', arr.shift(), this)
		}
		self._buffer = arr[0]
	}
	this.on('data', onData)

	this.on('connection', function(client) {
		self.fireEvent('client', client)
		client.on('data', onData)
	})

	if (self.config.client) this.on('close', function() {
		self.fireEvent('disconnect')
		delete self._socket
		self.connect()
	})

	self.fireEvent('connect')
}

Ext.net.LineSocket = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
		var self = this
		this.config = config
		this._buffer = ''

		this.onBind = function() {
			return onBind.call(this, self)
		}

		this.connect()

		this.addEvents(
			'line',
			'reconnect',
			'client',
			'end'
		)

		if (config.listeners) {
			this.listeners = config.listeners
			delete config.listeners
		}

		Ext.net.LineSocket.superclass.constructor.call(this)
	},
	ready: function() {
		return 'open' == this._socket.readyState
	},
	send: function(d) {
		this._socket.write(d);
	},
	connect: function() {
		if (this.config.server) {
			this._socket = net.createServer()
			this._socket.listen(this.config.server.port, this.config.server.host, this.onBind)
		} else if (this.config.client) {
			this._socket = new net.Socket
			this._socket.connect(this.config.client.port, this.config.client.host, this.onBind)
		}
	}
})
