const	Ext	= require('Ext')('Ext.class', 'Ext.data.Pipe')

/**
 * @class Ext.data.FullPipe
 * @extends Ext.data.Pipe
 *
 * Stream transform that collects a stream's data into one full chunk.
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype fullPipe
 */

class FullPipe extends Ext.data.Pipe {
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
		super(cfg)

		this._bufferStr = ''

		Ext.data.Pipe.pipe(this)

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
