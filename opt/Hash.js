Ext('Ext.opt', 'Ext.z', 'Ext.Promise')

Ext.rq('crypto')

const hashmap = {
	blake:	'BLAKE2b512'
	,blake512:	'BLAKE2b512'
	,blake256:	'BLAKE2s256'
}

class Hash {
	static stamp(hash, pipe, _o) {
		let o = _o || Object.create(null)

		if (Ext.isArray(hash) || Array.isArray(hash)) {
			return Ext.Promise.all(hash.map(s => this.stamp(s, pipe, o))).then(() => {
				return o
			})
		}

		return this.spout(hash, pipe).then((h) => {
			o[hash] = h

			return o
		})
	}

	static spout(hash, pipe) {
		if ('string' == typeof pipe) {
			return this.spout(hash, [pipe])
		}

		if (Ext.isArray(pipe) || Array.isArray(pipe)) {
			return this.spout(hash, (Ext.rq('stream'), Ext.z.stream.Readable.from(pipe)))
		}

		let	h	= this.hash(hash)

		return new Ext.Promise((p, f) => {
			pipe.on('data', function(data) {
				h.update(data)
			})

			pipe.once('end', function() {
				p(h.digest('hex'))
			})

			pipe.once('error', f)
		})
	}

	/**
	 * Return a hash
	 *
	 * @param {String} hash The hash algo to use.  Values of 'size' and 'length' will return a psuedo-hash.
	 * @return {Hash} Hasher object with update(data), and digest(strType) functions
	 */
	static hash(hash) {
		if ({length: 1, size: 1}[hash]) {
			return {
				x: 0
				,update(d) {
					this.x += d.length
				}
				,digest() {
					return this.x.toString()
				}
			}
		}

		return Ext.z.crypto.createHash(hashmap[hash] || hash)
	}
}

Ext.opt.Hash = Hash
