Ext.apply(Ext.util, {
	restrict: function(o) {
		if (!(o.convert instanceof Function)) {
			o.convert = function(value) { return (o.hasOwnProperty('default')) ? o.default : new o.type(value) }
		}
		if (!(o.check instanceof Function)) {
			o.check = function() { return true }
		}
		return function(value) {
			return (o.check(value) && (!o.type || value instanceof o.type)) ? value : o.convert.call(o.scope || this, value)
		}
	},
	argumentsToArray: function(args, start) {
		return Array.prototype.slice.call(args, start || 0)
	},
	makeFunc: function(o, scope) {
		var args = Ext.util.argumentsToArray(arguments, 1)
		return o.func.bind.apply(o.func, [o.scope || scope].concat(args))
	}
})
