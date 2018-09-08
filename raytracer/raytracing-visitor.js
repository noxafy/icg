/**
 * Author: noxafy
 * Created: 04.09.18
 */
class RayTracingCameraTraverser extends CameraTraverser {

	visitCameraNode(node) {
		const mat = this.getTopMatrix();

		let eye = mat.mul(node.eye);
		let direction = mat.mul(node.direction);
		let up = mat.mul(node.up);

		this.renderer.camera = new Camera(eye, direction, up, node.aspect, node.near, node.far, node.fovy);
	}
}

class RayTracingLightTraverser extends LightTraverser {

	visitLightNode(node) {
		let pos = this.getTopMatrix().mul(node.position);
		this.renderer.addLight(pos, node);
	}
}

class RayTracingDrawTraverser extends DrawTraverser {

	visitLightableNode(node) {
		let mat = this.getTopMatrix();
		if (node instanceof SphereNode) {
			this.renderer.objects.push(new Sphere(mat.mul(node.center), node.radius, node.color));
		} else if (node instanceof AABoxNode) {
			this.renderer.objects.push(new AABox(mat.mul(node.minPoint), mat.mul(node.maxPoint), node.color));
		} else if (node instanceof PyramidNode) {
			// TODO
		} else if (node instanceof ConeNode) {
			// TODO
		} else {
			throw Error("Unknown lightable node type: " + node.toString())
		}
	}

	visitTextureBoxNode(node) {
		// ignore for now
	}
}

