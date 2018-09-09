/**
 * Author: noxafy
 * Created: 09.09.18
 */
class GenericRasterShape extends RasterShape {
	constructor(gl, vertices, indices, normals, color) {
		super(gl);
		const colors = RasterShape.generateColors(color);
		this.init(this.init(vertices, indices, normals, colors))
	}
}