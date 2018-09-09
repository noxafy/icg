/**
 * Class representing an axis aligned box
 */
class AABox extends Shape {

	/**
	 * Creates an axis aligned box
	 * @param {Position} minPoint - The minimum Point
	 * @param {Position} maxPoint - The maximum Point
	 * @param {Color}    color    - The color of the cube
	 * @param {Material} material - The material of the cube
	 */
	constructor(minPoint, maxPoint, color, material) {
		super(color, material);

		this.vertices = [
			new Vector(minPoint.x, minPoint.y, maxPoint.z, 1),
			new Vector(maxPoint.x, minPoint.y, maxPoint.z, 1),
			new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1), // max point
			new Vector(minPoint.x, maxPoint.y, maxPoint.z, 1),
			new Vector(minPoint.x, minPoint.y, minPoint.z, 1), // min point
			new Vector(maxPoint.x, minPoint.y, minPoint.z, 1),
			new Vector(maxPoint.x, maxPoint.y, minPoint.z, 1),
			new Vector(minPoint.x, maxPoint.y, minPoint.z, 1)
		];

		this.indices = [
			0, 1, 2, 3,
			1, 5, 6, 2,
			4, 0, 3, 7,
			3, 2, 6, 7,
			5, 4, 7, 6,
			0, 4, 5, 1
		];
	}

	/**
	 * Calculates the intersection of the AAbox with the given ray
	 * @param  {Ray} ray      - The ray to intersect with
	 * @return {Intersection}   The intersection if there is one, null if there is none
	 */
	intersect(ray) {
		let B0 = this.vertices[4];
		let B1 = this.vertices[2];
		let O = ray.origin;
		let D = ray.direction;

		let t0x = (B0.x - O.x) / D.x;
		let t0y = (B0.y - O.y) / D.y;
		let t1x = (B1.x - O.x) / D.x;
		let t1y = (B1.y - O.y) / D.y;
		let t0z = (B0.z - O.z) / D.z
		let t1z = (B1.z - O.z) / D.z

		let normal = new Vector(-1, -1, -1);
		if (t0x > t1x) {
			let temp = t0x;
			t0x = t1x;
			t1x = temp;
			normal.x = 1;
		}
		if (t0y > t1y) {
			let temp = t0y;
			t0y = t1y;
			t1y = temp;
			normal.y = 1;
		}
		if (t0z > t1z) {
			let temp = t0z;
			t0z = t1z;
			t1z = temp;
			normal.z = 1;
		}
		let tmin = t0x;
		let tmax = t1x;
		if (tmin > t1y || t0y > t1x) return null;
		if (t0y > tmin) {
			tmin = t0y;
			normal.x = 0;
		} else {
			normal.y = 0;
		}
		if (t1y < tmax) tmax = t1y;
		if (tmin > t1z || t0z > tmax) return null;
		if (t0z > tmin) {
			tmin = t0z;
			normal.x = normal.y = 0;
		} else {
			normal.z = 0;
		}
		if (tmin < 0) return null;
		return new Intersection(tmin, D.mul(tmin).add(O), normal);
	}
}
