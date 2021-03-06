/**
 * Author: noxafy
 * Created: 02.09.18
 */
const pvsContent = undefined;
const pfsContent = undefined;
const tvsContent = undefined;
const tfsContent = undefined;

class RenderProcess {

	constructor() {
		this.onStop = undefined;
	}

	start() {
		if (Preferences.canvas.useRasterRenderer) {
			this.startRasterizer();
		} else {
			this.startRayTracer();
		}
	}

	startRasterizer() {
		const rasterizer = Preferences.canvas.rasterizer;
		const gl = rasterizer.getContext("webgl");

		const setupVisitor = new RasterSetupVisitor(gl);
		setupVisitor.setup(window.sg);

		const phongShader = new Shader(gl,
			"rasterizer/shader/phong-vertex-perspective-shader.glsl",
			"rasterizer/shader/phong-fragment-shader.glsl"
		);
		const textureShader = new Shader(gl,
			"rasterizer/shader/texture-vertex-perspective-shader.glsl",
			"rasterizer/shader/texture-fragment-shader.glsl"
		);
		this.renderer = new RasterRenderer(gl, phongShader, textureShader);

		Promise.all(
			[ phongShader.load(pvsContent, pfsContent), textureShader.load(tvsContent, tfsContent) ]
		).then(x =>
			window.requestAnimationFrame(window.run)
		);

		this.lastTimestamp = performance.now();
	}

	startRayTracer() {
		const raytracer = Preferences.canvas.raytracer;
		this.renderer = new RayTracingRenderer(raytracer.getContext("2d"), raytracer.width, raytracer.height);
		this.lastTimestamp = performance.now();
		window.requestAnimationFrame(window.run);
	}

	stop(cb) {
		this.onStop = cb || function () {
		};
	}
}