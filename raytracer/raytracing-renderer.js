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
		console.time("super.render")
		super.render(rootNode);
		console.timeEnd("super.render")

		console.time("trace")
		const rw = (this.imageData.width - 1) / 2;
		const rh = (this.imageData.height - 1) / 2;
		const width = this.imageData.width;
		const height = this.imageData.height;
		const data = this.imageData.data;
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const ray = Ray.makeRay(rw, rh, x, y, this.camera);

				let minIntersection = new Intersection();
				let minObj = null;
				for (let shape of this.objects) {
					const intersection = shape.intersect(ray);
					if (intersection && intersection.closerThan(minIntersection)) {
						minIntersection = intersection;
						minObj = shape;
					}
				}
				if (minObj) {
					let color = phong(minObj.color, minIntersection, this.lights, camera.eye);
					data[4 * (width * y + x)] = color.r * 255;
					data[4 * (width * y + x) + 1] = color.g * 255;
					data[4 * (width * y + x) + 2] = color.b * 255;
					data[4 * (width * y + x) + 3] = color.a * 255;
				}
			}
		}
		console.timeEnd("trace")
		this.context.putImageData(this.imageData, 0, 0);
	}

	clear() {
		this.imageData.data.fill(0);
		this.objects = [];
	}

}