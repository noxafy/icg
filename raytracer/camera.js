/**
 * Author: noxafy
 * Created: 05.09.18
 */
class Camera {

	/**
	 *
	 * @param {Position} eye
	 * @param {Vector} direction
	 * @param {Vector} up
	 * @param {number} aspect
	 * @param {number} near
	 * @param {number} far
	 * @param {number} fovy
	 */
	constructor(eye, direction, up, aspect, near, far, fovy) {
		this.eye = eye;
		this.direction = direction.normalised();
		this.up = up;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.fovy = fovy;
		// pre-calculate for more efficient ray calculation (1920 * 1080 on my mac: 1444ms -> 1132ms (n=33)
		this.hpxy = this.near * Math.tan(Utils.degToRad(this.fovy) / 2); // half plane xy
		this.hpxya = this.hpxy * this.aspect;
		this.r = this.up.cross(this.direction); // right
		/**
		 * @type {Vector|Position|Color}
		 */
		this.dmuln = this.direction.mul(this.near);
	}
}