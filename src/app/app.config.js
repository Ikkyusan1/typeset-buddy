tb.config(['cfpLoadingBarProvider', '$localStorageProvider',
	function(cfpLoadingBarProvider, $localStorageProvider) {

		// loading bar config
		cfpLoadingBarProvider.includeSpinner = false;
		// cfpLoadingBarProvider.latencyThreshold = 500;

		$localStorageProvider.setKeyPrefix('tb_');
	}
]);

