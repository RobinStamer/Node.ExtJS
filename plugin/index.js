Ext('Ext.ComponentMgr').ns('Ext.plugin')

Ext.plugin.apply = function(cmp, plugin, opts) {
	var p;
	if (Ext.isObject(plugin)) {
		p = plugin
	} else if (Ext.isFunction(plugin)) {
		p = new plugin(opts)
	} else if (Ext.isString(plugin)) {
		p = Ext.ComponentMgr.createPlugin(opts || {}, plugin)
	}

	if (!Ext.isArray(cmp.plugins)) {
		cmp.plugins = []
	}
	cmp.plugins.push(p)

	p.init(cmp)
}
