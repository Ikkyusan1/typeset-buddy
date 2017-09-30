tb.directive('tbStyleSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				styleset: '=',
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice as choice for choice in choices" ng-model="selectedValue"><option value="">-</option></select>',
			link: function($scope, $elem, $attrs) {

				$scope.refreshStyleList = function() {
					$scope.choices = [];
					let tmp = StylesService.getStyleSet($scope.styleset);
					tmp.styles.forEach(function(one) {
						$scope.choices.push(one.keyword);
					});
					if (!!!$scope.selectedValue) {
						$scope.selectedValue = null;
					}
				};

				$scope.$watch('styleset', function(newVal, oldVal) {
					if (angular.isDefined(newVal)) {
						$scope.refreshStyleList();
					}
					else {
						$scope.choices = [];
					}
				})
			}
		};
	}
]);
