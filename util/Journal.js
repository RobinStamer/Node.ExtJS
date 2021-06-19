Ext.ns('Ext.util')

class Journal {
	constructor(o) {
		Ext.apply(this, o.base || {})
		Object.defineProperty(this, 'cfg', {
			value: o.cfg || {}
		})

		if (!Array.isArray(this.journal)) {
			this.journal = []
		}
	}

	applyJournal() {
		for (var j of this.journal) {
		}
	}

	writeEntry(o) {
		var h = this.cfg.handlers[o.type]

		if ('function' != typeof h) {
			throw new Error(`No handler ${o.type}`)
		}

		o._when	= new Date - 0
		o._id	= `${o.type}:${o._when}`

		h.call(this, o)
		this.journal.push(o)
	}

	helper(key, ...args) {
		var h = this.cfg.helpers[key]

		if ('function' != typeof h) {
			throw new Error('No helper ${key}')
		}

		h.call(this, ...args)
	}
}

Ext.util.Journal = Journal

Ext.reg('Journal', Ext.util.Journal)
