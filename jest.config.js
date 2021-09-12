module.exports = {
	roots: [
		'tests'
	]
	,collectCoverage: true
	,globals: {
		Ext: require('.')
	}
	,testRegex: '.*'
}
