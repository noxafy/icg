/**
 * Author: noxafy
 * Created: 28.08.18
 */
class RasterShape {
	constructor(gl) {
		this.gl = gl;
	}

	init(vertices, indices, normals, colors) {
		this.makeVertexBuffer(vertices);
		this.makeIndexBuffer(indices);
		this.makeNormalBuffer(normals);
		this.makeColorBuffer(colors);
	}

	makeVertexBuffer(vertices) {
		this.vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	}

	makeIndexBuffer(indices) {
		this.indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
		this.elements = indices.length;
	}

	static generateColors(size, color) {
		let colors = new Array(size);
		for (let i = 0; i < size; i++) {
			colors[i] = color.data[i % 3];
		}
		return colors;
	}

	makeColorBuffer(colors) {
		this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
	}

	makeNormalBuffer(normals) {
		this.normalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
	}

	bindVertexBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		const positionLocation = shader.getAttributeLocation("pos");
		this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
		return positionLocation;
	}

	bindColorBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		const colorLocation = shader.getAttributeLocation("a_color");
		this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);
		return colorLocation;
	}

	bindNormalBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
		const normalLocation = shader.getAttributeLocation("a_normal");
		this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);
		return normalLocation;
	}

	/**
	 * Renders the shape
	 * @param {Shader} shader - The shader used to render
	 */
	render(shader) {
		const positionLocation = this.bindVertexBuffer(shader);
		const colorLocation = this.bindColorBuffer(shader);
		const normalLocation = this.bindNormalBuffer(shader);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

		this.gl.disableVertexAttribArray(positionLocation);
		this.gl.disableVertexAttribArray(colorLocation);
		this.gl.disableVertexAttribArray(normalLocation);
	}
}