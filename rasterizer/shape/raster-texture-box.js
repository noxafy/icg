/**
 * A class creating buffers for a textured box to render it with WebGL
 */
class RasterTextureBox extends RasterShape {
	/**
	 * Creates all WebGL buffers for the textured box
	 *     6 ------- 7
	 *    / |       / |
	 *   3 ------- 2  |
	 *   |  |      |  |
	 *   |  5 -----|- 4
	 *   | /       | /
	 *   0 ------- 1
	 *  looking in negative z axis direction
	 * @param {WebGLRenderingContext} gl - The canvas' context
	 * @param {Vector}          minPoint - The minimal x,y,z of the box
	 * @param {Vector}          maxPoint - The maximal x,y,z of the box
	 * @param {string}          texture  - The image filename for the texture
	 */
	constructor(gl, minPoint, maxPoint, texture) {
		super(gl);

		const mi = minPoint;
		const ma = maxPoint;

		let vertices = [
			// front
			mi.x, mi.y, ma.z, ma.x, mi.y, ma.z, ma.x, ma.y, ma.z,
			ma.x, ma.y, ma.z, mi.x, ma.y, ma.z, mi.x, mi.y, ma.z,
			// back
			ma.x, mi.y, mi.z, mi.x, mi.y, mi.z, mi.x, ma.y, mi.z,
			mi.x, ma.y, mi.z, ma.x, ma.y, mi.z, ma.x, mi.y, mi.z,
			// right
			ma.x, mi.y, ma.z, ma.x, mi.y, mi.z, ma.x, ma.y, mi.z,
			ma.x, ma.y, mi.z, ma.x, ma.y, ma.z, ma.x, mi.y, ma.z,
			// top
			mi.x, ma.y, ma.z, ma.x, ma.y, ma.z, ma.x, ma.y, mi.z,
			ma.x, ma.y, mi.z, mi.x, ma.y, mi.z, mi.x, ma.y, ma.z,
			// left
			mi.x, mi.y, mi.z, mi.x, mi.y, ma.z, mi.x, ma.y, ma.z,
			mi.x, ma.y, ma.z, mi.x, ma.y, mi.z, mi.x, mi.y, mi.z,
			// bottom
			mi.x, mi.y, mi.z, ma.x, mi.y, mi.z, ma.x, mi.y, ma.z,
			ma.x, mi.y, ma.z, mi.x, mi.y, ma.z, mi.x, mi.y, mi.z
		];

		this.makeVertexBuffer(vertices);
		this.elements = vertices.length / 3;

		let cubeTexture = gl.createTexture();
		let cubeImage = new Image();
		cubeImage.onload = function () {
			gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
		cubeImage.src = texture;
		this.texBuffer = cubeTexture;

		let uv = [
			// front
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
			// back
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
			// right
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
			// top
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
			// left
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
			// bottom
			0, 0, 1, 0, 1, 1,
			1, 1, 0, 1, 0, 0,
		];
		let uvBuffer = this.gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
		gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
		this.texCoords = uvBuffer;
	}

	/**
	 * Renders the textured box
	 * @param {Shader} shader - The shader used to render
	 */
	render(shader) {
		// vertex buffer
		const positionLocation = this.bindVertexBuffer(shader);

		// Bind the texture coordinates in this.texCoords
		// to their attribute in the shader
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoords);
		const texCoords = shader.getAttributeLocation("a_texCoord");
		this.gl.enableVertexAttribArray(texCoords);
		this.gl.vertexAttribPointer(texCoords, 2, this.gl.FLOAT, false, 0, 0);

		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBuffer);
		shader.getUniformInt("sampler").set(0);

		// draw
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.elements);

		// disable attributes
		this.gl.disableVertexAttribArray(positionLocation);
		this.gl.disableVertexAttribArray(texCoords);
	}
}