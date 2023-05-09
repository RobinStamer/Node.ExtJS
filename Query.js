Ext('Ext.CollectionMgr', 'Ext.ready')

let	rAs	= /^(.+)\s+[Aa][Ss]\s+(.+)$/

// TODO: GROUP BY
// TODO: INNER JOIN
// TODO: OUTER JOIN
// TODO: NATURAL JOIN
// TODO: implicit join
// TODO: OFFSET
// TODO: LIMIT
// TODO: output Observable
// TODO: output MixedCollection

function _multiEach(cb, ...cols) {
	if (1 == cols.length) {
		cols[0].each(o => { cb([o, cols[0]]) })
		return
	}

	cols[0].each(o => {
		_multiEach(o2 => {
			cb(o2, [o, cols[0]])
		}, ...cols.slice(1))
	})
}

function multiEach(cb, ...cols) {
	_multiEach(cb, ...cols.sort((a, b) => b.length - a.length))
}

class Query {
	_select
	_from
	_where	= x => true
	_limit	= 0
	_offset	= 0
	_stamp	= Symbol('QueryStamp')

	constructor(cfg) {
		if (Array.isArray(cfg)) {
			this.select(cfg)
			return
		}
	}

	_get() {
		let	cm	= this.colmap = new Map
			,cs	= new Set
			,col

		if (!this._from) {
			throw new Error('Ext.Select().get(): No FROM')
		}

		// FROM
		for (let c of this._from) {
			cm.set(c[1], col = Ext.cget(c[0]))
			cs.add(col)

			if (!col) {
				throw new Error(`Ext.Select().get(): Could not find Collection ${c[1]}`)
			}

			col[this._stamp] = c[1]

			// TODO: error on collision
		}

		let l = []

		multiEach((...set) => {
			let t = {}, r = {}

			for (let x of set) {
				t[x[1][this._stamp]] = x[0]
			}

			for (let x of this._select) {
				let	tbl	= x[0]
					,val	= x[1]
					,key	= x[2]
				
				if (tbl) {
					r[key] = t[tbl][val]
				} else {
					for (let _t of set) {
						let t = _t[0]

						if (t.hasOwnProperty(val)) {
							r[key] = t[val]
							break
						}
						// TODO: handle non-detection
					}
				}
			}

			if (this._where(r)) {
				l.push(r)
			}
		}, ...cs)

		return l
		/*
		return new (Ext.Promise || Promise)((p, f) => {
			let r = []

			multiEach(...set => {
				r.push(set)
			}, ...cs)

			p(r)
		}) //*/
	}

	get() {
		return Ext.readyP().then(this._get, this)
	}

	select(set) {
		this._select = []

		for (let x of set) {
			let	m	= rAs.exec(x)
				,okey	= m ? m[2] : null
				,ikey	= m ? m[1] : x
				,tbl	= null

			// `key`
			// `tbl`.key
			// `tbl`.`key`
			// tbl.`key`

			// key
			// tbl.key
			if (-1 == ikey.indexOf('`')) {
				m = ikey.split('.')

				if (1 == m.length) {
					// Do nothing, variables set correctly
				} else if (2 == m.length) {
					[tbl, ikey] = m
				} else {
					throw new Error(`Ext.Select(): Breakup error on ikey: ${x}`)
				}
			}

			if (okey && '`' == okey[0]) {
				if (!(okey = /^`(.+)`$/.exec(okey)[1])) {
					throw new Error(`Ext.Select(): Parse error on okey: ${x}`)
				}
			}

			// Table, Input Key, Output Key
			this._select.push([tbl, ikey, okey || ikey])
		}

		return this
	}

	from(set) {
		this._from = []

		for (let x of set) {
			let	pair	= x.split(/\s+/)
				,itbl	= x
				,otbl	= null

			// itbl
			// `itbl`
			// itbl otbl
			// `itbl` otbl
			// `itbl` `otbl`
			// itbl `otbl`

			if (1 == pair.length) {
				// Do nothing, variables set correctly
			} else if (2 == pair.length) {
				[itbl, otbl] = pair
			} else {
				throw new Error(`Ext.Select().where(): Breakup error: ${x}`)
			}

			this._from.push([itbl, otbl || itbl])
		}

		return this
	}

	where(fn) {
		if ('function' == typeof fn) {
			this._where = fn
		}

		return this
	}
}

Ext.Select = function querySelect(cfg) {
	return new Query(cfg)
}

Ext.Query = Query
Ext.reg('colquery', Ext.Query)
