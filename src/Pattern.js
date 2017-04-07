class Pattern {
	constructor(pattern) {
		this.pattern = pattern;
		if (!this.validate(this)) throw new Error(`Invalid pattern: ${pattern}`);
	}

	get breakdown() {
		return this.pattern;
	}

	set breakdown(newPattern) {
		const old = this.pattern;
		this.pattern = newPattern;
		if(!this.validate(this)) {
			this.pattern = old;
			throw new Error(`Invalid pattern: ${pattern}`);
		};
		return old;
	}

	stringify() {
		let o = "";
		let sortedProps = Object.keys(this.pattern).sort();
		for (let prop of sortedProps)
			o += `${prop}:${this.pattern[prop]}`;
		return o;
	}

	static validate(o) {
		if (!(o instanceof Pattern)) return false;
		const breakdown = o.breakdown;
		if (typeof breakdown != "object" || Array.isArray(breakdown)) return false;
		for (prop in breakdown) {
			if (typeof breakdown[prop] != "string") return false;
		}
		return true;
	}

	static parseResults(matchObj) {
		let { matches, originalQuery } = matchObj;
		// TODO: ... muder me ...
	}
}