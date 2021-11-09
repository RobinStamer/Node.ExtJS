//[now.getDate(), now.getMonth(), now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()]

/**
 * @class Ext
 */

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
			return s.replace(/^~\//, process.env.HOME + '/')
		}
	}
})())
