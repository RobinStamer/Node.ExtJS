Ext('Ext.p9p')

class PString extends String {
	constructor(b) {
		var sz

		if ('string' == typeof b || b instanceof String) {
			super(b)

			this.b = Buffer.from(`  ${b}`)
			this.b.writeUInt16LE(sz = this.b.length - 2)
		} else if (b instanceof Buffer) {
			sz = b.readUInt16LE(0)

			if (b.length - sz != 2) {
				throw new Error(`Malformed 9p.String, sz(${sz}) b.length(${b.length})`)
			}

			super(b.slice(2).toString())

			this.b = b
			this.sz = sz
		} else {
			throw new Error(`Expected Buffer or String, got ${typeof b}`)
		}

		if (-1 != this.b.indexOf(0, 2)) {
			throw new Error('9p.String cannot contain a NUL')
		}
	}

	toBuffer() {
		return this.b
	}
}

Ext.p9p.String = PString
