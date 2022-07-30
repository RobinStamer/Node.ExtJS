Ext('Ext.p9p')

class Qid {
	constructor(b) {
		if ('string' == typeof b) {
			b = Buffer.from(b, 'hex')
		} else if (!(b instanceof Buffer) || 13 != b.length) {
			throw new Error('Expected a 13-byte buffer!')
		}

		this.b	= b
	}

	get type() {
		return this.b.readUInt8()
	}

	get version() {
		return this.b.readUInt32LE(1)
	}

	get low() {
		return this.b.readUInt32LE(5)
	}

	get high() {
		return this.b.readUInt32LE(9)
	}

	toString() {
		return this.b.toString('hex')
	}

	writeTo(b, i) {
		b.writeUInt8(this.type, i || 0)
		b.writeUInt32LE(this.version, (i || 0) + 1)
		b.writeUInt32LE(this.low, (i || 0) + 5)
		b.writeUInt32LE(this.high, (i || 0) + 9)

		return b
	}

	static build(type, version, low, high) {
		var b = Buffer.allocUnsafe(13)

		b.writeUInt8(type)
		b.writeUInt32LE(version, 1)
		b.writeUInt32LE(low, 5)
		b.writeUInt32LE(high, 9)

		return new Qid(b)
	}

	static pull(b, offset = 0) {
		var r = b.length - offset

		if (13 == r) {
			return [new Qid(b), null]
		} else {
			return [new Qid(b.slice(0, 13)), b.slice(13)]
		}
	}
}

Ext.p9p.Qid = Qid
