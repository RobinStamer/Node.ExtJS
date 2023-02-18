var Ext = require('..')

Ext('Ext.util.Journal-more')

class TagJournal extends Ext.util.Journal {
	constructor(obj) {
		super(obj, {
			handlers:	Ext.util.Journal.tags.handlers
			,helpers:	Ext.util.Journal.tags.helpers
		})

		this.cfg.handlers.init = this.init
		this.journal.length || this.writeEntry({type: 'init'})
	}

	init() {
		this.helper('setupTags')
	}
}

test('Events in an empty TagJournal work', () => {
	let jrn = new TagJournal(null)

	expect(jrn.journal).toHaveLength(1)
	expect(jrn.tags.size).toBe(0)

	jrn.writeEntry({type: 'addTags', tags: ['one', 'two']})

	expect(jrn.journal).toHaveLength(2)
	expect(jrn.tags.size).toBe(2)
	expect(jrn).toHaveProperty('journal.0.type', 'init')

	let snap = JSON.parse(JSON.stringify(jrn))

	jrn.applyJournal()

	expect(JSON.parse(JSON.stringify(jrn))).toEqual(snap)
})

test('Can recreate Journal from its inner journal', () => {
	let j = new TagJournal(null)

	j.writeEntry({
		type:	'addTags'
		,tags:	['one', 'two', 'three']
	})
	j.writeEntry({
		type:	'delTags'
		,tags:	['two', 'four']
	})

	let j2 = new TagJournal({journal: j.journal})
	j2.applyJournal()

	expect(j2).toEqual(j)
})
