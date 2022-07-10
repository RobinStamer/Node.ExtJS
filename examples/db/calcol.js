var path = require('path'), d = new Date(2020, 0, 1, 12), o, col
	,Flecko = [
		 '00', '01', '02', '03', '04', '05', '06', '07', '08', '09'
		,'10', '11', '12', '13', '14', '15', '16', '17', '18', '19'
		,'20', '21', '22', '23', '24', '25', '26', '27', '28', '29'
		,'30', '31', '32', '33', '34', '35', '36', '37', '38', '39'
	]
	,DoW	= [
		'day:sunday', 'day:monday', 'day:tuesday', 'day:wednesday', 'day:thursday', 'day:friday', 'day:saturday'
	]
	,dayEnd	= [
		'weekend', 'weekday', 'weekday', 'weekday', 'weekday', 'weekday', 'weekend'
	]

col = Ext.xcreate({
	xtype:	'dircol'
	,dir:	path.resolve(`${__dirname}/../../var/data/calendar`)
})

col.on('load', function() {
	if (col.length) {
		// Do not generate the DB if we have any entries
		return
	}

	while (2023 > d.getFullYear()) {
		o = {
			id:	`${d.getFullYear()}-${Flecko[d.getMonth() + 1]}-${Flecko[d.getDate()]}`
			,tags:	[`year:${d.getFullYear()}`, `month:${Flecko[d.getMonth() + 1]}`, `day:${Flecko[d.getDate()]}`, `${DoW[d.getDay()]}`, `${dayEnd[d.getDay()]}`]
			,d:	d
		}

		col.add(o)

		d = new Date(d - -1000 * 24 * 60 * 60)
	}
})

module.exports = col
