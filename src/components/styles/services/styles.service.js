tb.factory('StylesService', ['$rootScope', '$localStorage', '$q', 'Utils', 'ngToast', '$timeout',
	function($rootScope, $localStorage, $q, Utils, ngToast, $timeout) {

		var self = this;

		self.appFonts = [];

		self.getAppFonts = function() {
			let def = $q.defer();
			if (!!!self.appFonts.length) {
				$rootScope.CSI.evalScript('getAppFonts();', function(res) {
					self.appFonts = JSON.parse(res);
					def.resolve(angular.copy(self.appFonts));
				});
			}
			else {
				def.resolve(angular.copy(self.appFonts));
			}
			return def.promise;
		};

		self.getStyleSetList = function() {
			return $localStorage.styleSets;
		};

		self.cleanAndCheckStyleSet = function(styleSet) {
			tbHelper.checkStyleSet(styleSet);
			let idx = (!angular.isDefined(styleSet.id))? -1 : $localStorage.styleSets.findIndex(function(one) { return one.id == styleSet.id; });
			let existingId = -1;
			if (idx > -1) existingId = $localStorage.styleSets[idx].id;
			for (let i = 0; i < $localStorage.styleSets.length; i++) {
				if ($localStorage.styleSets[i].name.trim().toLowerCase() == styleSet.name.trim().toLowerCase() && $localStorage.styleSets[i].id != existingId) throw 'A styleset with the same name already exists';
			}
		};

		self.saveStyleSet = function(styleSet) {
			self.cleanAndCheckStyleSet(styleSet);
			if (!angular.isDefined(styleSet.id)) styleSet.id = tbHelper.uniqueId();
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == styleSet.id; });
			if (idx > -1) {
				$localStorage.styleSets[idx] = angular.copy(styleSet);
			}
			else {
				$localStorage.styleSets.push(angular.copy(styleSet));
			}
			$localStorage.lastOpenedStyleSet = styleSet.id;
		};

		self.getStyleSet = function(id) {
			let styleSet = undefined;
			if (!angular.isDefined(id)) {
				id = (angular.isDefined($localStorage.lastOpenedStyleSet))? $localStorage.lastOpenedStyleSet : -1;
			}
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id === id; });
			if (idx > -1) {
				styleSet = angular.copy($localStorage.styleSets[idx]);
			}

			if (!!styleSet) {
				$localStorage.lastOpenedStyleSet = styleSet.id;
				$rootScope.log('styleSet', styleSet);
				return styleSet;
			}
			else {
				return tbHelper.getDummyStyleSet();
			}
		};

		self.deleteStyleSet = function(id) {
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == id; });
			if ($localStorage.styleSets[idx].id === 0) {
				ngToast.create({className: 'danger', content: 'Cannot delete default style set'});
				return false;
			}
			if (idx > -1) {
				$localStorage.styleSets.splice(idx, 1);
				delete $localStorage.lastOpenedStyleSet;
				$timeout(function(){ $rootScope.$broadcast('refresh-styleset-list'); }, 0);
				return true;
			}
		};

		return self;
	}
]);
