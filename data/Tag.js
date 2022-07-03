Ext('Ext.util.MixedCollection', 'Ext.ComponentMgr')

class Tag {
	constructor(cfg) {
		this.cfg = cfg

		this.col	= this.cfg.col
		this.getKey	= this.col.getKey
		this.tagKey	= this.cfg.tagKey || 'tags'
	}

	search(...tags) {
		var res = []

		this.col.each(function(obj) {
			for (var tag of tags) {
				if ( ('-' == tag[0] && -1 != obj[this.tagKey].indexOf(tag.slice(1))) // if the tag is negative, and the object has the tag
					|| ('-' != tag[0] && -1 == obj[this.tagKey].indexOf(tag)) ) { // OR if the tag is positive, and the object does not have the tag, then return
					return
				}
			}

			res.push(this.getKey(obj))
		}, this)

		return res
	}
}

Ext.data.Tag = Tag

Ext.reg('Tag', Ext.data.Tag)
