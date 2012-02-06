Ext('Ext.net.irc.Connection', 'Ext.plugin', 'Ext.util.Observable', 'Ext.util.CommandLine')

var	cl	= new Ext.util.CommandLine

Ext.net.irc.Bot = Ext.extend(Ext.util.Observable, {
	constructor: function(conf) {
		this.conf = conf

		for (var k in conf.servers) {
			this.addServer(k, conf.servers[k])
		}

		if (conf.plugins) for (var i = 0; i < conf.plugins.length; ++i) {
			Ext.plugin.apply(this, conf.plugins[i])
		}

		if (conf.listeners) {
			this.listeners = conf.listeners
			delete conf.listeners
			// Hack to make Observable not puke
			this.events = {}
		}

		Ext.net.irc.Bot.superclass.constructor.call(this, conf)
	},
	addServer: function(name, config) {
		var s = this[name] = new Ext.net.irc.Connection(Ext.apply({
			nicks: this.conf.nicks,
			servers: [name]
		}, config))
		var self = this

		s.on({
			PRIVMSG: function(m) {
				self.run(m, this)
			}
		})
	},
	run: function(m, server) {
		if ({'!':1,'*':1,'@':1}[m.argv[0][0]]) {
			var	command	= m.argv[0].substr(1),
				prefix	= m.argv.shift()[0]

			m.bind(server)

			this.fireEvent(command, cl.parseWords(m.argv, m), prefix)
		}
	},
	addListener: function(name, fn, scope, o) {
		if (Ext.isObject(name)) {
			return Ext.net.irc.Bot.superclass.addListener.apply(this, Array.prototype.slice.call(arguments, 0))
		}

		return Ext.net.irc.Bot.superclass.addListener.call(this, name, function(m) {
			try {
				var ret = fn.apply(this, Array.prototype.slice.call(arguments, 0))

				if (Ext.isString(ret) || Ext.isNumber(ret)) {
					m.say(ret)
				} else if (Ext.isArray(ret)) {
					for (var i = 0; i < ret.length; ++i) { m.say(ret[i]) } // TODO: Buffer/queue messages
				}
			} catch (e) {
				console.log(e.message)
				console.log(e.stack)

				m.notice(e.message)
			}
		}, scope, o)
	}
})

Ext.reg('ircbot', Ext.net.irc.Bot)
