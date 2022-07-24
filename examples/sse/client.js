Ext('Ext.http.EventSource').ns('App')

App.types = Ext.argv.length ? Ext.argv : ['goats', 'lol', 'foo']
App.es	= new Ext.http.EventSource('http://127.0.0.1:8033/?types=' + App.types.join(','))
App.fn = console.dir
App.scope = console

App._fn = function(d) {
	App.fn.call(App.scope, d)
}

App.es.on('goats', App._fn)
App.es.on('lol', App._fn)
App.es.on('foo', App._fn)

App.es.on(':id', function(id) {
	console.dir(id)
})

App.es.on(':reconnect', function() {
	console.log('RECONNECT')
	console.log(App.es._url)
})

