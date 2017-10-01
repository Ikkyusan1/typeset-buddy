tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('text_replacer', {
			url: 'text_replacer',
			parent: 'app',
			nav: true,
			label: 'Text Replace',
			order: 3,
			views: {
				app: {
					controller: 'TextReplacerCtrl',
					templateUrl: 'text_replacer.tpl.html',
				}
			}
		});
	}
]);
