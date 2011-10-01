var Ext = require('Ext')('Ext.net.LineSocket');

(new Ext.net.LineSocket({
	server: {
		host: '0.0.0.0',
		port: 9999
	}
})).on('line', function(line) {
	console.log(line)
	if (/quit/.test(line)) {
		this._socket.close()
	}
})
