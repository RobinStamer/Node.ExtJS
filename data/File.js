const	Ext	= require('Ext')('Ext.class')
	,fs	= require('fs')
	
Ext.ns('Ext.data')

class File extends fs.ReadStream {
	constructor(cfg) {
		super(cfg.name)

		this.render = true
	}
}

Ext.reg('file', File)

Ext.data.File = File
