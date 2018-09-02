/**
 * Author: noxafy
 * Created: 26.08.18
 */
class Material {
	/**
	 * Setup a material
	 * @param {Vector} ambient
	 * @param {Vector} diffuse
	 * @param {Vector} specular
	 * @param {number} shininess
	 * @param {string} name
	 */
	constructor(ambient, diffuse, specular, shininess, name) {
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

	toJsonObj() {
		if (this.name) return this.name.toUpperCase();
		else return {
			ambient: this.ambient.data,
			diffuse: this.diffuse.data,
			specular: this.specular.data,
			shininess: this.shininess
		}
	}
}