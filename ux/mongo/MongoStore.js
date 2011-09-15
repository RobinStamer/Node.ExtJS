var Ext = require('../../').load('Ext.data.Store', 'Ext.ux.mongo.MongoReader', 'Ext.ux.mongo.MongoWriter', 'Ext.ux.mongo.MongoProxy');

Ext.ns('Ext.ux.mongo')

Ext.ux.mongo.MongoStore = Ext.extend(Ext.data.Store, {
	constructor: function(config, collection) {
		if (false !== config.autoLoad) {
			config.autoLoad = true
		}
		config.reader = config.reader || new Ext.ux.mongo.MongoReader({
			fields: config.fields,
			idProperty: config.idProperty
		})
		config.proxy = config.proxy || new Ext.ux.mongo.MongoProxy({
			api: config.api
		}, collection)
		Ext.ux.mongo.MongoStore.superclass.constructor.call(this, config)
	}
})
