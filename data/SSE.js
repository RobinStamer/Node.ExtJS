const	Ext	= require('Ext')('Ext.class', 'Ext.util.MixedCollection', 'Ext.util.TagManager')
	,stream	= require('stream')

Ext.ns('Ext.data')

Ext(Ext.lib, 'url', 'querystring')

/**
 * @class Ext.data.SSE
 * @extends stream.Transform
 *
 * Implementation of server-sent events as a Stream.
 *
 * @constructor
 * @param {Object} cfg
 *
 * @xtype SSE
 */

class SSE extends stream.Transform {
	/**
	 * @cfg {WritableStream} output Output to write events to
	 */

	/**
	 * @cfg {String} id Component ID to use
	 */
	constructor(cfg) {
		super({objectMode: true})

		this.render	= true
		this.mc	= new Ext.util.MixedCollection
		this.map	= new Map
		this.tag	= new Ext.util.TagManager({collection: this.mc, returns: 'objects'})

		if (cfg.output) {
			if (!this.output.write) {
				this.output = Ext.xcreate(cfg.output)
			}
			this.pipe(this.output)
		}

		if (cfg.hasOwnProperty('id') && Ext.ComponentMgr) {
			this.id = cfg.id
			Ext.ComponentMgr.register(this)
		}
	}

	onData(d) {
		var	s	= this.tag.search('*')

		for (var o of s) {
			o.rs.write(d.txt)
		}

		s = this.tag.search(d.msg.type)

		for (var o of s) {
			o.rs.write(d.txt)
		}
	}

	reg(rq, rs) {
		var	o	= {id: Ext.id(null, 'SSE:')}
			,url	= Ext.lib.url.parse(rq.url)
			,query	= url.query ? Ext.lib.querystring.parse(url.query) : {}
			,self	= this

		o.types = query.types ? query.types.split(',') : []
		o.rq	= rq
		o.rs	= rs
		o.tags	= new Set(o.types)
		o.query	= query

		this.mc.add(o)
		this.map.set(rq, o)
		this.map.set(rs, o)

		this.pipe(rs)

		rq.on('close', function() {
			var	 o	= self.map.get(this)
			self.map.delete(o.rq)
			self.map.delete(o.rs)
		})

		return o
	}

	pipe(out, options) {
		if (out.writeHead) {
			out.writeHead(200, {
				'Content-Type': 'text/event-stream; charset=utf-8'
				,'Transfer-Encoding': 'identity'
				,'Cache-Control': 'no-cache'
				,'Connection': 'keep-alive'
			})
			out.flushHeaders()
		}

		var o = this.map.get(out)

		// Safari and others bug
		out.write(`:ok\n\nevent: :id\ndata: ${o.id}\n\n`)

		return super.pipe(out, options)
	}

	_transform(message, encoding, done) {
		var	arr	= []

		if (message.comment) arr.push(`: ${message.comment}\n`)
		if (message.type) arr.push(`event: ${message.type}\n`)
		if (message.id) arr.push(`id: ${message.id}\n`)
		if (message.retry) arr.push(`retry: ${message.retry}\n`)
		if (message.data) {
			if ('object' == typeof message.data) {
				message.data = JSON.stringify(message.data)
			}
			arr.push(message.data.split(/\n\r|\r\n/).map(line => `data: ${line}\n`).join(''))
		}
		arr.push('\n')

		this.onData({
			msg:	message
			,txt:	arr.join('')
		})
		done()
	}
}

Ext.data.SSE = SSE

Ext.reg('SSE', Ext.data.SSE)
