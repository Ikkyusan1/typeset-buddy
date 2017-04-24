tb.directive('tbStylePreset', [
	function() {
		return {
			restrict: 'E',
			scope: {
				preset: '=',
				removeAction: '&',
				duplicateAction: '&',
				applyAction: '&'
			},
			templateUrl: 'style_preset.tpl.html',
			controller: ['$scope', 'StylesService',
				function($scope, StylesService) {

				}
			]
		};
	}
]);