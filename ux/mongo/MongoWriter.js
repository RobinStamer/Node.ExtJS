Ext('Ext.data.JsonWriter').ns('Ext.ux.mongo')

Ext.ux.mongo.MongoWriter = Ext.extend(Ext.data.JsonWriter, {
	constructor: function(config) {
		Ext.ux.mongo.MongoWriter.superclass.constructor.call(this, config)
	}
})
