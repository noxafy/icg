/**
 * Class representing a ray-sphere intersection in 3D space
 */
class Intersection {
	/**
	 * Create an Intersection
	 * @param {number} t      - The distance on the ray
	 * @param {Vector} point  - The intersection points
	 * @param {Vector} normal - The normal in the intersection
	 */
	constructor(t, point, normal) {
		this.t = t ? t : Infinity;
		this.point = point;
		this.normal = normal;
	}

	/**
	 * Determines whether this intersection
	 * is closer than the other
	 * @param  {Intersection} other - The other Intersection
	 * @return {Boolean}              The result
	 */
	closerThan(other) {
		return this.t < other.t;
	}
}
