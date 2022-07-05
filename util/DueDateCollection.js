Ext('Ext.util.MixedCollection', 'Ext.util.DueDate');
/**
 * @class Ext.util.DueDateCollection
 * @extends Ext.util.MixedCollection
 * Collection class that wraps DueDates.
 */
Ext.util.DueDateCollection = Ext.extend(Ext.util.MixedCollection, {
	
	constructor: function(config = {}) {
		config.defaults = config.defaults ?? {};

		if(config.defaults.id)
		{
			throw 'DueDateCollection may not specify a default id.';
		}

		return Ext.util.MixedCollection.prototype.constructor.call(this);
	},
	
	add: function(key, record) {

		if(arguments.length === 1)
		{
            record = arguments[0];
            key    = this.getKey(record);
        }

		if(typeof record !== 'object')
		{
			throw 'DueDateCollection may only accept objects.';
		}

		if(!(record instanceof Ext.util.DueDate))
		{
			record = new DueDate(Object.apply(record, defaults));
		}

		return Ext.util.MixedCollection.prototype.add.call(this, key, record);
	},

	getKey(record)
	{
		return record.start + '::' + record.id;
	}

});
