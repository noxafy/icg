/**
 * Author: noxafy
 * Created: 18.08.18
 */
Preferences = {
	showSpecs: false,
	toggleShowSpecs() {
		if (this.showSpecs) {
			SpecsView.disable();
		} else {
			SpecsView.enable();
		}
		this.showSpecs = !this.showSpecs;
	},
	showMenu: false,
	toggleShowMenu() {
		if (this.showMenu) {
			MenuView.disable();
		} else {
			MenuView.enable();
		}
		this.showMenu = !this.showMenu;
	},
	getDefaultSceneGraph: function () {
		return "";
	}
}