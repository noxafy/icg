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
	 */
	constructor(ambient, diffuse, specular, shininess) {
		this.ambient = ambient;
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
	}
}