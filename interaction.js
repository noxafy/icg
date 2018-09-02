/**
 * Author: noxafy
 * Created: 13.08.18
 */
// user input event listener
let hitCmd = false; // user wants to make a browser short cut
let lastKey;

window.addEventListener('keydown', function (event){
	if (hitCmd) return;
	switch (event.key) {
		case "Meta":
			hitCmd = true;
			return;
	}

	event.preventDefault();
	if (event.key === lastKey || event.repeat) return;
	lastKey = event.key;
	let key = event.key.toLowerCase();
	switch (key) {
		case "p":
			for (let animationNode of animationNodes) {
				animationNode.toggleActive();
			}
			break;
		case "f":
			toggleFullScreenMode();
			break;
		case "v":
			Preferences.toggleShowSpecs();
			break;
	}

	driverSwitch(key, true);
});

window.addEventListener('keyup', function (event) {
	switch (event.key) {
		case "Meta":
			hitCmd = false;
	}
	if (hitCmd) return;

	event.preventDefault();
	lastKey = undefined;
	driverSwitch(event.key.toLowerCase(), false);
});

let w_downtime;

function driverSwitch(key, set) {
	switch (key) {
		// 2D driver
		case "i":
			set2DDriver("moveForward", set);
			break;
		case "j":
			set2DDriver("moveLeftward", set);
			break;
		case "k":
			set2DDriver("moveBackward", set);
			break;
		case "l":
			set2DDriver("moveRightward", set)
			break;
		// 3D driver and free flight driver
		case "w":
			if (set) {
				let now = Date.now();
				if (w_downtime && now - w_downtime <= 200) {
					double3DDriverSpeed(true);
				} else {
					w_downtime = now;
				}
			} else {
				double3DDriverSpeed(false);
			}
			set3DDriver("moveForward", set);
			setFreeFlight("moveForward", set);
			break;
		case "a":
			set3DDriver("moveLeftward", set);
			setFreeFlight("moveLeftward", set);
			break;
		case "s":
			set3DDriver("moveBackward", set);
			setFreeFlight("moveBackward", set);
			break;
		case "d":
			set3DDriver("moveRightward", set);
			setFreeFlight("moveRightward", set);
			break;
		case "shift":
			set3DDriver("moveDownward", set);
			setFreeFlight("moveDownward", set);
			break;
		case " ":
			set3DDriver("moveUpward", set);
			setFreeFlight("moveUpward", set);
			break;
		case "arrowleft":
			setFreeFlight("rotateLeftward", set);
			break;
		case "arrowright":
			setFreeFlight("rotateRightward", set);
			break;
		case "arrowup":
			setFreeFlight("rotateUpward", set);
			break;
		case "arrowdown":
			setFreeFlight("rotateDownward", set);
			break;
	}
}

function set2DDriver(foo, set) {
	forEachAnimatorSet(foo, set, animator => {
		return animator instanceof Driver2D;
	})
}

function set3DDriver(foo, set) {
	forEachAnimatorSet(foo, set, animator => {
		return animator instanceof Driver3D;
	})
}

function setFreeFlight(foo, set) {
	forEachAnimatorSet(foo, set, animator => {
		return animator instanceof FreeFlight;
	});
}

function double3DDriverSpeed(set) {
	forEachAnimatorSet("doubleSpeed", set, animator => {
		return animator instanceof Driver3D || animator instanceof FreeFlight;
	})
}

function forEachAnimatorSet(foo, set, filter) {
	for (let animationNode of animationNodes) {
		let animator = animationNode.animator;
		if (filter(animator)) {
			animator[foo](set);
		}
	}
}

let fullscreenActivated = false;

function toggleFullScreenMode() {
	if (fullscreenActivated) {
		if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
		else if (document.msExitFullscreen) document.msExitFullscreen();
		else if (document.exitFullscreen) document.exitFullscreen();
		else {
			console.error("Couldn't exit fullscreen mode!");
			return;
		}
		fullscreenActivated = false;
	} else {
		let p = canvas.parentNode.parentNode;
		if (p.mozRequestFullScreen) p.mozRequestFullScreen();
		else if (p.webkitRequestFullScreen) p.webkitRequestFullScreen();
		else if (p.msRequestFullscreen) p.msRequestFullscreen();
		else if (p.requestFullscreen) p.requestFullscreen();
		else {
			console.error("Fullscreen mode not available")
			return;
		}
		fullscreenActivated = true;
	}
}