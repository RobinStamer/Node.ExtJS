Ext('Ext.game.exalted')

Ext.apply(Ext.game.exalted, {
	Trait:	function(character, value) {
		this.value = value
	},

	Virtue:	function(character, value) {
		character.race.bonusChannels = character.race.bonusChannels || 0

		this.__defineGetter__('maxChannels', function() {
			return value + character.race.bonusChannels
		})
		this.freeChannels = this.maxChannels
		Ext.game.exalted.Virtue.superclass.constructor.call(this, character, value)
	},
	Background: function(character, value) {
		Ext.game.exalted.Background.superclass.constructor.call(this, character, value)
		if ('object' == typeof value) {
			Ext.apply(this, value)
		}
	},
	Limit: function(character, value) {
		Ext.game.exalted.Limit.superclass.constructor.call(this, character, value)
	}
})

Ext.extend(Ext.game.exalted.Virtue, Ext.game.exalted.Trait)
Ext.extend(Ext.game.exalted.Background, Ext.game.exalted.Trait)
Ext.extend(Ext.game.exalted.Limit, Ext.game.exalted.Trait)
