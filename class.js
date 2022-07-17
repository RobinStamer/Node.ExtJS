require('Ext')
Ext('Ext.Ext-more', 'Ext.ComponentMgr')

const	registry = require('Ext/var/registry.json')

/**
 * @class Ext
 */

// FIXME: Document these methods properly

/**
 * @param {Object} config
 * @return {Object}
 */
Ext.class = function ExtCls(config) {
	var	base	= config.parent || Object
		,funcs	= config.funcs || {}
		,cls

	if (config.init) {
		funcs.constructor = config.init(function() { let a = Array.from(arguments); (base.superclass ? base.superclass.constructor : base).apply(a[0], a.slice(1)) })
	}

	cls = Ext.extend(base, funcs)

	if (config.xtype) {
		Ext.reg(config.xtype, cls)
	}

	return cls
}

/**
 * @param {Object} cfg
 * @param {Constructor} def Default type
 */
Ext.xcreate = function(cfg, def) {
	if (!def && !cfg.xtype) {
		// Make code simpler, we probably just got an actual object, so return that
		return cfg
	}

	if (!Ext.ComponentMgr.isRegistered(cfg.xtype)) {
		Ext(registry[cfg.xtype])
	}

	return Ext.create(cfg, def)
}

// Private function to enable co-operative modules to add stuff to xcreate()
Ext.xcreate.reg = function(key, module) {
	registry[key] = module
}

/*
var A, C

A = Ext.class({
	init: function(sup) {
		return function() { sup(this); this.x = 42 }
	}
	,xtype: 'A'
})

Ext.reg('B', function() {
	this.x = 1337
})

Ext.class({
	init: function(sup) {
		return function() {
			sup(this)
			this.y = 'foobar'
		}
	}
	,xtype: 'C'
	,parent: A
})

console.dir(['A', 'B', 'C'].map((cls) => {
	return Ext.create({xtype: cls})
}))
*/
