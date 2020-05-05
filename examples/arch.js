const	Ext	= require('Ext')('Ext.data.File')

var p = Ext.xcreate({
	xtype:	'archFile'
	,name:	'arch.file.txt'
})

p.on('set', function(key, data) {
	console.log(`KEY: ${key}`)

	console.dir(data)
	console.log('')
})

p.on('finish', function() {
	console.dir(p.getData())
})
