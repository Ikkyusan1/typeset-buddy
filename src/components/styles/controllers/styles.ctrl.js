tb.controller('StylesCtrl', ['$scope', 'StylesService', 'ngToast', 'Utils', 'Applier', '$sessionStorage', 'SettingsService',
	function($scope, StylesService, ngToast, Utils, Applier, $sessionStorage, SettingsService) {

		$scope.$sessionStorage = $sessionStorage.$default({
			styleFilter: ''
		});

		$scope.clearStyleFilter = function(){
			$scope.$sessionStorage.styleFilter = '';
		};

		$scope.newStyleSet = function() {
			$scope.styleSet = tbHelper.getDummyStyleSet();
			$scope.selectedStyleset = null;
		};

		$scope.saveStyleSet = function() {
			try {
				StylesService.saveStyleSet($scope.styleSet);
				$scope.loadCurrentStyleSet();
				ngToast.create({className: 'success', content: 'Saved'});
			}
			catch (e) {
				ngToast.create({className: 'danger', content: e});
			}
		};

		$scope.exportStyleSet = function() {
			if (angular.isDefined($scope.selectedStyleset)) {
				let styleSet = StylesService.getStyleSet($scope.selectedStyleset);
				delete styleSet.id;
				let result = window.cep.fs.showSaveDialogEx('Export styleset', undefined, Utils.getValidFileSuffix('*.json'), styleSet.name + '_styleset.json', undefined, 'Export style set', undefined);
				if (!!result.data) {
					let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(styleSet, null, 2), cep.encoding.UTF8);
					if (writeResult.err != 0) {
						ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
					}
				}
			}
		};

		$scope.maybeAddStyleToSet = function(keyword) {
			let idx = $scope.styleSet.styles.findIndex(function(one) {
				return one.keyword == keyword;
			});
			if (idx == -1) {
				$scope.styleSet.styles.push(tbHelper.getDummyStyle(keyword));
			}
		};

		$scope.extendStyleSet = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				let filehandle = window.cep.fs.readFile(result.data[0]);
				if (filehandle.err === 0) {
					let scriptContent = filehandle.data;
					let pageNumbers = tbHelper.getPageNumbers(scriptContent);
					let candidates = [];
					if (pageNumbers.length > 0) {
						pageNumbers.forEach(function(pageNumber) {
							let pageScript = tbHelper.loadPage(scriptContent, pageNumber);
							if (pageScript != null) {
								let pageStyles = [];
								pageStyles.push(tbHelper.getTextStyles(pageScript[1], 'default_style')[0]);
								if (tbHelper.pageContainsText(pageScript[2])) {
									let lines = pageScript[2].split('\n');
									lines.forEach(function(line) {
										let lineStyles = tbHelper.getTextStyles(line, 'default_style');
										pageStyles = pageStyles.concat(lineStyles.filter(function(item) {
											return pageStyles.indexOf(item) < 0;
										}));
									});
								}
								candidates = candidates.concat(pageStyles.filter(function(item) {
									return candidates.indexOf(item) < 0;
								}));
							}
						});
						candidates.forEach(function(one) {
							$scope.maybeAddStyleToSet(one);
						});
						ngToast.create({className: 'success', content: 'Done'});
					}
					else {
						ngToast.create({className: 'info', content: 'Did not find any page number in the script'});
					}
				}
				else {
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.importStyleSet = function() {
			let file = window.cep.fs.showOpenDialogEx(false, false, 'Select styleset file', '', Utils.getValidFileSuffix('*.json'), undefined, false);
			if (angular.isDefined(file.data[0])) {
				$scope.selectedStyleset = null;
				let result = window.cep.fs.readFile(file.data[0]);
				if (result.err === 0) {
					try{
						let tmp = JSON.parse(result.data);
						$scope.log('parsed', tmp);
						StylesService.cleanAndCheckStyleSet(tmp);
						delete tmp.id;
						$scope.styleSet = angular.copy(tmp);
					}
					catch (e) {
						$scope.styleSet = tbHelper.getDummyStyleSet();
						ngToast.create({className: 'danger', content: 'Import error: ' + e});
					}
				}
				else {
					$scope.styleSet = tbHelper.getDummyStyleSet();
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.exportStyleProps = function() {
			let result = window.cep.fs.showSaveDialogEx('Export fonts and style properties', undefined, Utils.getValidFileSuffix('*.json'), 'tb_fonts_and_styleprops.json', undefined, 'Export', undefined);
			if (!!result.data) {
				StylesService.getAppFonts()
				.then(
					function(fonts) {
						let constants = {
							styleProperties: angular.copy(tbHelper.styleProps),
							fonts: fonts
						}
						let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(constants, null, 2));
						if (writeResult.err != 0) {
							ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
						}
					}
				)
			}
		};

		$scope.addStyle = function() {
			$scope.styleSet.styles.push(tbHelper.getDummyStyle());
		};

		$scope.deleteStyleSet = function() {
			if (angular.isDefined($scope.styleSet.id)) {
				Utils.showConfirmDialog('Are you sure you want to delete the style set "'+ $scope.styleSet.name +'" ?')
				.then(
					function() {
						if (StylesService.deleteStyleSet($scope.styleSet.id) === true) {
							ngToast.create({className: 'success', content: 'Deleted'});
						}
					},
					function() {}
				);
			}
		};

		$scope.duplicateStyle = function(style) {
			let newStyle = angular.copy(style);
			newStyle.keyword = 'Copy of ' + newStyle.keyword;
			delete newStyle.default;
			let idx = $scope.styleSet.styles.indexOf(style);
			if (idx > -1) {
				$scope.styleSet.styles.splice(idx + 1, 0, newStyle);
			}
			else {
				$scope.styleSet.styles.push(newStyle);
			}
		};

		$scope.duplicateStyleSet = function() {
			if (angular.isDefined($scope.selectedStyleset)) {
				let tmp = StylesService.getStyleSet($scope.selectedStyleset);
				delete tmp.id;
				tmp.name = 'Copy of ' + tmp.name;
				$scope.styleSet = tmp;
				$scope.selectedStyleset = null;
			}
		};

		$scope.removeStyle = function(style) {
			Utils.showConfirmDialog('Remove style ?')
			.then(
				function() {
					let idx = $scope.styleSet.styles.indexOf(style);
					if (idx > -1) {
						$scope.styleSet.styles.splice(idx, 1);
					}
				},
				function() {}
			);
		};

		$scope.applyStyleSelectedLayers = function(style, resize) {
			let tmpStyle = angular.copy(style);
			tmpStyle.autoResize = !!resize;
			tmpStyle.language = $scope.styleSet.language;
			Applier.actionSelectedLayers('applyStyle', tmpStyle)
			.then(
				function() {
					ngToast.create({className: 'success', content: 'Done'});
				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.setStyle = function(style) {
			let tmpStyle = angular.copy(style);
			Applier.setStyle(tmpStyle)
			.then(
				function() {

				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.actionSelectedLayers = function(action, param) {
			Applier.actionSelectedLayers(action, param)
			.then(
				function() {
					ngToast.create({className: 'success', content: 'Done'});
				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		$scope.loadCurrentStyleSet = function() {
			$scope.selectedStyleset = SettingsService.setting('lastOpenedStyleSet');
		};

		$scope.loadCurrentStyleSet();

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
			}
		});
	}
]);
