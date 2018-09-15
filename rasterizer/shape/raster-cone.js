/**
 * Creates all buffer for a cone necessary for rendering with webgl
 *
 * Author: noxafy
 * Created: 28.08.18
 */
class RasterCone extends RasterShape {

	/**
	 * Creates all WebGL buffers for the cone
	 * @param {WebGLRenderingContext} gl - The canvas' context
	 * @param {number}          radius   - The radius of the cone
	 * @param {Position}        top      - The top of the cone
	 * @param {number}          ringsize - The number of vertices for the bottom
	 * @param {Color}           color    - The color of the cone
	 */
	constructor(gl, radius, top, ringsize, color) {
		super(gl);

		let vertices = [ top.x, top.y, top.z ];

		let topy = top.y > 0 ? 1.0 : -1.0;
		let ally = top.y > 0 ? -1.0 : 1.0;
		let normals = [0.0, topy, 0.0];

		for (let ring = 0; ring < ringsize; ring++) {
			let theta = ring * Math.PI * 2 / ringsize - 1;
			let x = (radius * Math.sin(theta))
			let y = 0;
			let z = (radius * Math.cos(theta));
			vertices.push(x);
			vertices.push(y);
			vertices.push(z);

			let normal = new Vector(x, ally, z).normalised();
			normals.push(normal.x);
			normals.push(normal.y);
			normals.push(normal.z);
		}

		let indices = [];
		// side walls
		for (let ring = 0; ring < ringsize; ring++) {
			indices.push(0);
			const idx = ring % ringsize + 1;
			indices.push(idx);
			if (idx === ringsize) indices.push(1);
			else indices.push(idx + 1);
		}
		// bottom
		for (let ring = 2; ring < ringsize; ring++) {
			indices.push(1);
			indices.push(ring);
			indices.push(ring + 1);
		}
		const colors = RasterSphere.generateColors(vertices.length, color);
		this.init(vertices, indices, normals, colors);
	}
}
