/**
 * Author: noxafy
 * Created: 14.08.18
 */
class Driver extends Animator {
	/**
	 * Creates a new user controllable driver animation
	 * @param {number} speed - Speed of driving in 1/second
	 */
	constructor(speed = 1) {
		super();
		this.speed = speed / 1000;
		this.speedDoubled = false;

		this.moveXAxis = 0; // -1 = left, 1 = right
		this.moveLeft = false;
		this.moveRight = false;

		this.rotateXAxis = 0; // -1 = right, 1 = left
		this.rotateLeft = false;
		this.rotateRight = false;

		this.moveYAxis = 0; // -1 = down, 1 = up
		this.moveDown = false;
		this.moveUp = false;

		this.rotateYAxis = 0; // -1 = down, 1 = up
		this.rotateUp = false;
		this.rotateDown = false;

		this.moveZAxis = 0; // -1 = forward, 1 = backward
		this.moveForw = false;
		this.moveBackw = false;
	}

	calc(deltaT, mat) {
		let positionChangeMatrix = this.drive(deltaT);
		if (!positionChangeMatrix) return mat;

		return mat.mul(positionChangeMatrix);
	}

	/**
	 * Calculates the position change
	 * @param {number} deltaT - The time difference, the animation is advanced by
	 * @return {Matrix} Resulting position change
	 */
	drive(deltaT) {
		throw Error("Unsupported operation.")
	}

	doubleSpeed(set) {
		if (set === this.speedDoubled) return;

		if (set) this.speed *= 2;
		else this.speed /= 2;
		this.speedDoubled = set;
	}

	moveForward(set) {
		this.set(set, "moveForw", false, "moveZAxis", "moveBackw")
	}

	moveBackward(set) {
		this.set(set, "moveBackw", true, "moveZAxis", "moveForw");
	}

	moveRightward(set) {
		this.set(set, "moveRight", true, "moveXAxis", "moveLeft");
	}

	moveLeftward(set) {
		this.set(set, "moveLeft", false, "moveXAxis", "moveRight")
	}

	rotateRightward(set) {
		this.set(set, "rotateRight", false, "rotateXAxis", "rotateLeft");
	}

	rotateLeftward(set) {
		this.set(set, "rotateLeft", true, "rotateXAxis", "rotateRight")
	}

	moveUpward(set) {
		this.set(set, "moveUp", true, "moveYAxis", "moveDown")
	}

	moveDownward(set) {
		this.set(set, "moveDown", false, "moveYAxis", "moveUp")
	}

	rotateUpward(set) {
		this.set(set, "rotateUp", true, "rotateYAxis", "rotateDown");
	}

	rotateDownward(set) {
		this.set(set, "rotateDown", false, "rotateYAxis", "rotateUp")
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

class Driver2D extends Driver {
	/**
	 * Creates a new user controllable, continuous 2D driver animation
	 * @param {number} speed - The constant speed of driving in 1/second
	 */
	constructor(speed = 1) {
		super(speed);
	}

	drive(deltaT) {
		if (this.moveXAxis === 0 && this.moveZAxis === 0) return;

		let positionChange = new Vector(this.moveXAxis, 0, this.moveZAxis).normalised().mul(this.speed * deltaT);
		return Matrix.translation(positionChange);
	}

	moveUpward(set) {
		throw Error("Unsupported operation.")
	}

	moveDownward(set) {
		throw Error("Unsupported operation.")
	}
}

class Driver3D extends Driver {
	/**
	 * Creates a new user controllable, continuous 3D driver animation
	 * @param {number} speed - The constant speed of driving in 1/second in each direction
	 */
	constructor(speed = 1) {
		super(speed);
	}

	drive(deltaT) {
		if (this.moveXAxis === 0 && this.moveYAxis === 0 && this.moveZAxis === 0) return;

		let direction = new Vector(this.moveXAxis, this.moveYAxis, this.moveZAxis).normalised();
		let positionChange = direction.mul(this.speed * deltaT);
		return Matrix.translation(positionChange);
	}
}

class FreeFlight extends Driver {
	/**
	 * Creates a new user controllable, continuous free flight 3D driver animation, using rotation for left right orientation
	 * @param {number} speed - The constant speed of driving in 1/second in each direction
	 * @param {number} angleSpeed - The constant speed of rotating on x axis in angle/second
	 */
	constructor(speed = 1, angleSpeed = 60) {
		super(speed);
		this.angleSpeed = Utils.degToRad(angleSpeed) / 1000;
		this.up = new Vector(0, 1, 0); // humans rotate around y axis normally when turning left/right
		this.rotationYAxis = new Vector(1, 0, 0);
	}

	drive(deltaT) {
		if (this.moveXAxis === 0 && this.moveYAxis === 0 && this.moveZAxis === 0
			&& this.rotateXAxis === 0 && this.rotateYAxis === 0) return;

		let rot, trans;
		if (this.rotateXAxis !== 0) {
			let rot_x, rot_y, rot_z;
			let angle = this.rotateXAxis * this.angleSpeed * deltaT;

			if (this.up.x !== 0) {
				rot_x = Matrix.rotation(new Vector(1, 0, 0), angle * this.up.x);
			}
			if (this.up.y !== 0) {
				rot_x = Matrix.rotation(new Vector(0, 1, 0), angle * this.up.y);
			}
			if (this.up.z !== 0) {
				rot_z = Matrix.rotation(new Vector(0, 0, 1), angle * this.up.z);
			}

			if (rot_x) {
				if (rot_z) {
					rot = rot_x.mul(rot_z);
					if (rot_y) {
						rot = rot.mul(rot_y);
					}
				} else {
					if (rot_y) {
						rot = rot_x.mul(rot_y);
					} else {
						rot = rot_x;
					}
				}
			} else if (rot_z) {
				if (rot_y) {
					rot = rot_z.mul(rot_y);
				} else {
					rot = rot_z;
				}
			} else if (rot_y) {
				rot = rot_y
			} else {
				rot = Matrix.identity();
			}
		}
		if (this.rotateYAxis !== 0) {
			let rot2 = Matrix.rotation(this.rotationYAxis, this.rotateYAxis * this.angleSpeed * deltaT)
			this.up = rot2.invert().mul(this.up);
			if (rot) rot = rot.mul(rot2);
			else rot = rot2;
		}
		if (this.moveXAxis !== 0 || this.moveYAxis !== 0 || this.moveZAxis !== 0) {
			let direction = new Vector(this.moveXAxis, this.moveYAxis, this.moveZAxis).normalised();
			let positionChange = direction.mul(this.speed * deltaT);
			trans = Matrix.translation(positionChange);
		} else {
			trans = Matrix.identity();
		}
		if (rot) return trans.mul(rot);
		else return trans;
	}
}

// Linear Driver
// "slow starting" driver 1/x