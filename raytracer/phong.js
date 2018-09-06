/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * @param {Vector} objColor               - The colour of the intersected object
 * @param {Intersection} intersection     - The intersection information
 * @param {Array.<Vector>} lightPositions - The light positions
 * @param {number} shininess              - The shininess parameter of the Phong model
 * @param {Vector} cameraPosition         - The position of the camera
 * @return {Vector}                         The resulting colour
 */
function phong(objColor, intersection, lightPositions, shininess, cameraPosition) {
	const lightColor = new Color(1, 1, 1, 1);
	const kA = 0.8;
	const kD = 0.8;
	const kS = 0.2;

	const color = objColor;
	const n = intersection.normal; // the normal at this point on the surface

	//Ambient
	let ambient = color.mul(kA);

	// diffuse
	let dot_d = 0;

	// specular
	const v = cameraPosition.sub(intersection.point).normalised(); // direction pointing towards the viewer
	let dot_s = 0;

	for (let lp of lightPositions) {
		const l = lp.sub(intersection.point).normalised(); // direction vector from the point on the surface toward the light source
		const dot = n.dot(l);
		if (dot > 0) {
			dot_d += kD * dot;
			const r = n.mul(2 * l.dot(n)).sub(l).normalised(); // direction that a perfectly reflected ray of light would take from this point on the surface
			const dot2 = r.dot(v);
			if (dot2 > 0) dot_s += kS * Math.pow(dot2, shininess);
		}
	}
	let diffuse = lightColor.mul(dot_d);
	let specular = lightColor.mul(dot_s);

	return ambient.add(diffuse).add(specular);
}
