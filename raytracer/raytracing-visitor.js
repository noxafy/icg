/**
 * Author: noxafy
 * Created: 04.09.18
 */
class RayTracingCameraTraverser extends CameraTraverser {

	visitCameraNode(node) {
		this.renderer.lookat = this.getTopMatrix().invert().mul(Matrix.lookat(node.eye, node.center, node.up));
		this.renderer.camera = new Camera(node);
	}
}

class RayTracingLightTraverser extends LightTraverser {

	visitLightNode(node) {
		node.m_position = this.getTopMatrix().mul(node.position);
		node.vm_position = this.renderer.lookat.mul(node.m_position);
		this.renderer.lights.push(node);
	}
}

class RayTracingDrawTraverser extends DrawTraverser {

	visitLightableNode(node) {
		const vm = this.renderer.lookat.mul(this.getTopMatrix());
		if (node instanceof SphereNode) {
			this.renderer.objects.push(new Sphere(vm.mul(node.center), node.radius, node.color, node.material));
		} else if (node instanceof AABoxNode) {
			this.renderer.objects.push(
				new AABox(vm.mul(node.minPoint), vm.mul(node.maxPoint), node.color, node.material)
			);
		} else if (node instanceof PyramidNode) {
			// ignore for now
		} else if (node instanceof ConeNode) {
			// ignore for now
		} else if (node instanceof GenericNode) {
			// ignore for now
		}
		else {
			throw Error("Unknown lightable node: " + (node.constructor) ? node.constructor.name : node.toString());
		}
	}

	visitTextureBoxNode(node) {
		// ignore for now
	}
}

