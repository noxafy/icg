/**
 * Representing a node for a lightable shape
 * @extends Node
 */
class LightableNode extends Node {

	/**
	 *
	 * @param {Color}    color    - The color of the shape
	 * @param {Material} material - The material of the shape
	 */
	constructor(color, material) {
		if (!color) throw Error("Color is " + color);
		if (!material) throw Error("Material is " + material)

		super();
		this.color = color;
		this.material = material;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param  {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitLightableNode(this);
	}

	/**
	 * Sets the raster renderer
	 * @param {RasterShape} rasterShape
	 */
	setRasterShape(rasterShape) {
		this.raster = rasterShape;
	}

	setRasterRenderer(gl) {
		throw Error("Unsupported operation")
	}

	toString() {
		return this.color.toString() + "; " + this.material.toString();
	}
}

/**
 * Class representing a Sphere in the Scenegraph
 * @extends LightableNode
 */
class SphereNode extends LightableNode {
	/**
	 * Creates a new Sphere with center and radius
	 * @param  {Position} center   - The center of the Sphere
	 * @param  {number}   radius   - The radius of the Sphere
	 * @param  {Color}    color    - The color of the Sphere
	 * @param  {Material} material - The material of the sphere
	 * @param  {number}   ringsize - The number of edges in both axis'
	 */
	constructor(center, radius, color, material, ringsize = 50) {
		super(color, material);
		this.center = center;
		this.radius = radius;
		this.ringsize = ringsize;
	}

	setRasterRenderer(gl) {
		this.setRasterShape(new RasterSphere(gl, this.center, this.radius, this.ringsize, this.color))
	}

	toString() {
		return "Sphere: (" +
			super.toString() + "; " +
			"center: " + this.center.toString() + "; " +
			"radius: " + this.radius + ")"
	}
}

/**
 * Class representing an Axis Aligned Box in the Scenegraph
 * @extends LightableNode
 */
class AABoxNode extends LightableNode {
	/**
	 * Creates an axis aligned box
	 * @param  {Position} minPoint - The minimum Point
	 * @param  {Position} maxPoint - The maximum Point
	 * @param  {Color}    color    - The color of the cube
	 * @param  {Material} material - The material of the cube
	 */
	constructor(minPoint, maxPoint, color, material) {
		super(color, material);
		this.minPoint = minPoint;
		this.maxPoint = maxPoint;
	}

	setRasterRenderer(gl) {
		this.setRasterShape(new RasterBox(gl, this.minPoint, this.maxPoint, this.color));
	}

	toString() {
		return "AABox: (" +
			super.toString() + "; " +
			"minPoint: " + this.minPoint.toString() + "; " +
			"maxpoint: " + this.maxPoint.toString() + ")";
	}
}

/**
 * Class representing a (four-walled) pyramid in the Scenegraph
 * @extends LightableNode
 */
class PyramidNode extends LightableNode {
	/**
	 * Creates a pyramid
	 * @param  {number}   x_extent - The x extent of the pyramid
	 * @param  {number}   z_extent - The z extent of the pyramid
	 * @param  {number}   height   - The y extent of the pyramid
	 * @param  {Color}    color    - The color of the pyramid
	 * @param  {Material} material - The material of the pyramid
	 */
	constructor(x_extent, z_extent, height, color, material) {
		super(color, material);

		const x = x_extent / 2;
		const z = z_extent / 2;
		this.minPoint = new Position(x, 0, -z);
		this.maxPoint = new Position(-x, 0, z);
		this.top = new Position(0, height, 0);
	}

	setRasterRenderer(gl) {
		this.setRasterShape(new RasterPyramid(gl, this.minPoint, this.maxPoint, this.top, this.color));
	}

	toString() {
		return "Pyramid: (" +
			super.toString() + "; " +
			"min_point: " + this.minPoint.toString() + "; " +
			"max_point: " + this.maxPoint.toString() + "; " +
			"top: " + this.top.toString() + ")";
	}
}

/**
 * Class representing a (n-walled) cone in the Scenegraph
 * @extends LightableNode
 */
class ConeNode extends LightableNode {

	/**
	 * Creates a cone
	 * @param  {number}   radius   - The radius of the bottom of the cone
	 * @param  {number}   height   - The y extent of the cone
	 * @param  {Color}    color    - The color of the cone
	 * @param  {Material} material - The material of the cone
	 * @param  {number}   ringsize - The number of vertices of the bottom
	 */
	constructor(radius, height, color, material, ringsize = 50) {
		super(color, material);

		if (ringsize < 3) throw Error("Ringsize should not be lower than 3, but was: " + ringsize);
		this.ringsize = ringsize;
		this.radius = radius;
		this.top = new Position(0, height, 0);
	}

	setRasterRenderer(gl) {
		this.setRasterShape(new RasterCone(gl, this.radius, this.top, this.ringsize, this.color));
	}

	toString() {
		return "Cone: (" +
			super.toString() + "; " +
			"radius: " + this.radius + "; " +
			"top: " + this.top.toString() + ")";
	}
}