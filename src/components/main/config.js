tb.config(['$stateProvider', '$urlRouterProvider', '$localStorageProvider',
	function($stateProvider, $urlRouterProvider, $localStorageProvider) {

		// load last opened tab
		if($localStorageProvider.get('lastOpenedTab')) $urlRouterProvider.otherwise($localStorageProvider.get('lastOpenedTab'));
		else $urlRouterProvider.otherwise('/styles');

		$stateProvider
		.state('app', {
			url: '/',
			controller: 'AppCtrl',
			templateUrl: 'app.tpl.html',
		})
		.state('about', {
			url: 'about',
			parent: 'app',
			views: {
				app: {
					templateUrl: 'about.tpl.html'
				}
			}
		})
		.state('log_view', {
			url: 'log_view',
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
