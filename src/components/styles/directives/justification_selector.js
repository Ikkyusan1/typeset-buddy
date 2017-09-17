tb.directive('justificationSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.justification.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.justification.def;
				}
			}
		};
	}
]);