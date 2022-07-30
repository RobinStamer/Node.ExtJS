Ext('Ext.p9p.Message')

class VersionMessage extends Ext.p9p.Message {
	get msize() {
		return this.u32(7)
	}

	get version() {
		return this.string(11)[0].toString()
	}
}
