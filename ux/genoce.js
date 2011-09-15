var	isExtRegex	= /^Ext/;

function _load(o, module) {
	var source, dest;

	if (Ext.isString(module)) {
		source = dest = module
	} else {
		source = module.module
		dest = module.alias || module.module
	}

	if (isExtRegex.test(source)) {
		source = source.replace(/\./g, '/')
	}

	o[dest] = require(source)
}

this.load = function(Ext) {
	Ext.ux.load = function() {
		var	i	= 1,
				o	= (!Ext.isString(arguments[0]) && Ext.isObject(arguments[0])) ? arguments[0] : (i = 0, {});
		for (; i < arguments.length; ++i) {
			_load(o || {}, arguments[i])
		}
		return Ext
	}

	Ext.load = Ext.ux.load
}
