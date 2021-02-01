var	http	= require('http')
	,https	= require('https')
	,qs	= require('querystring')

Ext('Ext.class').ns('Ext.api')

var _convert = {
	json: (cb)=>{ return (d)=>{ try { cb(null, JSON.parse(d)) } catch (e) { cb({e: e, raw: d}) } } }
	,raw: (cb)=>{ return (d)=>{ return cb(d) } }
}

class Rest {
	constructor(obj) {
		this.cfg = Ext.apply({}, obj)

		delete this.cfg.xtype
	}

	_merge(_o, method) {
		var	o	= _o ? Ext.apply({}, _o, this.cfg) : Ext.apply({}, this.cfg)
			,p	= Ext.apply({}, o.query || {}, this.cfg.query || {})
			,s	= qs.stringify(p)

		o.method = method

		delete o.query

		o.path = (o.path || this.cfg.path || '/') + (s ? `?${s}` : '')
		return o
	}

	_request(_o, method, _cb) {
		var o	= this._merge(_o, method)
			,cb	= _cb || (()=>{})
			,H	= o.secure ? https : http
			,self	= this

		delete o.secure

		return H.request(o, (res) => {
			Ext.xcreate({
				xtype: 'fullPipe'
				,input: res
			}).on('data', (_convert[self.cfg.type]||_convert.raw)(cb))
		})
	}

	_post(_o, data, _m, _cb) {
		var o	= (o=>{
				o.headers = o.headers || {}
				o.headers['Content-Length'] = Buffer.byteLength(data)

				return _m(o)
			})(Ext.apply({}, _o || {}))
			,req	= this._request(o, 'POST', _cb)

		req.write(data)

		return req.end()
	}

	get(_o, _cb) {
		// Rely on chaining to return req
		return this._request(_o, 'GET', _cb).end()
	}

	post(_o, data, _cb) {
		return this._post(_o, qs.stringify(data || {}), o=>{
			o.headers['Content-Type'] = 'application/x-www-form-urlencoded'

			return o
		}, _cb)
	}

	postJson(_o, data, _cb) {
		return this._post(_o, JSON.stringify(data || {}), o=>o, _cb)
	}
}

Ext.api.Rest = Rest

Ext.reg('rest', Ext.api.Rest)
