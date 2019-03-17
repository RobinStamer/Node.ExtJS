const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')
	
Ext.ns('Ext.data')

const HEADER	= 0
	,DATA	= 1

class MultiFile extends stream.Writable {
	constructor(cfg) {
		super()

		this.data	= {}
		this.meta	= {}
		this.state	= HEADER
		this.keyN	= 0
		this.cur	= []

		if (cfg.input) {
			this.input = Ext.create(cfg.input)
			this.input.pipe(this)
		}
	}

	newKey() {
		return 'Key-' + keyN++
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
		const	key = this.meta.title || this.newKey()
			,last	= this.cur.pop()

		if ('' != last) {
			this.cur.push(last)
		}

		this.data[key] = {
			meta:	this.meta
			,data:	this.cur
		}

		this.emit('set', key, this.data[key])
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
					return
				}

				this.cur.push(line)
				break
		}
	}
}

Ext.reg('multiFile', MultiFile)

Ext.data.MultiFile = MultiFile
