/**
 * Author: noxafy
 * Created: 13.08.18
 */
UserInteraction = {
	init() {
		this.Events.Key.enable();
		this.Events.initOnClick();
	},
	Events: {
		Key: {
			hitCmd: false, // user wants to make a browser short cut
			lastKey: undefined,
			keyDownListener: (event) => {
				if (UserInteraction.Events.Key.hitCmd || window.renderProcess.onStop) return;

				switch (event.key) {
					case "Meta":
						UserInteraction.Events.Key.hitCmd = true;
						return;
				}

				event.preventDefault();
				if (event.key === UserInteraction.Events.Key.lastKey || event.repeat) return;
				UserInteraction.Events.Key.lastKey = event.key;
				let key = event.key.toLowerCase();
				switch (key) {
					case "p":
						for (let animationNode of animationNodes) {
							animationNode.toggleActive();
						}
						break;
					case "f":
						UserInteraction.View.toggleFullScreenMode();
						break;
					case "v":
						UserInteraction.View.toggleSpecs();
						break;
					case "m":
						UserInteraction.View.toggleMenu();
						break;
					case "r":
						Preferences.canvas.toggleRenderer();
						break;
				}

				UserInteraction.Events.Key.animationControl(key, true);
			},
			keyUpListener: (event) => {
				switch (event.key) {
					case "Meta":
						UserInteraction.Events.Key.hitCmd = false;
				}
				if (UserInteraction.Events.Key.hitCmd || window.renderProcess.onStop) return;

				event.preventDefault();
				UserInteraction.Events.Key.lastKey = undefined;
				UserInteraction.Events.Key.animationControl(event.key.toLowerCase(), false);
			},
			enable() {
				window.addEventListener('keydown', this.keyDownListener);
				window.addEventListener('keyup', this.keyUpListener);
			},
			disable() {
				window.removeEventListener('keydown', this.keyDownListener);
				window.removeEventListener('keyup', this.keyUpListener);
			},
			w_downtime: undefined,
			animationControl(key, set) {
				switch (key) {
					// 2D driver
					case "i":
						this.ControlHelper.set2DDriver("moveForward", set);
						break;
					case "j":
						this.ControlHelper.set2DDriver("moveLeftward", set);
						break;
					case "k":
						this.ControlHelper.set2DDriver("moveBackward", set);
						break;
					case "l":
						this.ControlHelper.set2DDriver("moveRightward", set)
						break;
					// 3D driver and free flight driver
					case "w":
						if (set) {
							let now = Date.now();
							if (this.w_downtime && now - this.w_downtime <= 200) {
								this.ControlHelper.double3DDriverSpeed(true);
							} else {
								this.w_downtime = now;
							}
						} else {
							this.ControlHelper.double3DDriverSpeed(false);
						}
						this.ControlHelper.set3DDriver("moveForward", set);
						this.ControlHelper.setFreeFlight("moveForward", set);
						break;
					case "a":
						this.ControlHelper.set3DDriver("moveLeftward", set);
						this.ControlHelper.setFreeFlight("moveLeftward", set);
						break;
					case "s":
						this.ControlHelper.set3DDriver("moveBackward", set);
						this.ControlHelper.setFreeFlight("moveBackward", set);
						break;
					case "d":
						this.ControlHelper.set3DDriver("moveRightward", set);
						this.ControlHelper.setFreeFlight("moveRightward", set);
						break;
					case "shift":
						this.ControlHelper.set3DDriver("moveDownward", set);
						this.ControlHelper.setFreeFlight("moveDownward", set);
						break;
					case " ":
						this.ControlHelper.set3DDriver("moveUpward", set);
						this.ControlHelper.setFreeFlight("moveUpward", set);
						break;
					case "arrowleft":
						this.ControlHelper.setFreeFlight("yawLeftward", set);
						break;
					case "arrowright":
						this.ControlHelper.setFreeFlight("yawRightward", set);
						break;
					case "arrowup":
						this.ControlHelper.setFreeFlight("pitchUpward", set);
						break;
					case "arrowdown":
						this.ControlHelper.setFreeFlight("pitchDownward", set);
						break;
					// Free rotor
					case "x":
						this.ControlHelper.setRotor("pitchUpward", set);
						break;
					case "y":
						this.ControlHelper.setRotor("yawRightward", set);
						break;
					case "z":
						this.ControlHelper.setRotor("rollRightward", set);
						break;
				}
			},
			ControlHelper: {
				set2DDriver(foo, set) {
					this.forEachAnimatorSet(foo, set, animator => {
						return animator instanceof Driver2D;
					})
				},
				set3DDriver(foo, set) {
					this.forEachAnimatorSet(foo, set, animator => {
						return animator instanceof Driver3D;
					})
				},
				setFreeFlight(foo, set) {
					this.forEachAnimatorSet(foo, set, animator => {
						return animator instanceof FreeFlight;
					});
				},
				setRotor(foo, set) {
					this.forEachAnimatorSet(foo, set, animator => {
						return animator instanceof FreeRotor || animator instanceof AxisAlignedRotor;
					});
				},
				double3DDriverSpeed(set) {
					this.forEachAnimatorSet("doubleSpeed", set, animator => {
						return animator instanceof Driver3D || animator instanceof FreeFlight;
					})
				},
				forEachAnimatorSet(foo, set, filter) {
					for (let animationNode of window.animationNodes) {
						let animator = animationNode.animator;
						if (filter(animator)) {
							animator[foo](set);
						}
					}
				}
			}
		},
		onFileDropped(jsonCb, objMtlCb) {
			document.body.addEventListener("dragover", function (e) {
				e.preventDefault();
			});
			document.body.addEventListener("dragleave", function (e) {
				e.preventDefault();
			});
			document.body.addEventListener("drop", function (e) {
				e.preventDefault();
				// only take account of the first file
				const file = e.dataTransfer.files[0];
				if (!FileReader) {
					window.alert("Sorry, file dropping not available!")
					return false;
				}
				if (Files.isJson(file)) {
					jsonCb(file);
				} else if (Files.isObj(file) || Files.isMtl(file)) {
					objMtlCb(file);
				} else {
					console.error("Unsupported file type: " + file.type);
				}
				return false;
			});
		},
		initOnClick() {
			let objColor, objMaterial, objId;

			initCanvasOnClick(Preferences.canvas.raytracer);
			initCanvasOnClick(Preferences.canvas.rasterizer);

			function initCanvasOnClick(canvas) {
				const renderer = new MouseRayTracingRenderer(canvas);
				canvas.addEventListener('click', function (e) {
					const rect = canvas.getBoundingClientRect();
					let mousePos = new Position(0, 0, 0);
					mousePos.x = (e.clientX - rect.left) * (canvas.width / rect.width);
					mousePos.y = (e.clientY - rect.top) * (canvas.height / rect.height);

					renderer.findObject(window.sg, mousePos, function (obj) {
						if (obj && obj.id === objId) return;
						if (objId !== undefined) unlight();
						if (obj) light(obj);
					});
				});
			}

			function unlight() {
				if (objColor) {
					objColor.x = getUnLighted(objColor.x)
					objColor.y = getUnLighted(objColor.y)
					objColor.z = getUnLighted(objColor.z)
				}
				objMaterial.ambient.x = getUnLighted(objMaterial.ambient.x)
				objMaterial.ambient.y = getUnLighted(objMaterial.ambient.y)
				objMaterial.ambient.z = getUnLighted(objMaterial.ambient.z)

				objColor = undefined;
				objMaterial = undefined;
				objId = undefined;

				function getUnLighted(val) {
					return Math.pow(val * 1.2 - 0.2, 2);
				}
			}

			function light(obj) {
				if (obj.color) objColor = obj.color;
				objMaterial = obj.material;
				objId = obj.id;

				if (objColor) {
					objColor.x = getLighted(objColor.x)
					objColor.y = getLighted(objColor.y)
					objColor.z = getLighted(objColor.z)
				}
				objMaterial.ambient.x = getLighted(objMaterial.ambient.x)
				objMaterial.ambient.y = getLighted(objMaterial.ambient.y)
				objMaterial.ambient.z = getLighted(objMaterial.ambient.z)

				function getLighted(val) {
					return Math.sqrt((val + 0.2) / 1.2);
				}
			}
		}
	},
	View: {
		toggleSpecs() {
			if (Preferences.showSpecs) SpecsView.disable();
			else SpecsView.enable();
			Preferences.showSpecs = !Preferences.showSpecs;
		},
		toggleMenu() {
			if (Preferences.showMenu) MenuView.disable();
			else MenuView.enable();
			Preferences.showMenu = !Preferences.showMenu;
		},
		toggleFullScreenMode() {
			if (Preferences.fullscreenActivated) {
				if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
				else if (document.exitFullscreen) document.exitFullscreen();
				else {
					console.error("Couldn't exit fullscreen mode!");
					return;
				}
				Preferences.fullscreenActivated = false;
			} else {
				let p = canvas.parentNode.parentNode;
				if (p.mozRequestFullScreen) p.mozRequestFullScreen();
				else if (p.webkitRequestFullScreen) p.webkitRequestFullScreen();
				else if (p.msRequestFullscreen) p.msRequestFullscreen();
				else if (p.requestFullscreen) p.requestFullscreen();
				else {
					console.error("Fullscreen mode not available!")
					return;
				}
				Preferences.fullscreenActivated = true;
			}
		},
		askForObjAndMtlFiles(droppedFile, cb) {
			let objFile, mtlFile;
			if (droppedFile) {
				if (Files.isObj(droppedFile)) objFile = droppedFile;
				else mtlFile = droppedFile;
			}
			ModelLoadView.init(objFile, mtlFile);
			ModelLoadView.onReady(function (obj, mtl, matrix) {
				// TODO: give user feedback
				cb(obj, mtl, matrix);
			});
			ModelLoadView.next();
		}
	}
}