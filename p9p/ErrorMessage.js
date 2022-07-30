Ext('Ext.p9p.Message')

class VersionMessage extends Ext.p9p.Message {
	get version() {
		return this.string(7)[0].toString()
	}
}
