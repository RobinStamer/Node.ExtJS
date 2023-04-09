Ext('Ext.opt', 'Ext.ComponentMgr').ns('Hyper.lib')

Ext.opt.hyper = Hyper

// TODO: generic dial() and listen() commands with smart-loading

// Connect to specific network (IE: bootstrap set)

Ext.apply(Hyper, {
	listen() {}
	,dial() {}
	,load(key, mod) {
		if ('string' == typeof key) {
			if (Hyper.lib[key]) {
				// We already loaded a module into that name, assume it's the same one
				return Hyper.load
			}

			if ('string' == typeof mod) {
				Hyper.lib[key] = require(mod)
				return Hyper.load
			}
			return Hyper.load(key, key)
		}

		// We recieved a map
		for (var k in key) {
			Hyper.load(k, key[k])
		}

		return Hyper.load
	}
})

Ext.reg('hyper', Ext.opt.hyper)
