Ext(Ext.lib, 'http', 'url', 'querystring')
Ext('Ext.data.SSE', 'Ext.TaskMgr')

var srv	= new Ext.lib.http.Server
	,types	= ['goats', 'lol', 'foo', 'bar', 'baz']
	,map	= new Map

srv.sse	= new Ext.data.SSE({})

srv.task = {
	interval:	1000 * 3 // 3 seconds
	,run:	function() {
		this.sse.write({
			type: types[Math.floor(Math.random() * types.length)]
		})
	}
	,scope:	srv
}

Ext.TaskMgr.start(srv.task)

srv.listen(8033, '127.0.0.1')
srv.on('request', function(rq, rs) {
	var	o	= Ext.applyIf({rq: true, rs: true}, this.sse.reg(rq, rs))

	process.stdout.write(o.id.toString() + ' ')
	console.dir(o)

	rq.on('close', function() {
		console.log(`${o.id}: CLOSE`)
	})
})
