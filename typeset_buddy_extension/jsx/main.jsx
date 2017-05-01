// polyfills and helper functions

/* JSON2.JS from https://github.com/douglascrockford/JSON-js */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?i+"":"null";case"boolean":case"null":return i+"";case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {
		var k;
		if (this == null) throw new TypeError('"this" is null or not defined');
		var o = Object(this);
		var len = o.length >>> 0;
		if (len === 0) return -1;
		var n = +fromIndex || 0;
		if (Math.abs(n) === Infinity) n = 0;
		if (n >= len) return -1;
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
		while (k < len) {
			if (k in o && o[k] === searchElement) return k;
			k++;
		}
		return -1;
	};
}

if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}

function getAppFonts() {
	var fontNames = [];
	for (var i=0; i < app.fonts.length; i++) {
		fontNames.push({
			value: app.fonts[i].postScriptName,
			label: app.fonts[i].name,
		});
	};
	return JSON.stringify(fontNames);
}

// WTF, Adobe, seriously. We shouldn't even need this.
function getTransformFactor() {
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
	var desc = executeActionGet(ref).getObjectValue(stringIDToTypeID('textKey'));
	var textSize =  desc.getList(stringIDToTypeID('textStyleRange')).getObjectValue(0).getObjectValue(stringIDToTypeID('textStyle')).getDouble(stringIDToTypeID('size'));
	if (desc.hasKey(stringIDToTypeID('transform'))) {
		var mFactor = desc.getObjectValue(stringIDToTypeID('transform')).getUnitDoubleValue(stringIDToTypeID('yy'));
		return mFactor;
	}
	return 1;
}

function getAdjustedSize(size) {
	return size / (getTransformFactor() * activeDocument.resolution / 72);
}

function getBasicTextboxWidth(fontSize) {
	return Math.round(getAdjustedSize(fontSize) * 7);
}

function getDimensionsFromCoords(coords){
	return {
		p: coords[0],
		w: coords[1][0] - coords[0][0],
		h: coords[2][1] - coords[0][1],
	};
}

function getLayerDimensions(layer) {
	return {
		width: getAdjustedSize(layer.bounds[2] - layer.bounds[0]),
		height: getAdjustedSize(layer.bounds[3] - layer.bounds[1])
	};
}

function getRealTextLayerDimensions(textLayer) {
	var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);
	textLayerCopy.textItem.height = activeDocument.height;
	textLayerCopy.rasterize(RasterizeType.TEXTCONTENTS);
	var dimensions = getLayerDimensions(textLayerCopy);
	textLayerCopy.remove();
	return dimensions;
}

function adjustTextLayer(textLayer) {
	var dimensions = getRealTextLayerDimensions(textLayer);
	textLayer.textItem.height = dimensions.height;
}

function applyStyleToActiveLayer(style) {
	var layer = app.activeDocument.activeLayer;
	if(layer.kind !== LayerKind.TEXT) {
		throw 'Not a text layer: ' + layer.name;
	}
	var textItem = layer.textItem;
	textItem.kind = TextType.PARAGRAPHTEXT;
	textItem.width = getBasicTextboxWidth(style.size);
	textItem.height = activeDocument.height;
	textItem.font = style.fontName;
	textItem.size = getAdjustedSize(style.size) + 'px';
	textItem.leading = style.leading;
	textItem.tracking = style.tracking;
	textItem.verticalScale = style.vScale;
	textItem.horizontalScale = style.hScale;
	textItem.fauxBold = style.fauxBold;
	textItem.fauxItalic = style.fauxItalic;
	textItem.capitalization = TextCase[style.capitalization];
	textItem.justification = Justification[style.justification];
	textItem.antiAliasMethod = AntiAlias[style.antialias];
	textItem.autoKerning = AutoKernType[style.kerning];
	textItem.hyphenation = style.hyphenate;
	if (typeof style.coords != 'undefined' && typeof style.dimensions == 'undefined') {
		style.dimensions = getDimensionsFromCoords(style.coords);
	}
	if (typeof style.dimensions != 'undefined') {
		textItem.position = dimensions.p;
		textItem.height = dimensions.h;
		textItem.width = dimensions.w;
	}
	else {
		adjustTextLayer(layer);
	}
}

