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
		// FIXME: No such event is defined on LineSocket
		self.fireEvent('disconnect')
		delete self._socket
		self.connect()
	})

	// FIXME: No such event is defined on LineSocket
	self.fireEvent('connect')
}

/**
 * @class Ext.net.LineSocket
 * @extends Ext.util.Observable
 * Implements a client and server for line-based protocols.
 *
 * @constructor
 * @param {Object} config
 */

Ext.net.LineSocket = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg {?} listeners (seems unused)
	 */
	/**
	 * @cfg {Object} server {host, port} pair to listen on, overrides {@link #client}
	 */
	/**
	 * @cfg {Object} client {host, port} pair to connect to
	 */
	constructor: function(config) {
		var self = this
		this.config = config
		this._buffer = ''

		this.onBind = function() {
			return onBind.call(this, self)
		}

		this.connect()

		this.addEvents(
			/**
			 * @event line
			 * Fires on every received line
			 * @param {String} line Received line, without line terminators
			 * @param {Socket} this FIXME: Is this the LineSocket, our net.Socket, or the client net.Socket?
			 */
			'line',
			/**
			 * @event reconnect
			 * FIXME: Is this used?
			 */
			'reconnect',
			/**
			 * @event client
			 * Fires when a client connects to this socket.
			 * @param {Socket} client
			 */
			'client',
			/**
			 * @event end
			 * FIXME: Is this used? Socket events aren't forwarded to this class.
			 */
			'end'
		)

		if (config.listeners) {
			this.listeners = config.listeners
			delete config.listeners
		}

		Ext.net.LineSocket.superclass.constructor.call(this)
	},
	/**
	 * Returns whether the socket is in ready state.
	 * @return {Boolean}
	 */
	ready: function() {
		return 'open' == this._socket.readyState
	},
	/**
	 * Writes data directly into the socket.
	 * @param {String|Buffer} d
	 */
	send: function(d) {
		this._socket.write(d);
	},
	/**
	 * Connects or listens depending on configured parameters
	 * @method
	 */
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
