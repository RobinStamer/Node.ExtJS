Ext('Ext.ComponentMgr').ns('Ext.plugin')

/*
 * @class Ext.plugin
 *
 *
 *
 */
Ext.apply(Ext.plugin, {
	/**
	 * Initialize a single component onto a component, append the plugin to the component's plugin list
	 * @param {Component} cmp Component to have all the plugins initialized
	 * @param {Object|String} plugin Plugin to initialize
	 * @param {Configuration?} opts Configuration for plugin if plugin is unitialized
	 */
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

		if (!cmp.plugins.includes(p)) {
			cmp.plugins.push(p)
		}

		return p
	}
	/**
	 * Initialize all plugins in a component
	 * @param {Component} cmp Component to have all the plugins initialized
	 */
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

/**
 * Initialize all plugins in a component
 * Alias for {@link Ext.plugin.setup}
 * @param {Component} cmp Component to have all the plugins initialized
 * @method Ext psetup
 */
Ext.psetup = function(cmp) {
	return Ext.plugin.setup(cmp)
}
