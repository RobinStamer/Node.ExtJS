Ext('Ext.util.Spawn')

var stream = Ext.xcreate({
	xtype: 'spawn:pipe'
	,cmd: ['grep', '-v', 'foo']
})

stream.on('data', function(d) {
	console.log(d.toString())
})

stream.s.stdout.on('data', function(d) {
	console.log(d)
})

stream.write('foo\nbar\nbaz\nfoobar')
stream.end()
