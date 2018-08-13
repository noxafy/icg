/**
 * Author: noxafy
 * Created: 13.08.18
 */
// user input event listener
let hitCmd = false;
let lastKey;
window.addEventListener('keydown', function (event) {
	if (hitCmd) return;
	switch (event.key) {
		case "Meta":
			hitCmd = true;
			return;
	}

	if (/^[a-z ]$/.test(event.key)) {
		event.preventDefault();
	}
	if (event.key === lastKey) return;
	lastKey = event.key;
	// console.log("keydown: [" + event.key + "]")
	switch (event.key) {
		case "ArrowUp":
			for (let animationNode of animationNodes) {
				animationNode.toggleActive();
			}
			break;
		case "f":
			toggleFullScreenMode();
			break;
		// secondary driver (2D)
		case "i":
			setDriver("setForward", true);
			break;
		case "j":
			setDriver("setLeftward", true);
			break;
		case "k":
			setDriver("setBackward", true);
			break;
		case "l":
			setDriver("setRightward", true)
			break;
	}

});

window.addEventListener('keyup', function (event) {
	switch (event.key) {
		case "Meta":
			hitCmd = false;
	}
	if (hitCmd) return;

	if (/^[a-z ]$/.test(event.key)) {
		event.preventDefault();
	}
	lastKey = undefined;
	// console.log("keyup: [" + event.key + "]")
	switch (event.key) {
		// secondary driver (2D)
		case "i":
			setDriver("setForward", false);
			break;
		case "j":
			setDriver("setLeftward", false);
			break;
		case "k":
			setDriver("setBackward", false);
			break;
		case "l":
			setDriver("setRightward", false)
			break;
	}
});

function setDriver(foo, set) {
	for (let animationNode of animationNodes) {
		let animator = animationNode.animator;
		if (animator instanceof Driver2D) {
			animator[foo](set);
			break;
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
		else console.error("Couldn't exit fullscreen mode!")
		fullscreenActivated = false;
	} else {
		let p = canvas.parentNode;
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