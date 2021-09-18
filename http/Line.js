Ext('Ext.http.One', 'Ext.data.LinePipe')

class Line extends Ext.data.LinePipe {
	constructor(s) {
		super({
			input: new Ext.http.One(s)
		})
	}
}

Ext.http.Line = Line
