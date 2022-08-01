Ext.ns('Ext.p9p')

Ext.p9p.plumb = function(...args) {
	Ext('Ext.p9p.PlumbMessage')

	// PlumbMessage replaces this function
	Ext.p9p.plumb(...args)
}

Ext.p9p.plumbListen = function(port) {
	return Ext.xcreate({
		xtype:	'plumbPipe'
		,input:	{
			xtype:	'spawn:stdout'
			,cmd:	['9p', 'read', `plumb/${port || 'web'}`]
		}
	})
}

Ext.p9p.getNS = function() {
	var ns = process.env.NAMESPACE || this.getNSfromDisplay()

	return new Promise((p,f) => {
		p(ns)
	})
}

Ext.p9p.getNSfromDisplay = function() {
	var os = Ext.lib.os || require('os'), display = process.env.DISPLAY || ':0'

	return `/tmp/ns.${os.userInfo().username}.${display}`
}
