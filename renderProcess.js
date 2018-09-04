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

	start() {
		if (Preferences.useRasterRenderer) {
			console.log("Raster render process started!");
			const gl = this.canvas.getContext("webgl");

			const setupVisitor = new RasterSetupVisitor(gl);
			setupVisitor.setup(sg);

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
				[phongShader.load(), textureShader.load()]
			).then(x =>
				window.requestAnimationFrame(window.run)
			);

			this.lastTimestamp = performance.now();
		} else {
			console.log("Raytracing render process started!");
			// this.renderer = new RayTracingVisitor();
			// this.lastTimestamp = performance.now();
			// window.requestAnimationFrame(window.run);
		}
	}

	stop(cb) {
		this.onStop = cb;
	}
}