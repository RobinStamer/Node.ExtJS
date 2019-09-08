const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

class ArchFile extends stream.Writable {
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

	getData() {
		return this.data
	}

	_write(chunk, encoding, done) {
		this._process(chunk.toString().substr(0, chunk.length - 1))
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

		this.emit('set', this.curKey, this.cur)
	}

	_process(line) {
		if (null === line) {
			// Store the data we collected
			this._completeSet()

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

Ext.reg('archFile', ArchFile)

Ext.data.ArchFile = ArchFile
