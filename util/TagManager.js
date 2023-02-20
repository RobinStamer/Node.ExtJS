Ext('Ext.ComponentMgr')

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
 * - keys: {String|Symbol} whether to return keys or objects
 */
class TagManager {
	collection
	returns   = 'keys'
	watchProp = 'tags'
	caches    = new Map
	records   = new Set

	constructor(config) {
		Object.freeze(config)

		Object.defineProperty(this, 'config', { value: config })
		Object.defineProperty(this, 'returns',    { value: config.returns ?? this.returns })

		if (config.watchProp) {
			Object.defineProperty(this, 'watchProp', { value: config.watchProp })
		}

		if (config.collection) {
			this.init(config.collection)
		}
	}

	/**
	 * Initialize collection
	 * @param {MixedCollection} col Collection to track tags on
	 */
	init(col) {
		Object.defineProperty(this, 'collection', { value: col })

		this.collection.on('update',  this.handleRecordUpdate, this)
		this.collection.on('replace', this.handleRecordReplace, this)
		this.collection.on('remove', this.handleRecordRemoved, this)
		this.collection.on('add', this.handleRecordAdded, this)

		this.collection.search = function(...arg) {
			return this._tagmgr.search(...arg)
		}

		this.collection._tagmgr = this
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
	 * Handle a record replaced within the collection.
	 * @method
	 */
	handleRecordReplace(index, oldRecord, newRecord)
	{
		for(const [name, cache] of this.caches)
		{
			cache.delete(oldRecord);
		}

		this.records.delete(oldRecord);

		this.cacheTags(newRecord);

		this.records.add(newRecord);
	}

	/**
	 * Handle a record replaced within the collection.
	 * @method
	 */
	handleRecordUpdate(index, record)
	{
		this.cacheTags(record);
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
		if(!(this.watchProp in record))
		{
			return;
		}

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
	search(...names) {
		const positives = names.filter(n => n[0] !== '-')
		const negatives = names.filter(n => n[0] === '-').map(n => n.substr(1))

		const caches = positives.length
			? this.sortCaches(positives.map(n => this.caches.get(n)).filter(x => x))
			: [this.records]

		const results = new Set(caches.shift())

		for (const record of results) {
			let watched = record[this.watchProp]
			
			if (!(watched instanceof Set)) {
				watched = new Set(watched)
			}

			for (const name of positives) {
				if (!watched.has(name)) {
					results.delete(record)
				}
			}

			for (const name of negatives) {
				if (watched.has(name)) {
					results.delete(record)
				}
			}
		}

		if (this.returns === 'objects') {
			return [...results]
		}

		return [...results].map(r => this.collection.getKey(r))
	}
}

Ext.util.TagManager = TagManager

Ext.preg('tagmgr', Ext.util.TagManager)
