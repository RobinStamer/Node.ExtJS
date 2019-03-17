const	Ext	= require('Ext')('Ext.data.MultiFile', 'Ext.data.LinePipe', 'Ext.data.File')

var p = Ext.create({
	xtype:	'multiFile'
	,name:	'process.test.txt'
	/*
	,input:	{
		xtype:	'linePipe'
		,input:	{
			xtype:	'file'
			,name:	'process.test.txt'
		}
	}
	//*/
})

p.on('set', function(key, meta, data) {
	console.log(`KEY: ${key}`)

	console.dir(meta)
	console.log('')
	console.dir(data)
	console.log('')
})

p.on('finish', function() {
	console.dir(p.getData())
})
