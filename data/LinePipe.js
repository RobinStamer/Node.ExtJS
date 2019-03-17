const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

class LinePipe extends stream.Transform {
	constructor(cfg) {
		super()

		this._bufferStr = ''

		if (cfg.input) {
			this.input = Ext.create(cfg.input)
			this.input.pipe(this)
		}
	}

	_transform(chunk, encoding, done) {
		var	buff = this._bufferStr + chunk.toString()
			,lines = buff.split('\n')

		while (lines.length > 1) {
			this.push(lines.shift() + '\n')
		}

		this._bufferStr = lines[0]
		done()
	}

	_flush(done) {
		if (this._bufferStr) { // avoid adding newlines to the file
			this.push(this._bufferStr + '\n')
		}
		this._bufferStr = ''
		done()
	}
}

Ext.reg('linePipe', LinePipe)

Ext.data.LinePipe = LinePipe
