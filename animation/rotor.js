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
	 * @return {Matrix} - The resulting rotation matrix
	 */
	rotate(angle) {
		throw new Error("Unsupported operation");
	}
}

class SimpleRotor extends Rotor {

	/**
	 * Creates a new constant rotor animation on a single axis
	 * @param {Vector} axis - The axis to rotate around
	 * @param {number} speed - Speed of rotation in angle per second
	 */
	constructor(axis, speed = 60) {
		super(speed);
		this.axis = axis;
	}

	rotate(angle) {
		return Matrix.rotation(this.axis, angle);
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
		let cnt = 0;
		if (this.yaw !== 0) cnt++;
		if (this.pitch !== 0) cnt++;
		if (this.roll !== 0) cnt++;
		angle /= cnt;
		let rot = Matrix.identity();
		if (this.yaw !== 0) {
			let rot1 = Matrix.identity();
			let rot_x, rot_y, rot_z;
			if (this.up.x !== 0) rot_x = Matrix.rotation(this.xAxis, this.yaw * angle * this.up.x);
			if (this.up.y !== 0) rot_y = Matrix.rotation(this.yAxis, this.yaw * angle * this.up.y);
			if (this.up.z !== 0) rot_z = Matrix.rotation(this.zAxis, this.yaw * angle * this.up.z);

			for (let d of [rot_x, rot_y, rot_z]) {
				if (d) rot = rot.mul(d);
			}
			rot = rot.mul(rot1);
		}
		if (this.pitch !== 0) {
			let rot2 = Matrix.identity();
			let rot_x, rot_y, rot_z;
			if (this.right.x !== 0) rot_x = Matrix.rotation(this.xAxis, this.pitch * angle * this.right.x);
			if (this.right.y !== 0) rot_y = Matrix.rotation(this.yAxis, this.pitch * angle * this.right.y);
			if (this.right.z !== 0) rot_z = Matrix.rotation(this.zAxis, this.pitch * angle * this.right.z);

			for (let d of [rot_x, rot_y, rot_z]) {
				if (d) rot2 = rot2.mul(d);
			}
			rot = rot.mul(rot2);
		}
		if (this.roll !== 0) {
			let rot3 = Matrix.identity();
			let rot_x, rot_y, rot_z;
			if (this.forward.x !== 0) rot_x = Matrix.rotation(this.xAxis, this.roll * angle * this.forward.x);
			if (this.forward.y !== 0) rot_y = Matrix.rotation(this.yAxis, this.roll * angle * this.forward.y);
			if (this.forward.z !== 0) rot_z = Matrix.rotation(this.zAxis, this.roll * angle * this.forward.z);

			for (let d of [rot_x, rot_y, rot_z]) {
				if (d) rot3 = rot3.mul(d);
			}
			rot = rot.mul(rot3);
		}
		const rot_inv = rot.invert();
		this.up = rot_inv.mul(this.up);
		this.right = rot_inv.mul(this.right);
		this.forward = rot_inv.mul(this.forward);
		return rot;
	}
}