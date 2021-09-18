test('Ext is a function?', () => {
	expect(typeof Ext).toBe('function')
})

test('Ext.apply', () => {
	expect(Ext.apply({a: 1}, {a: 2}, {a: 3})).toEqual({a: 2})
	expect(Ext.apply({}, {a: 2}, {a: 3})).toEqual({a: 2})
	expect(Ext.apply({a: 1}, {}, {a: 3})).toEqual({a: 3})
})
