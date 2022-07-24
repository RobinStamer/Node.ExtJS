#!/usr/bin/env ext

Ext('Ext.http.Line', 'Ext.util.Observable')

/**
 * @class Ext.http.EventSource
 * @extends Ext.util.Observable
 *
 * Processes an EventSource URL.
 *
 * @constructor
 * @param {String} url Requested URL
 */

class EventSource extends Ext.util.Observable {
	constructor(url) {
		super({})

		/**
		 * @event message
		 * Fires for each server-sent event
		 * @param {Object}
		 *   Event object, discriminated by the <code>type</code> property.
		 */
		this.addEvents('message')

		this._o	= {}
		this.connect(url)
	}

	/**
	 * Connect to an EventSource http(s) URL
	 * @param {String} url URL to connect to
	 */
	connect(url) {
		var self = this

		if (url) {
			this._url	= url
		}

		this._l	= new Ext.http.Line(url)

		this._l.on('data', function(line) {
			self._processLine(line)
		})

		this._l.on('close', function() {
			self.close()

			self.connect()
		})
	}

	_processLine(line) {
		var m, key, val

		// Just skip through comments
		if (':' == line[0]) {
			return

		// A blank line means we have the end of an event
		} else if ('' == line.trim()) {
			if (this._o.data) {
				// TODO: toggleable
				try {
					this._o.data = JSON.parse(this._o.data)
				} catch (e) {}
			}

			if (!Object.keys(this._o).length) {
				this._o = {}
				return
			}

			if (!this._o.type) {
				this._o.type = 'message'
			}

			// TODO: toggleable
			if (!this.events[this._o.type]) {
				this.addEvents(this._o.type)
			}

			this.fireEvent(this._o.type, this._o)
			this._o = {}
			return
		}

		m = EventSource.r.exec(line)

		if (m) {
			key	= m[1]
			val	= m[2]
			
			if ('event' == key) {
				key = 'type'
			}

			this._o[key] = val
		}
	}

	/**
	 * Closes the connection.
	 * @method
	 */
	close() {
		if (this._l) {
			this._l.input._input.destroy()
		}
	}
}

EventSource.r = /^([^:]+):\s+(.+)$/

Ext.http.EventSource = EventSource
