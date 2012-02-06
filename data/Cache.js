Ext('Ext.util.Observable')

Ext.data.Cache = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
		config.maxSize = config.maxSize || 0
		config.maxAge  = config.maxAge  || 0

		Ext.apply(this, config)

		this._store = []

		Ext.data.Cache.superclass.constructor.call(this)
	},
	add: function(obj) {
		var o = {
			obj: obj,
			date: new Date
		}
		this.fireEvent('new', o)
		this._store.push(o)
		this.clean()
	},
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
	forEach: function(cb) {
		this._store.forEach(cb)
	},
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
