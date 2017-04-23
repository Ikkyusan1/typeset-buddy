tb.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('script_view');

		$stateProvider
		.state('app', {
			url: '/',
			controller: 'AppCtrl',
			templateUrl: 'app.tpl.html',
		})
		$stateProvider
		.state('log_view', {
			url: '/log_view',
			parent: 'app',
			views: {
				app: {
					controller: ['$scope', function($scope){
						$scope.clearLog = function() {
							$scope.$root.logContent = [];
						};
					}],
					templateUrl: 'log_view.tpl.html',
				}
			}
		});
	}
]);
