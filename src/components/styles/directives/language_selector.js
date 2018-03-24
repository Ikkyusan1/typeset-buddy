tb.directive('languageSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" | orderBy: \'label\'" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.languages.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.languages.def;
				}
			}
		};
	}
]);
