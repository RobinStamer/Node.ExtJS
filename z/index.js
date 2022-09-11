Ext.ns('Ext.z')

Ext.rq = function(...a) {
	for (var k of a) {
		if (!Ext.z[k]) {
			Ext.z[k] = require(k)
		}
	}
}
