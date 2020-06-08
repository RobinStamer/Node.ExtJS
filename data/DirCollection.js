var	fs	= require('fs')

Ext('Ext.util.MixedCollection', 'Ext.ComponentMgr')

var DC = Ext.data.DirCollection = Ext.extend(Ext.util.MixedCollection, {
	constructor: function(cfg) {
		Ext.data.DirCollection.superclass.constructor.call(this)

		this.cfg = Ext.apply({}, cfg)

		this.json = {}

		if ('string' == typeof this.cfg.dir) {
			this.dirname = Ext.path ? Ext.path(this.cfg.dir) : this.cfg.dir
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
			var data

			if (e) {
				throw e
			}

			data = JSON.parse(json)

			self.json[fn] = json

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

		this._saveFile(key)
	}
	,_saveFile: function(key) {
		var item	= this.map[key]
			,json	= JSON.stringify(item) + '\n'

		if (this.json[key] != json) {
			this.json[key] = json

			fs.writeFileSync(`${this.dirname}/${key}`, json)
		}
	}
	,save: function() {
		for (var item of this.items) {
			this._saveFile(this.getKey(item))
		}
	}
})

Ext.reg('dircol', Ext.data.DirCollection)
