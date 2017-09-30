tb.directive('stylesetSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.id as choice.name for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = [];

				$scope.refreshStylesetList = function() {
					$scope.choices = StylesService.getStyleSetList();
					if (!!!$scope.selectedValue) {
						$scope.selectedValue = $scope.choices[0].id;
					}
				};

				$scope.$on('refresh-styleset-list', $scope.refreshStylesetList);
				$scope.refreshStylesetList();
			}
		};
	}
]);
