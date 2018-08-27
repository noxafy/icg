/**
 * Author: noxafy
 * Created: 26.08.18
 *
 * Got material table from http://devernay.free.fr/cours/opengl/materials.html
 * (another view: http://www.it.hiof.no/~borres/j3d/explain/light/p-materials.html)
 *
 * Extracted with following function:
 <pre>function tableToJson(table) {
	var data = {};
	// first row needs to be headers
	var headers = [];
	for (var i=0; i<table.rows[0].cells.length; i++) {
		headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
	}
	// go through cells
	for (var i=1; i<table.rows.length; i++) {
		var tableRow = table.rows[i];
		var rowData = {};
		rowData[headers[1]] =  [tableRow.cells[1].innerHTML * 1, tableRow.cells[2].innerHTML * 1, tableRow.cells[3].innerHTML * 1];
		rowData[headers[2]] =  [tableRow.cells[4].innerHTML * 1, tableRow.cells[5].innerHTML * 1, tableRow.cells[6].innerHTML * 1];
		rowData[headers[3]] =  [tableRow.cells[7].innerHTML * 1, tableRow.cells[8].innerHTML * 1, tableRow.cells[9].innerHTML * 1];
		rowData[headers[4]] =  tableRow.cells[10].innerHTML * 128;
		rowData[headers[0]] =  "'" + tableRow.cells[0].innerHTML + "'";
		data[tableRow.cells[0].innerHTML.toUpperCase().replace(" ", "_")] = rowData;
	}
	return data;
}</pre>
 */
Materials = {
	EMERALD: new Material(new Vector(0.0215, 0.1745, 0.0215), new Vector(0.07568, 0.61424, 0.07568), new Vector(0.633, 0.727811, 0.633), 76.8, 'emerald'),
	JADE: new Material(new Vector(0.135, 0.2225, 0.1575), new Vector(0.54, 0.89, 0.63), new Vector(0.316228, 0.316228, 0.316228), 12.8, 'jade'),
	OBSIDIAN: new Material(new Vector(0.05375, 0.05, 0.06625), new Vector(0.18275, 0.17, 0.22525), new Vector(0.332741, 0.328634, 0.346435), 38.4, 'obsidian'),
	PEARL: new Material(new Vector(0.25, 0.20725, 0.20725), new Vector(1, 0.829, 0.829), new Vector(0.296648, 0.296648, 0.296648), 11.264, 'pearl'),
	RUBY: new Material(new Vector(0.1745, 0.01175, 0.01175), new Vector(0.61424, 0.04136, 0.04136), new Vector(0.727811, 0.626959, 0.626959), 76.8, 'ruby'),
	TURQUOISE: new Material(new Vector(0.1, 0.18725, 0.1745), new Vector(0.396, 0.74151, 0.69102), new Vector(0.297254, 0.30829, 0.306678), 12.8, 'turquoise'),
	BRASS: new Material(new Vector(0.329412, 0.223529, 0.027451), new Vector(0.780392, 0.568627, 0.113725), new Vector(0.992157, 0.941176, 0.807843), 27.89743616, 'brass'),
	BRONZE: new Material(new Vector(0.2125, 0.1275, 0.054), new Vector(0.714, 0.4284, 0.18144), new Vector(0.393548, 0.271906, 0.166721), 25.6, 'bronze'),
	CHROME: new Material(new Vector(0.25, 0.25, 0.25), new Vector(0.4, 0.4, 0.4), new Vector(0.774597, 0.774597, 0.774597), 76.8, 'chrome'),
	COPPER: new Material(new Vector(0.19125, 0.0735, 0.0225), new Vector(0.7038, 0.27048, 0.0828), new Vector(0.256777, 0.137622, 0.086014), 12.8, 'copper'),
	GOLD: new Material(new Vector(0.24725, 0.1995, 0.0745), new Vector(0.75164, 0.60648, 0.22648), new Vector(0.628281, 0.555802, 0.366065), 51.2, 'gold'),
	SILVER: new Material(new Vector(0.19225, 0.19225, 0.19225), new Vector(0.50754, 0.50754, 0.50754), new Vector(0.508273, 0.508273, 0.508273), 51.2, 'silver'),
	BLACK_PLASTIC: new Material(new Vector(0, 0, 0), new Vector(0.01, 0.01, 0.01), new Vector(0.5, 0.5, 0.5), 32, 'black plastic'),
	CYAN_PLASTIC: new Material(new Vector(0, 0.1, 0.06), new Vector(0, 0.50980392, 0.50980392), new Vector(0.50196078, 0.50196078, 0.50196078), 32, 'cyan plastic'),
	GREEN_PLASTIC: new Material(new Vector(0, 0, 0), new Vector(0.1, 0.35, 0.1), new Vector(0.45, 0.55, 0.45), 32, 'green plastic'),
	RED_PLASTIC: new Material(new Vector(0, 0, 0), new Vector(0.5, 0, 0), new Vector(0.7, 0.6, 0.6), 32, 'red plastic'),
	WHITE_PLASTIC: new Material(new Vector(0, 0, 0), new Vector(0.55, 0.55, 0.55), new Vector(0.7, 0.7, 0.7), 32, 'white plastic'),
	YELLOW_PLASTIC: new Material(new Vector(0, 0, 0), new Vector(0.5, 0.5, 0), new Vector(0.6, 0.6, 0.5), 32, 'yellow plastic'),
	BLACK_RUBBER: new Material(new Vector(0.02, 0.02, 0.02), new Vector(0.01, 0.01, 0.01), new Vector(0.4, 0.4, 0.4), 10, 'black rubber'),
	CYAN_RUBBER: new Material(new Vector(0, 0.05, 0.05), new Vector(0.4, 0.5, 0.5), new Vector(0.04, 0.7, 0.7), 10, 'cyan rubber'),
	GREEN_RUBBER: new Material(new Vector(0, 0.05, 0), new Vector(0.4, 0.5, 0.4), new Vector(0.04, 0.7, 0.04), 10, 'green rubber'),
	RED_RUBBER: new Material(new Vector(0.05, 0, 0), new Vector(0.5, 0.4, 0.4), new Vector(0.7, 0.04, 0.04), 10, 'red rubber'),
	WHITE_RUBBER: new Material(new Vector(0.05, 0.05, 0.05), new Vector(0.5, 0.5, 0.5), new Vector(0.7, 0.7, 0.7), 10, 'white rubber'),
	YELLOW_RUBBER: new Material(new Vector(0.05, 0.05, 0), new Vector(0.5, 0.5, 0.4), new Vector(0.7, 0.7, 0.04), 10, 'yellow rubber'),
	BLANK: new Material(new Vector(0, 0, 0), new Vector(0, 0, 0), new Vector(0, 0, 0), 1, 'blank')
}