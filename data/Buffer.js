var Ext = require('Ext')

Ext.ns('Ext.data')

class Buffer {
	constructor(o) {
		if (o) {
			this.apply(o)
		}

		this.encoding = 'utf8'
		this.buffer = ''
	}

	apply(o) {
		const self = this

		o.on('data', function(data) { self.input(data) })
		o.on('end', function() { self.hook(self.buffer) })
	}

	input(data) {
		this.buffer += data.toString(this.encoding)
	}

	hook() {
		return this.buffer
	}
}

Ext.data.Buffer = Buffer
