var stream = require('stream')

class Pipe extends stream.Transform {
	constructor(cfg) {
		Ext.applyIf(cfg, {cfg: {}})

		super(Ext.apply(cfg.cfg, {readableObjectMode: true}))

		this.cfg	= cfg
	}

	static pipe(o, enforce) {
		if (!o.cfg) {
			return false
		}

		if (!o.cfg.input && o.cfg.cmd) {
			o.cfg.input = {
				xtype: 'spawn:stdout'
				,cmd: o.cfg.cmd
			}
		}

		if (!o.cfg.input && o.cfg.errcmd) {
			o.cfg.input = {
				xtype: 'spawn:stderr'
				,cmd: o.cfg.errcmd
			}
		}

		if (o.cfg.input) {
			if ('string' == typeof o.cfg.input) {
				o.cfg.input = {
					xtype:	'file'
					,name:	o.cfg.input
				}
			}

			if (o.cfg.input.xtype && !o.cfg.input.pipe) {
				o.cfg.input = Ext.xcreate(o.cfg.input)
			}

			if (enforce && !(o.cfg.input instanceof enforce)) {
				o.cfg.input = new enforce({input: o.cfg.input})
			}

			if (!o.s && Ext.util.Spawn && o.cfg.input instanceof Ext.util.Spawn) {
				o.s = o.cfg.input.s
			}

			if (o.cfg.input.pipe) {
				o.cfg.input.pipe(o)

				o.input = o.cfg.input
				return true
			}
		}

		return false
	}

	get render() {
		return true
	}
}

Ext.data.Pipe = Pipe
