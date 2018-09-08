/**
 * Calculate the color of an object at the intersection point according to the Phong Lighting model.
 * @param {Shape} obj                 - The intersected shape
 * @param {Intersection} intersection - The intersection information
 * @param {Array.<LightNode>} lights  - The lights with their positions and other properties
 * @param {Position} cameraPosition   - The position of the camera
 * @return {Color}                    The resulting color
 */
function phong(obj, intersection, lights, cameraPosition) {
	const n = intersection.normal; // the normal at this point on the surface
	const p = intersection.point;

	let res = new Color(0, 0, 0);
	for (let l of lights) {
		res = res.add(getPhongColor(l, n, p, obj.color, obj.material, cameraPosition));
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
function getPhongColor(light, n, p, color, material, cameraPos) {
	let ambient = color.mul(material.ambient).mul(light.ambient);
	let diffuse;
	let specular;

	const l = light.m_position.sub(p).normalised(); // direction vector from the point on the surface toward the light source
	const dot = n.dot(l);
	if (dot > 0) {
		diffuse = light.color.mul(dot).mul(material.diffuse).mul(light.diffuse);
		const r = n.mul(2 * l.dot(n)).sub(l).normalised(); // direction that a perfectly reflected ray would take from this point on the surface
		const v = cameraPos.sub(p).normalised(); // direction pointing towards the viewer
		const dot2 = r.dot(v);
		if (dot2 > 0) {
			specular = light.color.mul(Math.pow(dot2, material.shininess)).mul(material.specular).mul(light.specular);
		}
	}

	let res = ambient;
	if (diffuse) res = res.add(diffuse);
	if (specular) res = res.add(specular);

	const distance = light.position.sub(p).length;
	const attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);
	return res.mul(light.intensity / attenuation);
}
