/**
 * Author: noxafy
 * Created: 18.08.18
 */
Preferences = {
	showSpecs: false,
	toggleShowSpecs() {
		if (this.showSpecs) {
			SpecsView.disable();
		} else {
			SpecsView.enable();
		}
		this.showSpecs = !this.showSpecs;
	},
	showMenu: false,
	toggleShowMenu() {
		if (this.showMenu) {
			MenuView.disable();
		} else {
			MenuView.enable();
		}
		this.showMenu = !this.showMenu;
	},
	getDefaultSceneGraph: function () {
		return "";
	},
	canvas: {
		useRasterRenderer: true,
		rasterizer: document.getElementById("rasterizer"),
		raytracer: document.getElementById("raytracer"),
		aspectW: 16,
		aspectH: 9,
		init(rasterResolution, raytracerResolution) {
			this.setResolution(this.rasterizer, rasterResolution);
			this.setResolution(this.raytracer, raytracerResolution);

			let container = document.getElementById("canvas-container");
			window.onresize = () => {
				let tileSize = Math.min(window.innerWidth / this.aspectW, window.innerHeight / this.aspectH);
				container.style.width = tileSize * this.aspectW + "px";
				container.style.height = tileSize * this.aspectH + "px";
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