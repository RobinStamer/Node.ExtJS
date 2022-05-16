#!/usr/bin/env ext

var	p
	,cp	= require('child_process')
	,sp

//sp	= cp.spawn('9',	['9p', 'read', 'plumb/web'])

p = Ext.xcreate({
	xtype:	'plumbPipe'
//	,input:	sp.stdout
})

p.on('data', function(data) {
	console.dir(data)
	if (p._bufferStr && false) {
		console.log(p._bufferStr.length)
		console.log(p._bufferStr)
	}
})

p.write('lol\nweb\n/home/R\ntext\n\n3\none')
p.write('lol\nweb\n/home/R\ntext\n\n3\ntwolol\nweb\n/root\ntext\n\n5\nthree')
p.write('lol\nweb\n/home/R')
p.write('\ntext\n\n')
p.write('4\nfivelol')
p.write('\nweb\n/home/R\ntext\n\n3\nsix')
