function degToRad(angle) {
    return angle * Math.PI / 180;
}

/**
 * Class representing a ray
 */
class Ray {
    /**
     * Creates a new ray with origin and direction
     * @param  {Vector} origin    - The origin of the Ray
     * @param  {Vector} direction - The direction of the Ray
     */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     * Creates a ray from the camera through the image plane.
     * @param  {number} width  - The width of the canvas
     * @param  {number} height - The height of the canvas
     * @param  {number} xpos   - The pixel's x-position in the canvas
     * @param  {number} ypos   - The pixel's y-position in the canvas
     * @param  {Object} camera - The Camera
     * @return {Ray}             The resulting Ray
     */
    static makeRay(width, height, xpos, ypos, camera) {
        // alpha (deg) ~ camera.fovy (rad) -> Math.PI / 180
        // -> alpha / 2 = camera.fovy * Math.PI / 360
        const halfPlaneYZ = camera.near * Math.tan(degToRad(camera.fovy) / 2);
        const x = (xpos / (width - 1) * 2 - 1) * halfPlaneYZ * camera.aspect; // normalize xpos to [-1;1] and mul by x-axis plane change (aspect)
        const y = (ypos / (height - 1) * 2 - 1) * halfPlaneYZ;

        const v = camera.center.sub(camera.eye).normalised(); // camera view direction
        const r = camera.up.cross(v); // right direction, orthogonal to up and view vector
        const d = v.mul(camera.near).add(r.mul(x)).add(camera.up.mul(y)); // resulting direction = z + x + y

        return new Ray(
            camera.eye,
            d.normalised()
        );
    }
}
