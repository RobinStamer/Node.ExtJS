const	Ext	= require('Ext')('Ext.data.File')

var p = Ext.xcreate({
	xtype:	'multiFile'
	,name:	'process.test.txt'
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
