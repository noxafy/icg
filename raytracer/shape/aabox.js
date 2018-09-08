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

		let tmin = Infinity;
		let point;
		let norm;
		let z0 = O.add(D.mul(t0z));
		if (z0.x > B0.x && z0.x < B1.x && z0.y > B0.y && z0.y < B1.y) {
			point = z0;
			tmin = t0z;
			norm = new Vector(0, 0, (D.z < 0) ? 1 : -1, 1);
		}

		if (t0y < tmin) {
			let y0 = O.add(D.mul(t0y));
			if (y0.x > B0.x && y0.x < B1.x && y0.z > B0.z && y0.z < B1.z) {
				point = y0;
				tmin = t0y;
				norm = new Vector(0, (D.y < 0) ? 1 : -1, 0, 1);
			}
		}

		if (t0x < tmin) {
			let x0 = O.add(D.mul(t0x));
			if (x0.y > B0.y && x0.y < B1.y && x0.z > B0.z && x0.z < B1.z) {
				point = x0;
				tmin = t0x;
				norm = new Vector((D.x < 0) ? 1 : -1, 0, 0, 1);
			}
		}

		if (!point) {
			return null;
		}
		return new Intersection(tmin, point, norm);
	}

}
