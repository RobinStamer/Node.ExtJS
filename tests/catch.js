// Non-test to just list all of the files that are TODO in regards to writing tests for

var Ext = require('Ext')('Ext.p9p', 'Ext.data.JsonStore', 'Ext.data.JsonWriter', 'Ext.data.IC', 'Ext.data.DirCollection', 'Ext.ready', 'Ext.util.-more', 'Ext.util.JSONSerializer', 'Ext.util.CommandLine', 'Ext.util.Format-more', 'Ext.Container', 'Ext.data.MultiFile', 'Ext.data.LinePipe')

test('Yeah....', () => {
	expect(typeof Ext).toBe('function')
})

