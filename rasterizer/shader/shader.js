// Refer to https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Hinzuf%C3%BCgen_von_2D_Inhalten_in_einen_WebGL-Kontext
/**
 * Class to assemble a Shader to use with WebGL
 */
class Shader {
	/**
	 * Creates a shader
	 * @param {Object} gl   - The 3D context
	 * @param {string} vsId - The id of the vertex shader script node
	 * @param {string} fsId - The id of the fragment shader script node
	 */
	constructor(gl, vsId, fsId) {
		this.vsFilename = vsId;
		this.fsFilename = fsId;

		this.gl = gl;
	}

	static loadShader(gl, content, type) {
		const shader = gl.createShader(type);
		// Send the source to the shader object
		gl.shaderSource(shader, content);
		// Compile the shader program
		gl.compileShader(shader);

		// See if it compiled successfully
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("An error occurred compiling the shaders: ", gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	async load(vsContent, fsContent) {
		let gl = this.gl;
		let vertexShader, fragmentShader;
		if (vsContent) vertexShader = Shader.loadShader(gl, vsContent, gl.VERTEX_SHADER);
		else {
			vertexShader = this.getShader(gl, this.vsFilename, gl.VERTEX_SHADER);
		}

		if (fsContent) fragmentShader = Shader.loadShader(gl, fsContent, gl.FRAGMENT_SHADER);
		else {
			fragmentShader = this.getShader(gl, this.fsFilename, gl.FRAGMENT_SHADER);
		}

		return Promise.all([vertexShader, fragmentShader]).then(shaderParts => {
			// Create the shader program
			this.shaderProgram = gl.createProgram();
			gl.attachShader(this.shaderProgram, shaderParts[0]);
			gl.attachShader(this.shaderProgram, shaderParts[1]);
			gl.linkProgram(this.shaderProgram);

			// If creating the shader program failed, error
			if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
				console.error("Unable to initialize the shader program: ", gl.getProgramInfoLog(this.shaderProgram));
			}
		});
	}

	/**
	 * Use this shader program for the next
	 * WebGL calls
	 */
	use() {
		this.gl.useProgram(this.shaderProgram);
	}

	/**
	 * Returns the attribute location of a variable in the shader program
	 * @param  {string} name - The name of the variable
	 * @return {number}        The variable's location
	 */
	getAttributeLocation(name) {
		const attr = this.gl.getAttribLocation(this.shaderProgram, name);
		if (attr != -1) {
			this.gl.enableVertexAttribArray(attr);
		}
		return attr;
	}

	/**
	 * Loads a shader part from its script DOM node and compiles it
	 * @param  {Object} gl       - The 3D context
	 * @param  {string} filename - The filename of the shader script
	 * @param  {number} type     - The type of the shader (fragment or vertex)
	 * @return {Object}          The resulting shader part
	 */
	async getShader(gl, filename, type) {
		const source = fetch(filename).then(response => response.text());
		return source.then(s => Shader.loadShader(gl, s, type));
	}

	/**
	 * Returns an object that can be used to set a matrix on the GPU
	 * @param  {string} name   - The name of the uniform to set
	 * @return {UniformMatrix}   The resulting object
	 */
	getUniformMatrix(name) {
		return new UniformMatrix(this.gl,
			this.gl.getUniformLocation(this.shaderProgram, name)
		);
	}

	/**
	 * Returns an object that can be used to set a 3D vector on the GPU
	 * @param  {string} name - The name of the uniform to set
	 * @return {UniformVec3}   The resulting object
	 */
	getUniformVec3(name) {
		return new UniformVec3(this.gl,
			this.gl.getUniformLocation(this.shaderProgram, name)
		);
	}

	/**
	 * Returns an object that can be used to set an array of 3D vectors on the GPU
	 * @param  {string} name - The name of the uniform to set
	 * @return {UniformVec3Array}   The resulting object
	 */
	getUniformVec3Array(name) {
		return new UniformVec3Array(this.gl,
			this.gl.getUniformLocation(this.shaderProgram, name)
		);
	}

	/**
	 * Returns an object that can be used to set an float on the GPU
	 * @param  {string} name - The name of the uniform to set
	 * @return {UniformInt}    The resulting object
	 */
	getUniformFloat(name) {
		return new UniformFloat(this.gl,
			this.gl.getUniformLocation(this.shaderProgram, name)
		);
	}

	/**
	 * Returns an object that can be used to set an int on the GPU
	 * @param  {string} name - The name of the uniform to set
	 * @return {UniformInt}    The resulting object
	 */
	getUniformInt(name) {
		return new UniformInt(this.gl,
			this.gl.getUniformLocation(this.shaderProgram, name)
		);
	}
}

/**
 * Handler class to set uniform matrices
 * in the shader program
 */
class UniformMatrix {
	constructor(gl, position) {
		this.gl = gl;
		this.position = position;
	}

	/**
	 * Sends the given matrix to the GPU
	 * @param {Matrix} matrix - The matrix to send
	 */
	set(matrix) {
		this.gl.uniformMatrix4fv(
			this.position,
			false,
			matrix.data);
	}
}

/**
 * Handler class to set uniform vectors
 * in the shader program
 */
class UniformVec3 {
	constructor(gl, position) {
		this.gl = gl;
		this.position = position;
	}

	/**
	 * Sends the given vector to the GPU as 3dimensional vector
	 * @param {Vector} vec - The vector to send
	 */
	set(vec) {
		this.gl.uniform3f(
			this.position, vec.x, vec.y, vec.z
		);
	}
}

/**
 * Handler class to set uniform vectors
 * in the shader program
 */
class UniformVec3Array {
	constructor(gl, position) {
		this.gl = gl;
		this.position = position;
	}

	/**
	 * Sends the given vector to the GPU as 3dimensional vector
	 * @param {Array<Vector>} vecs - The vector to send
	 */
	set(vecs) {
		let arr = new Float32Array(vecs.length * 3);
		vecs.forEach((vec, idx) => {
			arr[idx] = vec.data[0];
			arr[idx + 1] = vec.data[1];
			arr[idx + 2] = vec.data[2];
		})
		this.gl.uniform3fv(this.position, arr);
	}
}

/**
 * Handler class to set uniform floats
 * in the shader program
 */
class UniformFloat {
	constructor(gl, position) {
		this.gl = gl;
		this.position = position;
	}

	/**
	 * Sends the given float value to the GPU
	 * @param {number} value - The float value to send
	 */
	set(value) {
		this.gl.uniform1f(this.position, value);
	}
}

/**
 * Handler class to set uniform ints
 * in the shader program
 */
class UniformInt {
	constructor(gl, position) {
		this.gl = gl;
		this.position = position;
	}

	/**
	 * Sends the given int value to the GPU
	 * @param {number} value - The int value to send
	 */
	set(value) {
		this.gl.uniform1i(this.position, value);
	}
}
