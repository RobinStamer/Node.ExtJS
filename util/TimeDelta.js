

class TimeDelta {
	constructor(d) {
		this.delta = d

		this.ms	= d % 1000
		this.s	= Math.floor(d / 1000 % 60)
		this.m	= Math.floor(d / (1000 * 60) % 60)
		this.h	= Math.floor(d / (1000 * 60 * 60) % 24)
		this.d	= Math.floor(d / (1000 * 60 * 60 * 24))
	}

	get sMiliseconds() {
		return this.ms.toString().padStart(2, '0')
	}

	get sSeconds() {
		return this.s.toString().padStart(2, '0')
	}

	get sMinutes() {
		return this.m.toString().padStart(2, '0')
	}

	get sHours() {
		return this.h.toString().padStart(2, '0')
	}

	get sDays() {
		return this.d.toString().padStart(2, '0')
	}

	toString() {
		return `${this.sDays} Days ${this.sHours}:${this.sMinutes}:${this.sSeconds}.${this.sMiliseconds}`
	}
}

Ext.util.TimeDelta = TimeDelta
