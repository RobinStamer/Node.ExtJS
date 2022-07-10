Ext('Ext.p9p')

class PlumbMessage {
	src	= 'Ext'
	dst	= ''
	wdir	= process.cwd()
	type	= 'text'
	attr	= ''
	ndata	= 0
	data	= ''

	constructor(cfg) {
		if (cfg) {
			Ext.apply(this, cfg)
		}
	}

	write(pipe) {
		var b = Buffer.isBuffer(this.data) ? this.data : Buffer.from(this.data)

		pipe.write(Buffer.concat([Buffer.from(`${this.src}\n${this.dst}\n${this.wdir}\n${this.type}\n\n${this.ndata = b.length}\n`), b]))
//		pipe.write(b)
		console.dir(this)
	}

	read(b) {
		for (var i = 0, c = 0, x = 0; i < b.length; ++i) {
			if (10 == b[i]) {
				++c

				if (5 == c) {
					x = i + 1
				}
			}

			if (6 == c) {
				x = b.slice(x, i).toString() - 0
				++i

				if (b.length < x + i) {
					return 0
				}

				this.data = b.slice(i, i + x)
				c = b.slice(0, i).toString().split('\n')
				this.src	= c.shift()
				this.dst	= c.shift()
				this.wdir	= c.shift()
				this.type	= c.shift()
				this.attr	= c.shift()
				this.ndata	= x
				return i + x
			}
		}
		return 0
	}
}

Ext.p9p.PlumbMessage = PlumbMessage

Ext.p9p.plumb = function(...args) {
	var pipe = Ext.xcreate({
		xtype:	'spawn:stdin'
		,cmd:	['9p', 'write', 'plumb/send']
	})

	for (var a of args) {
		var p = new PlumbMessage(a)

		p.write(pipe)
	}

	pipe.end()
}