function createTextLayer(text) {
	var textLayer = app.activeDocument.artLayers.add();
	textLayer.kind = LayerKind.TEXT;
	var textItem = textLayer.textItem;
	textItem.contents = text;
	textItem.position = [20, 20];
	textLayer = null;
	textItem = null;
}

function sortLayerInLayerGroup(layerGroup) {
	var layerGroupRef;
	var layer = app.activeDocument.activeLayer;
	try {
		layerGroupRef = app.activeDocument.layerSets.getByName(layerGroup);
	}
	catch (e) {
		layerGroupRef = app.activeDocument.layerSets.add();
		layerGroupRef.name = layerGroup;
	}
	layer.move(layerGroupRef, ElementPlacement.INSIDE);
	layerGroupRef = null;
}

function typesetEX(typesetObj) {
	var originalTypeUnits = app.preferences.typeUnits;
	app.preferences.typeUnits = TypeUnits.PIXELS;
	var originalRulerUnits = app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;
	try {
		if (app.documents.length == 0) return 'No document';
		var style = typesetObj.style;
		app.activeDocument.suspendHistory('Create text layer', 'createTextLayer('+ JSON.stringify(typesetObj.text) + ');');
		app.activeDocument.suspendHistory('Apply style', 'applyStyleToActiveLayer('+ JSON.stringify(style) + ');');
		if (style.useLayerGroups && style.layerGroup) {
			app.activeDocument.suspendHistory('Sort layer', 'sortLayerInLayerGroup("'+ style.layerGroup + '");');
		}
		app.preferences.typeUnits = originalTypeUnits;
		app.preferences.rulerUnits = originalRulerUnits;
		return 'done';
	}
	catch (e) {
		app.preferences.typeUnits = originalTypeUnits;
		app.preferences.rulerUnits = originalRulerUnits;
		return JSON.stringify(e);
	}
}


function getSelectedLayers() {
	var idGrp = stringIDToTypeID('groupLayersEvent');
	var descGrp = new ActionDescriptor();
	var refGrp = new ActionReference();
	refGrp.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
	descGrp.putReference(charIDToTypeID('null'), refGrp);
	try {
		executeAction(idGrp, descGrp, DialogModes.NO);
	}
	catch (e) {
		throw 'No selected layers';
	}
	var resultLayers = new Array();
	for (var ix = 0; ix < app.activeDocument.activeLayer.layers.length; ix++){
		resultLayers.push(app.activeDocument.activeLayer.layers[ix]);
	}
	var id8 = charIDToTypeID('slct');
	var desc5 = new ActionDescriptor();
	var id9 = charIDToTypeID('null');
	var ref2 = new ActionReference();
	var id10 = charIDToTypeID('HstS');
	var id11 = charIDToTypeID('Ordn');
	var id12 = charIDToTypeID('Prvs');
	ref2.putEnumerated(id10, id11, id12);
	desc5.putReference(id9, ref2);
	executeAction(id8, desc5, DialogModes.NO);
	return resultLayers;
}

function applyStyleToSelectedLayers(style) {
	var originalTypeUnits = app.preferences.typeUnits;
	app.preferences.typeUnits = TypeUnits.PIXELS;
	var originalRulerUnits = app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;
	try {
		var layers = getSelectedLayers();
		for (var i = 0; i < layers.length; i++) {
			app.activeDocument.activeLayer = layers[i];
			app.activeDocument.suspendHistory('Apply style', 'applyStyleToActiveLayer('+ JSON.stringify(style) + ');');
		}
		app.preferences.typeUnits = originalTypeUnits;
		app.preferences.rulerUnits = originalRulerUnits;
		return 'done';
	}
	catch(e){
		app.preferences.typeUnits = originalTypeUnits;
		app.preferences.rulerUnits = originalRulerUnits;
		return e;
	}
}

