/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */
class RasterVisitor {
	/**
	 * Creates a new RasterVisitor
	 * @param {WebGLRenderingContext} context
	 * @param {Shader} phongShader
	 * @param {Shader} textureShader
	 */
	constructor(context, phongShader, textureShader) {
		this.gl = context;
		this.phongShader = phongShader;
		this.textureShader = textureShader;

		this.cameraTraverser = new CameraTraverser(context, this);
		this.lightTraverser = new LightTraverser(context, this);
		this.drawTraverser = new DrawTraverser(context, this);
	}

	/**
	 * Renders the Scenegraph
	 * @param  {Node} rootNode                 - The root node of the Scenegraph
	 */
	render(rootNode) {
		// clear
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// camera traversal
		rootNode.accept(this.cameraTraverser);

		// light traversal
		this.lightPositions = [];
		this.lights = [];
		rootNode.accept(this.lightTraverser);

		// draw traversal
		rootNode.accept(this.drawTraverser);
	}
}

class RasterTraverser extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 */
	constructor(context, visitor) {
		super(context);
		this.visitor = visitor;
		this.modelMatrices = [];
	}

	/**
	 *
	 * @param {GroupNode} node
	 */
	visitGroupNode(node) {
		if (this.modelMatrices.length === 0) {
			this.modelMatrices.push(node.matrix);
		} else {
			const top = this.getM();
			this.modelMatrices.push(top.mul(node.matrix));
		}
		super.visitGroupNode(node);
		this.modelMatrices.pop();
	}

	/**
	 * Get the last (up-multiplied) matrix on the stack, also known as model matrix (M)
	 * @return {Matrix}
	 */
	getM() {
		return this.modelMatrices[this.modelMatrices.length - 1];
	}

	/**
	 * Setup uniform matrices needed for drawing projection, view and model matrix
	 * @param {Shader} shader
	 * @return {Matrix} Last element of this.modelMatrices to be used for normal calculation etc.
	 */
	setupPVM(shader) {
		// projection
		shader.getUniformMatrix("P").set(this.visitor.perspective);

		// view
		shader.getUniformMatrix("V").set(this.visitor.lookat);

		// model
		let mat = this.getM();
		let M = shader.getUniformMatrix("M");
		if (mat && M) M.set(mat);

		return mat;
	}

	/**
	 * Pass the properties of all lights to shader
	 * @param {Shader} shader
	 */
	setupLightProperties(shader) {
		for (let i = 0; i < this.visitor.lightPositions.length; i++) {
			let lightName = "lights[" + i + "]";
			let light = this.visitor.lights[i];

			shader.getUniformVec3(lightName + ".position").set(this.visitor.lightPositions[i]);
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
	 * @param {Shader} shader
	 * @param {Material} material
	 */
	setupMaterialProperties(shader, material) {
		shader.getUniformVec3("kA").set(material.ambient);
		shader.getUniformVec3("kD").set(material.diffuse);
		shader.getUniformVec3("kS").set(material.specular);
		shader.getUniformFloat("shininess").set(material.shininess);
	}

	setNormalMatrix(shader, mat) {
		// ((V * M)^T)^-1
		shader.getUniformMatrix("N").set(this.visitor.lookat.mul(mat).transpose().invert());
	}
}

// you can set this in console to get one debug log of the current lookat matrix
window.debugLookAt = false;

class CameraTraverser extends RasterTraverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitCameraNode(node) {
		this.visitor.lookat = Matrix.lookat(
			node.eye,
			node.center,
			node.up
		);
		if (this.modelMatrices.length > 0) {
			this.visitor.lookat = this.getM().invert().mul(this.visitor.lookat);
		}
		if (window.debugLookAt) {
			console.log("lookat:");
			console.log(this.visitor.lookat.toString());
			window.debugLookAt = false;
		}

		this.visitor.perspective = Matrix.perspective(
			camera.fovy,
			camera.aspect,
			camera.near,
			camera.far
		);
	}
}

class LightTraverser extends RasterTraverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitLightNode(node) {
		let pos = this.getM().mul(node.position);
		// P * V * M (so we don't have to do that in vertex shader and can pass it directly to fragment shader)
		pos = this.visitor.perspective.mul(this.visitor.lookat).mul(pos);
		this.visitor.lightPositions.push(pos);
		this.visitor.lights.push(node);
	}
}

class DrawTraverser extends RasterTraverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitLightableNode(node) {
		let phongShader = this.visitor.phongShader;
		phongShader.use();

		let mat = this.setupPVM(phongShader);
		this.setNormalMatrix(phongShader, mat);
		this.setupLightProperties(phongShader);
		this.setupMaterialProperties(phongShader, node.material);

		node.raster.render(phongShader);
	}

	visitTextureBoxNode(node) {
		let textureShader = this.visitor.textureShader;
		textureShader.use();

		let mat = this.setupPVM(textureShader);

		node.raster.render(textureShader);
	}
}

/**
 * Class representing a Visitor that sets up buffers for use by the RasterVisitor
 */
class RasterSetupVisitor extends Visitor {
	/**
	 * Sets up all needed buffers
	 * @param  {Node} rootNode - The root node of the Scenegraph
	 */
	setup(rootNode) {
		// Clear to white, fully opaque
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		// Clear everything
		this.gl.clearDepth(1.0);
		// Enable depth testing
		this.gl.enable(gl.DEPTH_TEST);
		this.gl.depthFunc(gl.LEQUAL);

		rootNode.accept(this);
	}

	visitLightableNode(node) {
		node.setRasterRenderer(this.gl);
	}

	visitTextureBoxNode(node) {
		node.setRasterRenderer(this.gl);
	}
}
