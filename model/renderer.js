/**
 * Abstract renderer class using threefold visitor pattern for camera traversing, light travering and draw traversing.
 *
 * Author: noxafy
 * Created: 03.09.18
 */
class Renderer {

	/**
	 * Create a new abstract renderer taking the three traversers as arguments
	 * @param {CameraTraverser} cameraTraverser
	 * @param {LightTraverser}  lightTraverser
	 * @param {DrawTraverser}   drawTraverser
	 */
	constructor(cameraTraverser, lightTraverser, drawTraverser) {
		this.cameraTraverser = cameraTraverser;
		this.lightTraverser = lightTraverser;
		this.drawTraverser = drawTraverser;

		this.cameraTraverser.setRenderer(this);
		if (this.lightTraverser) this.lightTraverser.setRenderer(this);
		this.drawTraverser.setRenderer(this);
	}

	/**
	 * Renders the Scenegraph, traversing scene graph for camera, lights and shapes
	 * @param {GroupNode} rootNode - The root node of the Scenegraph
	 */
	render(rootNode) {
		this.clear();

		// camera traversal
		rootNode.accept(this.cameraTraverser);

		// light traversal
		if (this.lightTraverser) {
			this.lights = [];
			rootNode.accept(this.lightTraverser);
		}

		// draw traversal
		rootNode.accept(this.drawTraverser);
	}

	/**
	 * Clear the screen
	 */
	clear() {
	}
}

