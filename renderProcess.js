/**
 * Author: noxafy
 * Created: 02.09.18
 */
class RenderProcess {
	constructor(canvas, sg, animationNodes) {
		this.canvas = canvas;
		this.sg = sg;
		this.animationNodes = animationNodes;
		this.onStop = undefined;
	}

	startRaster() {
		console.log("Raster render process started!");
		const gl = this.canvas.getContext("webgl");

		const setupVisitor = new RasterSetupVisitor(gl);
		setupVisitor.setup(sg);

		const phongShader = new Shader(gl,
			"shader/phong-vertex-perspective-shader.glsl",
			"shader/phong-fragment-shader.glsl"
		);
		const textureShader = new Shader(gl,
			"shader/texture-vertex-perspective-shader.glsl",
			"shader/texture-fragment-shader.glsl"
		);
		this.visitor = new RasterVisitor(gl, phongShader, textureShader);

		Promise.all(
			[phongShader.load(), textureShader.load()]
		).then(x =>
			window.requestAnimationFrame(window.run)
		);

		this.lastTimestamp = performance.now();
	}

	startRaytracing() {
		console.log("Raytracing render process started!");
		// this.visitor = new RayTracingVisitor();
		// this.lastTimestamp = performance.now();
		// window.requestAnimationFrame(window.run);
	}

	stop(cb) {
		this.onStop = () => {
			console.log("Render process stopped!");
			this.onStop = undefined;
			cb();
		};
	}
}