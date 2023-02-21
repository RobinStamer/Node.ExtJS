var	fs	= require('fs')

Ext('Ext.data.ManagedCollection', 'Ext.ComponentMgr', 'Ext.fs', 'Ext.util.Serializer')

/**
 * @class Ext.data.DirCollection
 * @extends Ext.data.ManagedCollection
 * Filesystem-backed ManagedCollection.
 *
 * @constructor
 * @param {Object} cfg A config object
 *
 * @xtype dircol
 */

var DC = Ext.data.DirCollection = Ext.extend(Ext.data.ManagedCollection, {
	/**
	 * @cfg {String} dir Directory to store this collection in
	 */

	/**
	 * @cfg {Function?} getFilename Override for the DirCollection.getFilename function, may cause issues with saving/loading
	 */
	constructor: function(cfg) {
		Ext.data.DirCollection.superclass.constructor.call(this, cfg)

		this.json = {}

		if ('string' == typeof this.cfg.dir) {
			this.dirname = Ext.path ? Ext.path(this.cfg.dir) : this.cfg.dir

			Ext.fs.mkdirP(this.dirname, 0700, e => {
				if (e) {
					this.fireEvent('error', e)
					throw e
				}
				this.load()
			})
		}

		if ('function' == typeof this.cfg.getFilename) {
			this.getFilename = this.cfg.getFilename
		}

		/**
		 * @event load
		 * Fires when the directory fully loads.
		 */
		this.addEvents('load')
		/**
		 * @event error
		 * Fires when DirCollection encounters an error.
		 * @param {Error} err The error that caused this event to fire
		 */
		this.addEvents('error')

		this.on('add', this._added)

		this.serializer = cfg.serializer instanceof Ext.util.Serializer ? cfg.serializer : (Ext('Ext.util.JSONSerializer'), new Ext.util.JSONSerializer)
	}
	,encode: function(...args) {
		return this.serializer.encode(...args)
	}
	,decode: function(...args) {
		return this.serializer.decode(...args)
	}
	,_added: function(index, o, key) {
		if (key === undefined) {
			// create, but don't throw an Error object to get stack trace information
			let w = new Error("Added undefined key to DirCollection!")
			w.name = "Warning"
			console.warn(w)
		}
	}
	/**
	 * Reloads the directory asynchronously.
	 * Fires a load event on completion.
	 */
	,load: function() {
		var dirname = this.dirname
			,self	= this

		if (this.loading) {
			// We are still loading
			return
		}

		fs.readdir(this.dirname, function(err, dir) {
			if (err) {
				throw err
			}

			self.loading = dir.length

			if (!self.loading) {
				self.fireEvent('load')
				return
			}

			for (var fn of dir) {
				self._loadFile(fn)
			}
		})
	}
	,_loadFile: function(key) {
		var self = this

		fs.readFile(`${self.dirname}/${key}`, 'utf-8', function(e, json) {
			var data

			if (e) {
				self.fireEvent('error', e)
				throw e
			}

			try {
				data	= self.decode(json)
			} catch (e) {
				self.fireEvent('error', e)
				throw e
			}

			if (key != self.getKey(data)) {
				console.warn("DirCollection loaded item with key", self.getKey(data), "but", key, "was expected")
			}
			self.json[key] = json

			self.add(key, data)

			if (0 == --self.loading) {
				self.fireEvent('load')
			}
		})
	}
	/**
	 * Converts an item's information into a filename the item's stored at.
	 * @param {String} key
	 * @param {Object} o
	 * @param {Number} index
	 * @return {String}
	 */
	,getFilename: function(key, o, index) {
		return key
	}
	/**
	 * Synchronously saves the collection to disk.
	 */
	,save: function() {
		if (this.loading) {
			let e = new TypeError("Tried to save DirCollection while it was still loading")
			this.fireEvent('error', e)
			throw e
		}
		try {
			let newJson = {}
			for (let i = 0; i < this.items.length; ++i) {
				let item	= this.items[i]
					,key	= this.keys[i]
					,json	= this.encode(item) + '\n'
					,file	= this.getFilename(key, item, i)

				newJson[file] = json
				if (this.json[file] != json) {
					fs.writeFileSync(`${this.dirname}/${file}`, json)
				}
			}
			for (let file in this.json) {
				if (!(file in newJson)) {
					fs.unlinkSync(`${this.dirname}/${file}`)
				}
			}
			this.json = newJson
		} catch (e) {
			this.fireEvent('error', e)
			throw e
		}
	}
})

Ext.reg('dircol', Ext.data.DirCollection)
