tb.controller('TextReplacerCtrl', ['$scope', 'SettingsService', 'Utils', 'ngToast', '$timeout', 'clipboard',
	function($scope, SettingsService, Utils, ngToast, $timeout, clipboard) {

		$scope.textReplaceRules = SettingsService.setting('textReplaceRules');

		$scope.moveRule = function(rule, up) {
			let mod = (!!up)? -1 : 1;
			let idx = $scope.textReplaceRules.findIndex(function(one) { return one.id == rule.id; });
			if (angular.isDefined($scope.textReplaceRules[idx + mod])) {
				$scope.textReplaceRules.splice(idx, 1);
				$scope.textReplaceRules.splice(idx + mod, 0, rule);
			}
		};

		$scope.addRule = function() {
			$scope.textReplaceRules.push(angular.copy(tbHelper.getDummyTextReplaceRule()));
		};

		$scope.removeRule = function(rule) {
			let idx = $scope.textReplaceRules.findIndex(function(one) { return one.id == rule.id; });
			$scope.textReplaceRules.splice(idx, 1);
		};

		$scope.exportRules = function() {
			let result = window.cep.fs.showSaveDialogEx('Export text replace rules', undefined, Utils.getValidFileSuffix('*.json'), 'text_replace_rules.json', undefined, 'Export text replace rules', undefined);
			if (!!result.data) {
				let tmpRules = angular.copy($scope.textReplaceRules);
				tmpRules.forEach(function(one) { delete one.id; });
				let obj = {textReplaceRules: tmpRules};
				let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(obj, null, 2), cep.encoding.UTF8);
				if (writeResult.err != 0) {
					ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
				}
			}
		};

		$scope.importRules = function() {
			let file = window.cep.fs.showOpenDialogEx(false, false, 'Select rules file', '', Utils.getValidFileSuffix('*.json'), undefined, false);
			if (angular.isDefined(file.data[0])) {
				let result = window.cep.fs.readFile(file.data[0]);
				if (result.err === 0) {
					try{
						let tmp = JSON.parse(result.data);
						$scope.log('parsed', tmp);
						let tmpRules;
						if (angular.isDefined(tmp.textReplaceRules)) {
							tmpRules = tmp.textReplaceRules;
						}
						else if (Array.isArray(tmp)) {
							tmpRules = tmp;
						}
						if (!angular.isDefined(tmp)) throw 'The file does not seem to contain any rule';
						$scope.textReplaceRules = $scope.textReplaceRules.concat(tbHelper.cleanTextReplaceRules(tmpRules));
					}
					catch (e) {
						ngToast.create({className: 'danger', content: 'Import error: ' + e});
					}
				}
				else {
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.appendDefaults = function() {
			$scope.textReplaceRules = $scope.textReplaceRules.concat(tbHelper.getDefaultTextReplaceRules());
		};

		$scope.$watch('textReplaceRules', function(newVal, oldVal) {
			SettingsService.setting('textReplaceRules', $scope.textReplaceRules);
		}, true);

	}
]);
