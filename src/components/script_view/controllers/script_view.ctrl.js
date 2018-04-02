tb.controller('ScriptViewCtrl', ['$scope', 'SettingsService', 'ScriptService', 'StylesService', 'Utils', 'ngToast', '$timeout', 'clipboard',
	function($scope, SettingsService, ScriptService, StylesService, Utils, ngToast, $timeout, clipboard) {

		$scope.reset = function() {
			$scope.filename = '';
			$scope.scriptContent = '';
			$scope.pageContent = '';
			$scope.pageNumbers = [];
			$scope.pageScript = '';
			$scope.pageNotes = '';
			$scope.rawBubbles = '';
			$scope.bubbles = [];
			$scope.pageStyle = '';
			$scope.panelSeparator = SettingsService.setting('panelSeparator');
			$scope.useLayerGroups = SettingsService.setting('useLayerGroups');
			$scope.mergeBubbles = SettingsService.setting('mergeBubbles');
			$scope.skipSfxs = SettingsService.setting('skipSfxs');
			$scope.textReplace = SettingsService.setting('textReplace');
			$scope.styleSet = undefined;
			$scope.selectedStyleset = SettingsService.setting('lastOpenedStyleSet');
		};

		$scope.browseScript = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				$scope.loadScript(result.data[0]);
			}
		};

		$scope.loadScript = function(filepath, page, autoloadPage) {
			try {
				let result = window.cep.fs.readFile(filepath, cep.encoding.UTF8);
				if (result.err === 0) {
					SettingsService.setting('lastOpenedScript', filepath);
					$scope.filename = Utils.extractFilename(filepath);
					$scope.scriptContent = result.data;
					$scope.pageNumbers = tbHelper.getPageNumbers($scope.scriptContent);
					if ($scope.pageNumbers.length > 0) {
						if (!!!autoloadPage || page == null) {
							ngToast.create({className: 'info', content: $scope.pageNumbers.length + ' page(s) found in file'});
							$scope.selectedPage = $scope.pageNumbers[0];
						}
						else {
							$scope.selectedPage = page;
							$scope.loadPage(page);
						}
					}
					else {
						throw 'Did not find any page number in the translation script';
					}
				}
				else {
					throw 'Could not open translation script';
				}
			}
			catch (e) {
				SettingsService.setting('lastOpenedScript', null);
				SettingsService.setting('lastOpenedPage', null);
				$scope.reset();
				ngToast.create({className: 'danger', content: e});
			}
		};

		$scope.reloadScript = function() {
			if (!!SettingsService.setting('lastOpenedScript')) {
				$scope.loadScript(SettingsService.setting('lastOpenedScript'), SettingsService.setting('lastOpenedPage'), true);
			}
		};

		$scope.setting = function(setting, val) {
			$scope[setting] = SettingsService.setting(setting, val);
		};

		$scope.loadPage = function(pageNumber) {
			if (angular.isDefined(pageNumber) && pageNumber != null && !Utils.isEmpty($scope.scriptContent)) {
				$scope.pageScript = tbHelper.loadPage($scope.scriptContent, pageNumber);
				if ($scope.pageScript != null) {
					let tmpPageStyle = tbHelper.getTextStyles($scope.pageScript[1], 'default_style')[0];
					$scope.pageStyle = ($scope.styleSet.styles.findIndex(function(one) { return one.keyword == tmpPageStyle; }) === -1)? {keyword: tmpPageStyle, inStyleSet: false} : {keyword: tmpPageStyle, inStyleSet: true};
					$scope.$root.log('pageStyle', $scope.pageStyle);
					$scope.pageNotes = tbHelper.getNotes($scope.pageScript[1]);
					$scope.$root.log('pageNotes', $scope.pageNotes);
					$scope.rawBubbles = $scope.pageScript[2];
					$scope.bubbles = [];
					$scope.$root.log('rawBubbles', $scope.rawBubbles);
					if (tbHelper.pageContainsText($scope.rawBubbles)) {
						$scope.$root.log('contains text');
						let lines = [];
						let previousStyle = $scope.pageStyle.keyword;
						lines = $scope.rawBubbles.split('\n');
						$scope.$root.log('lines', lines);
						lines.forEach(function(line) {
							let notes = tbHelper.getNotes(line);
							let skipIt = tbHelper.skipThisLine(line, $scope.panelSeparator);
							if (skipIt === false || !!notes) {
								let bubble = {
									text: tbHelper.cleanLine(line),
									styles: [],
									multibubblePart: false,
									notes: notes
								};
								let tmpStyles = [];
								if (bubble.text) {
									if ($scope.textReplace) {
										try {
											bubble.text = tbHelper.replaceText(bubble.text, SettingsService.setting('textReplaceRules'));
										}
										catch (e) {
											ngToast.create({className: 'danger', content: 'Text replace error: ' + e});
										}
									}
									if (tbHelper.isMultiBubblePart(line)) {
										tmpStyles = tbHelper.getTextStyles(line, previousStyle);
										bubble.multibubblePart = true;
									}
									else {
										tmpStyles = tbHelper.getTextStyles(line, $scope.pageStyle.keyword);
									}
									previousStyle = tmpStyles[0];
									bubble.styles = tmpStyles.map(function(one) {
										let idx = $scope.styleSet.styles.findIndex(function(available) { return available.keyword == one; });
										return (idx === -1 )? {keyword: one, inStyleSet: false} : {keyword: one, inStyleSet: true};
									});
								}
								if ($scope.mergeBubbles && bubble.multibubblePart == true) {
									let p = $scope.bubbles[$scope.bubbles.length -1];
									p.merged = true;
									if (!!!p.siblings) p.siblings = [];
									p.siblings.push(bubble);
									p.styles = p.styles.concat(bubble.styles.filter(function(item){
										return !!!p.styles.find(function(existing){
											return !!Utils.simpleComparison(existing, item);
										});
									}));
								}
								else {
									$scope.bubbles.push(bubble);
								}
							}
							else if (skipIt === null) {
								$scope.bubbles.push({panelSeparator: true});
							}
						});
					}
					SettingsService.setting('lastOpenedPage', pageNumber);
					$scope.$root.log('bubbles', $scope.bubbles);
				}
				else {
					ngToast.create({className: 'info', content: 'Could not find page ' + pageNumber + ' in file'});
					$scope.selectedPage = null;
					SettingsService.setting('lastOpenedPage', null);
					$scope.bubbles = [];
				}
			}
			else $scope.bubbles = [];
		};

		$scope.incPageNumber = function(forward) {
			let inc = (!!forward)? 1 : -1;
			if (!!$scope.pageNumbers.length) {
				if (angular.isDefined($scope.selectedPage)) {
					let idx = $scope.pageNumbers.findIndex(function(one) { return one == $scope.selectedPage; });
					if (angular.isDefined($scope.pageNumbers[idx + inc])) {
						$scope.selectedPage = $scope.pageNumbers[idx + inc];
						SettingsService.setting('lastOpenedPage', $scope.selectedPage);
					}
				}
				else {
					$scope.selectedPage = $scope.pageNumbers[0];
				}
			}
		};

		$scope.typeset = function(bubble, style) {
			if (!!$scope.selectedForcedStyle) {
				$scope.$root.log('force style', $scope.selectedForcedStyle);
				style = {keyword: $scope.selectedForcedStyle, inStyleSet: true};
			}
			if (!style.inStyleSet) {
				ngToast.create({className: 'info', content: 'Style "'+ style.keyword +'" not found in styleset. Fallback to default_style.'});
				style = 'default_style';
			}
			let stylePreset = $scope.styleSet.styles.find(function(one) { return one.keyword == style.keyword; });
			if (!!!stylePreset) stylePreset = $scope.styleSet.styles[0];
			if(!angular.isDefined($scope.styleSet.language)) {
				ngToast.create({className: 'info', content: 'The styleset\'s language is not defined. Fallback to default.'});
				stylePreset.language = tbHelper.styleProps.languages.def;
			}
			else{
				stylePreset.language = $scope.styleSet.language;
			}
			let text = bubble.text;
			if (!!bubble.siblings) {
				bubble.siblings.forEach(function(sibling){
					text += '\r' + sibling.text;
				});
			}
			let typesetObj = {text: text, style: stylePreset};
			ScriptService.maybeTypesetToPath(typesetObj)
			.then(
				function() {},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.typesetPage = function() {
			ScriptService.typesetPage(angular.copy($scope.pageScript), angular.copy($scope.styleSet));
		};

		$scope.tbRobot = function() {
			let extensionPath = $scope.$root.CSI.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
			let script = '$.evalFile("' + extensionPath + 'tb_robot.jsx");';
			$scope.$root.CSI.evalScript(script, function(result) {});
		};

		$scope.toClipboard = function(text, type) {
			clipboard.copyText(text);
			let txt = (!!type && type == 'note')? 'Note copied to clipboard' : 'Content copied to clipboard';
			ngToast.create({className: 'info', content: txt});
		};

		$scope.reset();

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		// autoload last openedscript
		$timeout(function() {
			if (!!SettingsService.setting('lastOpenedScript')) {
				$scope.loadScript(SettingsService.setting('lastOpenedScript'), SettingsService.setting('lastOpenedPage'), true);
			}
		}, 300);

		$scope.$watch('selectedPage', function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage(newVal);
			}
		});

		$scope.$watchGroup(['panelSeparator', 'mergeBubbles', 'textReplace'], function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage($scope.selectedPage);
			}
		});

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
				$scope.loadPage($scope.selectedPage);
			}
		});

	}
]);
