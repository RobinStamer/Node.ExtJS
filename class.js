require('Ext')
Ext('Ext.Ext-more', 'Ext.ComponentMgr')

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
