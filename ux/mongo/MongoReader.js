var Ext = require('../../').load('Ext.data.JsonReader');

Ext.ns('Ext.ux.mongo')

Ext.ux.mongo.MongoReader = Ext.extend(Ext.data.JsonReader, {
	constructor: function(config) {
		config.idProperty	= config.idProperty	|| '_id'
//		config.root			= config.root			|| 'rows'
		Ext.ux.mongo.MongoReader.superclass.constructor.call(this, config)
	}
})
