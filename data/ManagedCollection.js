Ext('Ext.util.MixedCollection', 'Ext.ComponentMgr')

Ext.data.ManagedCollection = Ext.extend(Ext.util.MixedCollection, {
	constructor: function(cfg) {
		Ext.data.ManagedCollection.superclass.constructor.call(this, !!cfg.allowFunctions, cfg.keyFn || cfg.getKey)

		this.cfg = Ext.apply({}, cfg)

		if ('string' == typeof this.cfg.id && Ext.CollectionMgr) {
			this.id = this.cfg.id
			Ext.CollectionMgr.register(this)
		}
	}
	,add: function(...args) {
		if (this.cfg.class) {
			if (1 == args.length) {
				if (!(args[0] instanceof this.cfg.class)) {
					args[0] = new (this.cfg.class)(args[0])
				}
			}
			if (2 == args.length) {
				if (!(args[1] instanceof this.cfg.class)) {
					args[1] = new (this.cfg.class)(args[1])
				}
			}
		}

		Ext.data.ManagedCollection.superclass.add.apply(this, args)
	}
})

Ext.reg('mcol', Ext.data.ManagedCollection)
