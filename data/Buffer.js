var Ext = require('Ext')

Ext.ns('Ext.data')

/**
 * @class Ext.data.Buffer
 * Accepts Buffer data from a stream and converts it to String.
 *
 * @constructor
 * @param {Stream?} o Object to attach data listeners to
 */
class Buffer {
	constructor(o) {
		if (o) {
			this.apply(o)
		}

		/**
		 * String encoding to use when reading buffers.
		 * @property
		 * @type String
		 */
		this.encoding = 'utf8'
		/**
		 * Data which was read from the stream.
		 * @property
		 * @type String
		 */
		this.buffer = ''
	}

	/**
	 * Attaches itself to data listeners on the given object.
	 * @param {Stream} o Object on which to listen for data
	 */
	apply(o) {
		const self = this

		o.on('data', function(data) { self.input(data) })
		o.on('end', function() { self.hook(self.buffer) })
	}

	/**
	 * Appends data to internal buffer. May be used manually if a stream is not attached.
	 * @param {Buffer} data
	 */
	input(data) {
		this.buffer += data.toString(this.encoding)
	}

	/**
	 * Called after fully reading the data.
	 * You may override this with a callback.
	 * @param {String} data
	 */
	hook() {
		return this.buffer
	}
}

Ext.data.Buffer = Buffer
