var	fs	= require('fs')

Ext('Ext.data.ManagedCollection', 'Ext.ComponentMgr', 'Ext.fs')

var DC = Ext.data.DirCollection = Ext.extend(Ext.data.ManagedCollection, {
	constructor: function(cfg) {
		Ext.data.DirCollection.superclass.constructor.call(this, cfg)

		this.json = {}

		if ('string' == typeof this.cfg.dir) {
			this.dirname = Ext.path ? Ext.path(this.cfg.dir) : this.cfg.dir

			Ext.fs.mkdirP(this.dirname)
		}

		if ('function' == typeof this.cfg.getFilename) {
			this.getFilename = this.cfg.getFilename
		}

		this.addEvents('load')

		this.load()
	}
	,removeAt: function(index) {
		var o	= Ext.data.DirCollection.superclass.removeAt.call(this, index)
			,key

		if (false != o) {
			key = this.getKey(o)

			delete this.json[key]

			fs.unlinkSync(`${this.dirname}/${key}`)
		}

		return o
	}
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

			for (var fn of dir) {
				self._loadFile(fn)
			}
		})
	}
	,_loadFile: function(fn) {
		var self = this

		fs.readFile(`${self.dirname}/${fn}`, 'utf-8', function(e, json) {
			var data, key

			if (e) {
				throw e
			}

			data	= JSON.parse(json)
			key	= self.getKey(data)

			self.json[key] = json

			DC.superclass.add.call(self, data)

			if (0 == --self.loading) {
				self.fireEvent('load')
			}
		})
	}
	,add: function(...args) {
		var key, data

		if (1 == args.length) {
			data = args[0]
			key = this.getKey(data)
		} else {
			key = args[0]
			data = args[1]
		}

		DC.superclass.add.call(this, key, data)

		this._saveFile(data, this.indexOf(data))
	}
	,_saveFile: function(item, index) {
		var key	= this.getKey(item)
			,json	= JSON.stringify(item) + '\n'

		if (this.json[key] != json) {
			this.json[key] = json

			fs.writeFileSync(`${this.dirname}/${this.getFilename(item, index)}`, json)
		}
	}
	,getFilename: function(o, index) {
		return this.getKey(o)
	}
	,save: function() {
		for (var i = 0; i < this.items.length; ++i) {
			this._saveFile(this.items[i], i)
		}
	}
})

Ext.reg('dircol', Ext.data.DirCollection)
