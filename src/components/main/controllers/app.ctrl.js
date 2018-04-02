tb.controller('AppCtrl', ['$scope', 'SettingsService', 'Utils',
	function($scope, SettingsService, Utils) {

		$scope.resetLocalStorage = function() {
			Utils.showConfirmDialog('Are you sure you wish to reset the localstorage? Every style set will be deleted.')
			.then(
				function() {
					SettingsService.reset();
				},
				function() {}
			);
		};

		// build tabs
		$scope.routes = [];
		$scope.$state.get().forEach(function(one) {
			if (angular.isDefined(one.nav) && one.nav === true) {
				$scope.routes.push({
					name: one.name,
					label: one.label,
					order: one.order
				})
			}
		});
		$scope.routes.sort(function(a, b) {
			if (a.order < b.order) return -1;
  		if (a.order > b.order) return 1;
  		return 0;
		});

		$scope.goToHomepage = function() {
			window.cep.util.openURLInDefaultBrowser($scope.$root.CONF.homepage);
		}
	}
]);
