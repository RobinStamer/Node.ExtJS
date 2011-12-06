var net = require('net'); Ext({}, 'Ext.util.Observable').ns('Ext.net')

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

		if (config.server) {
			this._socket = net.createServer()
			this._socket.listen(config.server.port, config.server.host, this.onBind)
		} else if (config.client) {
			this._socket = new net.Socket
			this._socket.connect(config.client.port, config.client.host, this.onBind)
		}

		this.addEvents(
			'line',
			'reconnect',
			'client',
			'end'
		)

		Ext.net.LineSocket.superclass.constructor.call(this)
	},
	ready: function() {
		return 'open' == this._socket.readyState
	},
	send: function(d) {
		this._socket.write(d);
	}
})
