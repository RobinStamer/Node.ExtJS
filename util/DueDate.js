const crypto = require('node:crypto');

/**
 * @class Ext.util.DueDate
 * 
 * Handles due dates, expiry and warning periods.
 * 
 * @constructor
 * @param {Object} config Configuration KV (all times are in milliseconds)
 * - name: the name of the DueDate 
 * - id: the unique id of the DueDate
 * - start: Start date, defaults to return value of Date.now().
 * - expiry: Expiration date, optional if interval is supplied. 
 * - interval: Duration of the period, optional if expiry is supplied. 
 * - warn: Time BEFORE EXPIRY to begin reporting a warning state
 * - flex: if true, .reset() will use a sliding window, rather than a rolling one.
 * - once: if true, .reset() will throw an error.
 */
class DueDate
{
	constructor(config = {})
	{
		Object.freeze(config);

		// Make sure we've been supplied with an interval or an expiry.
		if(!config.expiry && !config.interval)
		{
			throw 'Expiry or interval must be defined.';
		}

		// Make sure we've been supplied with EITHER an interval or an expiry.
		if(config.expiry && config.interval)
		{
			throw 'Either expiry or interval must be defined (not both).';
		}

		// Create the immutable properties
		Object.defineProperty(this, 'config', { value: config });
		Object.defineProperty(this, 'id',     { value: config.id   ?? crypto.randomUUID() });
		Object.defineProperty(this, 'warn',   { value: config.warn ?? null });
		Object.defineProperty(this, 'name',   { value: config.name ?? null });
		Object.defineProperty(this, 'flex',   { value: config.flex ?? null });
		Object.defineProperty(this, 'once',   { value: config.flex ?? null });

		if(config.start)
		{
			Object.defineProperty(this, 'start', { value: config.start });
		}
		else
		{
			Object.defineProperty(this, 'start', { value: Date.now() });
		}
		
		if(config.interval)
		{
			Object.defineProperty(this, 'interval', { value: config.interval });
			this.expiry   = this.start + config.interval;
		}
		else
		{
			Object.defineProperty(this, 'interval', { value: this.expiry - this.start });
		}
	}

	/**
	 * Move the expiration date up by the interval.
	 * @method
	 */
	reset()
	{
		if(this.once)
		{
			throw 'Cannot reset DueDate marked as "once".';
		}

		if(this.flex)
		{
			this.expiry = Date.now() + this.interval;
		}
		else
		{
			this.expiry += this.interval;
		}
	}

	/**
	 * Check if the date has come and passed.
	 * @method
	 * @return {Boolean}
	 */
	isOverdue()
	{
		return Date.now() >= this.expiry;
	}

	
	/**
	 * Check whether or not we're within the warning threshold.
	 * @method
	 * @return {Boolean}
	 */
	isWarning()
	{
		if(this.isOverdue())
		{
			return false;
		}

		return Date.now() >= this.expiry - this.warn;
	}
}

Ext.util.DueDate = DueDate;