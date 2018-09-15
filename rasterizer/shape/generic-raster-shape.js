/**
 * Calls all necessary webgl function for setting up a generic node for webgl
 * Author: noxafy
 * Created: 09.09.18
 */
class GenericRasterShape extends RasterShape {
	constructor(gl, vertices, indices, normals, colors) {
		super(gl);
		this.init(vertices, indices, normals, colors);
	}
}