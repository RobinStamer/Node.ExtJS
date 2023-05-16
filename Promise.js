Ext('Ext.more') // for Ext.group()

class EPromise extends Promise {
	then(f, c, scope) {
		// .then(f, scope)
		if ('function' != typeof c && c) {
			return this.then(f, undefined, c)
		}

		if (scope) {
			return super.then(
				f && ((...args) => { f.apply(scope, args) })
				,c && ((...args) => { c.apply(scope, args) })
			)
		}

		return super.then(f, c)
	}

	catch(f, scope) {
		return this.then(undefined, f, scope)
	}

	static delay(num, ...args) {
		return new this(p => {
			setTimeout(() => { p(...args) }, num)
		})
	}

	static resolve(...args) {
		return new this((p,f) => {
			p(...args)
		})
	}

	static reject(...args) {
		return new this((p,f) => {
			f(...args)
		})
	}

	static map(keys, ...args) {
		return this.allSettled(args).then(x => {
			return Ext.group(keys, x)
		})
	}
}

class Future {
	constructor() {
		const p = new Ext.Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})

		this.then = p.then.bind(p)
		this.catch = p.catch.bind(p)
	}
}

Ext.Promise	= EPromise
Ext.Future	= Future
