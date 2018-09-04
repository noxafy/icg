/**
 * Class representing a Visitor that sets up buffers for use by the RasterRenderer
 */
class RasterSetupVisitor extends Visitor {

	/**
	 * Creates a new RasterSetupVisitor
	 * @param {WebGLRenderingContext} context
	 */
	constructor(context) {
		super();
		this.gl = context;
	}

	/**
	 * Sets up all needed buffers
	 * @param {Node} rootNode - The root node of the Scenegraph
	 */
	setup(rootNode) {
		// Clear to white, fully opaque
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		// Clear everything
		this.gl.clearDepth(1.0);
		// Enable depth testing
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);

		rootNode.accept(this);
	}

	visitLightableNode(node) {
		node.setRasterRenderer(this.gl);
	}

	visitTextureBoxNode(node) {
		node.setRasterRenderer(this.gl);
	}
}