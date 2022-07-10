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
