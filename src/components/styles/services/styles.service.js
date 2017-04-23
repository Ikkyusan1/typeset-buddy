tb.factory('StylesService', ['$rootScope', '$localStorage', '$q', 'Utils', 'ngToast',
	function($rootScope, $localStorage, $q, Utils, ngToast) {
		// localStorage location
		// mac : ~/Library/Caches/CSXS/cep_cache/

		var self = this;

		self.constants = {
			antialias: [
				{value: 'CRISP', label: 'Crisp'},
				{value: 'SHARP', label: 'Sharp'},
				{value: 'SMOOTH', label: 'Smooth'},
				{value: 'STRONG', label: 'Strong'},
				{value: 'NONE', label: 'None'}
			],
			kerning: [
				{value: 'METRICS', label: 'Metrics'},
				{value: 'OPTICAL', label: 'Optical'}
			],
			capitalization: [
				{value: 'ALLCAPS', label: 'All caps'},
				{value: 'NORMAL', label: 'Normal'},
				{value: 'SMALLCAPS', label: 'Small caps'}
			],
			justification: [
				{value: 'CENTER', label: 'Center'},
				{value: 'CENTERJUSTIFIED', label: 'Center justified'},
				{value: 'FULLYJUSTIFIED', label: 'Fully justified'},
				{value: 'LEFT', label: 'Left'},
				{value: 'LEFTJUSTIFIED', label: 'Left justified'},
				{value: 'RIGHT', label: 'Right'},
				{value: 'RIGHTJUSTIFIED', label: 'Right justified'}
			]
		};

		self.appFonts = [];
		self.fontFallBack = 'ArialMT';

		self.dummyStyle = {
			keyword: null,
			layerGroup: null,
			fontName: null,
			size: 20,
			leading: 0,
			tracking: 0,
			vScale: 100,
			hScale: 100,
			capitalization: 'NORMAL',
			justification: 'CENTER',
			antialias: 'SMOOTH',
			fauxBold: false,
			fauxItalic: false,
			hyphenate: true,
			kerning: 'METRICS',
		};

		self.dummyStyleSet = {
			name: null,
			styles: [
				angular.copy(self.dummyStyle)
			]
		};

		self.getAppFonts = function() {
			let def = $q.defer();
			if (!!!self.appFonts.length) {
				$rootScope.CSI.evalScript('getAppFonts()', function(res) {
					self.appFonts = JSON.parse(res);
					def.resolve(angular.copy(self.appFonts));
				});
			}
			else {
				def.resolve(angular.copy(self.appFonts));
			}
			return def.promise;
		};

		self.getDummyStyle = function(keyword) {
			let dummy = angular.copy(self.dummyStyle);
			if (angular.isDefined(keyword) && !Utils.isEmpty(keyword)) dummy.keyword = keyword;
			return dummy;
		};

		self.getDummyStyleSet = function() {
			let dummy = angular.copy(self.dummyStyleSet);
			dummy.styles[0].default = true;
			dummy.styles[0].keyword = 'default_style';
			return dummy;
		};

		self.getStyleSetList = function() {
			return $localStorage.styleSets;
		};

		self.cleanAndCheckStyleSet = function(styleSet) {
			if (!angular.isDefined(styleSet.name) || !!!styleSet.name || !!!styleSet.name.trim()) throw 'Need a name';
			if (styleSet.name.length > 25) throw 'Name must be less than 25 characters';
			let defaultStyleCount = 0;
			if (!!!styleSet.styles) throw 'No styles in set';
			for (let i = 0; i < styleSet.styles.length; i++) {
				if (!!!styleSet.styles[i].keyword) throw 'Some style keywords are undefined';
				styleSet.styles[i].keyword = styleSet.styles[i].keyword.trim().toLowerCase();
				if (angular.isDefined(styleSet.styles[i].default) && styleSet.styles[i].default == true) {
					++defaultStyleCount;
					if (styleSet.styles[i].keyword != 'default_style') throw 'Default style must be named "default_style"';
				}
			}
			if (defaultStyleCount === 0) throw 'Missing default style';
			if (defaultStyleCount > 1) throw 'Only one default style allowed';
			styleSet.styles.sort(function(a, b) {
				if (a.keyword < b.keyword) return -1;
				if (a.keyword > b.keyword) return 1;
				return 0;
			});
			// force default values if undefined
			for (let i = 0; i < styleSet.styles.length; i++) {
				for (let prop in self.dummyStyle) {
					if (!angular.isDefined(styleSet.styles[i][prop]) || styleSet.styles[i][prop] === null) styleSet.styles[i][prop] = self.dummyStyle[prop];
				}
			}
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == styleSet.id; });
			for (let i = 0; i < $localStorage.styleSets.length; i++) {
				if ($localStorage.styleSets[i].name.trim().toLowerCase() == styleSet.name.trim().toLowerCase() && $localStorage.styleSets[i].id != idx) throw 'A styleset with the same name already exists';
			}
			for (let i = 0; i < styleSet.styles.length; i++) {
				if (angular.isDefined(styleSet.styles[i+1]) && styleSet.styles[i].keyword == styleSet.styles[i+1].keyword) throw 'The styleset contains duplicate style keywords';
			}
		};

		self.saveStyleSet = function(styleSet) {
			self.cleanAndCheckStyleSet(styleSet);
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == styleSet.id; });
			if (idx > -1) {
				$localStorage.styleSets[idx] = angular.copy(styleSet);
			}
			else {
				let maxId = -1;
				$localStorage.styleSets.forEach(function(one) {
					if (one.id > maxId) maxId = one.id;
				});
				styleSet.id = ++maxId;
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
				return self.getDummyStyleSet();
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
				$rootScope.$broadcast('refresh-styleset-list');
				return true;
			}
		};

		// init
		if (!!!$localStorage.styleSets) {
			$localStorage.styleSets = [];
			let def = self.getDummyStyleSet();
			def.name = 'Default set';
			self.saveStyleSet(def);
		}

		return self;
	}
]);