
Ext('Ext.util.Observable', 'Ext.class')

class IC extends Ext.util.Observable {
	constructor(cfg) {
		super()

		this.cfg = Ext.apply({}, cfg || {})

		if (!this.cfg.file) {
			;
		}
	}

	load() {
		var	self	= this
			,proc	= Ext.xcreate({
			xtype:	'fullPipe'
			,input:	{
				xtype:	'spawn:stdout'
				,cmd:	['ic', 'd', this.cfg.password, this.cfg.file, '-']
			}
		})

		return new Promise((p, f) => {
			proc.on('data', d => {
				self.data = self.parse(d)
				p(self.data)
				self.fireEvent('load', self.data)
			})
		})
	}

	save() {
		var proc = Ext.xcreate({
			xtype:	'spawn:stdin'
			,cmd:	['ic', 'e', this.cfg.password, '-', this.cfg.file]
		})

		proc.write(this.unparse(this.data))
		proc.end()
	}

	parse(str) {
		return JSON.parse(str)
	}

	unparse(data) {
		return JSON.stringify(data)
	}
}

Ext.data.IC = IC

Ext.reg('IC', Ext.data.IC)
