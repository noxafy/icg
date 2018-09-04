/**
 * Class representing a Renderer that uses Rasterisation to render a Scenegraph
 */
class RasterRenderer extends Renderer {
	/**
	 * Creates a new RasterRenderer
	 * @param {WebGLRenderingContext} context
	 * @param {Shader} phongShader
	 * @param {Shader} textureShader
	 */
	constructor(context, phongShader, textureShader) {
		super(new RasterCameraTraverser(),
			new RasterLightTraverser(),
			new RasterDrawTraverser(phongShader, textureShader));
		this.gl = context;
	}

	/**
	 * Renders the Scenegraph
	 * @param {GroupNode} rootNode - The root node of the Scenegraph
	 */
	render(rootNode) {
		// clear
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		super.render(rootNode);
	}
}