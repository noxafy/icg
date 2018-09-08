/**
 * Author: noxafy
 * Created: 05.09.18
 */
class Camera {

	/**
	 *
	 * @param {Position} eye
	 * @param {Position} center
	 * @param {Vector} up
	 * @param {number} aspect
	 * @param {number} near
	 * @param {number} far
	 * @param {number} fovy
	 */
	constructor(eye, center, up, aspect, near, far, fovy) {
		this.eye = eye;
		this.center = center;
		this.up = up;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.fovy = fovy;
	}
}