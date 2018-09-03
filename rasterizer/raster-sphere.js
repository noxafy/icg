/**
 * A class creating buffers for a sphere to render it with WebGL
 */
class RasterSphere extends RasterShape {
    /**
     * Creates all WebGL buffers for the sphere
     * @param {WebGLRenderingContext} gl - The canvas' context
     * @param {Position} center   - The center of the sphere
     * @param {number} radius   - The radius of the sphere
     * @param {Color} color    - The color of the sphere
     */
    constructor(gl, center, radius, color) {
		super(gl);

		let ringsize = 30;

		let vertices = [];
		let normals = [];
		for (let ring = 0; ring < ringsize; ring++) {
			for (let ring2 = 0; ring2 < ringsize; ring2++) {
				let theta = ring * Math.PI * 2 / ringsize - 1;
				let phi = ring2 * Math.PI * 2 / ringsize;
				let x = (radius *
					Math.sin(theta) *
					Math.cos(phi) +
					center.x
				);
				let y = (radius *
					Math.sin(theta) *
					Math.sin(phi) +
					center.y
				);
				let z = (radius *
					Math.cos(theta) +
					center.z
				);
				vertices.push(x);
				vertices.push(y);
				vertices.push(z);

				let normal = (new Vector(x, y, z)).sub(center).normalised();
				normals.push(normal.x);
				normals.push(normal.y);
				normals.push(normal.z);
			}
		}

		let indices = [];
        for (let ring = 0; ring < ringsize - 1; ring++) {
            for (let ring2 = 0; ring2 < ringsize; ring2++) {
                indices.push(ring * ringsize + ring2);
                indices.push(ring * ringsize + ((ring2 + 1) % ringsize));
                indices.push((ring + 1) * ringsize + ring2);

                indices.push(ring * ringsize + ((ring2 + 1) % ringsize));
                indices.push((ring + 1) * ringsize + ((ring2 + 1) % ringsize));
                indices.push((ring + 1) * ringsize + ring2);
            }
        }

		this.makeVertexBuffer(vertices);
		this.makeIndexBuffer(indices);
		this.makeNormalBuffer(normals);
		this.makeColorBuffer(RasterSphere.generateColors(vertices.length, color));
	}
}