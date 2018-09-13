/**
 * Author: noxafy
 * Created: 12.09.18
 */
Files = {
	getContent(file, cb) {
		let reader = new FileReader();
		reader.onload = function (res) {
			cb(res.target.result);
		}
		reader.readAsText(file);
	},
	isJson(file) {
		return file.name.endsWith(".json");
	},
	isObj(file) {
		return file.name.endsWith(".obj");
	},
	isMtl(file) {
		return file.name.endsWith(".mtl");
	}
}