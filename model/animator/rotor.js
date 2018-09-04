/**
 * Author: noxafy
 * Created: 14.08.18
 */
class Rotor extends Animator {

	/**
	 * Creates a new abstract rotor animation
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(speed = 60) {
		super();
		this.anglePerMilliSecond = Utils.degToRad(speed) / 1000;
	}

	calc(deltaT, mat) {
		const rot = this.rotate(this.anglePerMilliSecond * deltaT);
		if (!rot) return mat;
		return mat.mul(rot);
	}

	/**
	 * Create the rotation matrix
	 * @param {number} angle - The angle at which the object should be rotated
	 * @return {Matrix}        The resulting rotation matrix
	 */
	rotate(angle) {
		throw new Error("Unsupported operation");
	}
}

class SimpleRotor extends Rotor {

	/**
	 * Creates a new constant rotor animation on a single axis
	 * @param {Vector} axis  - The axis to rotate around
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(axis, speed = 60) {
		super(speed);
		this.axis = axis;
	}

	rotate(angle) {
		return Matrix.rotation(this.axis, angle);
	}

	toJsonObj() {
		return {
			type: "SimpleRotor",
			axis: this.axis.data,
			speed: Utils.round(Utils.radToDeg(this.anglePerMilliSecond * 1000))
		};
	}
}

class FreeRotor extends UserControllable {

	/**
	 * Creates a user controllable rotor animation
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(speed) {
		super();
		this.anglePerMilliSecond = Utils.degToRad(speed) / 1000;
	}

	calc(deltaT, mat) {
		const rot = this.rotate(this.anglePerMilliSecond * deltaT);
		return mat.mul(rot);
	}

	rotate(resultingAngle) {
		let rot = Matrix.identity();
		if (this.yaw !== 0) {
			rot = Matrix.rotation(this.yAxis, -this.yaw * resultingAngle);
		}
		if (this.pitch !== 0) {
			let rot2 = Matrix.rotation(this.xAxis, this.pitch * resultingAngle)
			rot = rot.mul(rot2);
		}
		if (this.roll !== 0) {
			let rot3 = Matrix.rotation(this.zAxis, this.roll * resultingAngle)
			rot = rot.mul(rot3);
		}
		return rot;
	}

	toJsonObj() {
		return {
			type: "FreeRotor",
			speed: Utils.round(Utils.radToDeg(this.anglePerMilliSecond * 1000))
		};
	}
}

class AxisAlignedRotor extends UserControllable {

	/**
	 * Creates a user controllable rotor animation
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(speed) {
		super();
		this.anglePerMilliSecond = Utils.degToRad(speed) / 1000;
		this.up = new Vector(0, -1, 0);
		this.right = new Vector(1, 0, 0);
		this.forward = new Vector(0, 0, -1);
	}

	calc(deltaT, mat) {
		const rot = this.rotate(this.anglePerMilliSecond * deltaT);
		return mat.mul(rot);
	}

	rotate(angle) {
		let rot = Matrix.identity();

		if (this.yaw !== 0) rot = rot.mul(this.getRotationMatrix(this.up, this.yaw * angle));
		if (this.pitch !== 0) rot = rot.mul(this.getRotationMatrix(this.right, this.pitch * angle));
		if (this.roll !== 0) rot = rot.mul(this.getRotationMatrix(this.forward, this.roll * angle));

		const rot_inv = rot.invert();
		this.up = rot_inv.mul(this.up);
		this.right = rot_inv.mul(this.right);
		this.forward = rot_inv.mul(this.forward);

		return rot;
	}

	getRotationMatrix(relative, angle) {
		let rot = Matrix.identity();
		let rot_x, rot_y, rot_z;
		if (relative.x !== 0) rot_x = Matrix.rotation(this.xAxis, angle * relative.x);
		if (relative.y !== 0) rot_y = Matrix.rotation(this.yAxis, angle * relative.y);
		if (relative.z !== 0) rot_z = Matrix.rotation(this.zAxis, angle * relative.z);

		for (let d of [rot_x, rot_y, rot_z]) {
			if (d) rot = rot.mul(d);
		}
		return rot;
	}

	toJsonObj() {
		return {
			type: "AxisAlignedRotor",
			speed: Utils.round(Utils.radToDeg(this.anglePerMilliSecond * 1000))
		};
	}
}