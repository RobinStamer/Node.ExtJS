const	Ext	= require('Ext')('Ext.class')
	,fs	= require('fs')
	
Ext.ns('Ext.data')

class File extends fs.ReadStream {
	constructor(cfg) {
		super(cfg.name, {
			encoding: cfg.encoding || 'utf8'
		})

		this.render = true
	}
}

Ext.reg('file', File)

Ext.data.File = File
