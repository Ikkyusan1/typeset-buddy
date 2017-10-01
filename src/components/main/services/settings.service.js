tb.factory('SettingsService', ['$rootScope', '$localStorage', '$q',
	function($rootScope, $localStorage, $q) {
		var self = this;

		self.init = function() {
			$rootScope.log('$localStorage', $localStorage);
			if (!!!$localStorage.styleSets) {
				$localStorage.styleSets = [tbHelper.getDummyStyleSet('Default set')];
				$localStorage.lastOpenedStyleSet = $localStorage.styleSets[0].id;
			}
			if (!angular.isDefined($localStorage.panelSeparator)) self.setting('panelSeparator', '–');
			if (!angular.isDefined($localStorage.useLayerGroups)) self.setting('useLayerGroups', true);
			if (!angular.isDefined($localStorage.mergeBubbles)) self.setting('mergeBubbles', false);
			if (!angular.isDefined($localStorage.lastOpenedScript)) self.setting('lastOpenedScript', '');
			if (!angular.isDefined($localStorage.textReplace)) self.setting('textReplace', false);
			if (!angular.isDefined($localStorage.textReplaceRules))
				self.setting('textReplaceRules', tbHelper.getDefaultTextReplaceRules());
		};

		self.setting = function(setting, val) {
			if (angular.isDefined(val)) $localStorage[setting] = val;
			return $localStorage[setting];
		};

		self.reset = function(){
			$localStorage.$reset();
			self.init();
			location.reload();
		};

		self.init();

		return self;
	}
]);
