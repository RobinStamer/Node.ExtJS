const	Ext	= require('Ext')('Ext.class')
	,stream	= require('stream')

Ext.ns('Ext.data')

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

		// Safari and others bug
		out.write(':ok\n\n')

		return super.pipe(out, options)
	}

	_transform(message, encoding, done) {
		if (message.comment) this.push(`: ${message.comment}\n`)
		if (message.type) this.push(`event: ${message.type}\n`)
		if (message.id) this.push(`id: ${message.id}\n`)
		if (message.retry) this.push(`retry: ${message.retry}\n`)
		if (message.data) {
			if ('object' == typeof message.data) {
				message.data = JSON.stringify(message.data)
			}
			this.push(message.data.split(/\n\r|\r\n/).map(line => `data: ${line}\n`).join(''))
		}
		this.push('\n')
		done()
	}
}

Ext.reg('SSE', SSE)

Ext.data.SSE = SSE
