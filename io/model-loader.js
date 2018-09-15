/**
 * Loader for importing polygonal geometry into the scene graph.
 *
 * Author: noxafy
 * Created: 09.09.18
 */
ModelLoader = {

	/**
	 * Loads a model using the .obj format for geometry and the .mtl for material properties. Takes the files as string and returns an Array of {@link GenericNode}s.
	 *
	 * Parses the vertices, indices and normals of a polygonal geometry from the .obj format as specified in {@link http://www.martinreddy.net/gfx/3d/OBJ.spec}, but ignores all other data owing to not being supported by application.
	 *
	 * Parses the ambient, diffuse, specular and shininess parameters as specifies in {@link http://paulbourke.net/dataformats/mtl/}, but ignores all other data owing to not being supported by application.
	 *
	 * @param {string} obj - Object geometry data as specified in the standard
	 * @param {string} mtl - Material properties data as specified in the standard
	 * @return {Array.<GenericNode>} geometry - An array of GenericNodes, containing the given data
	 */
	load(obj, mtl) {
		let materials = this.Mtl.parse(mtl);
		return this.Obj.parse(obj, materials);
	},
	Mtl: {
		/**
		 * Takes the content of a .mtl file as string and returns an array of the {@link Material}s.
		 * Parses the
		 *  - {@link Material.ambient} (Ka),
		 *  - {@link Material.diffuse} (Kd),
		 *  - {@link Material.specular} (Ks) and
		 *  - {@link Material.shininess} (Ns)
		 *
		 * parameters as specified in the .mtl standard {@link http://paulbourke.net/dataformats/mtl/}, but ignores all other data owing to not being supported by this implementation.
		 * @param {string} mtl
		 * @return {Array.<Material>}
		 */
		parse(mtl) {
			let materials = [];
			let current_mat;

			let lines = mtl.split("\n");
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i].trim();
				// ignore empty lines and comments
				if (line.length === 0 || line.startsWith("#")) continue;

				try {
					let args = line.split(" ");
					switch (args.shift()) {
						case "newmtl":
							if (current_mat && this.isValid(current_mat)) {
								materials.push(current_mat);
							}
							current_mat = new Material(null, null, null, null, args[0]);
							break;
						case "Ka":
							current_mat.ambient = this.parseColor(args);
							break;
						case "Kd":
							current_mat.diffuse = this.parseColor(args);
							break;
						case "Ks":
							current_mat.specular = this.parseColor(args);
							break;
						case "Ns":
							if (args.length === 0) throw Error("Expected shininess value after keyword \"Ns\".")
							current_mat.shininess = Number.parseFloat(args[0]);
							break;
						default:
						// ignore Tf, illum, d [-halo], sharpness, Ni and all others
					}
				} catch (e) {
					// e.message = "Parse Error in .mtl file: line " + (i + 1) + ": " + e.message;
					// console.error(e.stack);
					throw e;
				}
			}
			if (current_mat && this.isValid(current_mat)) {
				materials.push(current_mat);
			}
			return materials;
		},

		isValid(mat) {
			let missing = [];
			if (!mat.ambient) missing.push("Ka");
			if (!mat.diffuse) missing.push("Kd");
			if (!mat.specular) missing.push("Ks");
			if (mat.shininess === undefined) missing.push("Ns");
			if (missing.length > 0)
				throw Error("Missing properties for material " + mat.name + ": " + missing);
			return true;
		},

		/**
		 * Parses an array of strings to a vector as specified in mtl-standard
		 * @param {Array.<string>} args - array containing data for the vector
		 * @return {Color} The vector with the given color data
		 */
		parseColor(args) {
			switch (args[0]) {
				case "spectral":
					throw Error("Color definition as a spectral curve is not supported");
				case "xyz":
					args.shift();
					let color = parseColor0(args);
					return this.CIEXYZtoRGB(color);
				default:
					return parseColor0(args); // already in r g b
			}

			/**
			 * Takes an array of one to three strings and parses it to a color as specified in mtl standard (without a specifying keyword).
			 * @param args
			 * @return {Color}
			 */
			function parseColor0(args) {
				let r = Number.parseFloat(args[0]),
					g, b;
				if (args.length === 1) {
					g = b = r;
				} else if (args.length === 3) {
					g = Number.parseFloat(args[1]);
					b = Number.parseFloat(args[2]);
				} else {
					throw Error("Wrong number of arguments: " + args.length);
				}
				return new Color(r, g, b);
			}
		},

		/**
		 * Takes a color in CIEXYZ color space as specified in
		 * {@link https://en.wikipedia.org/wiki/CIE_1931_color_space} and
		 * converts it to a color in rgb space.
		 * @param {Color} color
		 */
		CIEXYZtoRGB(color) {
			return new Matrix([
				0.41847, -0.15866, -0.082835, 0,
				-0.091169, 0.25243, 0.015708, 0,
				0.00092090, -0.0025498, 0.17860, 0,
				0, 0, 0, 1
			]).mul(color);
		}
	},

	Obj: {
		/**
		 * Takes an .obj file as string and returns an array of {@link GenericNode}s. Parameters are parsed as specified in the .obj standard {@link http://www.martinreddy.net/gfx/3d/OBJ.spec}.
		 * <b>Vertex data</b>
		 * Parses keyword "v" to {@link GenericNode.vertices} and "vn" to {@link GenericNode.normals}. After each "v" or "vn" keyword there must be three arguments, containing the x, y and z coordinate of the vertex/normal. Synchronized order is not necessary, but specified through face elements.
		 *
		 * <b>Face elements</b>
		 * Only triangles are supported and are specified as face elements with keyword "f" and parsed to  {@link GenericNode.indices}. Therefore there should be three arguments after each "f" keyword. A value between the the two slashes (/) will be ignored. The third value will be used to calculate the normal for the vertex as required by this application.
		 *
		 * <b>Color</b>
		 * Contrary to standard specification there can be given an own color for each vertex by giving the r g b value directly appending to the vertex coordinates. Alternatively you can give one color for the whole object by specifying a line starting with the keyword "c" followed by the r g b values.
		 * If no color is given, a mid grey {@link Colors.GREY} will be used.
		 * @param {string} obj
		 * @param {Array.<Material>} materials
		 * @return {Array.<GenericNode>}
		 */
		parse(obj, materials) {
			let objects = [];
			let current_object;
			let vertices = [], normals = [], faces = [];

			let lines = obj.split("\n");
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i].trim();
				// ignore empty lines and comments
				if (line.length === 0 || line.startsWith("#")) continue;

				try {
					let args = line.split(" ");
					switch (args.shift()) {
						case "o":
							if (current_object) {
								this.processFaces(current_object, vertices, normals, faces);
								if (this.isValid(current_object)) {
									objects.push(current_object);
								}
							}
							// material just for satisfying application's material constraint
							current_object = new GenericNode([], [], [], [], Colors.GREY, Materials.DEFAULT, args[0]);
							break;
						case "v":
							if (args.length < 3) throw Error("Wrong number of arguments: " + args.length);
							vertices.push(Position.fromArray(args));
							if (args.length > 3) {
								const color = ModelLoader.Mtl.parseColor(args.slice(3));
								current_object.colors.push(color.r, color.g, color.b);
							}
							break;
						case "vn":
							if (args.length < 3) throw Error("Wrong number of arguments: " + args.length);
							const x = Number.parseFloat(args[0]);
							const y = Number.parseFloat(args[1]);
							const z = Number.parseFloat(args[2]);
							normals.push(new Vector(x, y, z));
							break;
						case "c":
							if (args.length < 1) throw Error("Please give color values with keyword \"c\"!");
							if (current_object.colors.length > 0)
								console.error("Keyword \"c\" found, but also vertex specific colors. Application will ignore the color.")
							current_object.color = ModelLoader.Mtl.parseColor(args);
							break;
						case "f":
							// if (args.length !== 3) console.error("Warning: Face with " + args.length + " components found at line " + i + ": " + line);
							for (let j = 1; j < args.length - 1; j++) {
								faces.push(args[0]);
								faces.push(args[j]);
								faces.push(args[j + 1])
							}
							break;
							// if (args.length !== 3) throw Error("There must be given exactly three arguments to specify a face, but was: " + args.length)
							break;
						case "usemtl":
							if (args.length < 1) throw Error("Please give a name of a material with keyword \"usemtl\"!")
							current_object.material = this.findMaterial(materials, args[0], current_object);
							break;
						default:
						// mtllib is asserted to be the given mtl file
						// ignore vt, vp,  and all others
					}
				} catch (e) {
					e.message = "Parse Error in .obj file: line " + (i + 1) + ": " + e.message;
					console.error(e.stack);
					throw e;
				}
			}
			if (current_object) {
				this.processFaces(current_object, vertices, normals, faces);
				if (this.isValid(current_object)) {
					objects.push(current_object);
				}
			}

			return objects;
		},

		/**
		 * Calculates the normals for each vertex and appends both and the indices to given node.
		 * Parses as specified in {@link ModelLoader.Obj.parse}.
		 * @param {GenericNode} node
		 * @param {Array.<Position>} vertices
		 * @param {Array.<Vector>} normals
		 * @param {Array.<String>} faces
		 */
		processFaces(node, vertices, normals, faces) {
			let normals_store = new Array(vertices.length);
			loop: for (let face of faces) {
				let idxs = face.split("/");
				if (idxs.length !== 3)
					throw Error("Face vertex specification must have three reference numbers, but was: " + face);

				const idx1 = Number.parseInt(idxs[0]) - 1; // one-based to zero-based
				if (idx1 >= vertices.length) throw Error("Face vertex specification cannot " +
					"in first part reference to an index higher than the count of given vertices (" + vertices.length + "), but was: " + face);
				node.indices.push(idx1);

				// ignore idxs[1]

				const idx3 = Number.parseInt(idxs[2]) - 1; // one-based to zero-based
				if (idx3 >= normals.length) throw Error("Face vertex specification cannot " +
					"in third part reference to an index higher than the count of given normals (" + normals.length + "), but was: " + face);

				const store_array = normals_store[idx1];
				if (store_array) {
					for (let idx of store_array) {
						if (idx === idx3) continue loop;
					}
					store_array.push(idx3);
				}
				else {
					normals_store[idx1] = [idx3];
				}
			}

			for (let i = 0; i < normals_store.length; i++) {
				const v = vertices[i];
				node.vertices.push(v.x, v.y, v.z);
				// if (!normals_store[i]) throw Error("No normal defined for vertex " + i);
				if (normals_store[i]) {
					let normal = new Vector(0, 0, 0);
					for (let idx of normals_store[i]) {
						if (idx < normals.length) {
							const vec = normals[idx];
							normal = normal.add(vec);
						}
					}
					const n = normal.normalised();
					node.normals.push(n.x, n.y, n.z);
				} else {
					node.normals.push(1, 1, 1);
				}
			}
		},

		/**
		 * Search for given material in given materials from .mtl file and the application's materials
		 * @param {Array.<Material>} materials - given materials from .mtl file
		 * @param {string} material_name
		 * @return {Material}
		 */
		findMaterial: function (materials, material_name) {
			// search through given material from .mtl file
			for (let material of materials) {
				if (material_name === material.name) return material;
			}
			// search through this application's material library
			for (let key in Materials) {
				if (Materials.hasOwnProperty(key) && Materials[key] instanceof Material) {
					if (material_name === Materials[key].name) return Materials[key];
				}
			}
			throw Error("Material not found: " + material_name)
		},

		/**
		 * Tests, if a generic node is complete.
		 * @param {GenericNode} obj
		 */
		isValid: function (obj) {
			let missing = [];
			if (obj.vertices.length === 0) missing.push("vertices");
			if (obj.indices.length === 0) missing.push("indices");
			if (obj.normals.length === 0) missing.push("normals");
			// colors is not mandatory
			if (missing.length > 0)
				throw Error("Missing properties for object " + obj.name + ": " + missing);

			if (obj.vertices.length !== obj.normals.length) throw Error("There must be as many normals as vertices, but where "
				+ obj.normals.length + " normals to " + obj.vertices.length + " vertices.");
			return true;
		}
	}
}

