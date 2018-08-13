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
}

/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */
class RasterVisitor extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 */
	constructor(context, phongShader, textureShader) {
		super(context);
		this.modelMatrices = [];
		this.phongShader = phongShader;
		this.textureshader = textureShader;
	}

	/**
	 * Renders the Scenegraph
	 * @param  {Node} rootNode                 - The root node of the Scenegraph
	 * @param  {Array.<Vector>} lightPositions - The light light positions
	 */
	render(rootNode, camera, lightPositions) {
		// clear
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.setupCamera(camera);

		// traverse and render
		rootNode.accept(this);
	}

	/**
	 * Helper function to setup camera matrices
	 * @param  {Object} camera - The camera used
	 */
	setupCamera(camera) {
		if (camera) {
			this.lookat = Matrix.lookat(
				camera.eye,
				camera.center,
				camera.up);

			this.perspective = Matrix.perspective(
				camera.fovy,
				camera.aspect,
				camera.near,
				camera.far
			);
		}
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

	visitSphereNode(node) {
		const shader = this.phongShader;
		shader.use();
		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		shader.getUniformMatrix("M").set(mat);

		let V = shader.getUniformMatrix("V");
		let N = shader.getUniformMatrix("N");
		if (this.lookat) {
			if (V) V.set(this.lookat);
			// set the normal matrix
			if (N) N.set(this.lookat.mul(mat).invert().transpose())
		}
		let P = shader.getUniformMatrix("P");
		if (P && this.perspective) {
			P.set(this.perspective);
		}

		node.rastersphere.render(shader);
	}

	visitAABoxNode(node) {
		this.phongShader.use();
		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		this.phongShader.getUniformMatrix("M").set(mat);
		let V = this.phongShader.getUniformMatrix("V");
		if (V && this.lookat) {
			V.set(this.lookat);
		}
		let P = this.phongShader.getUniformMatrix("P");
		if (P && this.perspective) {
			P.set(this.perspective);
		}

		node.rasterbox.render(this.phongShader);
	}

	visitTextureBoxNode(node) {
		this.textureshader.use();

		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		this.textureshader.getUniformMatrix("M").set(mat);
		let P = this.textureshader.getUniformMatrix("P");
		if (P && this.perspective) {
			P.set(this.perspective);
		}
		this.textureshader.getUniformMatrix("V").set(this.lookat);

		node.rastertexturebox.render(this.textureshader);
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
		node.rastersphere = new RasterSphere(this.gl, node.center, node.radius, node.color);
	}

	visitAABoxNode(node) {
		node.rasterbox = new RasterBox(this.gl, node.minPoint, node.maxPoint);
	}

	visitTextureBoxNode(node) {
		node.rastertexturebox = new RasterTextureBox(this.gl, node.minPoint, node.maxPoint, node.texture);
	}
}
