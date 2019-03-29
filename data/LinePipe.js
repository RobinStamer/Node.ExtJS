const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

class LinePipe extends stream.Transform {
	constructor(cfg) {
		super({readableObjectMode: !!cfg._transform})

		this._bufferStr = ''
		this.render	= true

		if (cfg.input) {
			this.input = Ext.xcreate(cfg.input)
			this.input.pipe(this)
		}

		if (cfg._transform) {
			this._mutate = cfg._transform
		}
	}

	_mutate(line) {
		return line + '\n'
	}

	_transform(chunk, encoding, done) {
		var	buff = this._bufferStr + chunk.toString()
			,lines = buff.split('\n')

		while (lines.length > 1) {
			this.push(this._mutate(lines.shift()))
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
