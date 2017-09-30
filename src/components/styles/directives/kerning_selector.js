tb.directive('kerningSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.kerning.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.kerning.def;
				}
			}
		};
	}
]);
