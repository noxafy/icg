/**
 * Class representing a Node in a Scenegraph
 */
class Node {
	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
	}
}

/**
 * Class representing a GroupNode in the Scenegraph.
 * A GroupNode holds a transformation and is able
 * to have child nodes attached to it.
 * @extends Node
 */
class GroupNode extends Node {
	/**
	 * Constructor
	 * @param  {Matrix} mat - A matrix describing the node's transformation
	 */
	constructor(mat) {
		super();
		this.matrix = mat;
		this.children = [];
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitGroupNode(this);
	}

	/**
	 * Adds a child node
	 * @param {Node} childNode - The child node to add
	 */
	add(childNode) {
		this.children.push(childNode);
	}
}

/**
 * Class representing a Sphere in the Scenegraph
 * @extends Node
 */
class SphereNode extends Node {
	/**
	 * Creates a new Sphere with center and radius
	 * @param  {Vector} center - The center of the Sphere
	 * @param  {number} radius - The radius of the Sphere
	 * @param  {Vector} color  - The colour of the Sphere
	 */
	constructor(center, radius, color) {
		super();
		this.center = center;
		this.radius = radius;
		this.color = color;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitSphereNode(this);
	}
}

/**
 * Class representing an Axis Aligned Box in the Scenegraph
 * @extends Node
 */
class AABoxNode extends Node {
	/**
	 * Creates an axis aligned box
	 * @param  {Vector} minPoint - The minimum Point
	 * @param  {Vector} maxPoint - The maximum Point
	 * @param  {Vector} color    - The colour of the cube
	 */
	constructor(minPoint, maxPoint, color) {
		super();
		this.minPoint = minPoint;
		this.maxPoint = maxPoint;
		this.color = color;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitAABoxNode(this);
	}
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
class TextureBoxNode extends Node {
	/**
	 * Creates an axis aligned box textured box
	 * @param  {Vector} minPoint - The minimum Point
	 * @param  {Vector} maxPoint - The maximum Point
	 * @param  {string} texture  - The image filename for the texture
	 */
	constructor(minPoint, maxPoint, texture) {
		super();
		this.minPoint = minPoint;
		this.maxPoint = maxPoint;
		this.texture = texture;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitTextureBoxNode(this);
	}
}

/**
 * Class representing the camera in the Scenegraph
 * @extends Node
 */
class CameraNode extends Node {
	/**
	 * Creates a camera
	 * @param {Vector} eye
	 * @param {Vector} center
	 * @param {Vector} up
	 * @param {number} near
	 * @param {number} far
	 * @param {number} fovy
	 */
	constructor(eye = new Vector(0, 0, -10, 1),
				center = new Vector(0, 0, -9, 1),
				up = new Vector(0, -1, 0, 0),
				near = 0.1, far = 100, fovy = 60) {
		super();
		this.eye = eye;
		this.center = center;
		this.up = up;
		this.fovy = fovy;
		this.near = near;
		this.far = far;
		this.aspect = window.aspect;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitCamera(this);
	}
}