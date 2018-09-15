/**
 * Class representing the camera in the Scenegraph
 * @extends Node
 */
class CameraNode extends Node {
	/**
	 * Creates the camera
	 * @param {Position} eye
	 * @param {number} aspect
	 * @param {number} near
	 * @param {number} far
	 * @param {number} fovy
	 */
	constructor(eye, aspect, near = 0.1, far = 100, fovy = 60) {
		super();
		if (eye.z === 0) throw Error("Eye cannot be on the plane!");
		if (Math.abs(eye.y - eye.z) < 1e-6) eye = new Position(eye.x, eye.y + 1e-6, eye.z);

		this.eye = eye;
		this.center = new Position(0, 0, 0); // always 0
		this.direction = this.center.sub(this.eye);
		let up = new Vector(0, 1, 0); // like humans are used to, up vector is always 0,1,0

		let angleTo90 = this.direction.angleTo(up) - Math.PI / 2;
		let half_right = Utils.degToRad(45);
		if (angleTo90 + half_right <= 1e-7) angleTo90 += 1e-7;
		const wide = Math.abs(angleTo90) > half_right;
		if (wide) angleTo90 = -angleTo90;
		this.up = Matrix.rotation(new Vector(1, 0, 0), angleTo90).mul(up);
		if (wide) this.up = new Vector(this.up.x, -this.up.y, this.up.z);

		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.fovy = fovy;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitCameraNode(this);
	}

	toString() {
		return "Camera";
	}
}