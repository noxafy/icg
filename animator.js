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

class Rotor extends Animator {
	/**
	 * Creates a new rotor animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(axis, speed = 60) {
		super();
		this.axis = axis;
		this.anglePerMilliSecond = Utils.degToRad(speed) / 1000;
	}

	calc(deltaT, mat) {
		// change the matrix to reflect a rotation
		let resultingAngle = this.anglePerMilliSecond * deltaT;
		const rot = Matrix.rotation(this.axis, resultingAngle);
		return mat.mul(rot);
	}
}

class Driver2D extends Animator {
	/**
	 * Creates a new user controllable driver animation
	 * @param {number} speed - Speed of driving in 1/second
	 */
	constructor(speed = 1) {
		super();
		this.speed = speed / 1000;
		this.xAxis = 0; // -1 = left, 1 = right
		this.zAxis = 0; // -1 = backward, 1 = forward
	}

	calc(deltaT, mat) {
		let positionChange = new Vector(this.xAxis * this.speed * deltaT, 0, this.zAxis * this.speed * deltaT);
		const trans = Matrix.translation(positionChange);
		return mat.mul(trans);
	}

	setForward(set) {
		this.setZ(set);
	}

	setBackward(set) {
		this.setZ(!set);
	}

	setZ(set) {
		if (set) {
			this.zAxis++;
		} else {
			this.zAxis--;
		}
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
		if (set) {
			this.xAxis++;
		} else {
			this.xAxis--;
		}
		if (this.xAxis < -1) this.xAxis = -1;
		if (this.xAxis > 1) this.xAxis = 1;
	}
}

// Linear Driver
// "slow starting" driver 1/x

class Jumper extends Animator {
	/**
	 * Creates a new jumper animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {Number} timePerJump - Milliseconds needed for one jump
	 */
	constructor(axis, timePerJump) {
		super();
		this.axis = axis;
		this.timePerJump = timePerJump;
		this.timePassed = 0;
		this.currentAxisPercentage = 0; // "jumps" between 0 and 1
	}

	calc(deltaT, mat) {
		this.timePassed = (this.timePassed + deltaT) % (this.timePerJump);
		let resultingPercentage = this.jump();
		if (!resultingPercentage) return mat;

		let deltaPercentage = resultingPercentage - this.currentAxisPercentage;
		this.currentAxisPercentage = resultingPercentage;
		const trans = Matrix.translation(this.axis.mul(deltaPercentage));
		return mat.mul(trans);
	}

	/**
	 * Calculates the position on given jump axis depending on this.timePassed
	 * @return {Number} position on given jump axis [0;1]
	 */
	jump() {
		throw Error("Unsupported operation.")
	}
}

class LinearJumper extends Jumper {
	/**
	 * Creates a new linear jumper animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} jpm - Jumps per Minute
	 */
	constructor(axis, jpm = 60) {
		super(axis, 60000 / jpm);
	}

	jump() {
		return Math.abs(this.timePassed / this.timePerJump * 2 - 1);
	}
}

class SinJumper extends Jumper {
	/**
	 * Creates a new sinus jumper animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} jpm - Jumps per Minute
	 */
	constructor(axis, jpm = 60) {
		super(axis, 60000 / jpm);
		this.periodsPerMilliSecond = 2 / this.timePerJump;
	}

	jump() {
		return Math.sin(this.timePassed * this.periodsPerMilliSecond * Math.PI) / 2 + 0.5;
	}
}

class PhysicsJumper extends Jumper {
	/**
	 * Creates a new physics imitating jumper animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} g_scale - Scaling factor for gravitational acceleration
	 */
	constructor(axis, g_scale = 1) {
		super(axis, 0); // timePerJump is set later
		this.g = 9.81E-6 * g_scale * Math.pow(axis.y / axis.length, 2); // in 1/ms^2
		if (this.g < .1E-16) return;

		this.timePerJump = Math.sqrt(2 * this.g * Math.abs(axis.y)) / this.g;
		this.halfJumpsPerMillisecond = 2 / this.timePerJump;
		if (axis.y < 0) {
			this.jumpDirection = -1; // with y-coord
		} else {
			this.timePassed = this.timePerJump / 2;
			this.currentAxisPercentage = 1;
			this.jumpDirection = 1; // with y-coord
		}
	}

	jump() {
		if (this.g < .1E-16) return;
		return this.jumpDirection * Math.pow(this.timePassed * this.halfJumpsPerMillisecond - 1, 2) + 1;
	}
}