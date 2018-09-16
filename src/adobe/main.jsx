
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };
idTS = function(id) { return app.typeIDToStringID(id); };
idTC = function(id) { return app.typeIDToCharID(id); };

var originalRulerUnits;
var originalTypeUnits;
var saveState;

function setPrefs() {
	originalRulerUnits = app.preferences.rulerUnits;
	originalTypeUnits = app.preferences.typeUnits;
	app.preferences.rulerUnits = Units.POINTS;
	app.preferences.typeUnits = TypeUnits.PIXELS;
	// app.preferences.smartQuotes = false;
}

function resetPrefs() {
	app.preferences.rulerUnits = originalRulerUnits;
	app.preferences.typeUnits = originalTypeUnits;
}

function undo() {
	executeAction(cTID('undo'), undefined, DialogModes.NO);
}

function saveState() {
	savedState = activeDocument.activeHistoryState;
}

function resetState() {
	activeDocument.activeHistoryState = savedState;
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
		var c = desc.count;
		for (var i = 0; i < c; i++) {
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
			selectedLayers.push(getLayerIDfromIDX(executeActionGet(ref).getInteger(cTID('ItmI')) - 1));
		}
		catch(e) {
			selectedLayers.push(getLayerIDfromIDX(executeActionGet(ref).getInteger(cTID('ItmI'))));
		}
		var vis = activeDocument.activeLayer.visible;
		if (vis == true) activeDocument.activeLayer.visible = false;
		var desc9 = new ActionDescriptor();
		var list9 = new ActionList();
		var ref9 = new ActionReference();
		ref9.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
		list9.putReference(ref9);
		desc9.putList(cTID('null'), list9);
		executeAction(cTID('Shw '), desc9, DialogModes.NO);
		if (activeDocument.activeLayer.visible == false) selectedLayers.shift();
		activeDocument.activeLayer.visible = vis;
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

function tryExec(functionName) {
	if (app.documents.length === 0) return 'no_document';
	setPrefs();
	saveState();
	try {
		var res;
		var evalString = arguments[0] + '(';
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					if (i > 1) evalString += ',';
					evalString += JSON.stringify(arguments[i]);
				}
			}
		}
		evalString += ')';
		res = eval(evalString);
		resetPrefs();
		return res;
	}
	catch (e) {
		resetPrefs();
		resetState();
		if (e instanceof Object && e.reselect != undefined){
			reselectLayers(e.reselect);
			return e.message;
		}
		else return e;
	}
}

function getSingleRectangleSelectionCoordinates() {
	try {
		var selections = activeDocument.selection;
		try {
			selections.makeWorkPath();
		}
		catch (e) {
			return 'no_selection';
		}
		var wPath = activeDocument.pathItems['Work Path'];
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
			dimensions = getGeometryFromCoords(bounds);
		}
		undo();
		return JSON.stringify(dimensions);
	}
	catch (e) {
		throw e;
	}
}

function getAdjustedSize(size) {
	return parseInt(size) / (activeDocument.resolution / 72);
}

function getBasicTextboxDimension(fontSize, vertical) {
	if (!!vertical) {
		return Math.round(getAdjustedSize(fontSize) * 9);
	}
	return Math.round(getAdjustedSize(fontSize) * 7);
}

function getGeometryFromCoords(coords){
	return {
		x: (100 * coords[0][0] / parseInt(activeDocument.width)),
		y: (100 * coords[0][1] / parseInt(activeDocument.height)),
		w: coords[1][0] - coords[0][0],
		h: coords[2][1] - coords[0][1]
	};
}

function getActiveLayerDimension() {
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	var descBounds = executeActionGet(ref).getObjectValue(sTID('bounds'));
	// width and height need to be adjusted... yet another weird thing
	return {
		x: descBounds.getUnitDoubleValue(sTID('left')),
		y: descBounds.getUnitDoubleValue(sTID('top')),
		width: getAdjustedSize(descBounds.getUnitDoubleValue(sTID('width'))),
		height: getAdjustedSize(descBounds.getUnitDoubleValue(sTID('height')))
	};
}

