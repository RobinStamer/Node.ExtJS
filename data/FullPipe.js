const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

class FullPipe extends stream.Transform {
	constructor(cfg) {
		super({readableObjectMode: !cfg.buffers})

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

	_transform(chunk, encoding, done) {
		this._bufferStr += chunk.toString()
		done()
	}

	_flush(done) {
		this.push(this._bufferStr)
		this._bufferStr = ''
		done()
	}
}

Ext.reg('fullPipe', FullPipe)

Ext.data.FullPipe = FullPipe
