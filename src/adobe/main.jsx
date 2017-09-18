
cTID = function(s) { return cTID[s] || (cTID[s] = app.charIDToTypeID(s)); };
sTID = function(s) { return app.stringIDToTypeID(s); };
idTS = function(id) { return app.typeIDToStringID (id); };

var originalPrefs = app.preferences;
var saveState;

function setPrefs() {
	originalPrefs = app.preferences;
	app.preferences.typeUnits = TypeUnits.PIXELS;
	app.preferences.rulerUnits = Units.PIXELS;
	// app.preferences.smartQuotes = false;
}

function resetPrefs() {
	app.preferences = originalPrefs;
}

function undo() {
	executeAction(cTID('undo'), undefined, DialogModes.NO);
}

function saveState() {
	savedState = app.activeDocument.activeHistoryState;
}

function resetState() {
	app.activeDocument.activeHistoryState = savedState;
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

// Paul Riggott, you rock!
// https://forums.adobe.com/thread/1161110
function getSelectedLayersIdx() {
	var selectedLayers = new Array;
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
	var desc = executeActionGet(ref);
	if (desc.hasKey(sTID('targetLayers'))) {
		desc = desc.getList(sTID('targetLayers'));
		var c = desc.count
		var selectedLayers = new Array();
		for (var i=0;i<c;i++) {
			try {
				activeDocument.backgroundLayer;
				selectedLayers.push(getLayerIDfromIDX(desc.getReference(i).getIndex()));
			}
			catch(e) {
				selectedLayers.push(getLayerIDfromIDX(desc.getReference(i).getIndex() + 1));
			}
		}
	}
	else {
		var ref = new ActionReference();
		ref.putProperty(cTID('Prpr'), cTID('ItmI'));
		ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
		try {
			activeDocument.backgroundLayer;
			selectedLayers.push(getLayerIDfromIDX( executeActionGet(ref).getInteger(cTID('ItmI')) - 1));
		}
		catch(e) {
			selectedLayers.push(getLayerIDfromIDX(executeActionGet(ref).getInteger(cTID('ItmI'))));
		}
		var vis = app.activeDocument.activeLayer.visible;
		if (vis == true) app.activeDocument.activeLayer.visible = false;
		var desc9 = new ActionDescriptor();
		var list9 = new ActionList();
		var ref9 = new ActionReference();
		ref9.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
		list9.putReference(ref9);
		desc9.putList(cTID('null'), list9);
		executeAction(cTID('Shw '), desc9, DialogModes.NO);
		if (app.activeDocument.activeLayer.visible == false) selectedLayers.shift();
		app.activeDocument.activeLayer.visible = vis;
	}
	return selectedLayers;
};

function getActiveLayerID(){
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	var desc = executeActionGet(ref);
	return desc.getInteger(sTID('layerID'));
};

function getLayerIDfromIDX(idx) {
	var ref = new ActionReference();
	ref.putIndex(cTID('Lyr '), idx);
	return executeActionGet(ref).getInteger(sTID('layerID'));
};

function selectLayerById(ID, add) {
	add = (add == undefined)? add = false : add;
	var ref = new ActionReference();
	ref.putIdentifier(cTID('Lyr '), ID);
	var desc = new ActionDescriptor();
	desc.putReference(cTID('null'), ref);
	if (add) {
		desc.putEnumerated(sTID('selectionModifier'), sTID('selectionModifierType'), sTID('addToSelection'));
	}
	desc.putBoolean(cTID('MkVs'), false);
	executeAction(cTID('slct'), desc, DialogModes.NO);
};

function reselectLayers(idx) {
	for (var i = 0; i < idx.length; i++) {
		selectLayerById(idx[i], true);
	}
}

function tryExec(functionName, obj) {
	if (app.documents.length === 0) return 'no_document';
	setPrefs();
	saveState();
	try {
		var res;
		if(obj != undefined) {
			res = eval(functionName + '('+ JSON.stringify(obj) +')');
		}
		else {
			res = eval(functionName + '()');
		}
		resetPrefs;
		return res;
	}
	catch (e) {
		resetPrefs;
		resetState();
		if (e instanceof Object && e.reselect != undefined){
			reselectLayers(e.reselect);
			return e.message;
		}
		else return e;
	}
}

// WTF, Adobe, seriously. We shouldn't even need this.
function getTransformFactor() {
	try {
		var ref = new ActionReference();
		ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
		var desc = executeActionGet(ref).getObjectValue(sTID('textKey'));
		var textSize =  desc.getList(sTID('textStyleRange')).getObjectValue(0).getObjectValue(sTID('textStyle')).getDouble(sTID('size'));
		if (desc.hasKey(sTID('transform'))) {
			var mFactor = desc.getObjectValue(sTID('transform')).getUnitDoubleValue(sTID('yy'));
			return mFactor;
		}
		return 1;
	}
	catch (e) {
		throw 'Error during the retrieval of the transform factor.';
	}
}

function getSingleRectangleSelectionDimensions() {
	try {
		var selections = app.activeDocument.selection;
		try {
			selections.makeWorkPath();
		}
		catch (e) {
			return 'no_selection';
		}
		var wPath = app.activeDocument.pathItems['Work Path'];
		var dimensions = {};
		// limit to a single path only
		if (wPath.subPathItems.length > 1) {
			throw 'multiple_paths';
		}
		// Loop through all paths
		for (var i = 0; i < wPath.subPathItems.length; i++) {
			var bounds = [];
			// we need rectangles only
			if (wPath.subPathItems[i].pathPoints.length != 4) {
				throw 'too_many_anchors';
			}
			// Loop through all path points and get their anchor coordinates
			for (var j = 0; j < wPath.subPathItems[i].pathPoints.length; j++) {
				bounds.push(wPath.subPathItems[i].pathPoints[j].anchor);
			}
			// calculate the corresponding dimensions
			dimensions = getDimensionsFromCoords(bounds);
		}
		undo();
		return JSON.stringify(dimensions);
	}
	catch (e) {
		throw e;
	}
}

function getAdjustedSize(size) {
	// var t = getTransformFactor();
	// var ar = activeDocument.resolution;
	// return size / (getTransformFactor() * activeDocument.resolution / 72);
	return size / (activeDocument.resolution / 72);
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

function adjustTextLayerHeight(textLayer) {
	var dimensions = getRealTextLayerDimensions(textLayer);
	textLayer.textItem.height = dimensions.height + 20; // add a little to keep some leeway
}

function autoResizeActiveLayer(style) {
	var layer = app.activeDocument.activeLayer;
	var textItem = layer.textItem;
	if (typeof style.coords != 'undefined' && typeof style.dimensions == 'undefined') {
		style.dimensions = getDimensionsFromCoords(style.coords);
	}
	if (typeof style.dimensions != 'undefined') {
		textItem.position = style.dimensions.p;
		textItem.height = getAdjustedSize(style.dimensions.h);
		textItem.width = getAdjustedSize(style.dimensions.w);
	}
	else {
		textItem.width = getBasicTextboxWidth(textItem.size);
		textItem.height = activeDocument.height;
		adjustTextLayerHeight(layer);
	}
}

function applyStyleActiveLayer(style) {
	var textItem = app.activeDocument.activeLayer.textItem;
	if (!!!style.useCurrent) {
		textItem.kind = TextType.PARAGRAPHTEXT;
		textItem.font = style.fontName;
		textItem.size = getAdjustedSize(style.size) + 'px';
		if (style.leading === 0) {
			textItem.useAutoLeading = true;
		}
		else {
			textItem.useAutoLeading = false;
			textItem.leading = style.leading;
		}
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
		if (!!!style.color) {
			textItem.color = app.foregroundColor;
		}
	}
	if (!!!style.noResize) {
		autoResizeActiveLayer(style);
	}
}

function adjustFontSizeActiveLayer(modifier) {
	var textItem = app.activeDocument.activeLayer.textItem;
	var fontSize = textItem.size;
	textItem.size = getAdjustedSize(parseInt(fontSize) + parseInt(modifier)) + 'px';
}

function roundFontSizeActiveLayer() {
	var textItem = app.activeDocument.activeLayer.textItem;
	textItem.size = getAdjustedSize(Math.round(parseFloat(textItem.size))) + 'px';
}

function toggleHyphenationActiveLayer() {
	var textItem = app.activeDocument.activeLayer.textItem;
	textItem.hyphenation = !textItem.hyphenation;
}

function toggleFauxBoldActiveLayer() {
	var textItem = app.activeDocument.activeLayer.textItem;
	textItem.fauxBold = !textItem.fauxBold;
}

function toggleFauxItalicActiveLayer() {
	var textItem = app.activeDocument.activeLayer.textItem;
	textItem.fauxItalic = !textItem.fauxItalic;
}

function createTextLayer(text, position) {
	var p = (!!position)? position : [20, 20];
	var textLayer = app.activeDocument.artLayers.add();
	textLayer.kind = LayerKind.TEXT;
	var textItem = textLayer.textItem;
	textItem.contents = text;
	textItem.position = p;
	textLayer = null;
	textItem = null;
}

function setStyle(style) {
	app.activeDocument.suspendHistory('Set style', '\
		createTextLayer(""); \
		applyStyleActiveLayer('+ JSON.stringify(style) + '); \
		app.activeDocument.activeLayer.remove(); \
	');
	return 'done';
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
	try {
		var style = typesetObj.style;
		var position = (!!typesetObj.position)? typesetObj.position : null;
		app.activeDocument.suspendHistory('Create text layer', 'createTextLayer('+ JSON.stringify(typesetObj.text) + ', '+ JSON.stringify(position) +');');
		app.activeDocument.suspendHistory('Apply style', 'applyStyleActiveLayer('+ JSON.stringify(style) + ');');
		if (typesetObj.useLayerGroups && style.layerGroup) {
			app.activeDocument.suspendHistory('Sort layer', 'sortLayerInLayerGroup("'+ style.layerGroup + '");');
		}
		return 'done';
	}
	catch (e) {
		throw e;
	}
}

function typesetFiles(fileList, scriptPath, targetFolder, styleSet, options) {
	try {
		if (!!!fileList.length) throw 'Need files';
		if (!!!scriptPath) throw 'Need translation script';
		if (!!!targetFolder) throw 'Need target folder';
		if (!!!styleSet) throw 'Need style set';
		var scriptFile = new File(scriptPath);
		var fileOK = scriptFile.open('r');
		if (fileOK) {
			var text = scriptFile.read();
			setPrefs();
			for (var i = 0; i < fileList.length; i++) {
				var pageNumber = tbHelper.getFilePageNumber(fileList[i].toString());
				if (!!!pageNumber) {
					if (!options.noPrompt) alert('No page number found in filename ' + fileList[i].toString());
				}
				else {
					var psdFile;
					try {
						// try to open the file anyway so that it can be saved afterwards in the target folder
						psdFile = new File(fileList[i]);
						open(psdFile);
					}
					catch (e) {
						if (!options.noPrompt) throw 'Could not open '+ fileList[i];
						continue;
					}
					var pageScript = tbHelper.loadPage(text, pageNumber);
					if (!pageScript) {
						if (!options.noPrompt) alert(fileList[i].toString() + ' has no corresponding page in the translation script');
					}
					else {
						var bubbles = pageScript[2];
						if (tbHelper.pageContainsText(bubbles)) {
							// page's global style, forced to defaults_style if none is set.
							var pageStyle = tbHelper.getTextStyles(pageScript[1], 'default_style')[0];
							var previousStyle = pageStyle;
							var lines = bubbles.split('\n');
							var n = 0;
							for (var j = 0; j < lines.length; j++) {
								var line = lines[j];
								if (tbHelper.skipThisLine(line, options.panelSeparator) === false) {
									// line style will be the last thing that's between single brackets
									// but if we're dealing with a double-bubble part, fallback on previous style if no style is defined for this bubble
									var lineStyle = (tbHelper.isMultiBubblePart(line))? tbHelper.getTextStyles(line, previousStyle).pop() : tbHelper.getTextStyles(line, pageStyle).pop();
									var cleanedText = tbHelper.cleanLine(line);
									if (options.skipSfxs && lineStyle == 'sfx') continue;
									else {
										n++;
										var style;
										try {
											style = tbHelper.getStyleFromStyleSet(styleSet, lineStyle);
										}
										catch (e) {
											try {
												style = tbHelper.getStyleFromStyleSet(styleSet, 'default_style');
											}
											catch (e) {
												throw 'Style '+ lineStyle +'not found and default_style not found either... (page '+ pageNumber +')';
											}
										}
										var typesetObj = {
											text: cleanedText,
											style: style,
											position: [20*n, 20*n],
											useLayerGroups: options.useLayerGroups
										};
										typesetEX(typesetObj);
									}
									previousStyle = lineStyle;
								}
							}
						}
					}
					var saveFile = new File(editTargetFolderPath.text + '/' + app.activeDocument.name);
					app.activeDocument.saveAs(saveFile);
					app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
					psdFile = null;
					saveFile = null;
				}
				if (!options.noPrompt && ((i+1) % options.promptEvery == 0)) {
					if (confirm(i+1 + '/' + fileList.length + 'pages done. Continue?', false) == false) break;
				}
			}
			resetPrefs();
			scriptFile.close();
			return 'done';
		}
		else {
			throw 'Failed to open translation script';
		}
	}
	catch (e) {
		resetPrefs();
		throw (e);
	}
}

function actionSelectedLayers(action, historyName, obj) {
	try {
		var idx = getSelectedLayersIdx();
	}
	catch (e) {
		throw 'no_selected_layers';
	}
	try {
		for (var i = 0; i < idx.length; i++) {
			selectLayerById(idx[i]);
			if(app.activeDocument.activeLayer.kind !== LayerKind.TEXT) throw 'not_text_layer';
			var val = (obj != undefined)? obj : {};
			app.activeDocument.suspendHistory(historyName, action + '('+ JSON.stringify(val) +');');
		}
		reselectLayers(idx);
		return 'done';
	}
	catch (e) {
		throw {message: e, reselect: idx};
	}
}

function applyStyleSelectedLayers(style) {
	return actionSelectedLayers('applyStyleActiveLayer', 'Apply style', style);
}

function autoResizeSelectedLayers() {
	return actionSelectedLayers('autoResizeActiveLayer', 'Auto resize');
}

function adjustFontSizeSelectedLayers(modifier) {
	return actionSelectedLayers('adjustFontSizeActiveLayer', 'Adjust font size', modifier);
}

function roundFontSizeSelectedLayers(modifier) {
	return actionSelectedLayers('roundFontSizeActiveLayer', 'Round font size', modifier);
}

function toggleHyphenationSelectedLayers() {
	return actionSelectedLayers('toggleHyphenationActiveLayer', 'Toggle hyphenation');
}

function toggleFauxBoldSelectedLayers() {
	return actionSelectedLayers('toggleFauxBoldActiveLayer', 'Toggle faux bold');
}

function toggleFauxItalicSelectedLayers() {
	return actionSelectedLayers('toggleFauxItalicActiveLayer', 'Toggle faux italic');
}