function adjustTextLayerDimensions(textLayer) {
	var dimensions = getActiveLayerDimension();
	textLayer.textItem.width = dimensions.width + 7; // add a little to keep some leeway
	textLayer.textItem.height = dimensions.height + 7; // add a little to keep some leeway
}

function isActiveLayerVertical() {
	var ref = new ActionReference();
	ref.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	var descriptor = executeActionGet(ref);
	var value = idTC(descriptor.getObjectValue(sTID('textKey')).getEnumerationValue(sTID('orientation')));
	return (value == 'Vrtc');
}

function resizeActiveLayer() {
	app.preferences.rulerUnits = Units.PIXELS;
	var layer = activeDocument.activeLayer;
	var textItem = layer.textItem;
	if (isActiveLayerVertical()) {
		textItem.width = activeDocument.width;
		textItem.height = getBasicTextboxDimension(textItem.size, true);
	}
	else {
		textItem.width = getBasicTextboxDimension(textItem.size);
		textItem.height = activeDocument.height;
	}
	adjustTextLayerDimensions(layer);
}

function applyStyleActiveLayer(style, autoResize) {
	// Text style
	var actionTextStyle = new ActionDescriptor();
	var actionTextStyleRef = new ActionReference();
	actionTextStyleRef.putProperty(cTID('Prpr'), cTID('TxtS'));
	actionTextStyleRef.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	actionTextStyle.putReference(cTID('null'), actionTextStyleRef);
	var actionTextStyleParams = prepareTextStyleParams(style);
	actionTextStyle.putObject(cTID('T   '), cTID('TxtS'), actionTextStyleParams);
	executeAction(cTID('setd'), actionTextStyle, DialogModes.NO);
	// Text orientation
	var actionTextOrientation = new ActionDescriptor();
	var actionTextOrientationRef = new ActionReference();
	actionTextOrientationRef.putProperty(cTID('Prpr'), cTID('Ornt'));
	actionTextOrientationRef.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	actionTextOrientation.putReference(cTID('null'), actionTextOrientationRef);
	actionTextOrientation.putEnumerated(cTID('T   '), cTID('Ornt'), convertStylePropValue('textOrientation', style.textOrientation));
	executeAction(cTID('setd'), actionTextOrientation, DialogModes.NO);
	// Paragraph style
	var actionParagraph = new ActionDescriptor();
	var actionParagraphRef = new ActionReference();
	actionParagraphRef.putProperty(cTID('Prpr'), sTID('paragraphStyle'));
	actionParagraphRef.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	actionParagraph.putReference(cTID('null'), actionParagraphRef);
	var actionParagraphParams = prepareParagraphStyleParams(style);
	actionParagraph.putObject(cTID('T   '), sTID('paragraphStyle'), actionParagraphParams);
	executeAction(cTID('setd'), actionParagraph, DialogModes.NO);
	// Antialias
	var actionAliasing = new ActionDescriptor();
	var actionAliasingRef = new ActionReference();
	actionAliasingRef.putProperty(cTID('Prpr'), cTID('AntA'));
	actionAliasingRef.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	actionAliasing.putReference(cTID('null'), actionAliasingRef);
	actionAliasing.putEnumerated(cTID('T   '), cTID('Annt'), convertStylePropValue('antialias', style.antialias));
	executeAction(cTID('setd'), actionAliasing, DialogModes.NO);
	if (!!autoResize || !!style.autoResize) resizeActiveLayer(style);
}

function adjustFontSizeActiveLayer(modifier) {
	var textItem = activeDocument.activeLayer.textItem;
	var fontSize = textItem.size;
	textItem.size = getAdjustedSize(parseInt(fontSize) + parseInt(modifier)) + 'px';
}

function roundFontSizeActiveLayer() {
	var textItem = activeDocument.activeLayer.textItem;
	textItem.size = getAdjustedSize(Math.round(parseFloat(textItem.size))) + 'px';
}

