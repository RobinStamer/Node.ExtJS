Ext('Ext.util.Observable', 'Ext.Promise').ns('Ext.net')

var	net	= require('net')
	,tls	= require('tls')

class Proxy extends Ext.util.Observable {
	sSrv	= tls.Server
	iSrv	= net.Server
	sCln	= tls.TLSSocket
	iCln	= net.Socket

	constructor(cfg) {
		super()

		this.cfg = Ext.apply(cfg || {}, {
		})

		this.addEvents(
			'client'
		)
	}

	_getPort(port) {
		return Proxy.portMap.get(port.toLowerCase()) || (port - 0)
	}

	_dial(str, obj) {
		var r = 'object' == typeof str ? str : ('object' == typeof obj ? obj : {})

		if ('string' == typeof str) {
			r.dial = str
		}

		r._dialParts = (r.dial || '').split('!')

		if ('ns' == r._dialParts[0]) {
			if (!Ext.p9p || !Ext.p9p.getNS) {
				Ext('Ext.p9p')
			}

			return Ext.p9p.getNS().then(ns => {
				r._dialParts[0] = 'unix'
				r._dialParts[1] = `${ns}/${r._dialParts[1]}`

				r.dial	= r._dialParts.join('!')
				r.path	= r._dialParts[1]

				return r
			})
		} else if ('tcp' == r._dialParts[0]) {
			r.port	= this._getPort(r._dialParts.pop())
			r.host	= r._dialParts.pop()

			if ('*' == r.host) {
				delete r.host
			}
		} else if ('unix' == r._dialParts[0]) {
			r.path = r._dialParts[1]
		}

		return Ext.Promise.resolve(r)
	}

	dial() {
		return (this.dialc
			? Ext.Promise.resolve(this.dialc)
			: this._dial(this.cfg.dial).then(function(cfg) {
				return this.dialc = cfg
			}, this)
		).then(function(cfg) {
			var sock	= cfg.secure ? new this.sCln : new this.iCln
			sock.parent	= this

			return new Ext.Promise((p,f) => {
				sock.connect(cfg, function() {
					p(sock)
				})
			})
		}, this)
	}

	listen() {
		return this._dial(this.cfg.listen).then(cfg => {
			this.srv = cfg.secure ? new this.sSrv(cfg) : new this.iSrv(cfg)
			this.srv.parent = this

			this.dials = cfg

			this.srv.on('connection', function(sock) {
				this.parent.dial().then(function(cln) {
					sock._buddy	= cln
					sock.parent	= cln.parent

					sock.pipe(sock._buddy)
					sock._buddy.pipe(sock)

					sock.parent.fireEvent('client', sock, sock._buddy)
				})
			})

			this.srv.listen(cfg)

			return this.srv
		}, this)
	}
}

Ext.net.Proxy = Proxy

if (Ext.reg)
Ext.reg('netproxy', Ext.net.Proxy)

Proxy.portMap = new Map([
	['9p', 564]
	,['9ps', 1564]
	,['redis', 6379]
	,['irc', 6667]
	,['ircs', 6690]
])

function handleDialString(str, fn, sock, cb) {
	var args = [], parts = str.split('!')

	if ('unix' == parts[0] && 2 == parts.length) {
		args.unshift(parts.pop())
	} else if ('tcp' == parts[0] && 3 == parts.length) {
		args.unshift(parts[1])

		args.unshift(Proxy.portMap.get(parts[2].toLowerCase()) || (parts[0] - 0))
	}

	return args
}

Ext.net.dial = function(str, sock) {
	var args

	if (!sock) {
		sock = new net.Socket
	}

	args = handleDialString(str, 'connect', sock, Ext.emptyFn)

	sock.connect(...args)

	return sock
}

Ext.net.listen = function(str, srv) {
	var args

	if (!srv) {
		srv = new net.Server
	}

	args = handleDialString(str, 'listen', srv, Ext.emptyFn)

	srv.listen(...args)
}
