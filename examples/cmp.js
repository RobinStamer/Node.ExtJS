require('Ext')
Ext('Ext.Ext-more', 'Ext.ComponentMgr')

var A, C

Ext.reg('A', A = Ext.extend(Object, {constructor: function() {
	this.x = 42
}}))

Ext.reg('B', function() {
	this.x = 1337
})

Ext.reg('C', C = Ext.extendX(A, function(sup) {
	return {
		constructor: function() {
			C.superclass.constructor.call(this)
			this.y = 'foobar'
		}
	}
}))

console.dir(['A', 'B', 'C'].map((cls) => {
	return Ext.create({xtype: cls})
}))
