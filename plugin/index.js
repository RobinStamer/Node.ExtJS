Ext('Ext.ComponentMgr').ns('Ext.plugin')

Ext.apply(Ext.plugin, {
	apply: function(cmp, plugin, opts) {
		var p

		if (Ext.isObject(plugin)) {
			p = plugin

			if (!p.init && p.ptype) {
				p = Ext.ComponentMgr.createPlugin(p)
			}
		} else if (Ext.isFunction(plugin)) {
			p = new plugin(opts)
		} else if (Ext.isString(plugin)) {
			p = Ext.ComponentMgr.createPlugin(opts || {}, plugin)
		}

		if (!Ext.isArray(cmp.plugins)) {
			cmp.plugins = [p]
		}

		p.init(cmp)

		return p
	}
	,setup: function(cmp) {
		if (!cmp.plugins) {
			if (cmp.cfg.plugins) {
				cmp.plugins = cmp.cfg.plugins

				delete cmp.cfg.plugins
			} else {
				return
			}
		}

		if (Ext.isObject(cmp.plugins)) {
			cmp.plugins = Ext.plugin.apply(cmp, cmp.plugins)
		} else if (Ext.isArray(cmp.plugins)) {
			cmp.plugins = cmp.plugins.map(p => { return Ext.plugin.apply(cmp, p) })
		}
	}
})

Ext.psetup = function(cmp) {
	return Ext.plugin.setup(cmp)
}
