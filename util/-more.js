/**
 * @class Ext
 */
Ext.apply(Ext.util, {
	/**
	 * FIXME: what does this do? Seems to not be used anywhere.
	 * @method Ext.util.restrict
	 * @param o
	 */
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
	/**
	 * Converts an arguments object into an array.
	 * @method Ext.util.argumentsToArray
	 * @param {Arguments} args
	 * @param {Number?} start
	 * @return {Array}
	 */
	argumentsToArray: function(args, start) {
		return Array.prototype.slice.call(args, start || 0)
	},
	/**
	 * Converts an object representing a function into a callable function, possibly with a custom scope and arguments.
	 * @method Ext.util.makeFunc
	 * @param {Object} o
	 * @param {Any} scope
	 * @param {Any*} ...args
	 */
	makeFunc: function(o, scope) {
		var args = Ext.util.argumentsToArray(arguments, 1)
		return o.func.bind.apply(o.func, [o.scope || scope].concat(args))
	}
})
