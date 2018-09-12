/**
 * Author: noxafy
 * Created: 03.09.18
 */
SceneGraphExporter = {

	/**
	 * Export the current Scene Graph and its animation nodes to json
	 * @param {GroupNode} rootNode
	 * @param {Array} animationNodes
	 */
	export(rootNode, animationNodes) {
		// generate scene graph
		let jsonGenerator = new SceneGraphJsonGenerator();
		const sceneGraphJsonObj = jsonGenerator.generate(rootNode);

		// generate animation nodes
		let animVisitor = new AnimationNodeJsonGenerator();
		const animJsonObj = [];
		for (let i = 0; i < animationNodes.length; i++) {
			let node = animationNodes[i];
			animJsonObj.push(animVisitor.generate(rootNode, node));
		}
		// make json
		let json = JSON.stringify({
			sg: sceneGraphJsonObj,
			animationNodes: animJsonObj
		});

		// export
		let a = document.createElement("a");
		let file = new Blob([json], {type: "application/json"});
		a.href = URL.createObjectURL(file);
		a.download = "scenegraph-export.json";
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(a.href);
		}, 0);
		setTimeout(MenuView.endButtonLoading, 1500);
	}
}

class SceneGraphJsonGenerator extends Visitor {

	constructor() {
		super(null);
		this.groupNodeCnt = 0;
		this.toAppend = [];
	}

	/**
	 * Traverses through all elements of the graph and returns the completed json-ready object
	 * @param {GroupNode} rootNode
	 */
	generate(rootNode) {
		rootNode.accept(this);
		return this.jsonObj;
	}

	visitGroupNode(node) {
		this.groupNodeCnt++;

		let obj = {
			type: "GroupNode",
			matrix: node.matrix.toArray(),
			name: "gn" + this.groupNodeCnt,
			children: []
		};

		this.toAppend.push(obj.children);
		super.visitGroupNode(node);
		this.toAppend.pop();
		this.append(obj);
	}

	visitLightableNode(node) {
		let obj;
		if (node instanceof SphereNode) {
			obj = {
				center: node.center.data,
				radius: node.radius,
				ringsize: node.ringsize
			};
		} else if (node instanceof AABoxNode) {
			obj = {
				minPoint: node.minPoint.data,
				maxPoint: node.maxPoint.data
			}
		} else if (node instanceof PyramidNode) {
			obj = {
				x_extent: node.minPoint.x * 2,
				z_extent: node.maxPoint.z * 2,
				height: node.top.y
			}
		} else if (node instanceof ConeNode) {
			obj = {
				radius: node.radius,
				height: node.top.y,
				ringsize: node.ringsize
			}
		} else if (node instanceof GenericNode) {
			obj = {
				vertices: node.vertices,
				indices: node.indices,
				normals: node.normals,
				colors: node.colors,
				name: node.name
			}
		} else {
			throw Error("Unknown node type: " + (node.constructor) ? node.constructor.name : node.toString());
		}

		obj.type = node.constructor.name;
		obj.color = node.color.toJsonObj();
		obj.material = node.material.toJsonObj();
		this.append(obj)
	}

	visitTextureBoxNode(node) {
		this.append({
			type: "TextureBoxNode",
			minPoint: node.minPoint.data,
			maxPoint: node.maxPoint.data,
			texture: node.texture
		})
	}

	visitCameraNode(node) {
		this.append({
			type: "CameraNode",
			eye: node.eye.data,
			aspect: node.aspect,
			near: node.near,
			far: node.far,
			fovy: node.fovy
		})
	}

	visitLightNode(node) {
		this.append({
			type: "LightNode",
			position: node.position.data,
			color: node.color.toJsonObj(),
			intensity: node.intensity,
			constant: node.constant,
			linear: node.linear,
			quadratic: node.quadratic
		})
	}

	append(obj) {
		if (this.toAppend.length > 0) this.toAppend[this.toAppend.length - 1].push(obj);
		else this.jsonObj = obj;
	}
}

class AnimationNodeJsonGenerator extends Visitor {

	constructor() {
		super(null);
	}

	/**
	 *
	 * @param {GroupNode} rootNode
	 * @param {AnimationNode} animationNode
	 */
	generate(rootNode, animationNode) {
		this.animationNode = animationNode;
		this.groupNodeCnt = 0;
		rootNode.accept(this);
		return this.jsonObj;
	}

	visitGroupNode(node) {
		this.groupNodeCnt++;

		if (this.animationNode.groupNode === node) {
			this.jsonObj = {
				groupNode: "gn" + this.groupNodeCnt,
				active: this.animationNode.active,
				animator: this.animationNode.animator.toJsonObj()
			};
			return;
		}

		super.visitGroupNode(node);
	}
}