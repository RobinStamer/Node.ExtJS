const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	,r	= /^(.+)\n(.+)\n(\/.+)\n(.+)\n(.*)\n([0-9]+)\n((.|\n)*)/
	
Ext('Ext.p9p.PlumbMessage')

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
	 * @cfg {Stream} input Input to attach this stream transform to
	 */
	constructor(cfg) {
		super({readableObjectMode: true})

		this._buffer	= Buffer.from('')
		this.render	= true
		this.next	= new Ext.p9p.PlumbMessage

		if (cfg.input) {
			this.input = Ext.xcreate(cfg.input)
			this.input.pipe(this)
		}
	}

	_transform(chunk, encoding, done) {
		var	buff	= Buffer.concat([this._buffer, chunk])
			,n

		while (n = this.next.read(buff)) {
			buff = buff.slice(n)
			this.push(this.next)

			this.next = new Ext.p9p.PlumbMessage
		}

		this._buffer = buff

		done()
	}

	_flush(done) {
		done()
	}
}

Ext.data.PlumbPipe = PlumbPipe

Ext.reg('plumbPipe', Ext.data.PlumbPipe)
