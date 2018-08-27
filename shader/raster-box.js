/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
class RasterBox {
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
        this.gl = gl;
        const mi = minPoint;
        const ma = maxPoint;
        let vertices = [
			mi.x, mi.y, ma.z, // l,b,f
			ma.x, mi.y, ma.z, // r,b,f
			ma.x, ma.y, ma.z, // r,t,f
			mi.x, ma.y, ma.z, // l,t,f
			ma.x, mi.y, mi.z, // r,b,n
			mi.x, mi.y, mi.z, // l,b,n
			mi.x, ma.y, mi.z, // l,t,n
			ma.x, ma.y, mi.z  // r,t,n
        ];
        let indices = [
            // front
            0, 1, 2, 2, 3, 0,
            // back
            4, 5, 6, 6, 7, 4,
            // right
            1, 4, 7, 7, 2, 1,
            // top
            3, 2, 7, 7, 6, 3,
            // left
            5, 0, 3, 3, 6, 5,
            // bottom
            5, 4, 1, 1, 0, 5
        ];

		// vertex buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;

		// index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.indexBuffer = indexBuffer;
        this.elements = indices.length;

		let normals = [
			// mi.x, mi.y, ma.z, // l,b,f
			-1.0, -1.0, 1.0,

			// ma.x, mi.y, ma.z, // r,b,f
			1.0, -1.0, 1.0,

			// ma.x, ma.y, ma.z, // r,t,f
			1.0, 1.0, 1.0,

			// mi.x, ma.y, ma.z, // l,t,f
			-1.0, 1.0, 1.0,

			// ma.x, mi.y, mi.z, // r,b,n
			1.0, -1.0, -1.0,

			// mi.x, mi.y, mi.z, // l,b,n
			-1.0, -1.0, -1.0,

			// mi.x, ma.y, mi.z, // l,t,n
			-1.0, 1.0, -1.0,

			// ma.x, ma.y, mi.z  // r,t,n
			1.0, 1.0, -1.0
		]
		const normalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
		this.normalBuffer = normalBuffer;

		// color buffer
		let colors = [];
		for (let i = 0; i < vertices.length; i += 3) {
			colors.push(color.r);
			colors.push(color.g);
			colors.push(color.b);
		}
		const colorBuffer = gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
		this.colorBuffer = colorBuffer;
    }

    /**
     * Renders the box
     * @param {Shader} shader - The shader used to render
     */
    render(shader) {
		// vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

		// color buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		const colorLocation = shader.getAttributeLocation("a_color");
		this.gl.enableVertexAttribArray(colorLocation);
		this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);

		// normal buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
		const normalLocation = shader.getAttributeLocation("a_normal");
		this.gl.enableVertexAttribArray(normalLocation);
		this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);

		// index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		// draw
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
		this.gl.disableVertexAttribArray(colorLocation);
    }
}

