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
	 * @param {WebGLRenderingContext} gl       - The canvas' context
	 * @param {Vector}          minPoint       - The minimal x,y,z of the box
	 * @param {Vector}          maxPoint       - The maximal x,y,z of the box
	 * @param {string}          diffuseTexture - The image filename for the diffuse texture
	 * @param {string}          normalTexture  - The image filename for the normal map
	 * @param {Material}        material       - The material properties of the box
	 */
	constructor(gl, minPoint, maxPoint, diffuseTexture, normalTexture, material) {
		super(gl);

		this.material = material;
		const mi = minPoint;
		const ma = maxPoint;

		// each face is declared by four independent vertices
		// so each vertex is represented fourfold
		const vertices = [
			// front
			mi.x, mi.y, ma.z, ma.x, ma.y, ma.z, // 0 :l,b,n 1 :r,t,n
			mi.x, ma.y, ma.z, ma.x, mi.y, ma.z, // 2 :l,t,n 3 :r,b,n
			// back
			mi.x, mi.y, mi.z, ma.x, ma.y, mi.z, // 4 :l,b,f 5 :r,t,f
			mi.x, ma.y, mi.z, ma.x, mi.y, mi.z, // 6 :l,t,f 7 :r,b,f
			// right
			ma.x, mi.y, mi.z, ma.x, ma.y, ma.z, // 8 :r,b,f 9 :r,t,n
			ma.x, mi.y, ma.z, ma.x, ma.y, mi.z, // 10:r,b,n 11:r,t,f
			// top
			mi.x, ma.y, mi.z, ma.x, ma.y, ma.z, // 12:l,t,f 13:r,t,n
			mi.x, ma.y, ma.z, ma.x, ma.y, mi.z, // 14:l,t,n 15:r,t,f
			// left
			mi.x, mi.y, mi.z, mi.x, ma.y, ma.z, // 16:l,b,f 17:l,t,n
			mi.x, mi.y, ma.z, mi.x, ma.y, mi.z, // 18:l,b,n 19:l,t,f
			// bottom
			mi.x, mi.y, mi.z, ma.x, mi.y, ma.z, // 20:l,b,f 21:r,b,n
			mi.x, mi.y, ma.z, ma.x, mi.y, mi.z  // 22:l,b,n 23:r,b,f
		];
		this.makeVertexBuffer(vertices);

		const indices = [
			0, 3, 1, 1, 2, 0,       // front
			4, 5, 7, 4, 6, 5,       // back
			8, 9, 10, 8, 11, 9,     // right
			12, 14, 13, 12, 13, 15, // top
			16, 18, 17, 16, 17, 19, // left
			20, 21, 22, 20, 23, 21, // bottom
		];
		this.makeIndexBuffer(indices);

		const uvs = [
			// front
			0, 1, 1, 0,
			0, 0, 1, 1,
			// back
			1, 1, 0, 0,
			1, 0, 0, 1,
			// right
			1, 1, 0, 0,
			0, 1, 1, 0,
			// top
			0, 0, 1, 1,
			0, 1, 1, 0,
			// left
			0, 1, 1, 0,
			1, 1, 0, 0,
			// bottom
			0, 1, 1, 0,
			0, 0, 1, 1
		];
		this.uvs = this.makeUVBuffer(uvs);

		const tangs = [
			// front
			1, 0, 0, 1, 0, 0,
			1, 0, 0, 1, 0, 0,
			// back
			-1, 0, 0, -1, 0, 0,
			-1, 0, 0, -1, 0, 0,
			// right
			0, 0, -1, 0, 0, -1,
			0, 0, -1, 0, 0, -1,
			// top
			1, 0, 0, 1, 0, 0,
			1, 0, 0, 1, 0, 0,
			// left
			0, 0, 1, 0, 0, 1,
			0, 0, 1, 0, 0, 1,
			// bottom
			1, 0, 0, 1, 0, 0,
			1, 0, 0, 1, 0, 0
		];
		this.tangs = this.makeTangentBuffer(tangs);

		const bitangs = [
			// front
			0, -1, 0, 0, -1, 0,
			0, -1, 0, 0, -1, 0,
			// back
			0, -1, 0, 0, -1, 0,
			0, -1, 0, 0, -1, 0,
			// right
			0, -1, 0, 0, -1, 0,
			0, -1, 0, 0, -1, 0,
			// top
			0, 0, 1, 0, 0, 1,
			0, 0, 1, 0, 0, 1,
			// left
			0, -1, 0, 0, -1, 0,
			0, -1, 0, 0, -1, 0,
			// bottom
			0, 0, -1, 0, 0, -1,
			0, 0, -1, 0, 0, -1
		];
		this.bitangs = this.makeBitangentBuffer(bitangs);
		this.texDiffuse = this.loadTexture(diffuseTexture);
		this.texNormal = this.loadTexture(normalTexture);
	}

	/**
	 * Renders the textured box
	 * @param {Shader} shader - The shader used to render
	 */
	render(shader) {
		// bind buffers
		const pos = this.bindVertexBuffer(shader);
		const uv = this.bindUVBuffer(shader);
		let tang, bitang;
		tang = this.bindTangBuffer(shader);
		bitang = this.bindBitangBuffer(shader);

		// activate diffuse texture
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texDiffuse);
		shader.getUniformInt("tex_diffuse").set(0);

		//  activate normal texture
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texNormal);
		shader.getUniformInt("tex_norm").set(1);

		// draw
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

		// disable attributes
		this.gl.disableVertexAttribArray(pos);
		this.gl.disableVertexAttribArray(uv);
		this.gl.disableVertexAttribArray(tang);
		this.gl.disableVertexAttribArray(bitang);
	}

	loadTexture(texture) {
		let imgTex = this.gl.createTexture();
		let cubeImage = new Image();
		(function (gl) {
			cubeImage.onload = function () {
				gl.bindTexture(gl.TEXTURE_2D, imgTex);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		})(this.gl);
		cubeImage.src = texture;
		return imgTex;
	}

	makeUVBuffer(uvs) {
		const uvBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
		return uvBuffer;
	}

	makeTangentBuffer(tangs) {
		const tang = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tang);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tangs), this.gl.STATIC_DRAW);
		return tang;
	}

	makeBitangentBuffer(bitangs) {
		let bitang = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bitang);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(bitangs), this.gl.STATIC_DRAW);
		return bitang;
	}

	bindBitangBuffer(shader) {
		const bitang = shader.getAttributeLocation("bitang");
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bitangs);
		this.gl.vertexAttribPointer(bitang, 3, this.gl.FLOAT, false, 0, 0);
		return bitang;
	}

	bindTangBuffer(shader) {
		const tang = shader.getAttributeLocation("tang");
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangs);
		this.gl.vertexAttribPointer(tang, 3, this.gl.FLOAT, false, 0, 0);
		return tang;
	}

	bindUVBuffer(shader) {
		const uv = shader.getAttributeLocation("uv");
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvs);
		this.gl.vertexAttribPointer(uv, 2, this.gl.FLOAT, false, 0, 0);
		return uv;
	}
}