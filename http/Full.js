Ext('Ext.http.One', 'Ext.data.FullPipe')

/**
 * @class Ext.http.Full
 * @extends Ext.data.FullPipe
 *
 * FullPipe for a single http(s) URL.
 *
 * @constructor
 * @param {String} s Requested URL
 */
class Full extends Ext.data.FullPipe {
	constructor(s) {
		super({
			input: new Ext.http.One(s)
		})
	}
}

Ext.http.Full = Full
