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

	read() {
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
