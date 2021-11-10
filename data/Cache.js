Ext('Ext.util.Observable')

/**
 * @class Ext.data.Cache
 * @extends Ext.util.Observable
 *
 * A simple cache implementation for arbitrary objects.
 *
 * @constructor
 * @param {Object} config
 */

Ext.data.Cache = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg {Number} maxSize The maximum size of the cache (as a number of total objects)
	 */

	/**
	 * @cfg {Number} maxAge The maximum age (in milliseconds) of objects before they are evicted
	 */
	constructor: function(config) {
		this.maxSize = config.maxSize || 0
		this.maxAge  = config.maxAge  || 0

		this.listeners = config.listeners

		this._store = []

		this.addEvents(
			/**
			 * @event new
			 * Fires when an object is added to the cache
			 * @param {Object} o Newly added object
			 */
			'new',
			/**
			 * @event free
			 * Fires when an object is evicted from the cache
			 * @param {Object} o Evicted object
			 * @param {String} reason 'size' if evicted due to size, 'date' if evicted due to age
			 */
			'free'
		)

		Ext.data.Cache.superclass.constructor.call(this, config)
	},
	/**
	 * Adds an object to the cache.
	 * Causes an eviction check.
	 * @param {Any} obj
	 */
	add: function(obj) {
		var o = {
			obj: obj,
			date: new Date
		}
		this.fireEvent('new', o)
		this._store.push(o)
		this.clean()
	},
	/**
	 * Checks for objects to evict from the cache
	 * @method
	 */
	clean: function() {
		// Free by size
		while (this.maxSize && this._store.length > this.maxSize) {
			this.fireEvent('free', this._store.shift(), 'size')
		}
		// Free by staleness
		while (this.maxAge && this._store[0].date - 0 + this.maxAge < new Date) {
			this.fireEvent('free', this._store.shift(), 'date')
		}
	},
	/**
	 * Iterates through objects in the cache, in oldest-to-newest order.
	 * Note: passes an <code>{obj, date}</code> object, not the bare added object.
	 * @param {Function} cb
	 */
	forEach: function(cb) {
		this._store.forEach(cb)
	},
	/**
	 * Accesses the most recent cached object.
	 * Note: returns an <code>{obj, date}</code> object, not the bare added object.
	 * @param {Function?} cb Filtering predicate, given object and unix timestamp
	 * @return {Object?} Cached object, if any
	 */
	last: function(cb) {
		if (Ext.isFunction(cb)) {
			for (var i = this._store.length; i > 0; )
				var o = this._store[--i]
				if (cb(o.obj, o.date))
					return o
		} else {
			return this._store[this._store.length - 1]
		}
	}
})
