var Ext = require('../../').load('Ext.data.JsonWriter');

Ext.ns('Ext.ux.mongo')

Ext.ux.mongo.MongoWriter = Ext.extend(Ext.data.JsonWriter, {
	constructor: function(config) {
		Ext.ux.mongo.MongoWriter.superclass.constructor.call(this, config)
	}
})
