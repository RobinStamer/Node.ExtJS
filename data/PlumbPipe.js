const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	,r	= /^(.+)\n(.+)\n(\/.+)\n(.+)\n(.*)\n([0-9]+)\n((.|\n)*)/
	
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

	__pump(m, buff) {
		// We don't have a full message, buffer input and wait for more
		if (!m) {
			return buff
		}

		var	o = {
			src:	m[1]
			,dst:	m[2]
			,pwd:	m[3]
			,type:	m[4]
			,attrstr:	m[5]
			,len:	m[6] - 0
			,data:	m[7]
		}
		// TODO: Parse attrstr

		// We have exactly one message
		if (o.len === o.data.length) {
			buff = ''
			this.push(o)
		}

		// We have one message and more
		if (o.len < o.data.length) {
			buff	= o.data.slice(o.len)
			o.data	= o.data.slice(0, o.len)

			this.push(o)
			return this.__pump(r.exec(buff), buff)
		}

		return buff
	}

	_transform(chunk, encoding, done) {
		var	buff	= this._bufferStr + chunk.toString()
			,m	= r.exec(buff)

		this._bufferStr = this.__pump(m, buff)

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
