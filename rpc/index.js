var Ext = require('Ext')('Ext.data.Buffer')

class RPC {
	constructor(opt) {
		this.defaults = 'object' == typeof opt ? opt : {}

		this.defaults.method = this.defaults.method || 'POST'
		this.defaults.encoding = this.defaults.encoding || 'utf8'
	}

	opts(opts) {
		Ext.apply(this.defaults, 'string' == typeof opts ? new URL(opts) : opts)
	}

	call() {
		const args = Array.from(arguments)
			,opts = 'object' == typeof args[0] ? args.shift() : {}
			,method = args.shift()
			,params = args.shift()
			,self = this
		var p = {}

		if ('string' != typeof method) {
			throw new Error(`Invalid type of method, got: ${typeof method}`)
		}

		p.jsonrpc = '2.0'
		p.id = 1
		p.method = method
		p.params = params

		p = Buffer.from(JSON.stringify(p))

		return new Promise(function(pass, fail) {
			const req = http.request({hostname: 'rpg.nobl.ca', path: '/var/rpc.php', method: 'POST'}, (r) => {
				const b = new Ext.data.Buffer(r)
				r.setEncoding('utf8') // FIXME
				b.hook = (data) => { pass(JSON.parse(data)) }
			})

			req.on('error', fail)

			req.write(p)
			req.end()
		})
	}
}

const rpc = new RPC

Ext.rpc = function() {
	return rpc.call.apply(rpc, Array.from(arguments))
}

Ext.rpc.Client = RPC
