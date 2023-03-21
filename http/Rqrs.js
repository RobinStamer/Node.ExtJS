Ext('Ext.ComponentMgr', 'Ext.z')

Ext.rq('url', 'querystring')

class Rqrs {
	constructor(...args) {
		if (1 == args.length) {
			Ext.appy(this, args)
		} else if (2 == args.length) {
			this.rq = args[0]
			this.rs = args[1]
		}

		this.url	= `http://null.todo${this.rq.url}`
		this.urlx	= Ext.z.url.parse(this.url)
		this.get	= Ext.z.querystring.parse(this.urlx.query)
	}

	toHttpOptions() {
		if (!this._httpOpt) {
			this._httpOpt = Ext.z.url.parse(this.urlx)

			if (!this._httpOpt.port) {
				switch (this._httpOpt.protocol) {
					case 'http:':
						this._httpOpt.port = 80
						break
					case 'https:':
						this._httpOpt.port = 443
						break
				}
			}
		}

		return this._httpOpt
	}
}

Ext.http.Rqrs = Rqrs
Ext.reg('rqrs', Ext.http.Rqrs)
