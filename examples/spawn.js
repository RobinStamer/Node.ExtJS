Ext('Ext.+')

Ext.xcreate({
	xtype: 'linePipe'
	,input: {
		xtype:	'spawn:stdout'
		,cmd:	['bash', '-c', 'xxd /dev/urandom | head']
	}
}).on('data', function(line) {
	console.dir({
		index:	Ext.id()
		,time: new Date - 0
		,line: line
	})
})
