/**
 * Author: noxafy
 * Created: 05.09.18
 */
class Camera {

	/**
	 *
	 * @param {CameraNode} camera
	 */
	constructor(camera) {
		this.eye = camera.eye;
		this.direction = camera.direction.normalised();
		this.up = camera.up;
		this.aspect = camera.aspect;
		this.near = camera.near;
		this.far = camera.far;
		this.fovy = camera.fovy;

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