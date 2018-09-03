class Visitor {
	constructor(context) {
		this.gl = context;
	}

	/**
	 * Visits a group node, calling accept for all children.
	 * @param  {GroupNode} node - The node to visit
	 */
	visitGroupNode(node) {
		for (let child of node.children) {
			child.accept(this);
		}
	}

	/**
	 * Visits a lightable node
	 * @param  {LightableNode} node - The node to visit
	 */
	visitLightableNode(node) {
	}

	/**
	 * Visits a textured box node. Loads the texture
	 * and creates a uv coordinate buffer
	 * @param  {TextureBoxNode} node - The node to visit
	 */
	visitTextureBoxNode(node) {
	}

	/**
	 * Visits a camera node. Updates the lookat and perspective matrices.
	 * @param  {CameraNode} node - The node to visit
	 */
	visitCameraNode(node) {
	}

	/**
	 * Visits a light node. Calculates and saves the light and its position.
	 * @param  {LightNode} node - The node to visit
	 */
	visitLightNode(node) {
	}
}