var L	= Ext.ns('Ext.util.Linux')
	,rM	= /([^:]+):\s*([0-9]+)\s?(.B)?/
	,rC	= /([^:\t]+)\s*:\s*(.+)*/

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

		if (null === m) {
			console.log(line)
		}

		if (m[2]) {
			o[m[1]] = m[2]
		}
	})
}

L.mountOpt = function (optstr) {
	const options	= optstr.split(',')
	const db	= new Ext.util.MixedCollection

	for (const option of options) {
		const parts	= option.split('=')
		const name	= parts[0]
		const value	= parts.length > 1 ? parts[1] : true

		if (value === 'true' || value === 'false') {
			db.add({ id: name, value: value === 'true' })
		} else {
			db.add({ id: name, value })
		}
	}

	return db
}

L.update()
