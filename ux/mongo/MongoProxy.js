var Ext = require('../../').load('Ext.data.DataProxy');

Ext.ns('Ext.ux.mongo')

Ext.ux.mongo.MongoProxy = Ext.extend(Ext.data.DataProxy, {
	constructor: function(config, collection) {
		if (!(collection instanceof require('mongodb').Collection)) {
			throw new Error('collection is not a Collection')
		}
		this.mongo = {
			collection:	collection
		}
		Ext.ux.mongo.MongoProxy.superclass.constructor.call(this, config)
	},
	request: function(action, rs, params, reader, callback, scope, options) {
		switch (action.toLowerCase()) {
			case 'read':
				var cur = this.mongo.collection.find(this.api[action])

				cur.toArray(function(err, rep) {
					if (err) {
						throw err
					}
					callback.call(scope, reader.readRecords(rep), options, true)
				})
				break
		}
	}
})
