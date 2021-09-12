var Ext	= require('Ext')('Ext.data.Buffer')
	,http	= require('http')
	,net	= require('net')
	,util	= require('util')
	,child_process	= require('child_process')

const transports = {
	sendHttp(config, data) {
		return new Promise((resolve, reject) => {
			const req = http.request({hostname: config.hostname, path: config.path, method: config.method})
			req.on('error', reject)
			req.on('result', r => {
				const b = new Ext.data.Buffer(r)
				r.setEncoding('utf8') // FIXME
				r.on('error', reject)
				b.hook = resolve
			})
			req.write(Buffer.from(data))
			req.end()
		})
	},

	sendUnix(config, data) {
		return new Promise((resolve, reject) => {
			const conn = net.createConnection(config.path)
			conn.on('connect', () => { conn.write(data); conn.end() })
			conn.on('error', reject)
			const b = new Ext.data.Buffer(conn)
			b.hook = resolve
		})
	},

	async sendSubprocess(config, data) {
		const promise = util.promisify(child_process.exec)(config.command)
		promise.child.stdin.write(data)
		promise.child.stdin.end()
		const {stdout, stderr} = await promise
		return stdout
	},
}


class RPC {
	constructor(opt) {
		this.defaults = 'object' == typeof opt ? opt : {}

		this.defaults.method = this.defaults.method || 'POST'
		this.defaults.encoding = this.defaults.encoding || 'utf8'
		this.defaults.hostname = this.defaults.hostname || 'rpg.nobl.ca'
		this.defaults.path = this.defaults.path || '/var/rpc.php'
		this.defaults.command = this.defaults.command || 'ssh hub0 ext /home/share/start_or_connect.js'
		this.defaults.transport = this.defaults.transport || transports.sendHttp
	}

	opts(opts) {
		Ext.apply(this.defaults, 'string' == typeof opts ? new URL(opts) : opts)
	}

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

		return (async function() {
			const d = JSON.parse(await self.defaults.transport(self.defaults, p))
			if (d.result) {
				return d.result
			} else {
				throw d
			}
		}())
	}

	handle(method) {
		var self = this

		return function(params) {
			return self.call(method, params)
		}
	}
}

const rpc = new RPC

Ext.rpc = function(...args) {
	return rpc.call.apply(rpc, args)
}

Ext.rpc.handle = function(method) {
	return rpc.handle(method)
}

Ext.rpc.Client = RPC

Ext.rpc.transports = transports
