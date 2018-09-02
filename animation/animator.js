/**
 * Author: noxafy
 * Created: 12.08.18
 */
class Animator {
	/**
	 * Calculates the intended animation wrt deltaT
	 * @param {number} deltaT - The time difference, the animation is advanced by
	 * @param {Matrix} mat - The current matrix from groupnode
	 * @return {Matrix} The resulting matrix
	 */
	calc(deltaT, mat) {
		throw Error("Unsupported Operation");
	}
}

class UserControllable extends Animator {

	constructor() {
		super();

		this.moveXAxis = 0; // 1 = right, -1 = left
		this.moveRight = false;
		this.moveLeft = false;

		this.moveYAxis = 0; // 1 = up, -1 = down
		this.moveUp = false;
		this.moveDown = false;

		this.moveZAxis = 0; // 1 = backward, -1 = forward
		this.moveBackw = false;
		this.moveForw = false;

		// some visual help: http://www.chrobotics.com/wp-content/uploads/2012/11/F18.png

		// rotate x axis
		this.pitch = 0; // 1 = up, -1 = down
		this.pitchUp = false;
		this.pitchDown = false;

		// rotate y axis
		this.yaw = 0; // 1 = right, -1 = left
		this.yawRight = false;
		this.yawLeft = false;

		// rotate z axis
		this.roll = 0; // 1 = right, -1 = left
		this.rollRight = false;
		this.rollLeft = false;
	}

	moveRightward(set) {
		this.set(set, "moveRight", true, "moveXAxis", "moveLeft");
	}

	moveLeftward(set) {
		this.set(set, "moveLeft", false, "moveXAxis", "moveRight")
	}

	moveUpward(set) {
		this.set(set, "moveUp", true, "moveYAxis", "moveDown")
	}

	moveDownward(set) {
		this.set(set, "moveDown", false, "moveYAxis", "moveUp")
	}

	moveBackward(set) {
		this.set(set, "moveBackw", true, "moveZAxis", "moveForw");
	}

	moveForward(set) {
		this.set(set, "moveForw", false, "moveZAxis", "moveBackw")
	}

	yawRightward(set) {
		this.set(set, "yawRight", true, "yaw", "yawLeft");
	}

	yawLeftward(set) {
		this.set(set, "yawLeft", false, "yaw", "yawRight")
	}

	pitchUpward(set) {
		this.set(set, "pitchUp", true, "pitch", "pitchDown");
	}

	pitchDownward(set) {
		this.set(set, "pitchDown", false, "pitch", "pitchUp")
	}

	rollRightward(set) {
		this.set(set, "rollRight", true, "roll", "rollLeft");
	}

	rollLeftward(set) {
		this.set(set, "rollLeft", false, "roll", "rollRight")
	}

	set(set, This, isPositiveDirection, axis, opposite) {
		if (set) {
			if (this[opposite]) {
				this[opposite] = false;
				this[axis] = 0;
			}
			else {
				this[This] = true;
				this[axis] = isPositiveDirection ? 1 : -1;
			}
		} else {
			if (this[opposite]) {
				this[opposite] = true;
				this[axis] = isPositiveDirection ? -1 : 1;
			}
			else {
				this[This] = false;
				this[axis] = 0;
			}
		}
	}
}