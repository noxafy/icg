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
	useRasterRenderer: true,
	canvas_rasterizer: document.getElementById("rasterizer"),
	canvas_raytracer: document.getElementById("raytracer"),
	toggleRenderer: function () {
		this.useRasterRenderer = !this.useRasterRenderer;
		if (this.useRasterRenderer) {
			this.canvas_rasterizer.className = "";
			this.canvas_raytracer.className = "disabled";
		} else {
			this.canvas_rasterizer.className = "disabled";
			this.canvas_raytracer.className = "";
		}
		if (this.showSpecs) SpecsView.FPS.init();
		window.renderProcess.stop(function () {
			window.renderProcess = new RenderProcess();
			window.renderProcess.start();
		});
	}
}