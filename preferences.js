/**
 * Author: noxafy
 * Created: 18.08.18
 */
Preferences = {
	showSpecs: false,
	showMenu: false,
	fullscreenActivated: false,
	getDefaultSceneGraph: function () {
		throw Error("niy");
	},
	canvas: {
		useRasterRenderer: true,
		rasterizer: document.getElementById("rasterizer"),
		raytracer: document.getElementById("raytracer"),
		container: document.getElementById("canvas-container"),
		aspectW: 16,
		aspectH: 9,
		init(rasterResolution, raytracerResolution) {
			this.setResolution(this.rasterizer, rasterResolution);
			this.setResolution(this.raytracer, raytracerResolution);

			window.onresize = () => {
				let tileSize = Math.min(window.innerWidth / this.aspectW, window.innerHeight / this.aspectH);
				this.container.style.width = tileSize * this.aspectW + "px";
				this.container.style.height = tileSize * this.aspectH + "px";
				if (ModelLoadView.container) {
					ModelLoadView.container.style.height = this.container.style.height;
				}
			};
			window.onresize();
		},
		setResolution(canvas, resolution) {
			canvas.setAttribute("width", this.aspectW * resolution);
			canvas.setAttribute("height", this.aspectH * resolution);
		},
		toggleRenderer: function () {
			this.useRasterRenderer = !this.useRasterRenderer;
			if (this.useRasterRenderer) {
				this.rasterizer.className = "";
				this.raytracer.className = "disabled";
			} else {
				this.rasterizer.className = "disabled";
				this.raytracer.className = "";
			}
			if (Preferences.showSpecs) SpecsView.FPS.init();
			window.renderProcess.stop(function () {
				window.renderProcess = new RenderProcess();
				window.renderProcess.start();
			});
		},
	}
}