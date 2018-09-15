/**
 * A class creating buffers for a pyramid to render it with WebGL
 */
class RasterPyramid extends RasterShape {
	/**
	 * Creates all WebGL buffers for the pyramid
	 *      0
	 *     /|\
	 *    //| \
	 *   /4-|--3
	 *  //  | /
	 * 1----2
	 *
	 *  looking in negative z axis direction
	 * @param {WebGLRenderingContext} gl - The canvas' context
	 * @param {Position}        minPoint - The minimal x,0,z of the pyramid's bottom
	 * @param {Position}        maxPoint - The maximal x,0,z of the pyramid's bottom
	 * @param {Position}        top      - The pyramid's summit
	 * @param {Color}           color    - The color of the pyramid
	 */
	constructor(gl, minPoint, maxPoint, top, color) {
		super(gl);

		const mi = minPoint;
		const ma = maxPoint;
		let vertices = [
			top.x, top.y, top.z, // 0
			mi.x, 0, ma.z, // 1
			ma.x, 0, ma.z, // 2
			ma.x, 0, mi.z, // 3
			mi.x, 0, mi.z, // 4
		];
		let indices = [
			0, 1, 2, // front
			0, 3, 4, // back
			0, 4, 1, // left
			0, 2, 3, // right
			4, 3, 2, 2, 1, 4 // bottom
		];
		let topy = top.y > 0 ? 1.0 : -1.0;
		let ally = top.y > 0 ? -1.0 : 1.0;
		let normals = [
			0.0, topy, 0.0,  // 0
			1.0, ally, 1.0, // 1
			-1.0, ally, 1.0,  // 2
			-1.0, ally, -1.0, // 3
			1.0, ally, -1.0 // 4
		]
		const colors = RasterShape.generateColors(vertices.length, color);
		this.init(vertices, indices, normals, colors)
	}
}