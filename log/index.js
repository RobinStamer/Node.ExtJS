Ext.ns('Ext.log')

Ext.log.FATAL	= 0x00200000
Ext.log.ERROR	= 0x00100000
Ext.log.WARN	= 0x00080000
Ext.log.INFO	= 0x00000010
Ext.log.DEBUG	= 0x00000001

Ext.log.log	= function(type, src, txt) {}

Ext.log.fatal	= function(src, txt) {
	this.log(this.FATAL, src, txt)
}

Ext.log.error	= function(src, txt) {
	this.log(this.ERROR, src, txt)
}

Ext.log.warn	= function(src, txt) {
	this.log(this.WARN, src, txt)
}

Ext.log.info	= function(src, txt) {
	this.log(this.INFO, src, txt)
}

Ext.log.debug	= function(src, txt) {
	this.log(this.DEBUG, src, txt)
}
