class TagManager
{
	collection;
	watchProp = 'tags';
	caches    = new Map;

	constructor(config)
	{
		if(!config.collection)
		{
			throw 'Collection is required for TagManager.';
		}

		if(config.watchProp)
		{
			this.watchProp = config.watchProp;
		}

		this.collection = config.collection;

		this.collection.on('add', (index, record, key) => this.handleRecordAdded(index, record, key));
	}

	handleRecordAdded(index, record, key)
	{
		this.cacheTags(record);
	}

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

	orderCaches(caches)
	{
		return [...(caches||this.caches)].sort((a, b) => a.size - b.size);
	}

	has(record)
	{
		const caches = this.orderCaches();

		for(const [name, cache] of this.caches)
		{
			if(cache.has(record))
			{
				return true;
			}
		}

		return false;
	}

	search(...names)
	{
		const caches = this.orderCaches(names.map(n => this.caches.get(n)).filter(x => x));

		const results = new Set(caches.shift());

		for(const name of names)
		{
			for(const record of results)
			{
				if(!record[this.watchProp].has(name))
				{
					results.delete(record);
				}
			}
		}

		console.log(results);	
	}
}

Ext.util.TagManager = TagManager;
