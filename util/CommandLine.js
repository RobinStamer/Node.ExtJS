Ext.util.CommandLine = Ext.extend(function(options) {
	Ext.apply(this, options)
}, {
	parseLine: function(line) {
		return this.parseWords(line.split(/ /g))
	},
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
	run: function(o) {
		var arg = (o.argv) ? this.parseWords(o.argv, o.obj) : this.parseLine(o.arg, o.obj);

		return this.func.call(o.scope || this, arg)
	}
})
