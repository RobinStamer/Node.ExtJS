Ext('Ext.p9p')

class Message {
	b

	constructor(b) {
		this.b = b
		
		if ('string' == typeof b) {
			this.b = Buffer.from(b, 'hex')
		} else if (b instanceof Buffer) {
			;
		} else {
			throw new Error(`Expected buffer, recieved: ${typeof b}`)
		}

		if (0 != this.b.length - this.sz) {
			throw new Error(`Buffer and size mismatch (${this.b.length}, ${this.sz})`)
		}
	}

	get sz() {
		return this.u32(0)
	}

	get type() {
		return this.u8(4)
	}

	get tag() {
		return this.u16(5)
	}

	static build(sz, type, tag) {
		// Limit sz to 32 bits
		sz	+= 7
		sz	&= 0xFFFFFFFF
		// Limit type to 8 bits
		type	&= 0xFF
		// Limit tag to 16 bits
		tag	&= 0xFFFF

		var	b	= Buffer.alloc(sz)

		b.writeUInt32LE(sz)
		b.writeUInt8(type, 4)
		b.writeUInt16LE(tag, 5)

		return new Message(b)
	}
	
	static buildVersion(str = '9P2000') {
		var	b	= Message.build(str.length + 2, 101, 0xFFFF)

		b.writeString(str)

		return b
	}
	
	static buildError(tag, str) {
		var	b	= Message.build(str.length + 2, 107, tag)

		b.writeString(str)

		return b
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
	
	writeString(str, i) {
		str = str.toString()
		
		this.b.writeUInt16LE(str.length, (i || 0) + 7)
		this.b.utf8Write(str, (i || 0) + 9)
	}
	
	writeQid(qid, i) {
		qid.writeTo(this.b, (i || 0) + 7)
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
