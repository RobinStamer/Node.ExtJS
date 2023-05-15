const	Ext	= require('Ext')('Ext.class', 'Ext.data.LinePipe', 'Ext-more')

/**
 * @class Ext.data.TablePipe
 * @extends Ext.data.Pipe
 *
 * Stream transform that collects a stream of CSV or "tabular" data
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype tablePipe
 */

class TablePipe extends Ext.data.Pipe {
	/**
	 * @cfg {Boolean} nullObject Create null objects instead of regular objects (default: false)
	 */

	/**
	 * @cfg {String|Regex} delim Delimeter to use.  Eg: `':'` or `/\s+/`
	 */

	/**
	 * @cfg {Array} headers Headers to apply
	 */

	/**
	 * @cfg {Boolean} noHeaders Do not apply headers, emit arrays instead of objects
	 */

	/**
	 * @cfg {Integer} deadlines Number of lines to ignore at the start
	 */
	constructor(cfg) {
		super(cfg)

		this.nullObject = !!cfg.nullObject
		this.delim	= cfg.delim ?? /\s{2,}/
		this.headers	= cfg.headers ?? null
		this.noHeaders	= cfg.noHeaders ?? false
		this.deadlines	= cfg.deadlines ?? 0

		Ext.data.Pipe.pipe(this, Ext.data.LinePipe)

		this.input.encoding	= 'utf8'
	}

	_transform(chunk, encoding, done) {
		if (this.deadlines) {
			this.deadlines--
			done()
			return
		}

		console.log(chunk)
		let set = chunk.toString().split(this.delim)

		if (this.noHeaders) {
			this.push(set)
			done()
			return
		}

		if (null === this.headers) {
			this.headers = set
			done()
			return
		}

		this.push(Ext.group(this.headers, set, this.nullObject))
		done()
	}

	_flush(done) {
		done()
	}
}

Ext.data.TablePipe = TablePipe

Ext.reg('tablePipe', Ext.data.TablePipe)
