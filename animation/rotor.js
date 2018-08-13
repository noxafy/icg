/**
 * Author: noxafy
 * Created: 14.08.18
 */
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