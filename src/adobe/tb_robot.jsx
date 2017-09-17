/**
 * Typeset Robot Buddy
 * Version: 0.1.0
 * Description: A typesetting script for Photoshop CS6+. It's meant to lay the groundwork for your typesetting. It will copy/paste the text from a script onto the relevant pages, and apply the relevant styles onto the text layers.
 * Author: Ikkyusan
/*

<javascriptresource>
<name>Typeset Robot Buddy...</name>
<menu>automate</menu>
</javascriptresource>
*/

// enable double clicking from the
// Macintosh Finder or the Windows Explorer
// #target photoshop

// Make Photoshop the frontmost application
app.bringToFront();

#include './polyfills.jsx'
#include './main.jsx'
#include './tb_helper.jsx'

var selectedFiles = [];
var useLayerGroups, skipSfxs, panelSeparator, noPrompt;

var capitalizationValues = tbHelper.styleProps.capitalization.values;
var justificationValues = tbHelper.styleProps.justification.values;
var kerningValues = tbHelper.styleProps.kerning.values;
var antialiasValues = tbHelper.styleProps.antialias.values;
var promptEvery = 10;

var fontNames = [];
for (var i=0; i < app.fonts.length; i++) {
	fontNames.push({
		value: app.fonts[i].postScriptName,
		label: app.fonts[i].name,
	});
};

function exportStyleProps() {
	var file = new File('tb_styleprops.json').saveDlg('Export fonts and style properties', jsonFilter);
	try {
		file.open('w');
		var constants = {
			styleProperties: tbHelper.styleProps,
			fonts: fontNames
		}
		file.writeln(JSON.stringify(constants, null, 2));
		file.close();
	}
	catch (e) {
		alert('Could not write to file '+ file.fsName);
	}
	file = null;
};

function fillCombo(combo, values, selection){
	if (values[0] !== null && typeof values[0] === 'object') {
		for (var i = 0; i < values.length; i++) {
			var item = combo.add('item', values[i].label);
			item.value = values[i].value;
		}
	}
	else {
		for (var i = 0; i < values.length; i++) {
			var item = combo.add('item', values[i]);
		}
	}
	combo.selection = (!!selection)? values.findIndex(function(one){ return one.value == selection; }) : 0;
}

function comboValue(combo) {
	return (combo.selection.value != undefined)? combo.selection.value : combo.selection.text;
}

function promptContinue(nb, nbTotal) {
	return confirm(nb + '/' + nbTotal + 'pages done. Continue?', false);
}

function failsafe() {
	if (!!!selectedPSDs.items.length) {
		alert('Please select some files first.');
		return false;
	}
	if (!!!editScriptPath.text) {
		alert('Please select the translation script that needs to be typesetted.');
		return false;
	}
	if (!!!editTargetFolderPath.text) {
		alert('Please select a target folder');
		return false;
	}
	if (!!!editStyleSetPath.text) {
		if (confirm('No style set defined. Do you really wish to typeset everything with the very basic default setting?\r'+ JSON.stringify(tbHelper.getDummyStyleSet().styles[0], null, 2), true)) {
			styleSet = tbHelper.getDummyStyleSet();
		}
		else return false;
	}
	return confirm('This will overwrite the files in target folder. Do you still wish to continue ?', true);
}


