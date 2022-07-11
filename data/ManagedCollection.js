Ext.call && Ext('Ext.util.MixedCollection', 'Ext.ComponentMgr')

/**
 * @class Ext.data.ManagedCollection
 * @extends Ext.util.MixedCollection
 * Collection class that optionally wraps elements in a specified class.
 *
 * @constructor
 * Creates a new ManagedCollection.
 * @param {Object} cfg A config object
 *
 * @xtype mcol
 */
Ext.data.ManagedCollection = Ext.extend(Ext.util.MixedCollection, {
	/**
	 * @cfg {String} id The id to use for the collection
	 */

	/**
	 * @cfg {Function} class Constructor to wrap collection elements with
	 */
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

		return Ext.data.ManagedCollection.superclass.add.apply(this, args)
	}
})

Ext.reg('mcol', Ext.data.ManagedCollection)
