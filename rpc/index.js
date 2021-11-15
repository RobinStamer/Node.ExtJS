var Ext	= require('Ext')('Ext.data.Buffer')
	,http	= require('http')
	,net	= require('net')
	,util	= require('util')
	,child_process	= require('child_process')

/**
 * @class Ext.rpc.transports
 * @singleton
 */
const transports = {
	/**
	 * RPC transport over HTTP.
	 * Requires a hostname, path, and method.
	 * @method
	 * @param {Object} config
	 * @param {String} data
	 * @return {Promise[String]}
	 */
	sendHttp(config, data) {
		return new Promise((resolve, reject) => {
			const req = http.request({hostname: config.hostname, path: config.path, method: config.method, port: config.port || 80})
			req.on('error', reject)
			req.on('response', r => {
				const b = new Ext.data.Buffer(r)
				r.setEncoding('utf8') // FIXME
				r.on('error', reject)
				b.hook = resolve
			})
			req.write(Buffer.from(data))
			req.end()
		})
	},

	/**
	 * RPC transport over unix sockets.
	 * Requires a socket filepath.
	 * @method
	 * @param {Object} config
	 * @param {String} data
	 * @return {Promise[String]}
	 */
	sendUnix(config, data) {
		return new Promise((resolve, reject) => {
			const conn = net.createConnection(config.path)
			conn.on('connect', () => { conn.write(data); conn.end() })
			conn.on('error', reject)
			const b = new Ext.data.Buffer(conn)
			b.hook = resolve
		})
	},

	/**
	 * RPC transport over pipe.
	 * Requires a command to execute.
	 * @method sendSubprocess
	 * @param {Object} config
	 * @param {String} data
	 * @return {Promise[String]}
	 */
	async sendSubprocess(config, data) {
		const promise = util.promisify(child_process.exec)(config.command)
		promise.child.stdin.write(data)
		promise.child.stdin.end()
		const {stdout, stderr} = await promise
		return stdout
	},
}

/**
 * @class Ext.rpc.Client
 * Simple RPC client implementation with pluggable transports
 *
 * @constructor
 * @param {Object} opts Connection options
 */
class RPC {
	/**
	 * @cfg {String} method HTTP method to use, if relevant (default: POST)
	 */
	/**
	 * @cfg {String} encoding Text encoding to use (default: utf8)
	 */
	/**
	 * @cfg {String} hostname Host to connect to (default: rpg.nobl.ca)
	 */
	/**
	 * @cfg {String} path Path to connect to (default: /var/rpc.php)
	 */
	/**
	 * @cfg {String} command Command to execute, if relevant (default: ssh hub0 ext /home/share/start_or_connect.js)
	 */
	/**
	 * @cfg {Function} transport RPC transport to use (default: {@link Ext.rpc.transports#sendHttp})
	 */
	constructor(opt) {
		this.defaults = 'object' == typeof opt ? opt : {}

		this.defaults.method = this.defaults.method || 'POST'
		this.defaults.encoding = this.defaults.encoding || 'utf8'
		this.defaults.hostname = this.defaults.hostname || 'rpg.nobl.ca'
		this.defaults.path = this.defaults.path || '/var/rpc.php'
		this.defaults.command = this.defaults.command || 'ssh hub0 ext /home/share/start_or_connect.js'
		this.defaults.transport = this.defaults.transport || transports.sendHttp
	}

	/**
	 * Sets connection options for this client.
	 * @param {String|Object} opts Config object or URL string
	 */
	opts(opts) {
		Ext.apply(this.defaults, 'string' == typeof opts ? new URL(opts) : opts)
	}

	/**
	 * Performs an RPC call.
	 * @param {Object?} opts Configuration options to use, optional
	 * @param {String} method RPC method to call
	 * @param {Object|Array?} params RPC method parameters
	 * @return {Promise[Object]} Asynchronous return value or error
	 */
	call(...args) {
		const	opts = 'object' == typeof args[0] ? args.shift() : {}
			,method = args.shift()
			,params = args.shift() || []
			,self = this
		var p = {}

		if ('string' != typeof method) {
			throw new Error(`Invalid type of method, got: ${typeof method}`)
		}

		p.jsonrpc = '2.0'
		p.id = 1
		p.method = method
		p.params = params

		p = JSON.stringify(p)

		return self.defaults.transport(self.defaults, p).then(o=>{
			return JSON.parse(o)
		})
	}

	/**
	 * Returns a pre-sugared {@link #call} function that calls the given method.
	 * @param {String} method
	 * @return {Function}
	 */
	handle(method) {
		var self = this

		return function(params) {
			return self.call(method, params)
		}
	}
}

/**
 * @class Ext.rpc
 * @extends Ext.rpc.Client
 * Singleton instance of {@link Ext.rpc.Client}.
 *
 * @singleton
 *
 * @constructor
 * Performs an RPC call, see {@link Ext.rpc.Client#call}.
 */
const rpc = new RPC

Ext.rpc = function(...args) {
	return rpc.call.apply(rpc, args)
}

/**
 * Returns a pre-sugared function that calls the given method. See {@link Ext.rpc.Client#handle}.
 */
Ext.rpc.handle = function(method) {
	return rpc.handle(method)
}

Ext.rpc.Client = RPC

Ext.rpc.transports = transports
