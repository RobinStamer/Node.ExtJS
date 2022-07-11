const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

/**
 * @class Ext.data.FullPipe
 * @extends stream.Transform
 *
 * Stream transform that collects a stream's data into one full chunk.
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype fullPipe
 */

class FullPipe extends stream.Transform {
	/**
	 * @cfg {Boolean} buffers Whether to accept buffers in stream
	 */

	/**
	 * @cfg {Stream} input Input to attach this stream transform to
	 */

	/**
	 * @cfg {Function} _transform Transforms the stream's data
	 */
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

Ext.data.FullPipe = FullPipe

Ext.reg('fullPipe', Ext.data.FullPipe)
