var	cp	= require('child_process')

Ext('Ext.data.Pipe')

class Spawn {
	constructor(opts) {
		this.cfg = opts
		this.xtype = this.cfg.xtype

		this.s = cp.spawn(this.cmd = this.cfg.cmd.shift(), this.cfg.cmd)

		if ('spawn:stdin' == this.xtype && opts.input) {
			Ext.data.Pipe.pipe(this)
		}
	}

	pipe(...args) {
		return this.s[{
			'spawn:stdout':	'stdout'
			,'spawn:stderr':	'stderr'
		}[this.xtype] || 'stdout'].pipe(...args)
	}

	write(...args) {
		this.s.stdin.write(...args)
	}

	end(...args) {
		this.s.stdin.end(...args)
	}
}

// Broke AF
class SpawnPipe extends Ext.data.Pipe {
	constructor(cfg) {
		super(cfg)

		this.s = cp.spawn(this.cmd = this.cfg.cmd.shift(), this.cfg.cmd)

		var self = this

		this.s.stdout.on('data', function(data) {
			self.push(data)
		})

		this.s.stdout.on('end', function() {
			self.end()
		})

		this.s.on('close', function() {
			self.end()
		})
	}

	_transform(chunk, encoding, done) {
		this.s.stdin.write(chunk)
		done()
	}

	_flush(done) {
		this.s.stdin.end()
		done()
	}
}

Ext.util.Spawn = Spawn
Ext.data.SpawnPipe = SpawnPipe

Ext.reg('spawn:stdout', Ext.util.Spawn)
Ext.reg('spawn:stderr', Ext.util.Spawn)
Ext.reg('spawn:stdin', Ext.util.Spawn)
Ext.reg('spawn:pipe', Ext.data.SpawnPipe)
