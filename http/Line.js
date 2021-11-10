Ext('Ext.http.One', 'Ext.data.LinePipe')

/**
 * @class Ext.http.Line
 * @extends Ext.data.LinePipe
 *
 * LinePipe for a single http(s) URL.
 *
 * @constructor
 * @param {String} s Requested URL
 */

class Line extends Ext.data.LinePipe {
	constructor(s) {
		super({
			input: new Ext.http.One(s)
		})
	}
}

Ext.http.Line = Line
