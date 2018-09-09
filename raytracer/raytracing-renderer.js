/**
 * Class representing a Renderer that uses Raytracing to render a Scenegraph
 * Author: noxafy
 * Created: 04.09.18
 */
class RayTracingRenderer extends Renderer {
	/**
	 * Creates a new RayTracingRenderer
	 * @param {CanvasRenderingContext2D} context
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(context, width, height) {
		super(new RayTracingCameraTraverser(),
			new RayTracingLightTraverser(),
			new RayTracingDrawTraverser());
		this.context = context;
		this.imageData = context.getImageData(0, 0, width, height);
	}

	/**
	 * Renders the Scenegraph
	 * @param {GroupNode} rootNode - The root node of the Scenegraph
	 */
	render(rootNode) {
		super.render(rootNode);

		const rw = (this.imageData.width - 1) / 2;
		const rh = (this.imageData.height - 1) / 2;
		const width = this.imageData.width;
		const height = this.imageData.height;
		const data = this.imageData.data;
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const ray = Raytracer.makeRay(rw, rh, x, y, this.camera);

				Raytracer.findMinIntersection(ray, this.objects, (minObj, minIntersection) => {
					if (minObj) {
						let color = Raytracer.phong(minObj, minIntersection, this.lights, this.camera.eye);
						data[4 * (width * y + x)] = color.r * 255;
						data[4 * (width * y + x) + 1] = color.g * 255;
						data[4 * (width * y + x) + 2] = color.b * 255;
						data[4 * (width * y + x) + 3] = color.a * 255;
					}
				});
			}
		}
		this.context.putImageData(this.imageData, 0, 0);
	}

	clear() {
		this.imageData.data.fill(0);
		/**
		 *
		 * @type {Array.<Shape>}
		 */
		this.objects = [];
	}

}