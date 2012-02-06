Ext('Ext.net.LineSocket', 'Ext.net.irc.Message')

Ext.net.irc.Connection = Ext.extend(Ext.net.LineSocket, {
	constructor: function(conf, parent) {
		this.parent = parent
		this.conf = conf

		console.log('IRC!')

		Ext.net.irc.Connection.superclass.constructor.call(this, {
			client: {
				host: conf.servers[0],
				port: 6667
			},
			listeners: {
				line: function(line) {
					var m = new Ext.net.irc.Message(line)
					console.log('L!\t' + m.command.substr(0,3) + '\t' + line)
					this.fireEvent(m.command, m)
				},
				connect: function() {
					console.log('C!')
					this.write('NICK ' + this.conf.nicks[0])
					this.write('USER ' + (this.conf.username || 'extbot') + ' "asd" localhost :' + (this.conf.realname || 'Node.ExtJS IRC Bot'))
				},
				'005': function(m) {
					this.write('JOIN ' + this.conf.channels.join(','))
				},
				PING: function(m) {
					this.write(m.orig.replace('PING', 'PONG'))
				}
			}
		})
	},
	write: function(text) {
		this._socket.write(text + '\r\n')
	},
	notice: function(targets, txt) {
		this.write('NOTICE ' + targets + ' :' + txt)
	},
	say: function(targets, txt) {
		this.write('PRIVMSG ' + targets + ' :' + txt)
	}
})
