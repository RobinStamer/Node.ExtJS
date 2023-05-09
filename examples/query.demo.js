#!/usr/bin/env ext

Ext('Ext.Query', 'Ext.Promise')

Ext.xcreate({
	xtype:	'mcol'
	,id:	'foo'
}).addAll([
	 {id: 'one', foo: 'wut'}
	,{id: 'two', foo: 'butt'}
])

Ext.xcreate({
	xtype:	'mcol'
	,id:	'bar'
}).addAll([
	 {id: 'three', bar: 'with', baz: 'choke'}
	,{id: 'four', bar: 'bear', baz: 'goat'}
	,{id: 'five', bar: 'monkey', baz: 'puter'}
	,{id: 'two', bar: 'donkey', baz: 'car'}
])

var s = Ext.Select(['foo', 'f.bar', 'f.baz as lol', 'foo.id as fooid', 'f.id as fid']).from(['foo', 'bar f'])

s.where(o => {
	return o.fooid == o.fid
})

console.dir(s)

s.get().then(x => {
	console.dir(x)
})
