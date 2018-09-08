/**
 * Calculate the color of an object at the intersection point according to the Phong Lighting model.
 * @param {Color} objColor                - The colour of the intersected object
 * @param {Intersection} intersection     - The intersection information
 * @param {Array.<LightNode>} lights      - The lights with their positions and other properties
 * @param {Position} cameraPosition       - The position of the camera
 * @return {Color}                        The resulting color
 */
function phong(objColor, intersection, lights, cameraPosition) {
	const n = intersection.normal; // the normal at this point on the surface
	const p = intersection.point;
	const kA = 0.8;
	const kD = 0.8;
	const kS = 0.2;
	const shininess = 10;

	let res = new Color(0, 0, 0);
	for (let l of lights) {
		res = res.add(getPhongColor(l, n, p, objColor, kA, kD, kS, shininess, cameraPosition));
	}
	return res;
}

/**
 *
 * @param {LightNode} light
 * @param {Vector} n
 * @param {Position} p
 * @param {Color} color
 * @param {number} kA
 * @param {number} kD
 * @param {number} kS
 * @param {number} shininess
 * @param {Position} cameraPos
 * @return {Color}
 */
function getPhongColor(light, n, p, color, kA, kD, kS, shininess, cameraPos) {
	//Ambient
	let ambient = color.mul(kA).mul(light.ambient);

	// diffuse
	let dot_d = 0;

	// specular
	const v = cameraPos.sub(p).normalised(); // direction pointing towards the viewer
	let dot_s = 0;


	const l = light.m_position.sub(p).normalised(); // direction vector from the point on the surface toward the light source
	const dot = n.dot(l);
	if (dot > 0) {
		dot_d += kD * dot;
		const r = n.mul(2 * dot).sub(l).normalised(); // direction that a perfectly reflected ray would take from this point on the surface
		const dot2 = r.dot(v);
		if (dot2 > 0) dot_s += kS * Math.pow(dot2, shininess);
	}

	let diffuse = light.color.mul(dot_d).mul(light.diffuse);
	let specular = light.color.mul(dot_s).mul(light.specular);

	const distance = light.position.sub(p).length;
	const attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);
	return ambient.add(diffuse).add(specular).mul(light.intensity / attenuation);
}
