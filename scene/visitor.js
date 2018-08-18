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

window.debugLookAt = false;

/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */
class RasterVisitor extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 */
	constructor(context, phongShader, textureShader) {
		super(context);
		this.phongShader = phongShader;
		this.textureShader = textureShader;

		this.cameraTraverser = new CameraTraverser(context, this);
		this.lightTraverser = new LightTraverser(context, this);
		this.drawTraverser = new DrawTraverser(context, this);

		this.modelMatrices = [];
	}

	/**
	 * Renders the Scenegraph
	 * @param  {Node} rootNode                 - The root node of the Scenegraph
	 * @param  {Array.<Vector>} lightPositions - The light light positions
	 */
	render(rootNode, lightPositions) {
		// clear
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// camera traversal
		this.cameraTraverser.traverse(rootNode);

		// light traversal
		this.lightTraverser.traverse(rootNode);

		// draw traversal
		this.drawTraverser.traverse(rootNode);
	}
}

class Traverser extends Visitor {
	/**
	 * Creates a new RasterVisitor
	 */
	constructor(context) {
		super(context);
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
	 * Start traversing here
	 * @param {Node} node
	 */
	traverse(node) {
		node.accept(this);
	}
}

class CameraTraverser extends Traverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context);
		this.visitor = visitor;
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
		super(context);
		this.visitor = visitor;
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
		// TODO
	}
}

class DrawTraverser extends Traverser {

	/**
	 * Creates a new camera traverser
	 */
	constructor(context, visitor) {
		super(context);
		this.visitor = visitor;
	}

	visitSphereNode(node) {
		let phongShader = this.visitor.phongShader;
		phongShader.use();

		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		phongShader.getUniformMatrix("M").set(mat);

		let V = phongShader.getUniformMatrix("V");
		let N = phongShader.getUniformMatrix("N");
		if (this.visitor.lookat) {
			if (V) V.set(this.visitor.lookat);
			// set the normal matrix
			if (N) N.set(this.visitor.lookat.mul(mat).invert().transpose())
		}

		let P = phongShader.getUniformMatrix("P");
		if (P && this.visitor.perspective) {
			P.set(this.visitor.perspective);
		}

		node.rastersphere.render(phongShader);
	}

	visitAABoxNode(node) {
		let phongShader = this.visitor.phongShader;
		phongShader.use();

		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		phongShader.getUniformMatrix("M").set(mat);

		let V = phongShader.getUniformMatrix("V");
		if (V && this.visitor.lookat) {
			V.set(this.visitor.lookat);
		}

		let P = phongShader.getUniformMatrix("P");
		if (P && this.visitor.perspective) {
			P.set(this.visitor.perspective);
		}

		node.rasterbox.render(phongShader);
	}

	visitTextureBoxNode(node) {
		let textureShader = this.visitor.textureShader;
		textureShader.use();

		let mat = this.modelMatrices[this.modelMatrices.length - 1];
		textureShader.getUniformMatrix("M").set(mat);
		let V = textureShader.getUniformMatrix("V");
		if (V && this.visitor.lookat) {
			V.set(this.visitor.lookat);
		}

		let P = textureShader.getUniformMatrix("P");
		if (P && this.visitor.perspective) {
			P.set(this.visitor.perspective);
		}

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
