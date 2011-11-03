Ext.ns('Ext.game.exalted')

Ext.apply(Ext.game.exalted, {
	attribute:	'Strength,Dexterity,Stamina,Charisma,Manipulation,Appearance,Perception,Intelligence,Wits'.split(','),
	ability:	['Archery Athletics Awareness Bureaucracy Craft Dodge Integrity Investigation Larceny Linguistics Lore MartialArts Medicine Melee Occult Performance Presence Resistance Ride Sail Socialize Stealth Survival Thrown War'.split(' ')],
	background:	['Wispers'],
	virtue:		'Compassion,Conviction,Temperance,Valor'.split(','),
	limit:		'Limit,Resonance,Paradox,Clarity,Dissonance,Torment,Bedlam'.split(','),
	physical:	'Strength,Dexterity,Stamina'.split(','),
	social:		'Charisma,Manipulation,Appearance'.split(','),
	mental:		'Perception,Intelligence,Wits'.split(','),
	misc:		'Essence,Willpower'.split(',')
})

Ext.game.exalted.traitClassifications = {}

;(function(tc, ta) {
	ta.forEach(function(key) {
		Ext.game.exalted[key].forEach(function(trait) {
			tc[trait.toLowerCase()] = key
		})
	})
})(Ext.game.exalted.traitClassifications, ['attribute', 'ability', 'virtue', 'limit', 'misc', 'background'])
