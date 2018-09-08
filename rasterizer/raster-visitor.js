// you can set this in console to get one debug log of the current lookat matrix
window.debugLookAt = false;

class RasterCameraTraverser extends CameraTraverser {

	visitCameraNode(node) {
		this.renderer.lookat = Matrix.lookat(
			node.eye,
			node.center,
			node.up
		);
		if (this.modelMatrices.length > 0) {
			this.renderer.lookat = this.getTopMatrix().invert().mul(this.renderer.lookat);
		}
		if (window.debugLookAt) {
			console.log("lookat:");
			console.log(this.renderer.lookat.toString());
			window.debugLookAt = false;
		}

		this.renderer.perspective = Matrix.perspective(
			camera.fovy,
			camera.aspect,
			camera.near,
			camera.far
		);
	}
}

class RasterLightTraverser extends LightTraverser {

	visitLightNode(node) {
		let pos = this.getTopMatrix().mul(node.position);
		// P * V * M (so we don't have to do that in vertex shader and can pass it directly to fragment shader)
		node.p_v_m_position = this.renderer.perspective.mul(this.renderer.lookat).mul(pos);
		this.renderer.lights.push(node);
	}
}

class RasterDrawTraverser extends DrawTraverser {

	constructor(phongShader, textureShader) {
		super();
		this.phongShader = phongShader;
		this.textureShader = textureShader;
	}

	visitLightableNode(node) {
		let phongShader = this.phongShader;
		phongShader.use();

		let mat = this.setupPVM(phongShader);
		this.setupN(phongShader, mat);
		this.setupLightProperties(phongShader);
		this.setupMaterialProperties(phongShader, node.material);

		node.raster.render(phongShader);
	}

	visitTextureBoxNode(node) {
		let textureShader = this.textureShader;
		textureShader.use();

		let mat = this.setupPVM(textureShader);

		node.raster.render(textureShader);
	}

	/**
	 * Setup uniform matrices needed for drawing projection, view and model matrix
	 * @param {Shader}  shader
	 * @return {Matrix} Last element of this.modelMatrices to be used for normal calculation etc.
	 */
	setupPVM(shader) {
		// projection
		shader.getUniformMatrix("P").set(this.renderer.perspective);

		// view
		shader.getUniformMatrix("V").set(this.renderer.lookat);

		// model
		let mat = this.getTopMatrix();
		if (mat) shader.getUniformMatrix("M").set(mat);

		return mat;
	}

	/**
	 * Pass the properties of all lights to shader
	 * @param {Shader} shader
	 */
	setupLightProperties(shader) {
		for (let i = 0; i < this.renderer.lights.length; i++) {
			let lightName = "lights[" + i + "]";
			let light = this.renderer.lights[i];

			shader.getUniformVec3(lightName + ".position").set(light.p_v_m_position);
			shader.getUniformVec3(lightName + ".color").set(light.color);

			shader.getUniformFloat(lightName + ".intensity").set(light.intensity);
			shader.getUniformFloat(lightName + ".constant").set(light.constant);
			shader.getUniformFloat(lightName + ".linear").set(light.linear);
			shader.getUniformFloat(lightName + ".quadratic").set(light.quadratic);

			shader.getUniformVec3(lightName + ".ambient").set(light.ambient);
			shader.getUniformVec3(lightName + ".diffuse").set(light.diffuse);
			shader.getUniformVec3(lightName + ".specular").set(light.specular);
		}
	}

	/**
	 * Pass the material properties to shader
	 * @param {Shader}   shader
	 * @param {Material} material
	 */
	setupMaterialProperties(shader, material) {
		shader.getUniformVec3("kA").set(material.ambient);
		shader.getUniformVec3("kD").set(material.diffuse);
		shader.getUniformVec3("kS").set(material.specular);
		shader.getUniformFloat("shininess").set(material.shininess);
	}

	/**
	 * Setup the normal matrix (N)
	 * @param {Shader} shader
	 * @param {Matrix} mat
	 */
	setupN(shader, mat) {
		// ((V * M)^T)^-1
		shader.getUniformMatrix("N").set(this.renderer.lookat.mul(mat).transpose().invert());
	}
}

