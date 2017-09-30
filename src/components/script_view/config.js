tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('script_view', {
			url: 'script_view',
			parent: 'app',
			nav: true,
			label: 'Script',
			order: 1,
			views: {
				app: {
					controller: 'ScriptViewCtrl',
					templateUrl: 'script_view.tpl.html',
				}
			}

		});
	}
]);
