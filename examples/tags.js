Ext('Ext.data.Tag')

var mc	= new Ext.util.MixedCollection
	,tag	= new Ext.data.Tag({col: mc})
	,data

data = [
	'abdc'
	,'dca'
	,'egv'
	,'lop'
	,'asdf'
	,'msoe'
	,'bals'
	,'osdl'
]

for (var d of data) {
	mc.add({
		id:	mc.length
		,tags:	d.split('')
	})
}

console.dir(tag.search('l'))

console.dir(tag.search('d'))

console.dir(tag.search('a', 'b'))

console.dir(tag.search('-c'))
