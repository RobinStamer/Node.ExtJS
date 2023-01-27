#!/usr/bin/env ext

Ext('Ext.net.Redis')

var x = new Ext.net.Redis({
	tryJSON: true
})

x.on('test', o => {
	console.dir(o)
})

x.on('!message', (...args) => {
	console.dir(...args)
})

x.sub('test')

x.pub('test', {
	foo: [1, 2, 3]
})
