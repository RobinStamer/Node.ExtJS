
var	ic	= Ext.xcreate({
		xtype:	'IC'
		,file:	Ext.path('~/ic.test.crypto')
		,password:	'blag'
	})

ic.load().then(d => {
	console.dir(ic)

	ic.data.x = (ic.data.x || 0) + 1

	ic.save()
})
