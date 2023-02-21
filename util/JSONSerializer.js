Ext('Ext.util.Serializer')

class JSONSerializer extends Ext.util.Serializer {
	space	= null
	key	= '__EXT_JS_SERIALIZED'
	scope	= null

	constructor(o) {
		super(o)

		// JSON.* functions do not apply our scope
		this.pack	= (...args) => { return this._pack(...args) }
		this.unpack	= (...args) => { return this._unpack(...args) }
	}

	encode(o) {
		return JSON.stringify(o, this.pack, this.space)
	}

	decode(s) {
		return JSON.parse(s, this.unpack)
	}

	_pack(k, v) {
		return (v instanceof Set) ? [this.key, 'Set', ...v] : v
	}

	_unpack(k, v) {
		if (Array.isArray(v) && this.key == v[0] && 'Set' == v[1]) {
			return new Set(v.slice(2))
		}

		return v
	}
}

Ext.util.JSONSerializer = JSONSerializer
