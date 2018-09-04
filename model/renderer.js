/**
 * Author: noxafy
 * Created: 03.09.18
 */
class Renderer {

	/**
	 * Create a new renderer taking the three traversers as arguments
	 * @param {CameraTraverser} cameraTraverser
	 * @param {LightTraverser}  lightTraverser
	 * @param {DrawTraverser}   drawTraverser
	 */
	constructor(cameraTraverser, lightTraverser, drawTraverser) {
		this.cameraTraverser = cameraTraverser;
		this.lightTraverser = lightTraverser;
		this.drawTraverser = drawTraverser;

		this.cameraTraverser.setRenderer(this);
		this.lightTraverser.setRenderer(this);
		this.drawTraverser.setRenderer(this);
	}

	/**
	 * Renders the Scenegraph, traversing scene graph for camera, lights and shapes
	 * @param {GroupNode} rootNode - The root node of the Scenegraph
	 */
	render(rootNode) {
		// camera traversal
		rootNode.accept(this.cameraTraverser);

		// light traversal
		this.lightPositions = [];
		this.lights = [];
		rootNode.accept(this.lightTraverser);

		// draw traversal
		rootNode.accept(this.drawTraverser);
	}

	/**
	 * Add a light to the cache. Should be called by the light traverser.
	 * @param {Position}  pos  - The position of the light node as used by the draw traverser
	 * @param {LightNode} node - The light node as used by the draw traverser
	 */
	addLight(pos, node) {
		this.lightPositions.push(pos);
		this.lights.push(node);
	}
}

