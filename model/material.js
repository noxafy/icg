/**
 * Author: noxafy
 * Created: 26.08.18
 */
class Material {
	/**
	 * Setup a material
	 * @param {Vector} ambient   - The ambient reflecting constant of the material
	 * @param {Vector} diffuse   - The diffuse reflecting constant of the material
	 * @param {Vector} specular  - The specular reflecting constant of the material
	 * @param {number} shininess - The shininess effect of the material
	 * @param {string} name      - The name of the material
	 */
	constructor(ambient, diffuse, specular, shininess, name = undefined) {
		this.ambient = ambient;
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
		this.name = name;
	}

	toString() {
		if (this.name) return "Material: " + this.name.toUpperCase();
		else return "Material: (" +
			"ambient: " + this.ambient.toString() + "; " +
			"diffuse: " + this.diffuse.toString() + "; " +
			"specular: " + this.specular.toString() + "; " +
			"shininess: " + this.shininess + ")";
	}

	/**
	 * Create a material from json object
	 * @param {string|Object} obj
	 * @return {Material}
	 */
	static fromJson(obj) {
		if (typeof obj === "string") {
			if (Materials[obj]) return Materials[obj];
			else throw Error("Unknown material: " + obj);
		} else if (obj && obj.ambient && obj.diffuse && obj.specular && obj.shininess) {
			return new Material(Vector.fromArray(obj.ambient), Vector.fromArray(obj.diffuse),
				Vector.fromArray(obj.specular), obj.shininess, obj.name);
		}
		throw Error("Invalid material specification: " + JSON.stringify(obj));
	}

	/**
	 * Creates the corresponding json oject to this object.
	 * @return {Object}
	 */
	toJsonObj() {
		if (this.name) return this.name.toUpperCase();
		else return {
			ambient: this.ambient.data,
			diffuse: this.diffuse.data,
			specular: this.specular.data,
			shininess: this.shininess,
			name: (this.name) ? this.name : null
		}
	}

	/**
	 * Return a copy of this material
	 * @return {Material}
	 */
	clone() {
		return new Material(this.ambient.clone(), this.diffuse.clone(), this.specular.clone(), this.shininess, this.name);
	}
}