function run() {
	try {
		if (!failsafe()) return false;
		var scriptFile = new File(editScriptPath.text);
		var fileOK = scriptFile.open('r');
		if(fileOK){
			var text = scriptFile.read();
			// set app prefs to pixels.
			setPrefs();
			var fileList = selectedPSDs.items;
			for (var i = 0; i < fileList.length; i++) {
				var pageNumber = tbHelper.getFilePageNumber(fileList[i].toString());
				if (!!!pageNumber) {
					if (!noPrompt.value) alert('No page number found in filename ' + fileList[i].toString());
				}
				else {
					var psdFile;
					try {
						// try to open the file anyway so that it can be saved afterwards in the target folder
						psdFile = new File(fileList[i].toString());
						open(psdFile);
					}
					catch (e) {
						if (!noPrompt.value) alert('Could not open '+ fileList[i].toString());
						continue;
					}
					var pageScript = tbHelper.loadPage(text, pageNumber);
					if (!pageScript) {
						if (!noPrompt.value) alert(fileList[i].toString() + ' has no corresponding page in the translation script');
					}
					else {
						var bubbles = pageScript[2];
						if (tbHelper.pageContainsText(bubbles)) {
							// we've got some text to typeset for this page, so let's get started
							// page's global style, forced to defaults_style if none is set.
							var pageStyle = tbHelper.getTextStyles(pageScript[1], 'default_style')[0];
							var previousStyle = pageStyle;
							var lines = bubbles.split('\n');
							var n = 0;
							for (var j = 0; j < lines.length; j++) {
								var line = lines[j];
								if (tbHelper.skipThisLine(line, comboValue(panelSeparator)) === false) {
									// line style will be the first thing that's between brackets
									// but if we're dealing with a double-bubble part, maybe there's a previous style set for it
									var lineStyle = (tbHelper.isMultiBubblePart(line))? tbHelper.getTextStyles(line, previousStyle).pop() : tbHelper.getTextStyles(line, pageStyle).pop();
									var cleanedText = tbHelper.cleanLine(line);
									// alert('style ' + lineStyle + ' == ' + cleanedText);
									if (skipSfxs.value && lineStyle == 'sfx') continue;
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
										// alert('style ' + lineStyle + ' == ' + cleanedText);
										var typesetObj = {
											text: cleanedText,
											style: style,
											position: [20*n, 20*n],
											useLayerGroups: useLayerGroups.value
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
				if (!noPrompt.value && ((i+1)%promptEvery == 0)) {
					if (promptContinue(i+1, fileList.length) == false) break;
				}
			}
			resetPrefs();
			scriptFile.close();
			alert('Done');
		}
		else {
			alert('Failed to open script');
		}
	}
	catch (e) {
		resetPrefs();
		alert(e);
	}
}

var minWidthBtn = 130;
var dlg = new Window('dialog', 'Typeset Buddy Robot', undefined,);
dlg.preferredSize.width = 800;
dlg.alignChildren = 'fill';
dlg.minimumSize.width = 800;
with(dlg) {
	filesPanel = add('panel', undefined, 'Files');
	filesPanel.alignChildren = ['fill', 'top'];
	with(filesPanel) {
		selectedPSDs = add('listbox', undefined, undefined, {multiselect: true});
		selectedPSDs.minimumSize = [540,150];
		rowPSDsBtns = add('group', undefined, undefined);
		rowPSDsBtns.alignChildren = ['right', 'center'];
		with(rowPSDsBtns) {
			btnSelectPSDs = add('button', undefined, 'Select PSDs');
			btnSelectPSDs.minimumSize.with = minWidthBtn;
			btnRemoveSelectedPSDs = add('button', undefined, 'Remove selected');
			btnRemoveSelectedPSDs.minimumSize.with = minWidthBtn;
			btnRemoveAllPSDs = add('button', undefined, 'Remove all');
			btnRemoveAllPSDs.minimumSize.with = minWidthBtn;
		}
		rowScriptPath = add('group', undefined, undefined);
		rowScriptPath.alignChildren = ['fill', 'center'];
		with(rowScriptPath) {
			editScriptPath = add('edittext', undefined, '', {readonly: false});
			btnScriptPath = add('button', undefined, 'Translation file');
			btnScriptPath.alignment = ['right', 'center'];
			btnScriptPath.minimumSize.width = minWidthBtn;
		}
		rowStyleSet = add('group', undefined, undefined);
		rowStyleSet.alignChildren = ['fill', 'center'];
		with(rowStyleSet) {
			editStyleSetPath = add('edittext', undefined, '', {readonly: false});
			btnStyleSetPath = add('button', undefined, 'Style set file');
			btnStyleSetPath.alignment = ['right', 'center'];
			btnStyleSetPath.minimumSize.width = minWidthBtn;
		}
		rowTargetFolder = add('group', undefined, undefined);
		rowTargetFolder.alignChildren = ['fill', 'center'];
		with(rowTargetFolder) {
			editTargetFolderPath = add('edittext', undefined, '', {readonly: false});
			btnTargetFolderPath = add('button', undefined, 'Target folder');
			btnTargetFolderPath.alignment = ['right', 'center'];
			btnTargetFolderPath.minimumSize.width = minWidthBtn;
		}
	}
	optionsPanel = add('panel', undefined, 'Options');
	optionsPanel.alignChildren = ['fill', 'center'];
	optionsPanel.orientation = 'row';
	with(optionsPanel) {
		gPanelSeparator = add('group');
		gPanelSeparator.add('statictext', undefined, 'Panel separator');
		panelSeparator = gPanelSeparator.add('dropdownlist');
		useLayerGroups = add('checkbox', undefined, 'Use layer groups');
		useLayerGroups.value = true;
		skipSfxs =add('checkbox', undefined, 'Skip SFXs ("sfx" keyword)');
		fillCombo(panelSeparator, tbHelper.panelSeparators);
		noPrompt = add('checkbox', undefined, 'No prompt');
	}
	rowActions = add('group', undefined, undefined);
	rowActions.alignChildren = ['right', 'center'];
	with(rowActions) {
		btnExportStyleProps = add('button', undefined, 'Export style properties and fonts');
		btnExportStyleProps.minimumSize.width = minWidthBtn;
		btnExportStyleProps.alignment = 'left';
		btnRun = add('button', undefined, 'Run');
		btnRun.minimumSize.width = minWidthBtn;
		btnCancel = add('button', undefined, 'Cancel');
		btnCancel.minimumSize.width = minWidthBtn;
	}
}

btnSelectPSDs.onClick = function() {
	var files = File.openDialog('Please select the files you want to typeset', psdFilter, true);
	var pre = [];
	for (var i = 0; i < selectedPSDs.items.length; i++) {
		pre.push(selectedPSDs.items[i].text);
	}
	selectedPSDs.removeAll();
	if (files != null) {
		for (var i = 0; i < files.length; i++) {
			pre.push(files[i].fsName);
		}
	}
	pre = unique(clone(pre)).sort();
	for (var i = 0; i < pre.length; i++) {
		selectedPSDs.add('item', pre[i]);
	}
};

btnRemoveSelectedPSDs.onClick = function() {
	var lst = selectedPSDs;
	if (!!!lst.selection) return false;
	var se = lst.selection;
	for (var i = 0; i < se.length; i++) {
		lst.remove(se[i]);
	}
};

btnRemoveAllPSDs.onClick = function() { selectedPSDs.removeAll(); };

btnScriptPath.onClick = function() {
	var file = File.openDialog('Please select the script file', txtFilter, false);
	if (file != null) {
		editScriptPath.text = editScriptPath.helpTip = file.fsName;
	}
}

btnStyleSetPath.onClick = function() {
	var file = File.openDialog('Select style set file', jsonFilter, false);
	if (file != null) {
		try {
			var fileOK = file.open('r');
			if(fileOK){
				var content;
				content = file.read();
				styleSet = JSON.parse(content);
				tbHelper.checkStyleSet(styleSet);
				editStyleSetPath.text = editStyleSetPath.helpTip = file.fsName;
				file.close();
			}
			else {
				throw('Failed to open file');
			}
		}
		catch (e) {
			alert(e);
			styleSet = null;
			editStyleSetPath.text = editStyleSetPath.helpTip = '';
		}
	}
}

btnTargetFolderPath.onClick = function() {
	var folder = Folder.selectDialog('Select target folder', null, false);
	if (folder != null) {
		editTargetFolderPath.text = editTargetFolderPath.helpTip = folder.fsName;
	}
}

btnExportStyleProps.onClick = function() { exportStyleProps(); }

btnRun.onClick = function() {	run(); }

dlg.center();
dlg.show();
