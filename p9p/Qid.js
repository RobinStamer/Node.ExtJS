Ext('Ext.p9p')

class Qid {
	type
	version
	high
	low

	constructor(b) {
		if (13 != b.length) {
			throw new Error('Expected a 13-byte buffer!')
		}

		this.b	= b

		this.type	= b.readUInt8(0)
		this.version	= b.readUInt32LE(1)
		this.low	= b.readUInt32LE(5)
		this.high	= b.readUInt32LE(9)
	}

	static build(type, version, low, high) {
		var b = Buffer.allocUnsafe(13)

		b.writeUInt8(type)
		b.writeUInt32(version, 1)
		b.writeUInt32(low, 5)
		b.writeUInt32(high, 9)

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
