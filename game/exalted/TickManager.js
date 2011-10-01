Ext('Ext.game').ns('Ext.game.exalted')

Ext.game.exalted.TickManager = function(config) {
	Ext.apply(this, config)

	this.state = {}
}

Ext.game.exalted.TickManager.prototype.clear = function() {
	this.state = {}
}

Ext.game.exalted.TickManager.prototype.join = function(character) {
	if (!character.joinBattle) {
		throw new Error('Did not get a Character with a joinBattle stat')
	}
	var	roll	= Ext.game.doRoll(character.joinBattle, 10, false, 'S', 7),
		name	= character.name || Ext.id(null, 'character-')

	return this.state[name] = Ext.apply(character, {
		roll: roll,
		DV: 0
	})
}

Ext.game.exalted.TickManager.prototype.start = function() {
	this.pos = 0
	return this.next()
}

Ext.game.exalted.TickManager.prototype.next = function() {
	var	self = this,
		arr	= []

	for (var k in this.state) {
		var mob = this.state[k]
		if (mob.roll) {
			mob.tick = Math.max(0, 6 - mob.roll.num) + self.pos
			delete mob.roll
		}
		if (self.pos >= mob.tick) {
			arr.push(mob)
		}
	}

	// If we didn't get any results increase the tick by one and try again.
	if (!arr.length) {
		++this.pos
		return this.next()
	}

	return {
		tick: this.pos,
		results: arr
	}
}

Ext.game.exalted.TickManager.prototype.act = function(character, speed, DV) {
	speed = Math.abs(parseInt(speed))

	if (!speed) {
		throw new Error('Got non-numeric or zero speed')
	}

	DV = -Math.abs(parseInt(DV))

	var mob = this.lookup(character)

	if (mob.tick > this.pos) {
		throw new Ext.UserError('Not ' + character.name + '\'s turn')
	}

	mob.tick += speed
	mob.DV = DV

	return mob
}

Ext.game.exalted.TickManager.prototype.lookup = function(character) {
	if (!character.name) {
		throw new Error('Did not get a Character with a name')
	}

	if (!this.state.hasOwnProperty(character.name)) {
		throw new Error('No such mob: ' + character.name)
	}
	return this.state[character.name]
}

Ext.game.exalted.TickManager.prototype.remove = function(character) {
	delete this.state[this.lookup(character).name]
}

