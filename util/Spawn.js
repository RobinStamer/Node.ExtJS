var	cp	= require('child_process')

class Spawn {
	constructor(opts) {
		this.cfg = opts
		this.xtype = this.cfg.xtype

		this.s = cp.spawn(this.cmd = this.cfg.cmd.shift(), this.cfg.cmd)
	}

	pipe(...args) {
		return this.s[{
			'spawn:stdout':	'stdout'
			,'spawn:stderr':	'stderr'
		}[this.xtype]].pipe(...args)
	}
}

Ext.util.Spawn = Spawn

Ext.reg('spawn:stdout', Ext.util.Spawn)
Ext.reg('spawn:stderr', Ext.util.Spawn)
