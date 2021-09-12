Ext('Ext.http.One', 'Ext.data.FullPipe')

class Full extends Ext.data.FullPipe {
	constructor(s) {
		super({
			input: new Ext.http.One(s)
		})
	}
}

Ext.http.Full = Full
