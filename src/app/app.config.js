tb.config(['$compileProvider', '$localStorageProvider', 'ngToastProvider', 'CONF',
	function($compileProvider, $localStorageProvider, ngToastProvider, CONF) {

		$compileProvider.debugInfoEnabled(CONF.debug);

		$localStorageProvider.setKeyPrefix('tb_');

		ngToastProvider.configure({
			verticalPosition: 'bottom',
			maxNumber: 10,
			combineDuplications: true
		});
	}
]);
