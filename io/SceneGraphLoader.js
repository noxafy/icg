/**
 * Author: noxafy
 * Created: 02.09.18
 */
SceneGraphLoader = {

	/**
	 * Loads the Scene Graph
	 * @param {string} json - The raw json to compile
	 * @return {{GroupNode, Array}} sceneGraph - The rootNode of the SceneGraph and the associated animation nodes
	 */
	load(json) {
		let sg_object = JSON.parse(json);
		let sg = new GroupNode(Matrix.identity());
		let animationNodes = [];
		return {rootNode: sg, animationNodes: animationNodes};
	},

	/**
	 * Exports the given Scene Graph to json
	 * @param {GroupNode} rootNode
	 * @param {Array} animationNodes
	 */
	export(rootNode, animationNodes) {
		// generate animation nodes
		let animVisitor = new AnimationNodeJsonGenerator();
		let jsonGenerator = new JsonGenerator();
		let jsonAnimJsonObj = [];
		for (let i = 0; i < animationNodes.length; i++) {
			let node = animationNodes[i];
			jsonAnimJsonObj.push(animVisitor.generate(rootNode, node));
		}
		let json = JSON.stringify({
			sg: jsonGenerator.generate(rootNode),
			animationNodes: jsonAnimJsonObj
		});

		// add to export button
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
		setTimeout(MenuView.endButtonLoading, 1000);
	}
}

class JsonGenerator extends Visitor {

	constructor() {
		super(null);
		this.groupNodeCnt = 0;
		this.toAppend = [];
	}

	/**
	 *
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
		for (let child of node.children) {
			child.accept(this);
		}
		this.toAppend.pop();
		this.append(obj);
	}

	visitLightableNode(node) {
		let obj;
		if (node instanceof SphereNode) {
			obj = {
				type: "SphereNode",
				center: node.center.data,
				radius: node.radius
			};
		} else if (node instanceof AABoxNode) {
			obj = {
				type: "AABoxNode",
				minPoint: node.minPoint.data,
				maxPoint: node.maxPoint.data
			}
		} else if (node instanceof PyramidNode) {
			obj = {
				type: "PyramidNode",
				x_extent: node.minPoint.x * 2,
				z_extent: node.maxPoint.z * 2,
				height: node.top.y
			}
		} else if (node instanceof ConeNode) {
			obj = {
				type: "ConeNode",
				radius: node.radius,
				height: node.top.y,
				ringsize: node.ringsize
			}
		}
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
			direction: node.center.sub(node.eye).data,
			up: node.up.data, // just for simplicity
			near: node.near,
			far: node.far,
			fovy: node.fovy
		})
	}

	visitLightNode(node) {
		this.append({
			type: "LightNode",
			position: node.position.data,
			color: node.color.data,
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
				name: "gn" + this.groupNodeCnt,
				active: this.animationNode.active,
				animator: this.animationNode.animator.toJsonObj()
			};
			return;
		}

		for (let child of node.children) {
			if (child instanceof GroupNode) {
				child.accept(this);
			}
		}
	}

	visitLightableNode(node) {
		//
	}

	visitTextureBoxNode(node) {
		//
	}

	visitCameraNode(node) {
		//
	}

	visitLightNode(node) {
		//
	}
}