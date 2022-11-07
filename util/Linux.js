var L	= Ext.ns('Ext.util.Linux')
	,rM	= /([^:]+):\s*([0-9]+)\s?(.B)?/
	,rC	= /([^:\t]+)\s*:\s*(.+)/

Ext('Ext.util.MixedCollection')

// TODO: hostid
// TODO: disks
// TODO: network

L.update = function updateLinux() {
	if (!L.memory) {
		L.memory = new Ext.util.MixedCollection
	}
	
	if (!L.cpu) {
		L.cpu = new Ext.util.MixedCollection
		L.cpu.getKey = o => { return o.processor }
	}

	var o

	Ext.xcreate({
		xtype:	'linePipe'
		,input:	{
			xtype:	'file'
			,name:	'/proc/meminfo'
		}
	}).on('data', line => {
		m = rM.exec(line)

		if (m[3]) {
			L.memory.add(m[1], {
				value:	m[2] - 0
				,type:	m[3]
			})
		} else {
			L.memory.add(m[1], m[2])
		}
	})

	Ext.xcreate({
		xtype:	'linePipe'
		,input:	{
			xtype:	'file'
			,name:	'/proc/cpuinfo'
		}
	}).on('data', line => {
		if ('' == line) {
			o && L.cpu.add(o)
			delete o

			return
		}

		if (!o) {
			o = {}
		}

		m = rC.exec(line)

		o[m[1]] = m[2]
	})
}

L.update()
