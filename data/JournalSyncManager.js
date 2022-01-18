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

	genSummary() {
		let sum = []

		this.db.eachKey((k, j) => sum.push({id: k, lastEventId: j.journal.at(-1)._id}))

		return sum
	}

	stage2(summary) {
		let ourSummary = this.genSummary()
		let needWhole = []
		let needUpdating = []

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

		return {summary: ourSummary, needWhole, needUpdating}
	}

	stage3(remote) {
		let needWhole = []
		let needUpdating = []

		for (let jsum of remote.summary) {
			let own = this.db.key(jsum.id)
			if (!own) {
				needWhole.push(jsum.id)
			} else if (!own.journal.map(ev => ev._id).includes(jsum.lastEventId)) {
				needUpdating.push({id: jsum.id, events:own.journal.map(e => e._id)})
			}
		}

		let journals = remote.needWhole.map(key => db.key(key).journal)
		let updates = []

		for (let upd of remote.needUpdating) {
			let events = this.db.key(upd.id).journal.filter(ev => !upd.events.includes(ev._id))
			updates.push({id: upd.id, events})
		}

		return {journals, updates, needWhole, needUpdating}
	}

	stage4(next) {
		for (let j of next.journals) {
			let own = new this.class({journal: j})
			//own.applyJournal() -- constructor already applies for DirCollection to work
			// TODO: maybe error out if we already have this journal
			this.db.add(own)
		}
		for (let upd of next.updates) {
			let own = this.db.key(upd.id)
			for (let ev of upd.events) {
				own.journal.push(ev)
			}
			own.applyJournal()
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
			let events = this.db.key(upd.id).journal.filter(ev => !upd.events.includes(ev._id))
			updates.push({id: upd.id, events})
		}

		return {journals, updates}
	}

	stage5(data) {
		for (let j of data.journals) {
			//console.log("adding journal", j[0].id)
			let own = new this.class({journal: j})
			// own.applyJournal(); -- constructor already applies
			this.db.add(own)
		}
		for (let upd of data.updates) {
			//console.log("updating journal", upd.id)
			let own = this.db.key(upd.id)
			for (let ev of upd.events) {
				own.journal.push(ev)
			}
			own.applyJournal()
		}
		this.save()
	}
}

Ext.data.JournalSyncManager = JournalSyncManager
