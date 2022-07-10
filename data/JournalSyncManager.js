Ext.ns('Ext.data')

class JournalSyncManager {
	constructor(o) {
		this.db = o
		this.class = this.db.cfg.class

		if (!this.class) {
			throw new Error('JournalSyncManager does not have a class!')
		}
	}

	save() {
		this.db.save && this.db.save()
	}

	emit(...args) {
		this.db.fireEvent(...args)
	}

	genSummary() {
		let sum = []

		this.db.eachKey((k, j) => sum.push({
			id:	k
			,lastEventId:	`${j.journal.length}.${j.journal.at(-1)._id}`
		}))

		this.emit('stage1', sum)

		return sum
	}

	takeSummary(summary, needWhole, needUpdating) {
		for (let jsum of summary) {
			let own = this.db.key(jsum.id)
			if (!own) {
				needWhole.push(jsum.id)
			} else if (!own.journal.map(ev => ev._id).includes(jsum.lastEventId)) {
				needUpdating.push({
					id:     jsum.id
					,events:        own.journal.map(e => e._id)
				})
			}
		}
	}

	stage2(summary) {
		let ourSummary = this.genSummary()
		let needWhole = []
		let needUpdating = []

		this.takeSummary(summary, needWhole, needUpdating)

		this.emit('stage2', ourSummary, needWhole, needUpdating)

		return {summary: ourSummary, needWhole, needUpdating}
	}

	stage3(remote) {
		let needWhole = []
		let needUpdating = []

		this.takeSummary(remote.summary, needWhole, needUpdating)

		let journals = remote.needWhole.map(key => this.db.key(key).journal)
		let updates = []

		for (let upd of remote.needUpdating) {
			let events = this.db.key(upd.id).journal.filter(ev => !upd.events.includes(ev._id))
			updates.push({id: upd.id, events})
		}

		this.emit('stage3', journals, updates, needWhole, needUpdating)

		return {journals, updates, needWhole, needUpdating}
	}

	stage4(next) {
		for (let j of next.journals) {
			this.db.add({id: j[0].id, journal: j})
		}
		for (let upd of next.updates) {
			let own = this.db.key(upd.id)
			own.journal.push(...upd.events)
			own.applyJournal()
			this.db.fireEvent('update', upd.id, own)
		}
		this.save()

		// NOTE: applying updates before the client receives a response is safe
		// If the client does not receive a response, they can restart the sync without issue

		var journals = []
		for (let key of next.needWhole) {
			journals.push(this.db.key(key).journal)
		}

		var updates = []
		for (let upd of next.needUpdating) {
			// TODO: FIXME?  This looks like it might be doing a ton of nested loops
			let events = this.db.key(upd.id).journal.filter(ev => !upd.events.includes(ev._id))
			updates.push({id: upd.id, events})
		}

		this.emit('stage4', journals, updates)

		return {journals, updates}
	}

	stage5(data) {
		this.emit('stage5', data)

		for (let j of data.journals) {
			this.db.add({id: j[0].id, journal: j})
		}
		for (let upd of data.updates) {
			let own = this.db.key(upd.id)
			own.journal.push(...upd.events)
			own.applyJournal()
			this.db.fireEvent('update', upd.id, own)
		}
		this.save()

		this.emit('stage6')
	}

	RPC(def) {
		def.raw = true
		def.func = (function(func, col) {
			return function() {
				func.call(this, col.get(col.getKey(this.rawParams)))
			}
		})(def.func, this.db)

		return def
	}

	stageRPC() {
		var	self = this

		return [{
			name:	'jobs.stage2'
			,raw:	true
			,func:	function() {
				this.response(self.stage2(this.rawParams))
			}
		},{
			name:	'jobs.stage4'
			,raw:	true
			,func:	function() {
				this.response(self.stage4(this.rawParams))
			}
		}]
	}
}

Ext.data.JournalSyncManager = JournalSyncManager
