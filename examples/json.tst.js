require('Ext').load('Ext.net.JsonRpc');

new Ext.net.JsonRpc({
	servers: {
		host: '0.0.0.0',
		port: 9999
	},
	methods: {
		test: function(params, handle) {
			handle.success('test')
		}
	}
})
