const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

/**
 * @class Ext.data.LinePipe
 * @extends stream.Transform
 *
 * Stream transform that processes data line by line.
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype linePipe
 */

class LinePipe extends stream.Transform {
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
		super({readableObjectMode: !cfg.buffers})

		this._bufferStr = ''
		this.render	= true
		this.addBreaks	= !!cfg.addBreaks

		if (cfg.input) {
			this.input = Ext.xcreate(cfg.input)
			this.input.pipe(this)
		}

		if (cfg._transform) {
			this._mutate = cfg._transform
		}
	}

	_mutate(line) {
		return line + (this.addBreaks ? '\n' : '')
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
			this.push(this._mutate(this._bufferStr))
		}
		this._bufferStr = ''
		done()
	}
}

LinePipe.quick = function(sock, cb) {
	if ('function' == typeof sock) {
		return function(c) {
			sock(LinePipe.quick(c, cb), c)
		}
	}

	var o = new LinePipe({
		input: sock
	})

	if ('function' == typeof cb) {
		o.on('data', cb)
	}

	return o
}

LinePipe.quickServer = function(net, ...args) {
	return net.createServer(LinePipe.quick(...args))
}

Ext.data.LinePipe = LinePipe

Ext.reg('linePipe', Ext.data.LinePipe)
