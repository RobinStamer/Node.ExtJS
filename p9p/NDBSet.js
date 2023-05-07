Ext('Ext.p9p')

class NDBSet {
	list	= []
	db	= null
	set	= new Set
	r	= /\s*(([^=]+)=([^"][^\t\r\n\v =]+|"([^"]+)"))\s?/g

	has(key, value) {
		if (!value) {
			if (!this.db) {
				this.weave()
			}

			return !!this.db[key]
		}

		return this.set.has(`${key}=${value}`) || this.set.has(`${key}="${value}"`)
	}

	weave() {
		if (this.db) {
			return this.db
		}

		this.db = {}

		for (var x of this.list) {
			if (this.db[x.key]) {
				this.db[x.key].push(x.value)
			} else {
				this.db[x.key] = [x.value]
			}
		}

		return this.db
	}

	import(str) {
		let m

		while (m = this.r.exec(str)) {
			// m[1] == K=V || K="V"
			// m[2] == K
			// m[3] == V || "V"
			// m[4] == V
			this.set.add(m[1])
			this.list.push({
				key:	m[2]
				,value:	m[4] || m[3]
			})
		}
	}
}

Ext.p9p.NDBSet = NDBSet
