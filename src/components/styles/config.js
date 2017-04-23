tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('styles', {
			url: 'styles',
			parent: 'app',
			nav: true,
			label: 'Styles',
			order: 0,
			views: {
				app: {
					controller: 'StylesCtrl',
					templateUrl: 'styles.tpl.html',
				}
			}

		});
	}
]);