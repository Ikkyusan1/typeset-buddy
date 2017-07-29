tb.run(['CONF', '$transitions', '$state', '$stateParams', '$rootScope', '$trace', 'themeManager', '$localStorage',
	function(CONF, $transitions, $state, $stateParams, $rootScope, $trace, themeManager, $localStorage) {

		// convenience shortcuts
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.CSI = new CSInterface();
		$rootScope.extensionID = $rootScope.CSI.getExtensionID();

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

		$rootScope.os = $rootScope.CSI.getOSInformation().toLowerCase().indexOf('mac') >= 0 ? 'Mac' : 'Windows';

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

		// save last opened tab
		let saveTab = function(transition, state) {
			$localStorage.lastOpenedTab = transition.to().name;
			return transition;
		}
		$transitions.onFinish(true, saveTab, {priority: 10});

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