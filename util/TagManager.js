/**
 * @class Ext.util.TagManager
 * 
 * Handles indexing and searching records by tags.
 * Records should have a Set object of tag names.
 * The Set of tag names can be placed under .tags
 * This can be changed with watchProp
 * 
 * @constructor
 * @param {Object} config Configuration KV
 * - collection: {MixedCollection} the collection to watch for records
 * - watchProp: {String|Symbol} the name of the property to watch for tags
 * - staySynced: {Boolean} Slower, but will not lose sync if tags are modified. Defaults to false.
 */
class TagManager
{
	collection;
	watchProp = 'tags';
	caches    = new Map;
	records   = new Set;

	constructor(config)
	{
		Object.freeze(config);

		Object.defineProperty(this, 'config', { value: config });

		if(config.watchProp)
		{
			Object.defineProperty(this, 'watchProp', { value: config.watchProp });
		}

		if(!config.collection)
		{
			throw 'Collection is required for TagManager.';
		}

		Object.defineProperty(this, 'collection', { value: config.collection });
		Object.defineProperty(this, 'staySynced', { value: config.staySynced ?? false});

		this.collection.on('remove', (index, record, key) => this.handleRecordRemoved(index, record, key));
		this.collection.on('add',    (index, record, key) => this.handleRecordAdded(index, record, key));
	}

	/**
	 * Handle a record added to the collection.
	 * @method
	 */
	handleRecordAdded(index, record, key)
	{
		this.cacheTags(record);

		this.records.add(record);
	}

	/**
	 * Handle a record removed from the collection.
	 * @method
	 */
	handleRecordRemoved(index, record, key)
	{
		for(const [name, cache] of this.caches)
		{
			cache.delete(record);
		}

		this.records.delete(record);
	}

	/**
	 * Rebuild the cache from scratch.
	 * Its a good idea to do this before searching if records have mutated their tag lists.
	 * @method
	 */
	rebuildCache()
	{
		for(const [name, cache] of this.caches)
		{
			cache.clear();
		}

		for(const record of this.records)
		{
			this.cacheTags(record);
		}
	}

	/**
	 * Cache the tags for a given record.
	 * @param record {Object} the record to cache tags for.
	 * @method
	 */
	cacheTags(record)
	{
		for(const name of record[this.watchProp])
		{
			if(!this.caches.has(name))
			{
				this.caches.set(name, new Set);
			}
		}

		for(const [name, cache] of this.caches)
		{
			cache.delete(record);
		}

		for(const name of record[this.watchProp])
		{
			const cache = this.caches.get(name);

			cache.add(record);
		}
	}

	/**
	 * Returns caches ordered from smallest to largest.
	 * @param caches {Array} Optional, if provided, sort only these caches instead of all caches.
	 * @return {Array}
	 * @method
	 */
	sortCaches(caches)
	{
		return [...(caches||this.caches)].sort((a, b) => a.size - b.size);
	}

	/**
	 * Returns whether or not the collection has a record.
	 * @param record {Object} the record to check on.
	 * @return {Boolean}
	 * @method
	 */
	has(record)
	{
		const caches = [].concat(this.sortCaches(), this.records);

		for(const [name, cache] of this.caches)
		{
			if(cache.has(record))
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * Search for records given a list of tags.
	 * @param names {Array} the list of names to check.
	 * @return {Array}
	 * @method
	 */
	search(...names)
	{
		const positives = names.filter(n => n[0] !== '-');
		const negatives = names.filter(n => n[0] === '-').map(n => n.substr(1));

		const caches = positives.length
			? this.sortCaches(positives.map(n => this.caches.get(n)).filter(x => x))
			: [this.records];

		const results = new Set(caches.shift());

		for(const record of results)
		{
			if(this.staySynced)
			{
				this.cacheTags(record);
			}

			for(const name of positives)
			{
				if(!record[this.watchProp].has(name))
				{
					results.delete(record);
				}
			}

			for(const name of negatives)
			{
				if(record[this.watchProp].has(name))
				{
					results.delete(record);
				}
			}
		}

		return results;
	}
}

Ext.util.TagManager = TagManager;
