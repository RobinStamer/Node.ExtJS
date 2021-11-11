/**
 * @class Ext.util.CommandLine
 * Processes command-line arguments
 *
 * @constructor
 * @param {Object} options
 */
Ext.util.CommandLine = Ext.extend(function(options) {
	Ext.apply(this, options)
}, {
	/**
	 * @cfg {Function} func
	 * Function to call when {@link #run} is called
	 */
	/**
	 * Parses a line of command input. Does not handle strings or escaping.
	 * FIXME: Broken, returns leftover positional args, not parsed opts!
	 * @param {String} line
	 * @return {???}
	 */
	parseLine: function(line) {
		return this.parseWords(line.split(/ /g))
	},
	/**
	 * Parses an array of command line arguments.
	 * FIXME: Broken, returns leftover positional args, not parsed opts, it just throws those away!
	 * @param {String[]} words
	 * @return {???}
	 */
	parseWords: function(words) {
		var opts = {}

		while (words.length && '-' == words[0][0]) {
			var word = words.shift()

			if ('--' == word) {
				// They asked us to stop parsing things as options
				break
			}

			if ('-' == word[1]) {
				opts[word.substr(2)] = ''
			} else {
				for (var i = 1; i < word.length; ++i) {
					opts[word[i]] = true
				}
			}
		}

		return words
	},
	/**
	 * Runs the object's func handler with parsed arguments from o.argv or o.arg.
	 * @param {Object} o
	 * @return {Any}
	 * Returns whatever the handler returns.
	 */
	run: function(o) {
		// FIXME: calls parse methods with two arguments but they only accept one
		var arg = (o.argv) ? this.parseWords(o.argv, o.obj) : this.parseLine(o.arg, o.obj);

		return this.func.call(o.scope || this, arg)
	}
})
