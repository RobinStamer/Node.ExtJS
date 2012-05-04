Ext('Ext.plugin', 'Ext.XTemplate')

Ext.plugin.TemplateMgr = Ext.extend(function(config) {
	Ext.apply(this, config, {
		Template: Ext.XTemplate
	})
}, {
	init: function(cmp) {
		var tpls = cmp.tpls || this.tpls || ((cmp.runner) ? cmp.runner.tpls : {})
		this.cmp = cmp

		cmp.tpls = cmp.tpls || {}

		for (var k in tpls) {
			if (!tpls.hasOwnProperty(k)) {
				continue
			}

			cmp.tpls[k] = (function(tpl) {
				var f = function(o) {
					return tpl.apply(o)
				}

				f.html = tpl.html

				return f
			})(new this.Template(tpls[k]))
		}
	}
})

Ext.preg('templatemgr', Ext.plugin.TemplateMgr)
