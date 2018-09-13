/**
 * Author: noxafy
 * Created: 12.09.18
 */
class MouseRayTracingRenderer extends Renderer {
	constructor(canvas) {
		super(new RayTracingCameraTraverser(), null, new MouseRayTracingDrawTraverser());
		this.canvas = canvas;
	}

	findObject(rootNode, mousePos, cb) {
		this.render(rootNode);
		const rw = (this.canvas.width - 1) / 2;
		const rh = (this.canvas.height - 1) / 2;
		const ray = Raytracer.makeRay(rw, rh, mousePos.x, mousePos.y, this.camera);
		Raytracer.findMinIntersection(ray, this.bounding_spheres, cb);
	}

	clear() {
		this.bounding_spheres = [];
	}
}

class MouseRayTracingDrawTraverser extends RayTracingDrawTraverser {
	constructor() {
		super();
	}

	visitLightableNode(node) {
		const vm = this.renderer.lookat.mul(this.getTopMatrix());
		let obj;
		if (node instanceof SphereNode) {
			obj = new Sphere(vm.mul(node.center), node.radius, node.color, node.material);
		} else if (node instanceof AABoxNode) {
			let center = node.minPoint.add(node.maxPoint).div(2);
			let radius = node.minPoint.sub(center).length;
			obj = new Sphere(vm.mul(center), radius, node.color, node.material);
		} else if (node instanceof PyramidNode) {
			let center = new Position(0, 0, 0);
			let radius = node.minPoint.add(center).length;
			let height = node.top.y;
			if (height > radius) {
				let project = height - radius;
				radius += project / 2;
				center.y = project / 2;
			} else if (height < -radius) {
				let project = height + radius;
				radius -= project / 2;
				center.y = project / 2;
			}
			obj = new Sphere(vm.mul(center), radius, node.color, node.material);
		} else if (node instanceof ConeNode) {
			let center = new Position(0, 0, 0);
			let radius = node.radius;
			let height = node.top.y;
			if (height > radius) {
				let project = height - radius;
				radius += project / 2;
				center.y = project / 2;
			} else if (height < -radius) {
				let project = height + radius;
				radius -= project / 2;
				center.y = project / 2;
			}
			obj = new Sphere(vm.mul(center), radius, node.color, node.material);
		} else if (node instanceof GenericNode) {
			// ignore for now
			return;
		} else {
			throw Error("Unknown lightable node: " + (node.constructor) ? node.constructor.name : node.toString());
		}
		obj.id = this.renderer.bounding_spheres.length - 1;
		this.renderer.bounding_spheres.push(obj);
	}
}