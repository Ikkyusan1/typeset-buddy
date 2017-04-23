// prepared just in case, but eventually not used
tb.directive('bubbleItem', [
	function() {
		return {
			restrict: 'E',
			scope: {
				bubble: '=',
				typesetAction: '&'
			},
			replace: true,
			templateUrl: 'bubble_item.tpl.html',
			controller: ['$scope', 'Utils', 'ScriptService', 'StylesService',
				function($scope, Utils, ScriptService, StylesService) {
					$scope.linkBubble = function() {
						if (!!!$scope.bubble.linked) {
							$scope.bubble.linked = true;
						}
						else {
							$scope.bubble.linked = false;
						}
					}
				}
			]
		};
	}
]);