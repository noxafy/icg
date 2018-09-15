/**
 * Helper object for processing file related actions.
 *
 * Author: noxafy
 * Created: 12.09.18
 */
Files = {
	/**
	 * Read contents from a file and pass it to callback
	 * @param {File} file
	 * @param {Function.<String>} cb
	 */
	getContent(file, cb) {
		let reader = new FileReader();
		reader.onload = function (res) {
			cb(res.target.result);
		}
		reader.readAsText(file);
	},
	/**
	 * Test if a file is a .json file
	 * @param {File} file
	 * @return {boolean}
	 */
	isJson(file) {
		return file.name.endsWith(".json");
	},
	/**
	 * Test if a file is a .obj file
	 * @param {File} file
	 * @return {boolean}
	 */
	isObj(file) {
		return file.name.endsWith(".obj");
	},
	/**
	 * Test if a file is a .mtl file
	 * @param {File} file
	 * @return {boolean}
	 */
	isMtl(file) {
		return file.name.endsWith(".mtl");
	}
}