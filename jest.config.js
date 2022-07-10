module.exports = {
	projects:	[{
		displayName:	'Live'
		,roots:	['tests']
		,testMatch:	['<rootDir>/tests/**/*.js']
	},{
		displayName:	'Acceptance'
		,roots:	['acceptanceTests']
		,testMatch:	['<rootDir>/acceptanceTests/**/*.js']
	}]
	,collectCoverage: true
	,testRegex: '.*'
}
