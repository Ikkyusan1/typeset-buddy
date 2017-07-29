tb.config(['$localStorageProvider', 'ngToastProvider',
	function($localStorageProvider, ngToastProvider) {

		$localStorageProvider.setKeyPrefix('tb_');

		ngToastProvider.configure({
			verticalPosition: 'bottom',
			maxNumber: 10
		});
	}
]);
