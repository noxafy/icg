/**
 * Author: noxafy
 * Created: 02.09.18
 */
let groupNodes = [];
SceneGraphLoader = {

	/**
	 * Loads the Scene Graph
	 * @param {string} json - The raw json to compile
	 * @return {{GroupNode, Array}} sceneGraph - The rootNode of the SceneGraph and the associated animation nodes
	 */
	load(json) {
		try {
			let sg_object = JSON.parse(json);
			if (!sg_object.sg) throw Error("Invalid scene graph json: sg_object.sg not defined")
			if (sg_object.sg.type !== "GroupNode") throw Error("Root node must be a GroupNode!")
			let tree = this.traverse(sg_object.sg);
			if (!sg_object.animationNodes) throw Error("Invalid scene graph json: sg_object.animationNodes not defined")
				let animationNodes = this.createAnimationNodes(sg_object.animationNodes);
			return {sg: tree, animationNodes: animationNodes};
		} catch (e) {
			console.error(e);
		}
	},

	traverse(obj) {
		let This;
		switch (obj.type) {
			case "GroupNode":
				This = new GroupNode(new Matrix(obj.matrix));
				for (let k in obj.children) {
					let childNode = this.traverse(obj.children[k]);
					if (childNode) This.add(childNode);
				}
				groupNodes[obj.name] = This;
				break;
			case "SphereNode":
				This = new SphereNode(new Position(obj.center), obj.radius,
					Color.getFromJson(obj.color), Material.getFromJson(obj.material));
				break;
			case "AABoxNode":
				This = new AABoxNode(new Position(obj.minPoint), new Position(obj.maxPoint),
					Color.getFromJson(obj.color), Material.getFromJson(obj.material));
				break;
			case "PyramidNode":
				This = new PyramidNode(obj.x_extent, obj.z_extent, obj.height,
					Color.getFromJson(obj.color), Material.getFromJson(obj.material));
				break;
			case "ConeNode":
				This = new ConeNode(obj.radius, obj.height, Color.getFromJson(obj.color), Material.getFromJson(obj.material));
				break;
			case "TextureBoxNode":
				This = new TextureBoxNode(new Position(obj.minPoint), new Position(obj.maxPoint), obj.texture);
				break;
			case "CameraNode":
				This = new CameraNode(new Position(obj.eye), new Vector(obj.direction), new Vector(0, 1, 0),
					obj.aspect, obj.near, obj.far, obj.fovy);
				break;
			case "LightNode":
				This = new LightNode(new Position(obj.position), Color.getFromJson(obj.color),
					obj.intensity, obj.constant, obj.linear, obj.quadratic);
				break;
			default:
				throw Error("Unknown node type: " + obj.type);
		}
		return This;
	},

	createAnimationNodes: function (nodes) {
		let animationNodes = [];
		for (let k in nodes) {
			let n = nodes[k];
			let animator;
			switch (n.animator.type) {
				case "Driver2D":
					animator = new Driver2D(n.animator.speed);
					break;
				case "Driver3D":
					animator = new Driver3D(n.animator.speed);
					break;
				case "FreeFlight":
					animator = new FreeFlight(n.animator.speed, n.animator.rotationSpeed, new Vector(n.animator.up));
					break;
				case "LinearJumper":
					animator = new LinearJumper(new Vector(n.animator.axis), n.animator.jpm);
					break;
				case "SinJumper":
					animator = new SinJumper(new Vector(n.animator.axis), n.animator.jpm);
					break;
				case "PhysicsJumper":
					animator = new PhysicsJumper(new Vector(n.animator.axis), n.animator.g_scale);
					break;
				case "SimpleRotor":
					animator = new SimpleRotor(new Vector(n.animator.axis), n.animator.speed);
					break;
				case "FreeRotor":
					animator = new FreeRotor(n.animator.speed);
					break;
				case "AxisAlignedRotor":
					animator = new AxisAlignedRotor(n.animator.speed);
					break;
				default:
					throw new Error("Unknown animator type: " + n.animator.type);
			}
			const groupNode = groupNodes[n.groupNode];
			if (!groupNode) throw Error("AnimationNode for unknown GroupNode found: " + n.groupNode);
			animationNodes.push(new AnimationNode(groupNode, animator, n.active));
		}
		return animationNodes;
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
		super.visitGroupNode(node);
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