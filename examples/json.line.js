Ext = require('Ext')('Ext.data.File', 'Ext.data.LinePipe')

r = Ext.create({
	xtype:	'linePipe'
	,input:	{
		xtype:	'file'
		,name:	'test.json'
	}
	,_transform:	JSON.parse
})

r.on('data', function(line) {
	console.dir(line)
})
