var Ext = require('Ext')('Ext.ux.MsgBus'), x = {}

var m1 = new Ext.ux.MsgBus({busName: 'Ext.Ext'})
m1.init(Ext)

var m2 = new Ext.ux.MsgBus
m2.init(x)

Ext.subscribe('**')

Ext.Ext.on('message', function() {
	console.log('Ext.Ext:')
	console.dir(arguments)
})

Ext.ux.Bus.on('message', function() {
	console.log('Ext.ux.Bus:')
	console.dir(arguments)
})

x.publish('asdf', 'This is a message!')
Ext.publish('asdf', 'This is another message')
