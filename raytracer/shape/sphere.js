/**
 * A class representing a sphere
 */
class Sphere extends Shape {
	/**
	 * Creates a new Sphere with center and radius
	 * @param {Position} center   - The center of the Sphere
	 * @param {number}   radius   - The radius of the Sphere
	 * @param {Color}    color    - The color of the Sphere
	 * @param {Material} material - The material of the Sphere
	 */
	constructor(center, radius, color, material) {
		super(color, material);
		this.center = center;
		this.radius = radius;
	}

	/**
	 * Calculates the intersection of the sphere with the given ray
	 * @param  {Ray} ray      - The ray to intersect with
	 * @return {Intersection} The intersection if there is one, null if there is none
	 */
	intersect(ray) {
		if (!this.c) {
			this.emc = ray.origin.sub(this.center); // eye - center
			this.c = this.emc.dot(this.emc) - this.radius * this.radius; // ray.direction.dot(ray.direction) == 1
		}
		const b = ray.direction.dot(this.emc);
		const underSqrt = b * b - this.c;
		if (underSqrt < 0) return null;
		// else if (underSqrt === 0) return new Intersection(-b);

		const t = -b - Math.sqrt(underSqrt);
		const point = ray.origin.add(ray.direction.mul(t));
		return new Intersection(t, point, point.sub(this.center).normalised());
	}
}