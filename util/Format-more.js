Ext('Ext.util.Format')

Ext.apply(Ext.util.Format, {
	pad: function(string, num) {
		string = string === 0 ? '0' : string || ''
		return ' '.repeat(Math.max(num - string.toString().length, 0)) + string
	}

	,rpad: function(string, num) {
		string = string || ''
		return string + ' '.repeat(Math.max(num - string.toString().length, 0))
	}

	,curry: function(string, ...argv) {
		for (var arg of argv) {
			var func = arg.shift()
			
			string = Ext.util.Format[func].apply(string, [string].concat(arg))
		}
		
		return string
	}

	,bar: function(numstr, len, chr) {
		num	= Math.max(0, Math.min(100, numstr - 0)) || 0
		chr	= chr || '='
		len	= Math.max(1, len - 0) || 1
		n	= Math.floor(num * len / 100)

		return chr.repeat(n) + ' '.repeat(len - n)
	}

	,per: function(numstr) {
		num	= Math.max(0, Math.min(100, numstr - 0)) || 0

		return Ext.util.Format.pad(Math.floor(num), 2)
	}
})
