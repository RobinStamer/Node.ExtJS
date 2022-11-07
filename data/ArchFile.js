const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

/**
 * @class Ext.data.ArchFile
 * @extends stream.Writable
 *
 * Stream which loads an Arch package data file.
 *
 * @constructor
 * @param {Object|String} cfg Configuration or filename
 *
 * @xtype archFile
 */
class ArchFile extends stream.Writable {
	/**
	 * @cfg {String} name Filename to load
	 */

	/**
	 * @cfg {LinePipe} input Input to use
	 */
	constructor(cfg) {
		super()

		this.data	= {}
		this.cur	= []
		this.curKey	= null

		if ('string' == typeof cfg) {
			cfg = {name: cfg}
		}

		if (cfg.input) {
			this.input = Ext.create(cfg.input)
		} else if (cfg.name) {
			this.input = Ext.xcreate({
				xtype:	'linePipe'
				,input:	{
					xtype:	'file'
					,name:	cfg.name
				}
			})
		}
		
		if (this.input) {
			this.input.pipe(this)
		}

		this.render	= true
	}

	/**
	 * Returns the parsed data map.
	 * @method
	 */
	getData() {
		return this.data
	}

	_write(chunk, encoding, done) {
		//this._process(chunk.toString().substr(0, chunk.length - 1))
		this._process(chunk.toString())
		done()
	}

	_final(done) {
		this._process(null)
		done()
	}

	_completeSet() {
		const	last	= this.cur.pop()

		if ('' != last) {
			this.cur.push(last)
		}

		if (null !== this.curKey) {
			this.emit('set', this.curKey, this.cur)
		}
	}

	_process(line) {
		if (null === line) {
			// Store the data we collected
			this._completeSet()

			this.emit('done')

			return
		}

		if ('%' == line[0]) {
			// We have a new header entry
			const	parts = line.split('%')
			this.curKey	= parts[1]
			this.cur = []
			this.data[parts[1]] = this.cur
			return
		}

		if ('' == line.trim()) {
			// Blank line, end of data set
			this._completeSet()
			this.curKey = null
			return
		}

		if (null !== this.curKey) {
			this.cur.push(line)
		}
	}
}

Ext.data.ArchFile = ArchFile

Ext.reg('archFile', Ext.data.ArchFile)
