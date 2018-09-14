class Visitor {
	constructor() {
	}

	/**
	 * Visits a group node, calling accept for all children.
	 * @param {GroupNode} node - The node to visit
	 */
	visitGroupNode(node) {
		for (let child of node.children) {
			child.accept(this);
		}
	}

	/**
	 * Visits a lightable node
	 * @param {LightableNode} node - The lightable node to visit
	 */
	visitLightableNode(node) {
	}

	/**
	 * Visits a textured box node. Loads the diffuseTexture
	 * and creates a uv coordinate buffer
	 * @param {TextureBoxNode} node - The diffuseTexture box node to visit
	 */
	visitTextureBoxNode(node) {
	}

	/**
	 * Visits a camera node. Updates the lookat and perspective matrices.
	 * @param {CameraNode} node - The camera node to visit
	 */
	visitCameraNode(node) {
	}

	/**
	 * Visits a light node. Calculates and saves the light and its position.
	 * @param {LightNode} node - The light node to visit
	 */
	visitLightNode(node) {
	}
}

class StackingVisitor extends Visitor {
	constructor() {
		super();
		this.modelMatrices = [];
	}

	/**
	 * Visit the group node and put the node's matrix upon the stack
	 * @param {GroupNode} node
	 */
	visitGroupNode(node) {
		if (this.modelMatrices.length === 0) {
			this.modelMatrices.push(node.matrix);
		} else {
			const top = this.getTopMatrix();
			this.modelMatrices.push(top.mul(node.matrix));
		}
		super.visitGroupNode(node);
		this.modelMatrices.pop();
	}

	/**
	 * Get the last (up-multiplied) matrix on the stack
	 * @return {Matrix}
	 */
	getTopMatrix() {
		return this.modelMatrices[this.modelMatrices.length - 1];
	}

	setRenderer(renderer) {
		this.renderer = renderer;
	}
}

class CameraTraverser extends StackingVisitor {
}

class LightTraverser extends StackingVisitor {
}

class DrawTraverser extends StackingVisitor {
}