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
		this.LightChanger.fetchLights();
		this.specsElem.style.width = document.getElementById("lights-dropdown").offsetWidth + 12 + "px";
	},
	init() {
		if (Preferences.showSpecs) {
			this.FPS.init();
			this.enable();
		}
		// disabled state is default
	},
	FPS: {
		e: document.getElementById("fps_val"),
		cnt: 0,
		sum: 0,
		i: 1,
		showTime: undefined,
		add(deltaT) {
			this.sum += deltaT;
			this.cnt++;
			if (!this.showTime) {
				this.showTime = setTimeout(() => {
					this.e.innerText = Math.round(10000 * this.cnt / this.sum) / 10;
					this.sum = 0;
					this.cnt = 0;
					this.showTime = undefined;
				}, 1000);
			}
		},
		init() {
			if (this.showTime) clearTimeout(this.showTime);
			this.showTime = undefined;
			this.sum = 0;
			this.cnt = 0;
			this.e.innerText = "Collecting data...";
		}
	},
	LightChanger: {
		sliders: document.getElementById("light_props_sliders"),
		dropdown: document.getElementById("lights-dropdown"),
		current_light: undefined,
		enable(light) {
			if (this.current_light === light) return;
			this.current_light = light;

			this.registerSlider("intensity", light.intensity, function (val) {
				return light.intensity = val;
			}, 5);
			this.registerSlider("constant", Math.sqrt(light.constant), function (val) {
				return light.constant = Math.pow(val, 2);
			});
			this.registerSlider("linear", Math.cbrt(light.linear), function (val) {
				return light.linear = Math.pow(val, 3);
			});
			this.registerSlider("quadratic", Math.pow(light.quadratic, 1 / 4), function (val) {
				return light.quadratic = Math.pow(val, 4);
			});

			this.sliders.className = "";
		},
		fetchLights() {
			this.dropdown.innerHTML = `<option value=default>Please choose a light...</option>`;
			for (let i = 0; i < window.renderProcess.renderer.lights.length; i++) {
				let light = window.renderProcess.renderer.lights[i];
				this.dropdown.innerHTML += `<option value=${i}>${light.toString()}</option>`
			}
		},
		registerSlider(id, default_val, set, max = 1, min = 0, step = 0.001) {
			// label
			const label = document.createElement("label");
			label.for = id;
			label.id = id + "_label";
			this.sliders.appendChild(label);

			// input element
			const el = document.createElement("input");
			el.type = "range";
			el.value = default_val;
			el.min = min;
			el.max = max;
			el.step = step;
			this.sliders.appendChild(el);

			// change listener
			el.onchange = () => {
				let res = set(el.value);
				label.innerText = id + ": " + Utils.round(res);
			}
			el.value = default_val;
			el.onchange();

			this.sliders.className = "";
		},
		disable() {
			this.sliders.innerHTML = "";
			this.sliders.className = "disabled";
			this.current_light = undefined;
		}
	}
}

SpecsView.init();
