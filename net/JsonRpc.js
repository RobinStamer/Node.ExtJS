Ext('Ext.net.LineSocket')

function setupServer(server) {
	var self = this, ret;

	ret = new Ext.net.LineSocket({
		server: server
	})

	ret.on('line', function(line, client) {
		this.line(line, client.write.bind(client))
	}.bind(self))

	return ret
}

Ext.net.JsonRpc = function(config) {
	var self = this

	Ext.apply(this, config)

	if (Array.isArray(this.servers)) {
		for (var i = 0; i < this.servers.length; ++i) {
			this.servers[i] = setupServer.call(this, this.servers[i])
		}
	} else if (this.servers) {
		this.servers = setupServer.call(this, this.servers)
	}

	this.Handle = function(json, callback) {
		this.parent = self

		this.success = function(response) {
			callback(JSON.stringify({
				id: json.id,
				result: response,
				jsonrpc: '2.0'
			}))
		}

		this.error = function(error, code) {
			callback(JSON.stringify({
				id: (null === json) ? null : (json.hasOwnProperty('id') ? json.id : null),
				error: {code: code || 0, message: error},
				jsonrpc: '2.0'
			}))
		}
	}
}

function noSuchMethod(params, handle) {
	handle.error('No Such Method', -32601)
}

Ext.net.JsonRpc.prototype = {
	call: function(method, params, handle) {
		try {
			var func = this.methods[method] || this.default || noSuchMethod
			func(params, handle)
		} catch (e) {
			console.log(e.message)
			console.log(e.stack)
			handle.error('internal service error')
		}
	},
	line: function(line, callback) {
		try {
			var json = JSON.parse(line)
		} catch (e) {
			// DEBUG
			console.log(e)
			console.log(e.stack)
			return
		}

		console.dir(json)
		this.call(json.method, json.params, new this.Handle(json, callback))
	}
}
