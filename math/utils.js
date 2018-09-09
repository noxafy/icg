/**
 * Author: noxafy
 * Created: 12.08.18
 */
class Utils {
	static degToRad(angle) {
		return angle * Math.PI / 180;
	}

	static radToDeg(rad) {
		return rad * 180 / Math.PI;
	}

	static round(val) {
		let abs = Math.abs(val);
		if (abs > 1e-1) {
			return Math.round(val * 1000) / 1000
		}
		else if (abs > 1e-2) {
			return Math.round(val * 10000) / 10000
		}
		else if (abs > 1e-3) {
			return Math.round(val * 100000) / 100000
		}
		else if (abs > 1e-4) {
			return Math.round(val * 1000000) / 1000000
		}
		else if (abs > 1e-5) {
			return Math.round(val * 10000000) / 10000000
		}
		else if (abs > 1e-6) {
			return Math.round(val * 100000000) / 100000000
		}
		else return val;
	}
}