const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

const HEADER	= 0
	,DATA	= 1

// FIXME: Figure out what this does and provide more than rudimentary documentation

/**
 * @class Ext.data.MultiFile
 * @extends stream.Writable
 *
 * @constructor
 * @param {Object|String} cfg Configuration or filename
 *
 * @xtype multiFile
 */

class MultiFile extends stream.Writable {
	/**
	 * @cfg {String} name Filename to load
	 */

	/**
	 * @cfg {LinePipe} input Input to use
	 */
	constructor(cfg) {
		super()

		this.data	= {}
		this.meta	= {}
		this.state	= HEADER
		this.keyN	= 0
		this.cur	= []

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

	newKey() {
		return 'Key-' + this.keyN++
	}

	getData() {
		return this.data
	}

	_write(chunk, encoding, done) {
		this._process(chunk.toString())
		done()
	}

	_final(done) {
		this._process(null)
		done()
	}

	_completeSet() {
		const	key = this.meta.key || this.meta.title || this.meta.name || this.newKey()
			,last	= this.cur.pop()

		if ('' != last) {
			this.cur.push(last)
		}

		this.data[key] = {
			meta:	this.meta
			,data:	this.cur
		}

		if ('undefined' == typeof this.cur[this.cur.length - 1]) {
			this.cur.pop()
		}

		this.emit('set', key, this.meta, this.cur)
	}

	_process(line) {
		if (null === line) {
			// Store the data we collected
			this._completeSet()

			return
		}

		switch (this.state) {
			case HEADER:
				if ('@' == line[0]) {
					// We have a new header entry
					const	parts = line.split(' ')
						,key	= parts[0].substr(1)
						,value	= parts.slice(1).join('_')
					this.meta[key] = value
					return
				}

				if ('' == line.trim()) {
					// Blank line, continue and do nothing
					return
				}

				// We have a non-header line
				this.state = DATA
				this.cur = [line]
				break
			case DATA:
				if ('@' == line[0]) {
					// We have a new header entry
					const	parts = line.split(' ')
						,key	= parts[0].substr(1)
						,value	= parts.slice(1).join(' ')

					// Store the data we collected
					this._completeSet()

					this.state = HEADER
					
					// Reset meta and start a new one
					this.meta = {}
					this.meta[key] = value
					this.cur = []
					return
				}

				this.cur.push(line)
				break
		}
	}
}

Ext.data.MultiFile = MultiFile

Ext.reg('multiFile', Ext.data.MultiFile)
