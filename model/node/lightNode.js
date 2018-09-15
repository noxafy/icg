/**
 * Class representing a light
 */
class LightNode extends Node {
	/**
	 * Creates a new light with position, color and attenuation properties
	 * @param {Position} position  - The position of the light
	 * @param {Vector}   color     - The color of the light
	 * @param {number}   intensity - The intensity of the light
	 * @param {number}   constant  - the constant lighting from this light
	 * @param {number}   linear    - the linear with distance decreasing factor
	 * @param {number}   quadratic - the quadratic with distance decreasing factor
	 */
	constructor(position, color, intensity, constant, linear, quadratic) {
		super();
		this.position = position;
		this.color = color;
		this.intensity = intensity;

		this.ambient = new Vector(1, 1, 1);
		this.diffuse = new Vector(1, 1, 1);
		this.specular = new Vector(1, 1, 1);

		this.constant = constant;
		this.linear = linear;
		this.quadratic = quadratic;
	}

	/**
	 * Accepts a visitor according to the visitor pattern
	 * @param {Visitor} visitor - The visitor
	 */
	accept(visitor) {
		visitor.visitLightNode(this);
	}

	toString() {
		return "Light: (" + this.color.toString() + "; " +
			"Position: " + this.m_position.toString() + ")";
	}
}