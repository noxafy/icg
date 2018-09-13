/**
 * Author: noxafy
 * Created: 12.09.18
 */
ModelLoadView = {
	state: 0,
	ready: undefined,
	objFile: undefined,
	mtlFile: undefined,
	container: document.getElementById("modelload-form-container"),
	form: document.getElementById("modelload-form"),
	nextBtn: document.getElementById("modelload-form-button-next"),
	prevBtn: document.getElementById("modelload-form-button-previous"),
	objDrop: document.getElementById("modelload-form-droparea-obj"),
	mtlDrop: document.getElementById("modelload-form-droparea-mtl"),
	page1: document.getElementById("page_getOtherFile"),
	page2: document.getElementById("page_setMatrix"),
	init(objFile, mtlFile) {
		this.state = 0;
		this.ready = undefined;
		this.objFile = objFile;
		this.mtlFile = mtlFile;
		this.nextBtn.disabled = true;
		this.prevBtn.disabled = true;
		this.clearUploaded(this.objDrop, "<strong>Required</strong>: Drop .obj file here");
		this.clearUploaded(this.mtlDrop, "Optional: Drop .mtl file here")
		if (this.objFile) {
			this.nextBtn.disabled = false
			this.setUploaded(this.objDrop, this.objFile);
		}
		if (this.mtlFile) {
			this.setUploaded(this.mtlDrop, this.mtlFile);
		}
	},
	next() {
		switch (this.state) {
			case 0:
				this.container.className = "";
				UserInteraction.Events.Key.disable();
				this.page1.className = "";
				this.state = 1;
				break;
			case 1:
				this.page1.className = "disabled";
				this.page2.className = "";
				this.nextBtn.innerText = "Done";
				this.prevBtn.disabled = false;
				this.state = 2;
				break;
			case 2:
				this.close();
				let matrix = this.getMatrixFromPage2();
				this.ready(this.objFile, this.mtlFile, matrix);
				this.state = 0;
				break;
		}
	},
	previous() {
		switch (this.state) {
			case 2:
				this.nextBtn.innerText = "Next >";
				this.page1.className = "";
				this.page2.className = "disabled";
				this.nextBtn.disabled = false;
				this.prevBtn.disabled = true;
				this.state = 1;
				break;
		}
	},
	onFileDrop(e) {
		e.preventDefault();
		// only take account of the first file
		const file = e.dataTransfer.files[0];
		if (!FileReader) {
			window.alert("Sorry, file dropping not available! Please use another browser.")
			return false;
		}
		if (Files.isObj(file)) {
			this.nextBtn.disabled = false;
			this.objFile = file;
			this.setUploaded(this.objDrop, this.objFile);
		} else if (Files.isMtl(file)) {
			this.mtlFile = file;
			this.setUploaded(this.mtlDrop, this.mtlFile);
		} else {
			// TODO: represent error in view
			console.error("Unsupported file type: " + file.name);
		}
	},
	setUploaded(drop, file) {
		let span = drop.children[0];
		span.innerHTML = "Uploaded file: " + file.name;
		span.style.color = "black";
		drop.style.borderStyle = "solid";
		drop.style.backgroundColor = "lightgray";
	},
	clearUploaded(drop, text) {
		let span = drop.children[0];
		span.style.color = "";
		span.innerHTML = text;
		drop.style.borderStyle = "dotted";
		drop.style.backgroundColor = "";
	},
	getMatrixFromPage2() {
		const tx = document.getElementById("modelload-form-translation-x").value || 0;
		const ty = document.getElementById("modelload-form-translation-y").value || 0;
		const tz = document.getElementById("modelload-form-translation-z").value || 0;
		const t = Matrix.translation(new Vector(tx, ty, tz));

		const rax = document.getElementById("modelload-form-rotation-x").value || 0;
		const rx = Matrix.rotation(new Vector(1, 0, 0), rax);
		const ray = document.getElementById("modelload-form-rotation-y").value || 0;
		const ry = Matrix.rotation(new Vector(0, 1, 0), ray);
		const raz = document.getElementById("modelload-form-rotation-z").value || 0;
		const rz = Matrix.rotation(new Vector(0, 0, 1), raz);
		const r = rx.mul(ry).mul(rz);

		const sx = document.getElementById("modelload-form-scale-x").value || 1;
		const sy = document.getElementById("modelload-form-scale-y").value || 1;
		const sz = document.getElementById("modelload-form-scale-z").value || 1;
		const s = Matrix.scaling(new Vector(sx, sy, sz));

		return s.mul(r).mul(t);
	},
	resetInputFields() {
		document.getElementById("modelload-form-translation-x").value = "";
		document.getElementById("modelload-form-translation-y").value = "";
		document.getElementById("modelload-form-translation-z").value = "";

		document.getElementById("modelload-form-rotation-x").value = "";
		document.getElementById("modelload-form-rotation-y").value = "";
		document.getElementById("modelload-form-rotation-z").value = "";

		document.getElementById("modelload-form-scale-x").value = "";
		document.getElementById("modelload-form-scale-y").value = "";
		document.getElementById("modelload-form-scale-z").value = "";
	},
	onReady(cb) {
		this.ready = cb;
	},
	cancel() {
		this.close();
		this.ready(false);
	},
	close() {
		this.nextBtn.disabled = true;
		this.page2.className = "disabled";
		UserInteraction.Events.Key.enable();
		this.nextBtn.innerText = "Next >";
		this.resetInputFields();
		this.container.className = "disabled";
	}
}

function onDragOver(e, el) {
	e.preventDefault();
	if (el) el.style.borderStyle = 'solid';
	return false;
}

function onDragLeave(e, el) {
	e.preventDefault();
	if (el) el.style.borderStyle = 'dotted';
	return false;
}

function testNumberInput(e) {
	switch (e.key) {
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case ".":
		case ",":
		case "-":
		case "Delete":
		case "Backspace":
		case "ArrowRight":
		case "ArrowLeft":
		case "Tab":
			// allow
			break;
		case "a":
		case "c":
		case "x":
			// you can paste non-sense -> not allowed
			// but allow copy
			if (e.ctrlKey || e.metaKey) break;
		// fall-through
		default:
			e.preventDefault();
	}
}