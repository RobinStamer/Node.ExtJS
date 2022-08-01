class EPromise extends Promise {
	then(f, scope) {
		if (!scope) {
			return super.then(f)
		}

		return super.then((...args) => {
			return f.apply(scope, args)
		})
	}

	catch(f, scope) {
		if (!scope) {
			return super.catch(f)
		}

		return super.catch((...args) => {
			return f.apply(scope, args)
		})
	}

	static resolve(...args) {
		return new EPromise((p,f) => {
			p(...args)
		})
	}

	static reject(...args) {
		return new EPromise((p,f) => {
			f(...args)
		})
	}
}

Ext.Promise = EPromise
