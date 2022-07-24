Ext('Ext.http.EventSource').ns('App')

App.types = []
App.es	= new Ext.http.EventSource('http://127.0.0.1:8033/?types=goats,lol,foo')
App.fn = console.dir
App.scope = console

App._fn = function(d) {
	App.fn.call(App.scope, d)
}

App.es.on('goats', App._fn)
App.es.on('lol', App._fn)
App.es.on('foo', App._fn)

