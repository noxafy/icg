class Color extends Vector {
	/**
	 * Create a color. Alpha is 1 per default if not given.
	 * @param r
	 * @param g
	 * @param b
	 * @param name
	 * @param a
	 */
	constructor(r, g, b, name, a = 1) {
		if (Array.isArray(r)) {
			b = r[2];
			g = r[1];
			r = r[0];
		}
		super(r, g, b, a);
		if (typeof name === "string") this.name = name;
		else this.a = name;
	}

	/**
	 * Returns the red component
	 * @return {number} The red component of the color
	 */
	get r() {
		return this.data[0];
	}

	/**
	 * Sets the red component of the color to val
	 * @param  {number} val - The new red value
	 */
	set r(val) {
		this.data[0] = val;
	}

	/**
	 * Returns the green component of the color
	 * @return {number} The green component
	 */
	get g() {
		return this.data[1];
	}

	/**
	 * Sets the green component of the color to val
	 * @param  {number} val - The new green value
	 */
	set g(val) {
		this.data[1] = val;
	}

	/**
	 * Returns the blue component of the color
	 * @return {number} The blue component
	 */
	get b() {
		return this.data[2];
	}

	/**
	 * Sets the blue component of the color to val
	 * @param  {number} val - The new blue value
	 */
	set b(val) {
		this.data[2] = val;
	}

	/**
	 * Returns the alpha component of the color
	 * @return {number} The alpha component
	 */
	get a() {
		return this.data[3];
	}

	/**
	 * Sets the alpha component of the color to val
	 * @param  {number} val - The new alpha value
	 */
	set a(val) {
		this.data[3] = val;
	}

	static getFromJson(obj) {
		if (typeof obj === "string") {
			if (Colors[obj]) return Colors[obj];
			else throw Error("Unknown color: " + obj);
		} else if (Array.isArray(obj)) {
			return new Color(obj);
		}
		throw Error("Invalid data type for color: " + typeof obj);
	}

	toString() {
		if (this.name) return "Color: " + this.name.toUpperCase();
		else return "Color: " + super.toString();
	}

	toJsonObj() {
		if (this.name) return this.name.toUpperCase();
		else return this.data;
	}
}