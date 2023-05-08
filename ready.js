Ext('Ext.util.DelayedTask', 'Ext.util.Observable', 'Ext.ComponentMgr')

var ready = [], readyCnt = 0, create = Ext.create

function flushrun() {
	if (ready.length) {
		var ev = ready.shift()

		ev[0].call(ev[1], readyCnt)
	}

	ready.length && flushrun()
}

function readyHook() {
	readyCnt++

	return function() {
		readyCnt--
		readyPump()
	}
}

function readyPump() {
	Ext._ready.delay(Ext._readyTime)
}

Ext._ready = new Ext.util.DelayedTask(function() {
	if (readyCnt) {
		readyPump()

		return
	}

	if (!Ext.isReady) {
		Ext.isReady = true

		ready.length && flushrun()
	}
})

Ext._readyTime = 700

Ext.onReady = function onReady(fn, scope) {
	ready.push([fn, scope || global])

	if (Ext.isReady) {
		flushrun()
	} else {
		readyPump()
	}
}

Ext.setupReady = function setupReady(obs) {
	readyPump()

	if ('function' == obs.once) {
		obs.once('ready', readyHook())
	} else if (obs instanceof Ext.util.Observable) {
		obs.on('ready', readyHook(), obs, {single: true})
	} else {
		throw new Error('Expected Observable')
	}
}

Ext.create = function createReady(...args) {
	let r = create.apply(Ext, args)

	if (r instanceof Ext.util.Observable && r.events.ready) {
		r.on('ready', readyHook(), r, {single: true})
	}

	return r
}

Ext.readyP = function() {
	let P = Ext.Promise || Promise

	if (Ext.isReady) {
		return P.resolve()
	}

	return new P((p, f) => {
		Ext.onReady(p)
	})
}

class ReadyOnLoad {
	constructor(cfg) {
		this.ev = (cfg && cfg.ev) || 'load'
	}

	init(cmp) {
		this.parent = cmp

		if ('function' == typeof cmp.once) {
			cmp.once(this.ev, this.x)
		} else if (cmp instanceof Ext.util.Observable) {
			cmp.on(this.ev, this.x, cmp, {single: true})
			cmp.addEvents('ready')
		}

		Ext.setupReady(cmp)
	}

	x() {
		this.fireEvent('ready')
	}
}

Ext.preg('ready', ReadyOnLoad)