function toggleHyphenationActiveLayer() {
	var textItem = activeDocument.activeLayer.textItem;
	textItem.hyphenation = !textItem.hyphenation;
}

function toggleFauxBoldActiveLayer() {
	var textItem = activeDocument.activeLayer.textItem;
	textItem.fauxBold = !textItem.fauxBold;
}

function toggleFauxItalicActiveLayer() {
	var textItem = activeDocument.activeLayer.textItem;
	textItem.fauxItalic = !textItem.fauxItalic;
}

function replaceTextActiveLayer(rules) {
	var textItem = activeDocument.activeLayer.textItem;
	textItem.contents = tbHelper.replaceText(textItem.contents, rules);
}

function setColorActiveLayer(color) {
	var actionColor = new ActionDescriptor();
	var actionColorRef = new ActionReference();
	actionColorRef.putProperty(cTID('Prpr'), cTID('TxtS'));
	actionColorRef.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
	actionColor.putReference(cTID('null'), actionColorRef);
	var colorDesc = new ActionDescriptor();
	var c = new ActionDescriptor();
	c.putDouble(cTID('Rd  '), color.r);
	c.putDouble(cTID('Grn '), color.g);
	c.putDouble(cTID('Bl  '), color.b);
	colorDesc.putObject(cTID('Clr '), cTID('RGBC'), c);
	actionColor.putObject(cTID('T   '), cTID('TxtS'), colorDesc);
	executeAction(cTID('setd'), actionColor, DialogModes.NO);
}

function createTextLayer(text, position) {
	var p = (!!position)? position : [20, 20];
	var textLayer = activeDocument.artLayers.add();
	textLayer.kind = LayerKind.TEXT;
	var textItem = textLayer.textItem;
	textItem.contents = text;
	textItem.position = p;
	textLayer = null;
	textItem = null;
}

function createEmptyLayer() {
	var action = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putClass(cTID('Lyr '));
	action.putReference(cTID('null'), ref);
	executeAction(cTID('Mk  '), action, DialogModes.NO);
}

function setStyle(style) {
	activeDocument.suspendHistory('Set style', '\
		createTextLayer(""); \
		applyStyleActiveLayer('+ JSON.stringify(style) + '); \
		activeDocument.activeLayer.remove(); \
	');
	return 'done';
}

function sortLayerInLayerGroup(layerGroup) {
	var layerGroupRef;
	var layer = activeDocument.activeLayer;
	try {
		layerGroupRef = activeDocument.layerSets.getByName(layerGroup);
	}
	catch (e) {
		layerGroupRef = activeDocument.layerSets.add();
		layerGroupRef.name = layerGroup;
	}
	layer.move(layerGroupRef, ElementPlacement.INSIDE);
	layerGroupRef = null;
}

function typesetEX(typesetObj) {
	try {
		var style = typesetObj.style;
		if (!!!typesetObj.coordinates) {
			typesetObj.coordinates = {
				x: 45,
				y: 45,
				w: 20,
				h: 20
			};
			typesetObj.autoResize = true;
		}
		activeDocument.suspendHistory('Create text layer', 'typeset('+ JSON.stringify(typesetObj) +');');
		if (typesetObj.useLayerGroups && style.layerGroup) {
			activeDocument.suspendHistory('Sort layer', 'sortLayerInLayerGroup("'+ style.layerGroup + '");');
		}
		return 'done';
	}
	catch (e) {
		throw e;
	}
}

