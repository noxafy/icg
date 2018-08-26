/**
 * Class representing a vector in 4D space
 */
class Vector {
    /**
     * Create a vector
     * @param  {number} x - The x component
     * @param  {number} y - The y component
     * @param  {number} z - The z component
     * @param  {number} w - The w component
     */
    constructor(x, y, z, w = 0) {
        this.data = [x, y, z, w];
    }

    /**
     * Returns the x component of the vector
     * @return {number} The x component of the vector
     */
    get x() {
        return this.data[0];
    }

    /**
     * Sets the x component of the vector to val
     * @param  {number} val - The new value
     */
    set x(val) {
        this.data[0] = val;
    }

    /**
     * Returns the first component of the vector
     * @return {number} The first component of the vector
     */
    get r() {
        return this.data[0];
    }

    /**
     * Sets the first component of the vector to val
     * @param  {number} val - The new value
     */
    set r(val) {
        this.data[0] = val;
    }

    /**
     * Returns the y component of the vector
     * @return {number} The y component of the vector
     */
    get y() {
        return this.data[1];
    }

    /**
     * Sets the y component of the vector to val
     * @param  {number} val - The new value
     */
    set y(val) {
        this.data[1] = val;
    }

    /**
     * Returns the second component of the vector
     * @return {number} The second component of the vector
     */
    get g() {
        return this.data[1];
    }

    /**
     * Sets the second component of the vector to val
     * @param  {number} val - The new value
     */
    set g(val) {
        this.data[1] = val;
    }

    /**
     * Returns the z component of the vector
     * @return {number} The z component of the vector
     */
    get z() {
        return this.data[2];
    }

    /**
     * Sets the z component of the vector to val
     * @param  {number} val - The new value
     */
    set z(val) {
        this.data[2] = val;
    }

    /**
     * Returns the third component of the vector
     * @return {number} The third component of the vector
     */
    get b() {
        return this.data[2];
    }

    /**
     * Sets the third component of the vector to val
     * @param  {number} val - The new value
     */
    set b(val) {
        this.data[2] = val;
    }

    /**
     * Returns the w component of the vector
     * @return {number} The w component of the vector
     */
    get w() {
        return this.data[3];
    }

    /**
     * Sets the w component of the vector to val
     * @param  {number} val - The new value
     */
    set w(val) {
        this.data[3] = val;
    }

    /**
     * Returns the fourth component of the vector
     * @return {number} The fourth component of the vector
     */
    get a() {
        return this.data[3];
    }

    /**
     * Sets the fourth component of the vector to val
     * @param  {number} val - The new value
     */
    set a(val) {
        this.data[3] = val;
    }

    /**
     * Calculates the length of the vector
     * @return {number} The length of the vector
     */
    get length() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    /**
     * Creates a new vector with the vector added
     * @param {Vector} other - The vector to add
     * @return {Vector}        The new vector;
     */
    add(other) {
		return new Vector(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    }

    /**
     * Creates a new vector with the vector subtracted
     * @param {Vector} other - The vector to subtract
     * @return {Vector}        The new vector
     */
    sub(other) {
		return new Vector(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
    }

    /**
     * Creates a new vector with the scalar multiplied
     * @param {number} other - The scalar to multiply
     * @return {Vector}        The new vector
     */
    mul(other) {
		return new Vector(this.x * other, this.y * other, this.z * other, this.w);
    }

    /**
     * Creates a new vector with the scalar divided
     * @param {number} other - The scalar to divide
     * @return {Vector}        The new vector
     */
    div(other) {
		return new Vector(this.x / other, this.y / other, this.z / other, this.w);
    }

    /**
     * Dot product
     * @param {Vector} other - The vector to calculate the dot product with
     * @return {number}        The result of the dot product
     */
    dot(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Cross product
     * @param {Vector} other - The vector to calculate the cross product with
     * @return {Vector}        The result of the cross product as new Vector
     */
    cross(other) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.z * other.x - this.x * other.z;
        let z = this.x * other.y - this.y * other.x;
        return new Vector(x, y, z, 0);
    }

    /**
     * Returns an array representation of the vector
     * @return {Array.<number>} An array representation.
     */
    valueOf() {
        return this.data;
    }

    /**
     * Creates a new vector by normalising the vector
     * @return {Vector} A vector with length 1
     */
    normalised() {
        return this.div(this.length);
    }

    /**
     * Compares the vector to another
     * @param  {Vector} other - The vector to compare to.
     * @return {Boolean}        True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
     */
    equals(other) {
        return (
            Math.abs(this.x - other.x) <= Number.EPSILON &&
            Math.abs(this.y - other.y) <= Number.EPSILON &&
            Math.abs(this.z - other.z) <= Number.EPSILON &&
            ((!this.w && !other.w) || Math.abs(this.w - other.w) <= Number.EPSILON)
        );
    }

	toString() {
		return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]"
	}
}

class Position extends Vector {
	constructor(x, y, z) {
		super(x, y, z, 1);
	}
}
