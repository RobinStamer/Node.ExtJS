var url = require('url')

Ext.ns('Ext.http')

class One extends require('stream').Transform {
	constructor(s) {
		super()

		var	o	= url.parse(/[^:]+:\/\//.test(s) ? s : `http://${s}`)
			,self	= this
			,x	= {}

		if (!{'http:': true, 'https:': true}[o.protocol]) {
			throw new Error(`Invalid protocol ${o.protocol}`)
		}

		x.host =	o.hostname
		x.path =	o.path

		if (o.port) {
			x.port =	(o.port - 0)
		}

		;({
			'https:': require('https')
			,'http:': require('http')
		}[o.protocol]).request(x, (res) => {
			res.pipe(self)
		}).end()
	}

	_transform(data, enc, done) {
		this.push(data)
		done()
	}

	_flush(done) {
		done()
	}
}

Ext.http.One = One
