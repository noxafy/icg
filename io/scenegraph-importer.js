/**
 * Author: noxafy
 * Created: 02.09.18
 */
let groupNodes = [];
SceneGraphImporter = {

	/**
	 * Imports a Scene Graph and its animation nodes from a json
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
				This = new SphereNode(Position.fromArray(obj.center), obj.radius,
					Color.fromJson(obj.color), Material.fromJson(obj.material), obj.ringsize);
				break;
			case "AABoxNode":
				This = new AABoxNode(Position.fromArray(obj.minPoint), Position.fromArray(obj.maxPoint),
					Color.fromJson(obj.color), Material.fromJson(obj.material));
				break;
			case "PyramidNode":
				This = new PyramidNode(obj.x_extent, obj.z_extent, obj.height,
					Color.fromJson(obj.color), Material.fromJson(obj.material));
				break;
			case "ConeNode":
				This = new ConeNode(obj.radius, obj.height,
					Color.fromJson(obj.color), Material.fromJson(obj.material), obj.ringsize);
				break;
			case "GenericNode":
				let colors = []
				for (let color of obj.colors) {
					colors.push(Color.fromJson(color).data);
				}
				This = new GenericNode(obj.vertices, obj.indices, obj.normals, obj.colors,
					Color.fromJson(obj.color), Material.fromJson(obj.material), obj.name);
				break;
			case "TextureBoxNode":
				This = new TextureBoxNode(Position.fromArray(obj.minPoint), Position.fromArray(obj.maxPoint),
					obj.diffuseTexture, obj.normalTexture, Material.fromJson(obj.material));
				break;
			case "CameraNode":
				This = new CameraNode(Position.fromArray(obj.eye), obj.aspect, obj.near, obj.far, obj.fovy);
				break;
			case "LightNode":
				This = new LightNode(Position.fromArray(obj.position), Color.fromJson(obj.color),
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
					animator = new FreeFlight(n.animator.speed, n.animator.rotationSpeed, Vector.fromArray(n.animator.up));
					break;
				case "LinearJumper":
					animator = new LinearJumper(Vector.fromArray(n.animator.axis), n.animator.jpm);
					break;
				case "SinusJumper":
					animator = new SinusJumper(Vector.fromArray(n.animator.axis), n.animator.jpm);
					break;
				case "PhysicsJumper":
					animator = new PhysicsJumper(Vector.fromArray(n.animator.axis), n.animator.g_scale);
					break;
				case "SimpleRotor":
					animator = new SimpleRotor(Vector.fromArray(n.animator.axis), n.animator.speed);
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
	}
}