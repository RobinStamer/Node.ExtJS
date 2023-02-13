const NOPE = Symbol('NOPE')

class ParamDescriptor {
	/**
	 * @cfg {String} name Name of the parameter
	 */

	/**
	 * @cfg {String} type
	 */

	/**
	 * @cfg {Boolean} optional Flag to indicate that this parameter is not required
	 */

	/**
	 * @cfg {Any} default Default value if parameter is not present
	 */

	/**
	 * @cfg {Regex} regex A regex pattern to check a string value against
	 */

	/**
	 * @cfg {Boolean} regexPass Flag when true will pass return value of regex.exec() instead of provided string
	 */

	/**
	 * @cfg {String} getKey Value to fill from getFunc 
	 */

	/**
	 * @cfg {Function} getFunc Call this function on the user-supplied parameter
	 * Return value of this function is provided to the call handler as this paramater, OR if getKey is provided, return value is provided as getKey
	 */

	/**
	 * @cfg {Number} min Minimum value, error if value is smaller
	 */

	/**
	 * @cfg {Number} max Maximum value, error if value is bigger
	 */

	constructor(cfg) {
		;
	}
}

Ext.util.ParamDescriptor = ParamDescriptor

Ext.reg('paramdesc', Ext.util.ParamDescriptor)
