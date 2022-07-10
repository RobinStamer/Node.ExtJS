#!/usr/bin/env ext

// TODO: FIXME: this is broken until we impliment our own 9p client
// The 9p program does not like trying to write to plumb/send

Ext('Ext.p9p')

Ext.p9p.plumbListen('web').on('data', function(msg) {
	console.dir(msg)
	process.exit(0)
})

process.nextTick(function() {
	Ext.p9p.plumb({
		dst:	'web'
		,data:	'http://nobl.ca'
	})
})

setTimeout(function() { process.exit(1) }, 10000)
