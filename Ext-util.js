//[now.getDate(), now.getMonth(), now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()]

/**
 * @class Ext
 */

const	HOME	= process.env.HOME
	,path	= require('path')

Ext.apply(Ext, (function() {
	return {
		/**
		 * Pads a string to a certain length
		 * @param {String} str	Input value to pad 
		 * @param {String} char	Character or other pattern to pad with
		 * @param {Number} length	Expected output length of the final string
		 * @return {String} Padded str
		 */
		pad: function pad(s, c, l) /* string s input, char c padding, num l length */ {
			return (c.repeat(l) + s).substr(-l)
		}
		/**
		 * Converts a path that may be relative to a home directory into one that may be used.
		 * @param {String} path
		 * @return {String} Converted path
		 */
		,path: function path(s) {
			return '~' == s ? HOME : s.replace(/^~\//, HOME + '/')
		}
		/**
		 * Reverses Ext.path(), turns an absolute directory into one prefixed with ~ if it's in the user's home
		 * @param {String} path
		 * @param {Boolean} absolute If true, add current working directory to the path before checking
		 * @return {String} Converted path
		 */
		,unpath: function unpath(s, a) {
			if (a && !path.isAbsolute(s)) {
				s = path.join(process.cwd(), s)
			}

			return s.slice(0, HOME.length) == HOME ? `~${s.slice(HOME.length)}` : s
		}
		/**
		 * Return a new UUID
		 * @return {String} The UUID
		 */
		,getUUID() {
			try {
				return Ext.ux.UUID()
			} catch (e) {
				// Yep, totally the correct way to handle this
				Ext('Ext.ux.UUID')
				return Ext.ux.UUID()
			}
		}
		/**
		 * Joins a set of keys with a set of values
		 * @param {Array|Set} keys The keys
		 * @param {Array|Set} values The values
		 * @return {Object} The bound object
		 */
		,bind(keys, values) {
			var len = Math.min(keys.length, values.length), r = {}

			for (var i = 0; i < len; ++i) {
				if (keys[i]) {
					r[keys[i]] = values[i]
				}
			}

			return r
		}
		/**
		 * Returns a promise that resolves with value (if provided) after a given number of milliseconds.
		 * Note: You can pass a rejected Promise as value to delay a promise rejection.
		 * @param {Number} ms Number of milliseconds to wait
		 * @param {Any?} value The delayed value
		 */
		,delayed(ms, value) {
			return new Promise(res => setTimeout(() => res(value), ms))
		}
		/**
		 * Returns a promise that resolves when the stream finishes, or rejects if an error occurs.
		 * Note: For writable streams you might want to use 'finish' as the success event.
		 * @param {Stream} stream The stream
		 * @param {String?} successEvent Name of the successful event, 'end' by default
		 * @param {String?} errorEvent Name of the error event, 'error' by default
		 */
		,promisifyStream(stream, successEvent='end', errorEvent='error') {
			return new Promise((res, rej) => {
				stream.once(successEvent, () => res())
				stream.once(errorEvent, err => rej(err))
			})
		}
	}
})())
