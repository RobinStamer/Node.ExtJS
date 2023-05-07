/**
 * @class Ext.log.Log
 * Logging class
 */
class Log {
	/**
	 * @type Number
	 */
	FATAL	= 0x00200000
	/**
	 * @type Number
	 */
	ERROR	= 0x00100000
	/**
	 * @type Number
	 */
	WARN	= 0x00080000
	/**
	 * @type Number
	 */
	INFO	= 0x00000010
	/**
	 * @type Number
	 */
	DEBUG	= 0x00000001
	/**
	 * @type Number
	 */
	PRODUCTION	= ~0 ^ this.DEBUG
	/**
	 * @type Number
	 */
	DEVELOPMENT	= ~0

	/**
	 * @type Number
	 */
	_level	= this.PRODUCTION

	/**
	 * Change the default log level
	 * @param {Number|String} l The log level to set.  Eg: <code>'PRODUCTION'</code>, <code>'DEVELOPMENT'</code>, <code>Ext.log.FATAL | Ext.log.ERROR</code>
	 * @returns {Number} The value set
	 */
	level(l) {
		return this._level = 'string' == typeof l ? this[l.toUpperCase()] : l
	}

	/**
	 * Message log function.  Calls {@link Ext.log.dolog} if the type matches the defined level bitmask (default is 'PRODUCTION', IE: all non-debug messages)
	 * @param {Number} type Message type, eg: Ext.log.FATAL
	 * @param {String} src Message source, eg: 'lighttp'
	 * @param {String} txt Message to log
	 * @returns {Any} Value from this.dolog or `null` if dolog() was not called
	 */
	log(type, src, txt) {
		if (type & this._level) {
			return this.dolog(type, src, txt)
		}

		return null
	}

	/**
	 * Stub function for logging implimentors.  Called by {@link Ext.log.log}.
	 * @param {Number} type
	 * @param {String} src
	 * @param {String} txt
	 * @stub
	 */
	dolog(type, src, txt) {}

	/**
	 * Shortcut function to log a fatal error
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 */
	fatal(src, txt) {
		return this.log(this.FATAL, src, txt)
	}

	/**
	 * Shortcut function to log a standard error
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 */
	error(src, txt) {
		return this.log(this.ERROR, src, txt)
	}

	/**
	 * Shortcut function to log a warning
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 */
	warn(src, txt) {
		return this.log(this.WARN, src, txt)
	}

	/**
	 * Shortcut function to log an informational message
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 */
	info(src, txt) {
		return this.log(this.INFO, src, txt)
	}

	/**
	 * Shortcut function to log a debug message
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 */
	debug(src, txt) {
		return this.log(this.DEBUG, src, txt)
	}
}

Ext.log = new Log
Ext.log.Log = Log
