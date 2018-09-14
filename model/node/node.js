/**
 * Class representing a Node in a Scenegraph
 */
class Node {
	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		throw Error("Unsupported operation");
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
	 * @param {Matrix} mat - A matrix describing the node's transformation
	 */
	constructor(mat) {
		super();
		this.matrix = mat;
		this.children = [];
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param {Visitor} visitor - The visitor
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

	toString() {
		let sum = "";
		for (let child of this.children) {
			sum += child.toString() + ", "
		}
		if (sum) {
			sum = sum.substr(0, sum.length - 2);
		}
		return "GroupNode: [" + sum + "]"
	}
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
class TextureBoxNode extends Node {
	/**
	 * Creates an axis aligned textured box
	 * @param {Position} minPoint - The minimum Point
	 * @param {Position} maxPoint - The maximum Point
	 * @param {string} diffuseTexture - The image filename for the diffuseTexture
	 * @param {string} normalTexture - The image filename for the normal map
	 * @param {Material} material - The material of the box
	 */
	constructor(minPoint, maxPoint, diffuseTexture, normalTexture, material) {
		super();
		this.minPoint = minPoint;
		this.maxPoint = maxPoint;
		this.diffuseTexture = diffuseTexture;
		this.normalTexture = normalTexture;
		this.material = material;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitTextureBoxNode(this);
	}

	setRasterRenderer(gl) {
		this.raster = new RasterTextureBox(gl, this.minPoint, this.maxPoint,
			this.diffuseTexture, this.normalTexture, this.material);
	}

	toString() {
		return "TextureBox: " +
			"(minPoint: " + this.minPoint.toString() + "; " +
			"maxPoint: " + this.maxPoint.toString() + "; " +
			"diffuseTexture: " + this.diffuseTexture + "; " +
			"normalTexture: " + this.normalTexture + ")";
	}
}

