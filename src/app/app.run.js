tb.run(['CONF', '$transitions', '$state', '$stateParams', '$rootScope', '$trace', 'themeManager', '$localStorage', 'ngToast',
	function(CONF, $transitions, $state, $stateParams, $rootScope, $trace, themeManager, $localStorage, ngToast) {

		$rootScope.CONF = CONF;

		// convenience shortcuts
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.CSI = new CSInterface();
		$rootScope.extensionID = $rootScope.CSI.getExtensionID();

		// convoluted way to load the jsx files
		let JSXs = [
			'polyfills',
			'tb_helper',
		];

		let extensionPath = $rootScope.CSI.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
		for (let i = 0; i < JSXs.length; i++){
			let jsxFile =  extensionPath + JSXs[i] +'.jsx';
			let script = '$.evalFile("' + jsxFile + '");';
			$rootScope.CSI.evalScript(script, function(result) {});
		}

		$rootScope.os = $rootScope.CSI.getOSInformation().toLowerCase().indexOf('mac') >= 0 ? 'Mac' : 'Windows';

		themeManager.init();

		function persist(on) {
			var event;
			if (on) {
			  event = new CSEvent('com.adobe.PhotoshopPersistent', 'APPLICATION');
			}
			else {
			  event = new CSEvent('com.adobe.PhotoshopUnPersistent', 'APPLICATION');
			}
			event.extensionId = $rootScope.extensionID;
			$rootScope.CSI.dispatchEvent(event);
		}

		$rootScope.debug = CONF.debug;

		// log utility when debug mode is on
		$rootScope.log = function(what, obj) {
			if ($rootScope.debug == true) {
				if (!$rootScope.logContent) $rootScope.logContent = [];
				if (angular.isDefined(obj)) {
					$rootScope.logContent.push({label: what, value: obj});
					console.log(what, obj);
				}
				else {
					$rootScope.logContent.push({label: 'log', value: what});
					console.log(what);
				}
			}
		};

		$rootScope.toast = function(toast) {
			if (toast.className == 'danger') toast.dismissOnTimeout = false;
			toast.timeout = 6000;
			ngToast.create(toast);
		};

		// save last opened tab
		let saveTab = function(transition, state) {
			$localStorage.lastOpenedTab = transition.to().name;
			return transition;
		}
		$transitions.onFinish(true, saveTab, {priority: 10});

		let forbidAppState = {
			to: function(state) { return state.name == 'app'; }
		};
		let redirectToLastOpenedTab = function(transition, state) {
			let $state = transition.router.stateService;
			let lastOpenedTab = (!!$localStorage.lastOpenedTab)? $localStorage.lastOpenedTab : 'styles';
			return $state.target(lastOpenedTab, undefined, {location: true});
		};
		$transitions.onBefore(forbidAppState, redirectToLastOpenedTab);

		if ($rootScope.debug == true) {
			// trace routes if debug mode
			$trace.enable(1);
			// $trace.enable('HOOK');
			persist(false);
		}
		else {
			persist(true);
		}

		$rootScope.$watch('debug', function(newVal, oldVal) {
			if (newVal != oldVal) {
				if ($rootScope.debug) {
					$trace.enable(1);
					persist(false);
				}
				else {
					$trace.disable(1);
					persist(true);
				}
			}
		});

	}
]);
