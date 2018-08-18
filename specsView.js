/**
 * Author: noxafy
 * Created: 18.08.18
 */
SpecsView = {
	specsElem: document.getElementById("specs-view"),
	disable() {
		this.FPS.e.innerText = "";
		this.specsElem.className = "disabled";
	},
	enable() {
		this.FPS.init();
		this.specsElem.className = "";
	},
	init() {
		this.FPS.init();
		if (Preferences.showSpecs) {
			this.enable();
		}
		// disabled state is default
	},
	FPS: {
		e: document.getElementById("fps"),
		cnt: 20,
		sum: 0,
		i: 1,
		add(deltaT) {
			this.sum += deltaT;
			if (--this.i === 0) {
				this.e.innerText = Math.round(10000 * this.cnt / this.sum) / 10;
				this.sum = 0;
				this.i = this.cnt;
			}
		},
		init() {
			this.i = this.cnt;
		}
	}
}

SpecsView.init();