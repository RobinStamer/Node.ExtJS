Ext('Ext.Date')

Ext.stamp = function(n = new Date) {
	return n.format('Y-m-d H:i:s')
}

Ext.stamp.full = function full(n = new Date) {
	return n.format('Y-m-d H:i:s.u')
}

Ext.stamp.now = function date(n = new Date) { return new Date(n) }

Ext.stamp.date = function date(n = new Date) {
	return n.format('Y-m-d')
}

Ext.stamp.time = function time(n = new Date) {
	return n.format('H:i:s')
}
