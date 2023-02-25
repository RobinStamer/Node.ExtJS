
/**
 * @class Ext.log.Log
 * Logging class
 */
class Log {
	FATAL	= 0x00200000
	ERROR	= 0x00100000
	WARN	= 0x00080000
	INFO	= 0x00000010
	DEBUG	= 0x00000001
	PRODUCTION	= ~0 ^ this.DEBUG
	DEVELOPMENT	= ~0

	_level	= this.PRODUCTION

	/**
	 * Change the default log level
	 * @param {Number|String} l The log level to set.  Eg: `'PRODUCTION'`, `'DEVELOPMENT'`, `Ext.log.FATAL | Ext.log.ERROR`
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
	 * @method Ext log log
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
	 * @method Ext log dolog
	 * @stub
	 */
	dolog(type, src, txt) {}

	/**
	 * Shortcut function to log a fatal error
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 * @method Ext log fatal
	 */
	fatal(src, txt) {
		return this.log(this.FATAL, src, txt)
	}

	/**
	 * Shortcut function to log a standard error
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 * @method Ext log error
	 */
	error(src, txt) {
		return this.log(this.ERROR, src, txt)
	}

	/**
	 * Shortcut function to log a warning
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 * @method Ext log warn
	 */
	warn(src, txt) {
		return this.log(this.WARN, src, txt)
	}

	/**
	 * Shortcut function to log an informational message
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 * @method Ext log info
	 */
	info(src, txt) {
		return this.log(this.INFO, src, txt)
	}

	/**
	 * Shortcut function to log a debug message
	 * @param {String} src Message source
	 * @param {String} txt Message body
	 * @returns {Any} Return value from {@link Ext.log.log}
	 * @method Ext log debug
	 */
	debug(src, txt) {
		return this.log(this.DEBUG, src, txt)
	}
}

Ext.log = new Log
Ext.log.Log = Log
