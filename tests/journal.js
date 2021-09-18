Ext('Ext.util.Journal')

let handlers = {
	init(o) {
		if (this.base === undefined) this.base = {};

		this.base.id = this.id = o.id
		this.counter = 0
	},
	add(o) {
		expect(this.id).toBeDefined()
		this.counter += o.amount
	},
}
let helpers = {
	answer() {
		expect(this.id).toBeDefined()
		return 42
	},
}

test('Ext.util.Journal exists?', () => {
	expect(Ext.util.Journal).toBeDefined()
})

test('Journal can be initialized?', () => {
	expect(new Ext.util.Journal(null, {handlers, helpers})).toBeInstanceOf(Ext.util.Journal)
})

test('Events in an empty Journal work', () => {
	let jrn = new Ext.util.Journal(null, {handlers, helpers})

	jrn.writeEntry({type: "init", id: "emptyTest"}, 0)

	expect(jrn.journal).toHaveLength(1)
	expect(jrn.id).toBe("emptyTest")
	expect(jrn.counter).toBe(0)

	jrn.writeEntry({type: "add", amount: 5}, 2000)

	expect(jrn.journal).toHaveLength(2)
	expect(jrn.counter).toBe(5)
	expect(jrn).toHaveProperty('journal.0.type', "init")

	let snap = JSON.parse(JSON.stringify(jrn));

	jrn.applyJournal()

	expect(JSON.parse(JSON.stringify(jrn))).toEqual(snap)
})

test('Can recreate Journal from its inner journal', () => {
	let jrn = new Ext.util.Journal(null, {handlers, helpers})

	jrn.writeEntry({type: "init", id: "emptyTest"}, 0)
	jrn.writeEntry({type: "add", amount: 5}, 2400)
	jrn.writeEntry({type: "add", amount: -2}, 2800)

	let jrn2 = new Ext.util.Journal({journal: jrn.journal}, {handlers, helpers})
	jrn2.applyJournal()

	expect(jrn2).toEqual(jrn)
})
