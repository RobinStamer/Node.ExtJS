#!/usr/bin/env ext

Ext('Ext.util.JSON', 'Ext.util.Observable', 'Ext.net.Proxy')

class Redis extends Ext.util.Observable {
	hold	= null
	prefix	= null
	type	= null
	_io	= null
	_pubsub	= null
	dial	= 'tcp!spine.n!redis'
	opts	= {}

	constructor(opts) {
		super()

		Ext.apply(this.opts, opts)

		this.tryJSON	= !!this.opts.tryJSON
		if (this.opts.dial) {
			this.dial = this.opts.dial
		}
	}

	handle() {}

	pump(data) {
		if (this.hold) {
			this.hold.data.push(data)

			if ('$' == this.type && data.length != this.prefix) {
				// TODO: do something
			}

			if (this.hold.size === this.hold.data.length) {
				var cmd = this.hold.data.shift()

				if (this.tryJSON && 'message' == cmd) {
					try {
						this.hold.data[this.hold.size - 2] = Ext.decode(data)
					} catch (e) {}
				}

				this.fireEvent('!' + cmd, this.hold.data)
				if ('message' == cmd) {
					this.fireEvent(...this.hold.data)
				}
				this.hold = null
			}
		} else {
			this.handle(data)
		}
		this.reset()
	}

	process(line) {
		if (null === this.prefix) {
			if (':' == line[0]) {
				this.pump(line.slice(1) - 0)
				return
			} else if ('$' == line[0]) {
				this.prefix = line.slice(1) - 0
				this.type = '$'
			} else if ('*' == line[0]) {
				this.hold = {
					data: []
					,size: line.slice(1) - 0
				}
			} else {
				console.log(`NOPE: ${line}`)
			}
		} else if ('$' == this.type) {
			this.pump(line)
			return
		}
	}

	reset() {
		this.prefix	= null
		this.type	= null
	}

	_dial() {
		return Ext.xcreate({
			xtype:	'linePipe'
			,input:	Ext.net.dial(this.dial)
		})
	}

	get io() {
		if (!this._io) {
			this._io = this._dial()
		}

		return this._io
	}

	get pubsub() {
		if (!this._pubsub) {
			this._pubsub = this._dial()

			this._pubsub.on('data', line => {
				// TODO: fix LinePipe to be configured to split on \r\n instead of just \n
				this.process(line.replace(/\r$/, ''))
			})
		}

		return this._pubsub
	}

	sub(...cats) {
		this.pubsub.input.write(`subscribe ${cats.join(' ')}\r\n`)
	}

	pub(cat, msg) {
		this.io.input.write(`publish ${cat} ${Ext.encode(this.tryJSON ? Ext.encode(msg) : msg)}\r\n`)
	}

	// TODO: get
	// TODO: set
	// TODO: unsub
	// TODO: pub
	// TODO: ppub?
	// TODO: psub
	// TODO: punsub
}

Ext.net.Redis = Redis
