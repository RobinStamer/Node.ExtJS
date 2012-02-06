Ext('Ext.net.irc.Connection', 'Ext.plugin', 'Ext.util.Observable')

Ext.net.irc.Bot = Ext.extend(Ext.util.Observable, {
	constructor: function(conf) {
		this.conf = conf

		console.log('BOT!')

		for (var k in conf.servers) {
			this[k] = new Ext.net.irc.Connection(Ext.apply({
				nicks: conf.nicks,
				servers: [k]
			}, conf.servers[k]))
		}

		if (conf.plugins) for (var i = 0; i < conf.plugins.length; ++i) {
			Ext.plugin.apply(this, conf.plugins[i])
		}

		Ext.net.irc.Bot.superclass.constructor.call(this, conf)
	}

})

Ext.reg('ircbot', Ext.net.irc.Bot)
