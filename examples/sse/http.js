Ext(Ext.lib, 'http', 'url', 'querystring')
Ext('Ext.data.SSE', 'Ext.TaskMgr')

var srv	= new Ext.lib.http.Server
	,types	= ['goats', 'lol', 'foo', 'bar', 'baz']
	,map	= new Map
	,count	= 5

srv.sse	= new Ext.data.SSE({})

srv.sse.removeRandom = function() {
	var x = this.mc.get(Math.floor(Math.random() * this.mc.length))

	console.log(`NUKE! ${x.id}`)

	x.rs.end()

	this.remove(x.id)
}

srv.sse.on('data', function(d) {
	console.dir(d)
})

srv.task = {
	interval:	1000 * 3 // 3 seconds
	,run:	function() {
		this.sse.write({
			type: types[Math.floor(Math.random() * types.length)]
			,data:	count.toString()
		})

		if (this.sse.map.size) {
			if (!count) {
				count = 5
				this.sse.removeRandom()
			}
			count--
		}
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
