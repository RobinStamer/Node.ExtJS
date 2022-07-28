Ext('Ext.p9p')

class Message {
	b
	sz
	type
	tag

	constructor(b) {
		this.b = b

		if (b instanceof Buffer) {
			;
		} else {
			throw new Error(`Expected buffer, recieved: ${typeof b}`)
		}

		if (4 != this.b.length - this.sz) {
			throw new Error(``)
		}

		this.sz	= this.u32(0)
		this.type	= this.u8(4)
		this.tag	= this.u16(5)
	}

	static build(sz, type, tag) {
		// Limit sz to 32 bits
		sz	&= 0xFFFFFFFF
		// Limit type to 8 bits
		type	&= 0xFF
		// Limit tag to 16 bits
		tag	&= 0xFFFF

		this.b = Buffer.alloc(sz + 4)
		this.b.writeUInt32LE(sz)
		this.b.writeUInt8(type, 4)
		this.b.writeUInt16(tag, 5)
	}

	toString() {
		return this.b.toString('hex')
	}

	u8(i) {
		return this.b.readUInt8(i || 0)
	}

	u16(i) {
		return this.b.readUInt16LE(i || 0)
	}

	u32(i) {
		return this.b.readUInt32LE(i || 0)
	}

	i64(i) {
		return this.b.readBigInt64LE(i || 0)
	}

	qid(i) {
		return new Ext.p9p.Qid(this.b.slice(i, i + 13))
	}

	string(i) {
		var r = Buffer.strip16(this.b.slice(i))

		r[0] = new Ext.p9p.String(r[0])

		return r
	}

	static strip16(b) {
		var sz = b.readUInt16LE(0)

		if (2 == b.length - sz) {
			return [b, null]
		} else if (2 < b.length - sz) {
			return [b.slice(0, sz + 2), b.slice(sz + 2)]
		} else {
			return null
		}
	}

	static strip32(b) {
		var sz = b.readUInt32LE(0)

		if (4 == b.length - sz) {
			return [b, null]
		} else if (4 < b.length - sz) {
			return [b.slice(0, sz + 4), b.slice(sz + 4)]
		} else {
			return null
		}
	}
}

Ext.p9p.Message = Message
