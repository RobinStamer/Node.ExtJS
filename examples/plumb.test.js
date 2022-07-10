#!/usr/bin/env ext

var	p
	,cp	= require('child_process')
	,sp

//sp	= cp.spawn('9',	['9p', 'read', 'plumb/web'])

p = Ext.xcreate({
	xtype:	'plumbPipe'
//	,input:	sp.stdout
})

p.on('data', function(msg) {
	msg.data = msg.data.toString()
	console.dir(msg)
})

p.write('lol\nweb\n/home/R\ntext\n\n3\none')
p.write('lol\nweb\n/home/R\ntext\n\n3\ntwolol\nweb\n/root\ntext\n\n5\nthree')
p.write('lol\nweb\n/home/R')
p.write('\ntext\n\n')
p.write('4\nfourlol')
p.write('\nweb\n/home/R\ntext\n\n4\nfive')