function typesetPage(pageScript, styleSet, options) {
	if (tbHelper.pageContainsText(pageScript.rawBubbles)) {
		// page's global style, forced to defaults_style if none is set.
		var pageStyle = tbHelper.getTextStyles(pageScript.pageNote, 'default_style')[0];
		var previousStyle = pageStyle;
		var lines = pageScript.rawBubbles.split(pageScript.lineEnding);
		var n = 0;
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (tbHelper.skipThisLine(line, options.panelSeparator) === false) {
				// line style will be the last thing that's between single brackets
				// but if we're dealing with a multi-bubble part, fallback on previous style if no style is defined for this part
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
							throw 'Style '+ lineStyle +' not found and default_style not found either... (page '+ pageNumber +')';
						}
					}
					if (!!options.textReplaceRules) {
						cleanedText = tbHelper.replaceText(cleanedText, options.textReplaceRules);
					}
					var typesetObj = {
						text: cleanedText,
						style: style,
						coordinates: {x: 30+n, y: 30+n, w: 20, h: 20},
						autoResize: true,
						useLayerGroups: options.useLayerGroups
					};
					typesetEX(typesetObj);
				}
				previousStyle = lineStyle;
			}
		}
	}
	return 'done';
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
					if (pageScript == null) {
						if (!options.noPrompt) {
							if (confirm(fileList[i].toString() + ' has no corresponding page in the translation script.\nContinue to typeset?', false) == false) break;
						}
					}
					else {
						typesetPage(pageScript, styleSet, options);
					}
					var saveFile = new File(editTargetFolderPath.text + '/' + activeDocument.name);
					activeDocument.saveAs(saveFile);
					activeDocument.close(SaveOptions.DONOTSAVECHANGES);
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
			if(activeDocument.activeLayer.kind !== LayerKind.TEXT) continue;
			var val = (obj != undefined)? obj : {};
			activeDocument.suspendHistory(historyName, action + '('+ JSON.stringify(val) +');');
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
	return actionSelectedLayers('resizeActiveLayer', 'Auto resize');
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

function replaceTextSelectedLayers(rules) {
	var tmpRules = tbHelper.cleanTextReplaceRules(rules);
	return actionSelectedLayers('replaceTextActiveLayer', 'Replace text', tmpRules);
}

function convertStylePropValue(styleProperty, value) {
	var prop = tbHelper.getStyleProp(styleProperty, value);
	return (prop.descriptorType == 'string')? sTID(prop.descriptorValue) : cTID(prop.descriptorValue);
}

function prepareTextStyleParams(style) {
	var params = new ActionDescriptor();
	params.putString(sTID('fontPostScriptName'), style.fontName);
	params.putUnitDouble(cTID('Sz  '), cTID('#Pxl'), style.size);
	if (!!!style.language) style.language = tbHelper.styleProps.languages.def;
	params.putEnumerated(sTID('textLanguage'), sTID('textLanguage'), sTID(style.language));
	params.putEnumerated(sTID('fontCaps'), sTID('fontCaps'), convertStylePropValue('capitalization', style.capitalization));
	params.putEnumerated(cTID('AtKr'), cTID('AtKr'), convertStylePropValue('kerning', style.kerning));
	params.putBoolean(sTID('syntheticBold'), style.fauxBold);
	params.putBoolean(sTID('syntheticItalic'), style.fauxItalic);
	params.putDouble(cTID('VrtS'), style.vScale);
	params.putDouble(cTID('HrtS'), style.vScale);
	if (style.leading === 0) {
		params.putBoolean(sTID('autoLeading'), true);
	}
	else {
		params.putBoolean(sTID('autoLeading'), false);
		params.putUnitDouble(cTID('Ldng'), cTID('#Pxl'), style.leading);
	}
	params.putInteger(cTID('Trck'), style.tracking);
	return params;
}

function prepareParagraphStyleParams(style) {
	var params = new ActionDescriptor();
	params.putEnumerated(cTID('Algn'), cTID('Alg '), convertStylePropValue('justification', style.justification));
	params.putBoolean(sTID('hyphenate'), style.hyphenate);
	return params;
}

