/**
 * Author: noxafy
 * Created: 09.09.18
 */
class Raytracer {


	/**
	 * Creates a ray from the camera through the image plane.
	 * @param  {number} width  - The width of the canvas - 1) / 2
	 * @param  {number} height - The height of the canvas - 1) / 2
	 * @param  {number} xPos   - The pixel's x-position in the canvas
	 * @param  {number} yPos   - The pixel's y-position in the canvas
	 * @param  {Object} camera - The Camera
	 * @return {Ray}             The resulting Ray
	 */
	static makeRay(width, height, xPos, yPos, camera) {
		const x = (xPos / width - 1) * camera.hpxya;
		const y = (yPos / height - 1) * camera.hpxy;
		const d = camera.dmuln.sub(camera.r.mul(x)).sub(camera.up.mul(y)).normalised();
		return new Ray(camera.eye, d);

		// // alpha (deg) ~ camera.fovy (rad) -> Math.PI / 180
		// // -> alpha / 2 = camera.fovy * Math.PI / 360
		// const halfPlaneXY = camera.near * Math.tan(Utils.degToRad(camera.fovy) / 2);
		// const x = (xPos / (width - 1) * 2 - 1) * halfPlaneXY * camera.aspect; // normalize xPos to [-1;1] and mul by x-axis plane change (aspect)
		// const y = (yPos / (height - 1) * 2 - 1) * halfPlaneXY;
		//
		// const v = camera.center.sub(camera.eye).normalised(); // camera view direction
		// const r = camera.up.cross(v); // right direction, orthogonal to up and view vector
		// const d = v.mul(camera.near).sub(r.mul(x)).sub(camera.up.mul(y)); // resulting direction = z + x + y
		//
		// return new Ray(
		//     camera.eye,
		//     d.normalised()
		// );
	}

	/**
	 *
	 * @param {Ray}      ray
	 * @param {Array.<Shape>} objects
	 * @param {Function} cb
	 */
	static findMinIntersection(ray, objects, cb) {
		let minIntersection = new Intersection();
		let minObj = null;
		for (let shape of objects) {
			const intersection = shape.intersect(ray);
			if (intersection && intersection.closerThan(minIntersection)) {
				minIntersection = intersection;
				minObj = shape;
			}
		}
		cb(minObj, minIntersection);
	}

	/**
	 * Calculate the color of an object at the intersection point according to the Phong Lighting model.
	 * @param {Shape} obj                 - The intersected shape
	 * @param {Intersection} intersection - The intersection information
	 * @param {Array.<LightNode>} lights  - The lights with their positions and other properties
	 * @param {Position} cameraPosition   - The position of the camera
	 * @return {Color}                    The resulting color
	 */
	static phong(obj, intersection, lights, cameraPosition) {
		const n = intersection.normal; // the normal at this point on the surface
		const p = intersection.point;

		let res = new Color(0, 0, 0);
		for (let l of lights) {
			res = res.add(Raytracer.getPhongColor(l, n, p, obj.color, obj.material, cameraPosition));
		}
		return res;
	}

	/**
	 *
	 * @param {LightNode} light
	 * @param {Vector} n
	 * @param {Position} p
	 * @param {Color} color
	 * @param {Material} material
	 * @param {Position} cameraPos
	 * @return {Color}
	 */
	static getPhongColor(light, n, p, color, material, cameraPos) {
		let ambient = color.mul(material.ambient).mul(light.ambient);
		let diffuse;
		let specular;

		const l = light.m_position.sub(p).normalised(); // direction vector from the point on the surface toward the light source
		const dot = n.dot(l);
		if (dot > 0) {
			diffuse = light.color.mul(dot).mul(material.diffuse).mul(light.diffuse);
			const r = n.mul(2 * dot).sub(l).normalised(); // direction that a perfectly reflected ray would take from this point on the surface
			const v = cameraPos.sub(p).normalised(); // direction pointing towards the viewer
			const dot2 = r.dot(v);
			if (dot2 > 0) {
				specular = light.color.mul(Math.pow(dot2, material.shininess)).mul(material.specular).mul(light.specular);
			}
		}

		let res = ambient;
		if (diffuse) res = res.add(diffuse);
		if (specular) res = res.add(specular);

		const distance = light.m_position.sub(p).length;
		const attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);
		return res.mul(light.intensity / attenuation);
	}

}

/**
 * Class representing a ray
 */
class Ray {
	/**
	 * Creates a new ray with origin and direction
	 * @param  {Vector} origin    - The origin of the Ray
	 * @param  {Vector} direction - The direction of the Ray
	 */
	constructor(origin, direction) {
		this.origin = origin;
		this.direction = direction;
	}
}

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