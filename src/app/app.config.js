tb.config(['cfpLoadingBarProvider', '$localStorageProvider', 'ngToastProvider',
	function(cfpLoadingBarProvider, $localStorageProvider, ngToastProvider) {

		// loading bar config
		cfpLoadingBarProvider.includeSpinner = false;
		// cfpLoadingBarProvider.latencyThreshold = 500;

		$localStorageProvider.setKeyPrefix('tb_');
		ngToastProvider.configure({
			verticalPosition: 'bottom',
			maxNumber: 10
		});
	}
]);