function typeset(params) {
	createEmptyLayer();
	var typesetActionDescriptor = new ActionDescriptor();
	var layerActionReference = new ActionReference();
	layerActionReference.putClass(cTID('TxLr'));
	typesetActionDescriptor.putReference(cTID('null'), layerActionReference);
	var layerDescriptor = new ActionDescriptor();
	layerDescriptor.putString(cTID('Txt '), params.text);
	// Positionning of the top left corner of the text box. Coordinates are percentage... srsly...
	var clickCoordinatesDescriptor = new ActionDescriptor();
	clickCoordinatesDescriptor.putUnitDouble(cTID('Hrzn'), cTID('#Prc'), params.coordinates.x);
	clickCoordinatesDescriptor.putUnitDouble(cTID('Vrtc'), cTID('#Prc'), params.coordinates.y);
	layerDescriptor.putObject(cTID('TxtC'), cTID('Pnt '), clickCoordinatesDescriptor);
	// Text box
	var shapeActionList = new ActionList();
	var textShapeDescriptor = new ActionDescriptor();
	textShapeDescriptor.putEnumerated(cTID('TEXT'), cTID('TEXT'), sTID('box'));
	// text orientation
	textShapeDescriptor.putEnumerated(cTID('Ornt'), cTID('Ornt'), convertStylePropValue('textOrientation', params.style.textOrientation));
	var shapeBoundsDescriptor = new ActionDescriptor();
	shapeBoundsDescriptor.putDouble(cTID('Top '), 0);
	shapeBoundsDescriptor.putDouble(cTID('Left'), 0);
	// Dimensions. In points... ffs...
	shapeBoundsDescriptor.putDouble(cTID('Rght'), params.coordinates.w);
	shapeBoundsDescriptor.putDouble(cTID('Btom'), params.coordinates.h);
	textShapeDescriptor.putObject(sTID('bounds'), cTID('Rctn'), shapeBoundsDescriptor);
	shapeActionList.putObject(sTID('textShape'), textShapeDescriptor);
	layerDescriptor.putList(sTID('textShape'), shapeActionList);
	// Font style. Hyphenation language is included. Whatever.
	var fontStuffActionList = new ActionList();
	var fontStuffDescriptor = new ActionDescriptor();
	fontStuffDescriptor.putInteger(cTID('From'), 0);
	fontStuffDescriptor.putInteger(cTID('T   '), params.text.length);
	var styleDescriptor = prepareTextStyleParams(params.style);
	fontStuffDescriptor.putObject(cTID('TxtS'), cTID('TxtS'), styleDescriptor);
	fontStuffActionList.putObject(cTID('Txtt'), fontStuffDescriptor);
	layerDescriptor.putList(cTID('Txtt'), fontStuffActionList);
	// AntiAlias
	layerDescriptor.putEnumerated(cTID('AntA'), cTID('Annt'), convertStylePropValue('antialias', params.style.antialias));
	// Alignment and hyphenation
	var paragraphStyleRangeActionList = new ActionList();
	var paragraphStyleRangeDescriptor = new ActionDescriptor();
	paragraphStyleRangeDescriptor.putInteger(cTID('From'), 0);
	paragraphStyleRangeDescriptor.putInteger(cTID('T   '), params.text.length);
	var paragraphStyleDescriptor = prepareParagraphStyleParams(params.style);
	paragraphStyleRangeDescriptor.putObject(sTID('paragraphStyle'), sTID('paragraphStyle'), paragraphStyleDescriptor);
	paragraphStyleRangeActionList.putObject(sTID('paragraphStyleRange'), paragraphStyleRangeDescriptor);
	layerDescriptor.putList(sTID('paragraphStyleRange'), paragraphStyleRangeActionList);
	// Finally create the layer
	typesetActionDescriptor.putObject(cTID('Usng'), cTID('TxLr'), layerDescriptor);
	executeAction(cTID('Mk  '), typesetActionDescriptor, DialogModes.NO);
	// Autoresize. Or not.
	if (params.autoResize) resizeActiveLayer();
	// Set the color
	var c = app.foregroundColor.rgb;
	setColorActiveLayer({r: c.red.toFixed(2), g: c.green.toFixed(2), b: c.blue.toFixed(2)});
	return 'done';
}
