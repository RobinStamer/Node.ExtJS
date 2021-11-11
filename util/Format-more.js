Ext('Ext.util.Format')

/**
 * @class Ext.util.Format
 */
Ext.apply(Ext.util.Format, {
	/**
	 * Left-pads the string to a given length with a given character.
	 * @param {String} string
	 * @param {Number} num
	 * @param {String} c
	 * @return {String}
	 */
	pad: function(string, num, c) {
		string = string === 0 ? '0' : string || ''
		c = 0 === c ? '0' : (c || ' ').toString()[0]
		return c.repeat(Math.max(num - string.toString().length, 0)) + string
	}

	/**
	 * Right-pads the string to a given length with a given character.
	 * @param {String} string
	 * @param {Number} num
	 * @param {String} c
	 * @return {String}
	 */
	,rpad: function(string, num, c) {
		// XXX: Why does this method convert string and c .toString, while .pad() doesn't?
		try {
			string = string.toString()
		} catch (e) {
			string = ''
		}
		c = 0 === c ? '0' : (c || ' ').toString()[0]
		return string + c.repeat(Math.max(num - string.toString().length, 0))
	}

	/**
	 * Applies a pipeline of format methods to a string.
	 * The first item of each array is a Format function name
	 * <p>Example usage:</p>
	 * <pre><code>
	 * Ext.util.Format.curry("  123.45678 ",
	 *   ["trim"],
	 *   ["round", 2]
	 *   ["pad", 10, ' '])
	 * // returns "0000123.46"
	 * </code></pre>
	 * @param {Mixed} string
	 * @param {Any[]*} ...argv
	 * @return {String}
	 */
	,curry: function(string, ...argv) {
		for (var arg of argv) {
			var func = arg.shift()
			
			string = Ext.util.Format[func].apply(string, [string].concat(arg))
		}
		
		return string
	}

	/**
	 * Returns a progress bar filled to a given percentage.
	 * @param {Number|String} numstr Fill percentage
	 * @param {Number|String} len Total length of the progress bar, in characters
	 * @param {String} chr 'filled' character
	 * @return {String}
	 */
	,bar: function(numstr, len, chr) {
		num	= Math.max(0, Math.min(100, numstr - 0)) || 0
		chr	= chr || '='
		len	= Math.max(1, len - 0) || 1
		n	= Math.floor(num * len / 100)

		return chr.repeat(n) + ' '.repeat(len - n)
	}

	/**
	 * Formats a percentage value.
	 * @param {Number|String} number Percentage
	 * @return {String} Percentage, padded to 2 characters
	 */
	,per: function(numstr) {
		num	= Math.max(0, Math.min(100, numstr - 0)) || 0

		return Ext.util.Format.pad(Math.floor(num), 2)
	}
})
