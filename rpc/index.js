var Ext	= require('Ext')('Ext.data.Buffer')
	,http	= require('http')

class RPC {
	constructor(opt) {
		this.defaults = 'object' == typeof opt ? opt : {}

		this.defaults.method = this.defaults.method || 'POST'
		this.defaults.encoding = this.defaults.encoding || 'utf8'
		this.defaults.hostname = this.defaults.hostname || 'rpg.nobl.ca'
		this.defaults.path = this.defaults.path || '/var/rpc.php'
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

		p = Buffer.from(JSON.stringify(p))

		return new Promise(function(pass, fail) {
			const req = http.request({
				hostname:	self.defaults.hostname
				,path:	self.defaults.path
				,method: self.defaults.method
			}, (r) => {
				const b = new Ext.data.Buffer(r)
				r.setEncoding('utf8') // FIXME
				b.hook = (data) => {
					try {
						const d = JSON.parse(data)
						if (d.result) {
							pass(d.result)
						} else {
							fail(d)
						}
					} catch (e) {
						fail({badparse: data})
					}
				}
			})

			req.on('error', fail)

			req.write(p)
			req.end()
		})
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
