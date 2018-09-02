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
	 * Visits a lightable node
	 * @param  {LightableNode} node - The node to visit
	 */
	visitLightableNode(node) {
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
	 * Visits a light node. Calculates and saves the light and its position.
	 * @param  {LightNode} node - The node to visit
	 */
	visitLightNode(node) {
		throw Error("Unsupported operation");
	}
}