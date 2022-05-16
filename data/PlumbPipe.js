const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	,r	= /^(.+)\n(.+)\n(\/.+)\n(.+)\n(.*)\n([0-9]+)\n(.*)/
	
Ext.ns('Ext.data')

/**
 * @class Ext.data.PlumbPipe
 * @extends stream.Transform
 *
 * Stream transform that processes data from a plumb port.
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype plumbPipe
 */

class PlumbPipe extends stream.Transform {
	/**
	 * @cfg {Boolean} buffers Whether to accept buffers in stream
	 */

	/**
	 * @cfg {Boolean} addBreaks Whether to add newlines to the end of each line
	 */

	/**
	 * @cfg {Stream} input Input to attach this stream transform to
	 */

	/**
	 * @cfg {Function} _transform Transforms the stream's data, conflicts with addBreaks
	 */
	constructor(cfg) {
		super({readableObjectMode: true})

		this._bufferStr = ''
		this.render	= true

		if (cfg.input) {
			this.input = Ext.xcreate(cfg.input)
			this.input.pipe(this)
		}
	}

	_transform(chunk, encoding, done) {
		var	buff	= this._bufferStr + chunk.toString()
			,m	= r.exec(buff)

		// We don't have a full message, buffer input and wait for more
		if (!m) {
			this._bufferStr = buff
			done()
			return
		}

		// We have exactly one message
		if (m[7].length === (m[6] - 0)) {
			buff = ''

			// TODO: parse attrstr
			this.push({
				src:	m[1]
				,dst:	m[2]
				,pwd:	m[3]
				,type:	m[4]
				,attrstr:	m[5]
				,len:	m[6] - 0
				,data:	m[7]
			})
		}
		// TODO: having more than one message

		this._bufferStr = buff
		done()
	}

	_flush(done) {
		if (this._bufferStr) { // avoid adding newlines to the file
			//this.push(this._mutate(this._bufferStr))
		}
		this._bufferStr = ''
		done()
	}
}

Ext.reg('plumbPipe', PlumbPipe)

Ext.data.PlumbPipe = PlumbPipe
