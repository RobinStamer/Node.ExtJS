Ext('Ext.data.DirCollection')

/**
 * @class Ext.data.NumericDirCollection
 * @extends Ext.data.DirCollection
 *
 * DirCollection with numeric keys.
 * WARNING: Currently broken, don't use!
 *
 * @constructor
 * @param {Object} cfg A config object
 *
 * @xtype numdircol
 */

class NumericDirCollection extends Ext.data.DirCollection {
	constructor(cfg) {
		super(Ext.apply({
			getFilename: (k,o,i)=>i
		}, cfg))
	}
}

Ext.data.NumericDirCollection = NumericDirCollection

Ext.reg('numdircol', Ext.data.NumericDirCollection)
