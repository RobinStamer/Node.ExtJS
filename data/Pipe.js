var stream = require('stream')

class Pipe extends stream.Transform {
	constructor(cfg) {
		super(Ext.apply(cfg.cfg || {}, {readableObjectMode: true}))

		this.cfg = cfg
	}

	static pipe(o) {
		if (o.cfg.input) {
			if (o.cfg.input.xtype && !o.cfg.input.pipe) {
				o.cfg.input = Ext.xcreate(o.cfg.input)
			}

			if (o.cfg.input.pipe) {
				o.cfg.input.pipe(o)
			}
		}
	}
}

Ext.data.Pipe = Pipe
