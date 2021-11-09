Ext.ns('Ext.util')

/**
 * @class Ext.util.Journal
 * Manages an object's state using journalling. A journal may be replayed at any time to reconstruct the object's data.
 *
 * @constructor
 * Constructs a Journal object.
 * @param {Object} o Object to base the journal on
 * @param {Object} cfg Journal configuration
 *
 * @xtype Journal
 */

class Journal {
	/**
	 * @cfg {Object} handlers
	 * Map of journal event handlers.
	 * An entry will be called when a corresponding event is (re)played from the journal.
	 * A handler should accept one parameter, the event. 'this' will be set to this journal.
	 */

	/**
	 * @cfg {Object} helpers
	 * Map of helper functions which can be accessed by the helper method.
	 * 'this' will be set to the Journal when called.
	 */
	constructor(o, cfg) {
		Ext.apply(this, o || {})
		Object.defineProperty(this, 'cfg', {
			value: cfg || {}
		})

		if (!this.cfg.handlers) {
			this.cfg.handlers = {}
		}

		if (!Array.isArray(this.journal)) {
			this.journal = []
		}
	}

	/**
	 * Applies all events in the journal in chronological order.
	 * This operation should be indempotent on well-behaving journals.
	 */
	applyJournal() {
		this.journal = this.journal.sort((a,b) => { return (a._when ?? 1e100) - (b._when ?? 1e100) })

		for (var j of this.journal) {
			var h = this.cfg.handlers[j.type]

			if (!j._id) {
				j._when	= new Date - 0
				j._id	= `${j.type}:${j._when}`
			}

			h.call(this, j)
		}
	}

	/**
	 * Writes a journal entry.
	 * @param {Object} o
	 *   The entry to write, must have a 'type' property that matches one of the journal's handlers.
	 * @param {Number?} when
	 *   When in the journal to write the entry (in unix time).
	 *   All entries should have a unique 'when' time.
	 *   <br>
	 *   Note that the journal object may end up in a different state when constructed this way from when it is replayed later.
	 *   <br>
	 *   You may use Journal.applyJournal to make the journal's state consistent after using this parameter.
	 */
	writeEntry(o, when) {
		var h = this.cfg.handlers[o.type]

		if ('function' != typeof h) {
			throw new Error(`No handler ${o.type}`)
		}

		o._when	= when ?? new Date - 0
		o._id	= `${o.type}:${o._when}`

		h.call(this, o)
		let position = this.journal.findIndex(j => (j._when ?? 1e100) > o._when)
		if (position === -1) position = this.journal.length
		this.journal.splice(position, 0, o)
	}

	/**
	 * Calls a helper method, most useful from within a handler method.
	 * @param {String} key Name of the helper method
	 * @param {Any} ...args
	 */
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
