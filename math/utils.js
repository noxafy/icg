/**
 * Helper objects for processing math related problems.
 *
 * Author: noxafy
 * Created: 12.08.18
 */
class Utils {
	/**
	 * Convert angle in deg to rad
	 * @param {number} angle
	 * @return {number}
	 */
	static degToRad(angle) {
		return angle * Math.PI / 180;
	}

	/**
	 * Convert angle in rad to deg
	 * @param {number} rad
	 * @return {number}
	 */
	static radToDeg(rad) {
		return rad * 180 / Math.PI;
	}

	/**
	 * Shorten a value as usually sensible for toString output.
	 * @param {number} val
	 * @return {*}
	 */
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
		else if (abs > 1e-7) {
			return Math.round(val * 1000000000) / 1000000000
		}
		else return val;
	}
}