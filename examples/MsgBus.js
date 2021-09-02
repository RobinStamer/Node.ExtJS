var Ext = require('Ext')('Ext.ux.MsgBus'), x = {}

var m1 = new Ext.ux.MsgBus({busName: 'Ext.Ext'})
m1.init(Ext)

var m2 = new Ext.ux.MsgBus
m2.init(x)

Ext.subscribe('**')

Ext.Ext.on('message', function(...args) {
	console.log('Ext.Ext:')
	console.dir(args)
})

Ext.ux.Bus.on('message', function(...args) {
	console.log('Ext.ux.Bus:')
	console.dir(args)
})

x.publish('asdf', 'This is a message!')
Ext.publish('asdf', 'This is another message')
