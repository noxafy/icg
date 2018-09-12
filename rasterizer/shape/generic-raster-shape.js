/**
 * Author: noxafy
 * Created: 09.09.18
 */
class GenericRasterShape extends RasterShape {
	constructor(gl, vertices, indices, normals, colors) {
		super(gl);
		this.init(vertices, indices, normals, colors);
	}
}