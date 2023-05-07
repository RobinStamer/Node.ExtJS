Ext('Ext.ComponentMgr', 'Ext.z').ns('Ext.http')

Ext.rq('url', 'querystring')

class Url {
	constructor(cfg) {
		this.url	= 'string' == typeof cfg ? cfg : cfg.url
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

Ext.http.Url = Url
Ext.reg('url', Ext.http.Url)
