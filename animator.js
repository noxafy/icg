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
	constructor(axis, speed) {
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