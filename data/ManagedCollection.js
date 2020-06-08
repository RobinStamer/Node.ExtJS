var	fs	= require('fs')

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
})

Ext.reg('mcol', Ext.data.ManagedCollection)
