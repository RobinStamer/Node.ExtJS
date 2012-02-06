//{"prefix":"Ling!~rstamer@genoce.org","command":"PRIVMSG","arguments":[":level"],"lastarg":null,"orig":":Ling!~rstamer@genoce.org PRIVMSG #genoce :level"}
//:zoklet.slashnet.org 353 GenoceBot = #genoce :GenoceBot jace @Ling
//:zoklet.slashnet.org 366 GenoceBot #genoce :End of /NAMES list.

Ext('Ext.net.irc')

var r = /^([^!]+)!([^@]+)@(.+)$/

Ext.net.irc.Message = Ext.extend(function(str) {
	this.orig = str
	this.argv = str.split(' ')

	if (':' == this.argv[0][0]) {
		this.prefix = this.argv.shift().substr(1)

		this.user = r.exec(this.prefix)

		if (!this.user) {
			this.server = this.prefix
		}
	}

	this.command = this.argv.shift().toUpperCase()

	if (this.command in {PRIVMSG: 1, NOTICE: 1}) {
		this.chan = this.argv.shift()
	} else if (this.command in {353:1}) {
		this.argv.shift()
		this.argv.shift()

		this.chan = this.argv.shift()
		this.argv[0] = this.argv[0].substr(1)
	}

	if (this.argv.length > 0 && ':' == this.argv[0][0]) {
		this.argv[0] = this.argv[0].substr(1)
	}

	this.__defineGetter__('arg', function() {
		return this.argv.join(' ')
	})
	this.__defineSetter__('arg', function() {})
}, {

	bind: function(sock) {
		this.sock = sock;
	},

	notice: function(msg, chan) {
		this.sock.notice(chan || this.chan, msg)
	},

	say: function(msg, chan) {
		this.sock.say(chan || this.chan, msg)
	},

	act: function(msg, chan) {
		this.sock.act(chan || this.chan, msg)
	}
})
