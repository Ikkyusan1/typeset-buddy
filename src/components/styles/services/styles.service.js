tb.factory('StylesService', ['$rootScope', '$localStorage', '$q', 'Utils', 'ngToast',
	function($rootScope, $localStorage, $q, Utils, ngToast) {
		// localStorage location
		// mac : ~/Library/Caches/CSXS/cep_cache/

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
			$rootScope.$broadcast('refresh-styleset-list');
		};

		self.getStyleSet = function(id) {
			let styleSet = undefined;
			if (!angular.isDefined(id)) {
				// attempt to load last styleset
				if (angular.isDefined($localStorage.lastOpenedStyleSet)) {
					styleSet = self.getStyleSet($localStorage.lastOpenedStyleSet);
				}
			}
			else {
				let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == id; });
				if (idx > -1) {
					styleSet = angular.copy($localStorage.styleSets[idx]);
				}
			}
			if (!!styleSet) {
				$localStorage.lastOpenedStyleSet = styleSet.id;
				return styleSet;
			}
			else {
				return tbHelper.getDummyStyleSet();
			}
		};

		self.deleteStyleSet = function(id) {
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == id; });
			if ($localStorage.styleSets[idx].name == 'Default set') {
				ngToast.create({className: 'danger', content: 'Cannot delete default style set'});
				return false;
			}
			if (idx > -1) {
				$localStorage.styleSets.splice(idx, 1);
				delete $localStorage.lastOpenedStyleSet;
				$rootScope.$broadcast('refresh-styleset-list');
				return true;
			}
		};

		self.setStyle = function(style) {
			let def = $q.defer();
				$rootScope.$root.CSI.evalScript('tryExec("setStyle", '+ JSON.stringify(style) +');', function(res) {
				$rootScope.log('setStyle return', res);
				if (res === 'no_document') {
					def.reject('No document.');
				}
				else if (res === 'done') {
					def.resolve();
				}
				else {
					def.reject(res);
				}
			});
			return def.promise;
		};

		self.actionSelectedLayers = function(action, param) {
			let def = $q.defer();
			let actionString = '"'+ action + 'SelectedLayers"';
			if (angular.isDefined(param)) {
				actionString += ', '+ JSON.stringify(param);
			}
			$rootScope.$root.CSI.evalScript('tryExec('+ actionString +');', function(res) {
				$rootScope.log(actionString + ' return', res);
				if (res === 'no_document') {
					def.reject('No document.');
				}
				else if (res === 'no_selected_layers') {
					def.reject('Could not retrieve the selected layers.');
				}
				else if (res === 'not_text_layer') {
					def.reject('Not a text layer.');
				}
				else if (res === 'done') {
					def.resolve();
				}
				else {
					def.reject(res);
				}
			});
			return def.promise;
		};

		// init
		if (!!!$localStorage.styleSets) {
			$localStorage.styleSets = [];
			let defaultSet = tbHelper.getDummyStyleSet();
			defaultSet.name = 'Default set';
			self.saveStyleSet(defaultSet);
		}

		return self;
	}
]);
