tb.factory('ScriptService', ['$rootScope', '$localStorage', '$q', 'StylesService',
	function($rootScope, $localStorage, $q, StylesService) {
		var self = this;

		self.init = function() {
			$rootScope.log('$localStorage', $localStorage);
			if (!angular.isDefined($localStorage.panelSeparator)) self.setting('panelSeparator', '–');
			if (!angular.isDefined($localStorage.useLayerGroups)) self.setting('useLayerGroups', true);
			if (!angular.isDefined($localStorage.mergeBubbles)) self.setting('mergeBubbles', false);
			if (!angular.isDefined($localStorage.lastOpenedScript)) self.setting('lastOpenedScript', '');
		};

		self.setting = function(setting, val) {
			if (angular.isDefined(val)) $localStorage[setting] = val;
			return $localStorage[setting];
		};

		self.getPageNumbers = function(text) {
			return tbHelper.getPageNumbers(text);
		};

		// pageNumber can be a double page, like "006-007"
		// returns array of matches or null
		// [0]: the whole match
		// [1]: undefined or a page note. Mainly used to apply a style to a whole page, like [italic]
		// [2]: the page's bubbles.
		// [3]: start of the next page or end
		self.loadPage = function(text, pageNumber) {
			let res = tbHelper.loadPage(text, pageNumber);
			$rootScope.log('page Match', res);
			return res;
		};

		self.pageContainsText = function(text) {
			return tbHelper.pageContainsText(text);
		};

		self.getTextStyles = function(text, fallback) {
			return tbHelper.getTextStyles(text, fallback);
		};

		self.getNotes = function(text) {
			return tbHelper.getNotes(text);
		};

		self.cleanLine = function(text) {
			return tbHelper.cleanLine(text);
		};

		self.skipThisLine = function(text) {
			return tbHelper.skipThisLine(text, self.setting('panelSeparator'));
		};

		self.isMultiBubblePart = function(text) {
			return tbHelper.isMultiBubblePart(text);
		};

		self.maybeTypesetToPath = function(typesetObj) {
			let def = $q.defer();
			let tmpObj = angular.copy(typesetObj);
			tmpObj.useLayerGroups = self.setting('useLayerGroups');
			$rootScope.log('typesetObj', tmpObj);
			$rootScope.CSI.evalScript('tryExec("getSingleRectangleSelectionDimensions");', function(res) {
				$rootScope.log('maybeTypesetToPath return', res);
				if (res == 'no_document') {
					def.reject('No document');
				}
				else if (res == 'no_selection') {
					return self.typeset(tmpObj)
				}
				else if (res == 'multiple_paths') {
					def.reject('Too many paths. Only one path allowed.');
				}
				else if (res == 'too_many_anchors') {
					def.reject('Too many anchors in path. Only rectangle paths are allowed (use the marquee tool).');
				}
				else {
					try {
						res = JSON.parse(res);
						if (!angular.isDefined(res.p)) {
							def.reject('The dimensions were malformed.');
						}
						else {
							tmpObj.style.dimensions = res;
							return self.typeset(tmpObj);
						}
					}
					catch (e) {
						def.reject('Could not parse the dimensions.');
					}
				}
			});
			return def.promise;
		};

		self.typeset = function(typesetObj) {
			let def = $q.defer();
			$rootScope.$root.CSI.evalScript('tryExec("typesetEX", ' + JSON.stringify(typesetObj) + ');', function(res) {
				$rootScope.log('typeset return', res);
				if (res === 'no_document') {
					def.reject('No document');
				}
				else if(res === 'done') {
					def.resolve();
				}
				else {
					def.reject(res)
				}
			});
			return def.promise;
		};

		self.init();
		return self;
	}
]);
