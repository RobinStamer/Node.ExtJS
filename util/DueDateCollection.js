Ext('Ext.util.MixedCollection', 'Ext.util.DueDate');
/**
 * @class Ext.util.DueDateCollection
 * @extends Ext.util.MixedCollection
 * Collection class that wraps DueDates.
 */
Ext.util.DueDateCollection = Ext.extend(Ext.util.MixedCollection, {
	
	constructor: function(config = {}) {
		Object.freeze(config);
		
		const defaults = config.defaults ?? {};

		if(defaults.id)
		{
			throw 'DueDateCollection may not specify a default id.';
		}

		Object.defineProperty(this, 'defaults', {value: config.defaults});

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
			record = new Ext.util.DueDate(Object.assign({}, record, this.defaults));
		}

		return Ext.util.MixedCollection.prototype.add.call(this, key, record);
	},

	getKey(record)
	{
		return record.start + '::' + record.id;
	}

});
