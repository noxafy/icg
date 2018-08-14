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
		this.xAxis = 0; // -1 = left, 1 = right
		this.leftward = false;
		this.rightward = false;
		this.yAxis = 0; // -1 = down, 1 = up
		this.downward = false;
		this.upward = false;
		this.zAxis = 0; // -1 = forward, 1 = backward
		this.forward = false;
		this.backward = false;
	}

	calc(deltaT, mat) {
		if (this.xAxis === 0 && this.yAxis === 0 && this.zAxis === 0) return mat;

		let positionChangeMatrix = this.drive(deltaT);
		return mat.mul(positionChangeMatrix);
		// let res = mat.mul(positionChangeMatrix);
		// console.log("x: %f, y: %f, z: %f", res.data[12], res.data[13], res.data[14]);
		// return res;
	}

	/**
	 * Calculates the position change
	 * @param deltaT
	 * @return {Matrix} Resulting position changes
	 */
	drive(deltaT) {
		throw Error("Unsupported operation.")
	}

	setForward(set) {
		this.set(set, "forward", false, "zAxis", "backward")
	}

	setBackward(set) {
		this.set(set, "backward", true, "zAxis", "forward");
	}

	setRightward(set) {
		this.set(set, "rightward", true, "xAxis", "leftward");
	}

	setLeftward(set) {
		this.set(set, "leftward", false, "xAxis", "rightward")
	}

	setUpward(set) {
		this.set(set, "upward", true, "yAxis", "downward")
	}

	setDownward(set) {
		this.set(set, "downward", false, "yAxis", "upward")
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
		let positionChange = new Vector(this.xAxis, 0, this.zAxis).normalised().mul(this.speed * deltaT);
		return Matrix.translation(positionChange);
	}

	setUpward(set) {
		throw Error("Unsupported operation.")
	}

	setDownward(set) {
		throw Error("Unsupported operation.")
	}

	setY(set) {
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
		let positionChange = new Vector(this.xAxis, this.yAxis, this.zAxis).normalised().mul(this.speed * deltaT);
		return Matrix.translation(positionChange);
	}
}

// Linear Driver
// "slow starting" driver 1/x