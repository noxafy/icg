/**
 * Author: noxafy
 * Created: 14.08.18
 */
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
		let resultingPercentage = this.jump(this.timePassed);
		if (!resultingPercentage) return mat;

		let deltaPercentage = resultingPercentage - this.currentAxisPercentage;
		this.currentAxisPercentage = resultingPercentage;
		const trans = Matrix.translation(this.axis.mul(deltaPercentage));
		return mat.mul(trans);
	}

	/**
	 * Calculates the position on given jump axis depending on this.timePassed
	 * @param {number} timePassed - The time point where the jump is now
	 * @return {Number} position on given jump axis [0;1]
	 */
	jump(timePassed) {
		throw Error("Unsupported operation.")
	}

	toJsonObj(obj) {
		obj.axis = this.axis.data;
		return obj;
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

	jump(timePassed) {
		return Math.abs(timePassed / this.timePerJump * 2 - 1);
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "LinearJumper",
			jpm: 60000 / this.timePerJump
		});
	}
}

class SinusJumper extends Jumper {
	/**
	 * Creates a new sinus jumper animation
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} jpm  - Jumps per Minute
	 */
	constructor(axis, jpm = 60) {
		super(axis, 60000 / jpm);
		this.periodsPerMilliSecond = 2 / this.timePerJump;
	}

	jump(timePassed) {
		return Math.sin(timePassed * this.periodsPerMilliSecond * Math.PI) / 2 + 0.5;
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "SinusJumper",
			jpm: 60000 / this.timePerJump
		});
	}
}

class PhysicsJumper extends Jumper {
	/**
	 * Creates a new physics imitating jumper animation
	 * @param {Vector} axis    - The axis to rotate around
	 * @param {number} g_scale - Scaling factor for gravitational acceleration
	 */
	constructor(axis, g_scale = 1) {
		super(axis, 0); // timePerJump is set later
		this.g = 9.81E-6 * g_scale * Math.pow(axis.y / axis.length, 2); // in 1/ms^2
		if (this.g < .1E-16) return;

		this.timePerJump = Math.sqrt(2 * this.g * Math.abs(axis.y)) / this.g;
		this.halfJumpsPerMillisecond = 2 / this.timePerJump;
		if (axis.y > 0) {
			this.jumpDirection = -1; // with y-coord
		} else {
			this.timePassed = this.timePerJump / 2;
			this.currentAxisPercentage = 1;
			this.jumpDirection = 1; // with y-coord
		}
	}

	jump(timePassed) {
		if (this.g < Number.EPSILON) return;
		return this.jumpDirection * Math.pow(timePassed * this.halfJumpsPerMillisecond - 1, 2) + 1;
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "PhysicsJumper",
			g_scale: this.g / (9.81E-6 * Math.pow(this.axis.y / this.axis.length, 2))
		});
	}
}