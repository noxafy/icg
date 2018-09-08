/**
 * Class representing an Animation
 */
class AnimationNode {
	/**
	 * Creates a new AnimationNode
	 * @param {GroupNode} groupNode - The GroupNode to attach to
	 * @param {Animator}  animator  - The Animator that executes the matrix calculation
	 * @param {Boolean}   active    - If the Animation starts active
	 */
	constructor(groupNode, animator, active = true) {
		this.groupNode = groupNode;
		this.animator = animator;
		this.active = active;
	}

	/**
	 * Toggles the active state of the animation node.
	 * Except it's a Driver. It's always on to remain user freedom.
	 */
	toggleActive() {
		if (this.animator instanceof UserControllable) this.active = true
		else this.active = !this.active;
	}

	/**
	 * Advances the animation by deltaT
	 * @param {number} deltaT - The time difference, the animation is advanced by
	 */
	simulate(deltaT) {
		// change the matrix of the attached
		// group node to reflect a rotation
		if (this.active) {
			let res = this.animator.calc(deltaT, this.groupNode.matrix);
			if (!res) throw Error(this.constructor.name + ": Failed to calculate animation for " + this.groupNode.toString())
			this.groupNode.matrix = res;
		}
	}
}
