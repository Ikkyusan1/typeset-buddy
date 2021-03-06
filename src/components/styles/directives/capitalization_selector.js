tb.directive('capitalizationSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.capitalization.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.capitalization.def;
				}
			}
		};
	}
]);
