var	Ext	= require('Ext')('Ext.data.Cache'),
	fs	= require('fs'),
	filename= './log.txt'

var c = new Ext.data.Cache({
	maxAge:		6 * 1000, // 6 seconds
	maxSize:	1000
})

c.on('free', function(obj, reason) {
	obj.reason = reason

	//writeDataToDisk(obj.obj, obj.date, obj.reason)
})

c.add('thing')
c.add('foo')
c.add('bar')
c.add('baz')
