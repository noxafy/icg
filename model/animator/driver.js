/**
 * Author: noxafy
 * Created: 14.08.18
 */
class Driver extends UserControllable {
	/**
	 * Creates a new abstract driver animation
	 * @param {number} speed - Speed of driving in 1/second
	 */
	constructor(speed) {
		super();
		this.speed = speed / 1000;
		this.speedDoubled = false;
	}

	calc(deltaT, mat) {
		let positionChangeMatrix = this.drive(deltaT);
		if (!positionChangeMatrix) return mat;

		return mat.mul(positionChangeMatrix);
	}

	/**
	 * Calculates the position change
	 * @param {number}  deltaT - The time difference, the animation is advanced by
	 * @return {Matrix}          The resulting position change
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

	toJsonObj(obj) {
		obj.speed = this.speed * 1000;
		return obj;
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

		let direction = new Vector(this.moveXAxis, 0, this.moveZAxis).normalised();
		return Matrix.translation(direction.mul(this.speed * deltaT));
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "Driver2D"
		});
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
		return Matrix.translation(direction.mul(this.speed * deltaT));
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "Driver3D"
		});
	}
}

class FreeFlight extends Driver {
	/**
	 * Creates a new user controllable, continuous free flight 3D driver animation, using rotation for left right orientation
	 * @param {number} movingSpeed   - The constant speed of driving in 1/second in each direction
	 * @param {number} rotationSpeed - The constant speed of rotating on x axis in angle/second
	 * @param {Vector} up            - The up vector of the element at start
	 */
	constructor(movingSpeed = 1, rotationSpeed = 60, up = new Vector(0, 1, 0)) { // humans normally are vertical
		super(movingSpeed);
		if (rotationSpeed instanceof Vector) {
			up = rotationSpeed;
			rotationSpeed = 60;
		}
		this.up = up;
		this.revertedUp = new Vector(0, 1, 0).angleTo(this.up) > Utils.degToRad(90);
		this.rotationSpeed = Utils.degToRad(rotationSpeed) / 1000;
	}

	drive(deltaT) {
		if (this.moveXAxis === 0 && this.moveYAxis === 0 && this.moveZAxis === 0
			&& this.yaw === 0 && this.pitch === 0) return;

		let rot = Matrix.identity(), trans = Matrix.identity();
		if (this.yaw !== 0) {
			let rot_y, rot_z;
			let angle = -this.yaw * this.rotationSpeed * deltaT;
			if (this.revertedUp) angle = -angle;

			// x axis not required because free flight cannot roll
			if (this.up.y !== 0) rot_y = Matrix.rotation(this.yAxis, angle * this.up.y);
			if (this.up.z !== 0) rot_z = Matrix.rotation(this.zAxis, angle * this.up.z);

			for (let d of [rot_y, rot_z]) {
				if (d) rot = rot.mul(d);
			}
			// up vector does not change on yawing
		}
		if (this.pitch !== 0) {
			let rot2 = Matrix.rotation(this.xAxis, this.pitch * this.rotationSpeed * deltaT)
			this.up = rot2.invert().mul(this.up);
			rot = rot.mul(rot2);
		}
		// no roll, because you don't do that very often in your daily routine
		if (this.moveXAxis !== 0 || this.moveYAxis !== 0 || this.moveZAxis !== 0) {
			// move right, left, back and forward on own axis'
			let direction = new Vector(this.moveXAxis, 0, this.moveZAxis);
			// but up and down on world axis (humans are not used to this movement)
			if (this.moveYAxis !== 0) {
				let c = 1;
				if (this.revertedUp) c = -1;
				direction = direction.add(this.up.mul(c * this.moveYAxis));
			}
			trans = Matrix.translation(direction.normalised().mul(this.speed * deltaT));
		}
		return trans.mul(rot);
	}

	toJsonObj() {
		return super.toJsonObj({
			type: "FreeFlight",
			rotationSpeed: Utils.round(Utils.radToDeg(this.rotationSpeed * 1000)),
			up: this.up.data
		});
	}
}

// TODO: "slow starting" driver 1/x