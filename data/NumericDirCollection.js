Ext('Ext.data.DirCollection')

class NumericDirCollection extends Ext.data.DirCollection {
	constructor(cfg) {
		super(Ext.apply({
			getFilename: (o,i)=>i
		}, cfg))
	}
}

Ext.data.NumericDirCollection = NumericDirCollection

Ext.reg('numdircol', Ext.data.NumericDirCollection)
