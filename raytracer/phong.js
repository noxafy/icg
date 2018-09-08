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
	//Ambient
	let ambient = color.mul(material.ambient).mul(light.ambient);

	// diffuse
	let dot_d = 0;

	// specular
	const v = cameraPos.sub(p).normalised(); // direction pointing towards the viewer
	let dot_s = 0;


	const l = light.m_position.sub(p).normalised(); // direction vector from the point on the surface toward the light source
	const dot = n.dot(l);
	if (dot > 0) {
		dot_d = dot;
		const r = n.mul(2 * l.dot(n)).sub(l).normalised(); // direction that a perfectly reflected ray would take from this point on the surface
		const dot2 = r.dot(v);
		if (dot2 > 0) dot_s = Math.pow(dot2, material.shininess);
	}

	let diffuse = light.color.mul(dot_d).mul(material.diffuse).mul(light.diffuse);
	let specular = light.color.mul(dot_s).mul(material.specular).mul(light.specular);

	const distance = light.position.sub(p).length;
	const attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);
	return ambient.add(diffuse).add(specular).mul(light.intensity / attenuation);
}
