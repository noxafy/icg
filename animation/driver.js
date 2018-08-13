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
		this.yAxis = 0; // -1 = down, 1 = up
		this.zAxis = 0; // -1 = forward, 1 = backward
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
		this.setZ(!set);
	}

	setBackward(set) {
		this.setZ(set);
	}

	setZ(set) {
		if (set) this.zAxis++; else this.zAxis--;

		if (this.zAxis < -1) this.zAxis = -1;
		if (this.zAxis > 1) this.zAxis = 1;
	}

	setRightward(set) {
		this.setX(set);
	}

	setLeftward(set) {
		this.setX(!set);
	}

	setX(set) {
		if (set) this.xAxis++; else this.xAxis--;

		if (this.xAxis < -1) this.xAxis = -1;
		if (this.xAxis > 1) this.xAxis = 1;
	}

	setUpward(set) {
		this.setY(set);
	}

	setDownward(set) {
		this.setY(!set);
	}

	setY(set) {
		if (set) this.yAxis++; else this.yAxis--;

		if (this.yAxis < -1) this.yAxis = -1;
		if (this.yAxis > 1) this.yAxis = 1;
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
		let positionChange = new Vector(this.xAxis * this.speed * deltaT, 0, this.zAxis * this.speed * deltaT);
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

// Linear Driver
// "slow starting" driver 1/x