class Visitor {
	constructor(context) {
		this.gl = context;
	}

	/**
	 * Visits a group node
	 * @param  {GroupNode} node - The node to visit
	 */
	visitGroupNode(node) {
		throw Error("Unsupported operation");
	}

	/**
	 * Visits a sphere node
	 * @param  {SphereNode} node - The node to visit
	 */
	visitSphereNode(node) {
		throw Error("Unsupported operation");
	}

	/**
	 * Visits an axis aligned box node
	 * @param  {AABoxNode} node - The node to visit
	 */
	visitAABoxNode(node) {
		throw Error("Unsupported operation");
	}

	/**
	 * Visits a textured box node. Loads the texture
	 * and creates a uv coordinate buffer
	 * @param  {TextureBoxNode} node - The node to visit
	 */
	visitTextureBoxNode(node) {
		throw Error("Unsupported operation");
	}

	/**
	 * Visits a camera node. Updates the lookat and perspective matrices.
	 * @param  {CameraNode} node - The node to visit
	 */
	visitCameraNode(node) {
		throw Error("Unsupported operation");
	}

	/**
	 * Visits a light node. //TODO
	 * @param  {LightNode} node - The node to visit
	 */
	visitLightNode(node) {
		throw Error("Unsupported operation");
	}
}

/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */
class RasterVisitor extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 * @param {WebGLRenderingContext} context
	 * @param {Shader} phongShader
	 * @param {Shader} textureShader
	 */
	constructor(context, phongShader, textureShader) {
		super(context);
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
		this.cameraTraverser.traverse(rootNode);

		// light traversal
		this.lightPositions = [];
		this.lights = [];
		this.lightTraverser.traverse(rootNode);

		// draw traversal
		this.drawTraverser.traverse(rootNode);
	}
}

class Traverser extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 */
	constructor(context, visitor) {
		super(context);
		this.visitor = visitor;
		this.modelMatrices = [];
	}

	visitGroupNode(node) {
		if (this.modelMatrices.length === 0) {
			this.modelMatrices.push(node.matrix);
		} else {
			const top = this.modelMatrices[this.modelMatrices.length - 1];
			this.modelMatrices.push(top.mul(node.matrix));
		}
		for (let childNode of node.children) {
			childNode.accept(this);
		}
		this.modelMatrices.pop();
	}

	/**
	 * Setup uniform matrices needed for drawing projection, view and model matrix
	 * @param {Shader} shader
	 * @return {Matrix} Last element of this.modelMatrices to be used for normal calculation etc.
	 */
	setupPVM(shader) {
		let mat = this.modelMatrices[this.modelMatrices.length - 1];

		// projection
		let P = shader.getUniformMatrix("P");
		if (this.visitor.perspective && P) P.set(this.visitor.perspective);
		// view
		let V = shader.getUniformMatrix("V");
		if (this.visitor.lookat && V) V.set(this.visitor.lookat);

		// model
		let M = shader.getUniformMatrix("M");
		if (mat && M) M.set(mat);

		return mat;
	}

	setupLightProperties(shader) {
		for (let i = 0; i < this.visitor.lightPositions.length; i++) {
			shader.getUniformVec3Array("f_lightPoses").set(this.visitor.lightPositions);
			let lightName = "lights[" + i + "]";
			let light = this.visitor.lights[i];
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
	 *
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
		let N = shader.getUniformMatrix("N");
		if (this.visitor.lookat && N) {
			N.set(this.visitor.lookat.mul(mat).invert().transpose())
		}
	}
	/**
	 * Start traversing here
	 * @param {Node} node
	 */
	traverse(node) {
		node.accept(this);
	}
}

// you can set this in console to get one debug log of current lookat matrix
window.debugLookAt = false;

class CameraTraverser extends Traverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitSphereNode(node) {
		// do nothing
	}

	visitAABoxNode(node) {
		// do nothing
	}

	visitTextureBoxNode(node) {
		// do nothing
	}

	visitCameraNode(node) {
		this.visitor.lookat = Matrix.lookat(
			node.eye,
			node.center,
			node.up
		);
		if (window.debugLookAt) {
			console.log("Old lookat");
			console.log(this.visitor.lookat.data);
		}
		if (this.modelMatrices.length > 0) {
			if (window.debugLookAt) {
				console.log("modelMatrices.last");
				console.log(this.modelMatrices[this.modelMatrices.length - 1].data);
				console.log(this.modelMatrices[this.modelMatrices.length - 1].invert().data);
			}
			this.visitor.lookat = this.modelMatrices[this.modelMatrices.length - 1].invert().mul(this.visitor.lookat);
		}
		if (window.debugLookAt) {
			console.log("New lookat");
			console.log(this.visitor.lookat.data);
			window.debugLookAt = false;
		}

		this.visitor.perspective = Matrix.perspective(
			camera.fovy,
			camera.aspect,
			camera.near,
			camera.far
		);
	}

	visitLightNode(node) {
		// do nothing
	}
}

class LightTraverser extends Traverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitSphereNode(node) {
		// do nothing
	}

	visitAABoxNode(node) {
		// do nothing
	}

	visitTextureBoxNode(node) {
		// do nothing
	}

	visitCameraNode(node) {
		// do nothing
	}

	visitLightNode(node) {
		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		let pos = this.visitor.lookat.mul(mat).mul(node.position);
		pos.z = 2 * this.visitor.lookat.getVal(2, 3) - pos.z;
		this.visitor.lightPositions.push(pos);
		this.visitor.lights.push(node);
	}
}

class DrawTraverser extends Traverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context, visitor);
	}

	visitSphereNode(node) {
		let phongShader = this.visitor.phongShader;
		phongShader.use();

		let mat = this.setupPVM(phongShader);
		this.setupLightProperties(phongShader);
		this.setupMaterialProperties(phongShader, node.material);
		this.setNormalMatrix(phongShader, mat);

		node.rastersphere.render(phongShader);
	}

	visitAABoxNode(node) {
		let phongShader = this.visitor.phongShader;
		phongShader.use();

		let mat = this.setupPVM(phongShader);
		this.setupLightProperties(phongShader);
		this.setupMaterialProperties(phongShader, node.material);

		node.rasterbox.render(phongShader);
	}

	visitTextureBoxNode(node) {
		let textureShader = this.visitor.textureShader;
		textureShader.use();

		let mat = this.setupPVM(textureShader);

		node.rastertexturebox.render(textureShader);
	}

	visitCameraNode(node) {
		// do nothing
	}

	visitLightNode(node) {
		// do nothing
	}
}

/** Class representing a Visitor that sets up buffers for use by the RasterVisitor */
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

	visitGroupNode(node) {
		for (let child of node.children) {
			child.accept(this);
		}
	}

	visitSphereNode(node) {
		node.setRastersphere(this.gl);
	}

	visitAABoxNode(node) {
		node.setRasterbox(this.gl);
	}

	visitTextureBoxNode(node) {
		node.setRasterTextureBox(this.gl);
	}

	visitCameraNode(node) {
		// nothing to do
	}

	visitLightNode(node) {
		// nothing to do
	}
}
