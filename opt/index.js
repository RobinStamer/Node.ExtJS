Ext.opt = function opt(...args) {
	for (var a of args) {
		Ext(`Ext.opt.${a}`)
	}
}
