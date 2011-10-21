Ext('Ext.game.exalted', 'Ext.game', 'Ext.game.exalted.Trait', 'Ext.util.Observable')

Ext.game.exalted.Character = Ext.extend(Ext.util.Observable, {
	constructor: function(o) {
		this.race = {}

		for (var i = 0; i < Ext.game.exalted.attribute.length; ++i) {
			this[Ext.game.exalted.attribute[i].toLowerCase()] = o.attributes[i] = new Ext.game.exalted.Trait(this, o.attributes[i])
		}

		for (var i = 0; i < Ext.game.exalted.ability.length; ++i) {
			this[Ext.game.exalted.ability[i].toLowerCase()] = o.abilities[i] = new Ext.game.exalted.Trait(this, o.abilitys[i])
		}

		for (var i = 0; i < Ext.game.exalted.virtue.length; ++i) {
			this[Ext.game.exalted.virtue[i].toLowerCase()] = o.virtues[i] = new Ext.game.exalted.Virtue(this, o.virtues[i])
		}

		for (var i = 0; i < Ext.game.exalted.background.length; ++i) {
			if (!o.backgrounds[Ext.game.exalted.background[i]]) {
				continue
			}
			this[Ext.game.exalted.background[i].toLowerCase()] = o.backgrounds[i] = new Ext.game.exalted.Background(this, o.backgrounds[Ext.game.exalted.background[i]])
		}

		Ext.game.exalted.Character.superclass.constructor.apply(this)

		this.addEvents(
			'trait'
		)
	},
	getValue: function(s, x) {
		var o = {name: s}

		if (x) {
			s = s.toLowerCase()
			var classification = Ext.game.exalted.traitClassifications[s];
			if (!classification) {
				throw new Error('Could not locate Trait in classification listing')
			}

			// Check to see if the roll already had an Attribute, Ability or Virtue when we're given on
			if (classification in {attribute:1,ability:1,virtue:1} && x[classification]) {
				throw new Error('Already applied a ' + classification + ' to this roll: ' + x[classification].name + ' and ' + s)
			}

			x[classification] = this[s]

			// Ensure we can do the Virtue Channel
			if ('virtue' == classification) {

			}

			return this[s]
		}

		o.value = (new Function('o', 'return ' + s.replace(/([a-z]+)/ig, ' this.getValue("$1", o).value '))).call(this, o)
		return o;
	},
	doRoll: function(s, func, targetNumber) {
		var o = this.getValue(s)
		o.roll = Ext.game.doRoll(o.value, 10, false, func || 'S', targetNumber || 7)
		return o
	}
})
