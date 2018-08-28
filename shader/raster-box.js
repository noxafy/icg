/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
class RasterBox extends RasterShape {
	/**
	 * Creates all WebGL buffers for the box
	 *     6 ------- 7
	 *    / |       / |
	 *   3 ------- 2  |
	 *   |  |      |  |
	 *   |  5 -----|- 4
	 *   | /       | /
	 *   0 ------- 1
	 *  looking in negative z axis direction
	 * @param {WebGLRenderingContext} gl - The canvas' context
	 * @param {Position} minPoint - The minimal x,y,z of the box
	 * @param {Position} maxPoint - The maximal x,y,z of the box
	 * @param {Color} color - The color of the cube
	 */
	constructor(gl, minPoint, maxPoint, color) {
		super(gl);

		const mi = minPoint;
        const ma = maxPoint;
        let vertices = [
			mi.x, mi.y, ma.z, // l,b,n
			ma.x, mi.y, ma.z, // r,b,n
			ma.x, ma.y, ma.z, // r,t,n
			mi.x, ma.y, ma.z, // l,t,n
			ma.x, mi.y, mi.z, // r,b,f
			mi.x, mi.y, mi.z, // l,b,f
			mi.x, ma.y, mi.z, // l,t,f
			ma.x, ma.y, mi.z  // r,t,f
        ];
        let indices = [
			0, 1, 2, 2, 3, 0, // front
			4, 5, 6, 6, 7, 4, // back
			1, 4, 7, 7, 2, 1, // right
			3, 2, 7, 7, 6, 3, // top
			5, 0, 3, 3, 6, 5, // left
			5, 4, 1, 1, 0, 5  // bottom
        ];
		let normals = [
			-1.0, -1.0, 1.0, // mi.x, mi.y, ma.z, // l,b,n
			1.0, -1.0, 1.0, // ma.x, mi.y, ma.z, // r,b,n
			1.0, 1.0, 1.0, // ma.x, ma.y, ma.z, // r,t,n
			-1.0, 1.0, 1.0, // mi.x, ma.y, ma.z, // l,t,n
			1.0, -1.0, -1.0, // ma.x, mi.y, mi.z, // r,b,f
			-1.0, -1.0, -1.0, // mi.x, mi.y, mi.z, // l,b,f
			-1.0, 1.0, -1.0, // mi.x, ma.y, mi.z, // l,t,f
			1.0, 1.0, -1.0 // ma.x, ma.y, mi.z  // r,t,f
		]

		this.makeVertexBuffer(vertices);
		this.makeIndexBuffer(indices);
		this.makeNormalBuffer(normals);
		this.makeColorBuffer(vertices.length, color);
	}
}

