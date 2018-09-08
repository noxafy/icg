/**
 * Author: noxafy
 * Created: 08.09.18
 */
class Shape {

	/**
	 * Creates a general shape with properties needed for phong lighting
	 * @param {Color}    color    - The color pf the shape
	 * @param {Material} material - The material of the shape
	 */
	constructor(color, material) {
		this.color = color;
		this.material = material;
	}

	/**
	 * Calculates the intersection of the shape with the given ray
	 * @param  {Ray} ray      - The ray to intersect with
	 * @return {Intersection}   The intersection if there is one, null if there is none
	 */
	intersect(ray) {
	}

}