var	r	= /(\d*)d(\d*)(e?)(([dksSo])(\d*))?/g,
		Ext	= require('../');

Ext.ns('Ext.game');

Ext.game.doRoll = function(count, sides, explodes, func, arg) {
	return doRoll(null, count, sides, explodes, null, func, arg)
}

var doRoll = function(un1, count, sides, explodes, un2, func, arg) {
	var	o	= {
		rolls:	[],
		num:	0,
		toString: function() { return this.num.toString() }
	},
		num;

	count	= parseInt(count)
	sides	= parseInt(sides)
	arg	= parseInt(arg)

	if (!func) {
		o.num = Ext.game.roll(count, sides)
	} else {
		for (var i = 0; i < count; ++i) {
			o.rolls.push(num = Ext.game.roll(sides))
			switch (func) {
				case 'S':
					if (num == count) {
						++o.num
					}
				case 's':
					o.num += (num >= arg ? 1 : 0)
					break
				default:
					o.num += num
			}
			if (explodes && num == sides) {
				--i;
			}
		}
		o.rolls = o.rolls.sort(function(a, b) { if (a > b) return -1; else if (b > a) return 1; return 0; })
	}

	return o;
}

Ext.game.roll = function(count, sides) {
	if (!sides) {
		sides = count
		count = 1
	}

	return Math.floor((1 == count) ? Math.random() * sides : (Math.random() + Math.random())/2 * (sides - 1) * count) + count
}

Ext.game.rollString = function(str) {
	return str.replace(r, doRoll)
}
