/**
 * Author: noxafy
 * Created: 28.08.18
 */
class RasterShape {
	constructor(gl) {
		this.gl = gl;
	}

	makeVertexBuffer(vertices) {
		const vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.vertexBuffer = vertexBuffer;
	}

	makeIndexBuffer(indices) {
		const indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
		this.indexBuffer = indexBuffer;
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
		const colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
		this.colorBuffer = colorBuffer;
	}

	makeNormalBuffer(normals) {
		const normalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
		this.normalBuffer = normalBuffer;
	}

	bindVertexBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		const positionLocation = shader.getAttributeLocation("a_position");
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
		return positionLocation;
	}

	bindColorBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		const colorLocation = shader.getAttributeLocation("a_color");
		this.gl.enableVertexAttribArray(colorLocation);
		this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);
		return colorLocation;
	}

	bindNormalBuffer(shader) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
		const normalLocation = shader.getAttributeLocation("a_normal");
		this.gl.enableVertexAttribArray(normalLocation);
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