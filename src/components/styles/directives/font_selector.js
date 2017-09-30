tb.directive('fontSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices | orderBy: \'label\'" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				StylesService.getAppFonts()
				.then(
					function(list) {
						$scope.choices = list;
						if (!!!$scope.selectedValue) {
							$scope.selectedValue = tbHelper.styleProps.fontName.def;
						}
					}
				);
			}
		};
	}
]);
