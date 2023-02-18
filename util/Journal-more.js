Ext('Ext.util.Journal')

Ext.apply(Ext.util.Journal, {
	joiner: {
		handlers: {
			join(obj) {
				Ext.apply(this.key ? this[this.key] : this, this.key ? obj[this.key] : obj)
			}
		}
	}
	,tags: {
		helpers: {
			setupTags() {
				this.tags = new Set
			}
		}
		,handlers: {
			addTags(o) {
				for (var i = 0; i < o.tags.length; ++i) {
					this.tags.add(o.tags[i])
				}
			}
			,delTags(o) {
				for (var i = 0; i < o.tags.length; ++i) {
					this.tags.delete(o.tags[i])
				}
			}
		}
	}
})
