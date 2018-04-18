/**
 * Typeset Robot Buddy
 * Version: 0.1.0
 * Description: A typesetting script for Photoshop CS6+. It's meant to lay the groundwork for your typesetting. It will copy/paste the text from a script onto the relevant pages, and apply the relevant styles onto the text layers.
 * Author: Ikkyusan
*/
/*
<javascriptresource>
<name>Typeset Robot Buddy...</name>
<menu>automate</menu>
</javascriptresource>
*/

// enable double clicking from the
// Macintosh Finder or the Windows Explorer
#target photoshop

// Make Photoshop the frontmost application
app.bringToFront();

#include './polyfills.jsx'
#include './main.jsx'
#include './tb_helper.jsx'

var selectedFiles = [];
var styleSet, textReplaceRules = null;
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
		file.encoding = 'UTF8';
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
		if (failsafe()) {
			var fileList = [];
			for (var i = 0; i < selectedPSDs.items.length; i++) {
				fileList.push(selectedPSDs.items[i].toString());
			}
			var options = {
				panelSeparator: comboValue(panelSeparator),
				useLayerGroups: useLayerGroups.value,
				skipSfxs: skipSfxs.value,
				promptEvery: promptEvery,
				noPrompt: noPrompt.value,
				textReplaceRules: textReplaceRules
			};
			var start = new Date();
			if (typesetFiles(fileList, editScriptPath.text, editTargetFolderPath.text, styleSet, options) == 'done') {
				alert('Done. Processed in : '+ ((new Date() - start)/1000) +'s');
			}
		}
	}
	catch (e) {
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
		rowTextReplaceRules = add('group', undefined, undefined);
		rowTextReplaceRules.alignChildren = ['fill', 'center'];
		with(rowTextReplaceRules) {
			editTextReplaceRulesPath = add('edittext', undefined, '', {readonly: false});
			btnTextReplaceRulesPath = add('button', undefined, 'Text replace rules');
			btnTextReplaceRulesPath.alignment = ['right', 'center'];
			btnTextReplaceRulesPath.minimumSize.width = minWidthBtn;
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
};

btnStyleSetPath.onClick = function() {
	var file = File.openDialog('Select style set file', jsonFilter, false);
	if (file != null) {
		try {
			var fileOK = file.open('r');
			if(fileOK){
				fileOK.encoding = 'UTF8';
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
};

btnTextReplaceRulesPath.onClick = function() {
	var file = File.openDialog('Select text replace rules file', jsonFilter, false);
	if (file != null) {
		try {
			var fileOK = file.open('r');
			if(fileOK){
				fileOK.encoding = 'UTF8';
				var content;
				content = file.read();
				rules = JSON.parse(content);
				if (rules.textReplaceRules != undefined) {
					textReplaceRules = tbHelper.cleanTextReplaceRules(rules.textReplaceRules);
				}
				else if (Array.isArray(rules)) {
					textReplaceRules = tbHelper.cleanTextReplaceRules(rules);
				}
				editTextReplaceRulesPath.text = editTextReplaceRulesPath.helpTip = file.fsName;
				file.close();
			}
			else {
				throw('Failed to open file');
			}
		}
		catch (e) {
			alert(e);
			textReplaceRules = null;
			editTextReplaceRulesPath.text = editTextReplaceRulesPath.helpTip = '';
		}
	}
};


btnTargetFolderPath.onClick = function() {
	var folder = Folder.selectDialog('Select target folder', null, false);
	if (folder != null) {
		editTargetFolderPath.text = editTargetFolderPath.helpTip = folder.fsName;
	}
};

btnExportStyleProps.onClick = function() { exportStyleProps(); };

btnRun.onClick = function() {	run(); };

dlg.center();
dlg.show();
