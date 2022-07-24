var	fs	= require('fs')

Ext('Ext.data.Pipe')

class GamePipe extends Ext.data.Pipe {
	constructor(cfg) {
		if ('number' == typeof cfg.input) {
			cfg.input = `/dev/input/js${cfg.input}`
		}

		if ('string' == typeof cfg.input) {
			// Use this instead of xtype file so input isn't duplicated
			cfg.input = new fs.ReadStream(cfg.input)
		}

		super(cfg)

		if (cfg.input) {
			Ext.data.Pipe.pipe(this)
		}

		this.buttons = 0
	}

	_transform(chunk, enc, done) {
		var b = this.hold ? Buffer.concat([this.hold, chunk]) : chunk

		console.log(b.length)

		delete this.hold

		while (b.length >= 8) {
			var ev = {
				// u32 Time ; s16 value ; u8 type ; u8 number
				number:	b.readUInt8(7)
				,time:	b.readUInt32LE(0)
				,value:	b.readInt16LE(4)
				,type:	b.readUInt8(6)
			}

			ev.isButton	= !!(ev.type & 0x01)
			ev.isAxis	= !!(ev.type & 0x02)
			ev.isInit	= !!(ev.type & 0x80)

			if (ev.isButton && 53 > ev.number) {
				if (ev.value) {
					this.buttons |= 1 << ev.number
				} else {
					this.buttons &= ~(1 << ev.number)
				}
			}

			this.push(ev)

			b = b.slice(8)
		}

		this.hold = b

		done()
	}
}

Ext.data.GamePipe = GamePipe

Ext.reg('gamepipe', Ext.data.GamePipe)
