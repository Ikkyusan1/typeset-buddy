tb.controller('AppCtrl', ['$scope', '$localStorage', '$uibModal', 'Utils',
	function($scope, $localStorage, $uibModal, Utils) {

		$scope.resetLocalStorage = function() {
			Utils.showConfirmDialog('Are you sure you reset the localstorage? Every style set will be deleted.')
			.then(
				function() {
					$localStorage.$reset();
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
	}
]);
