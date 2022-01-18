Ext('Ext.util.Journal').ns('Ext.examples')

class JournalTest extends Ext.util.Journal {
	constructor(o) {
		super(o, {
			handlers: {
				add: function(o) { this.num -= -o.n }
				,init:	function() { this.num = 0 }
			}
			,helpers: {}
		})
		this.num = 0
	}
}

Ext.examples.JournalTest = JournalTest
