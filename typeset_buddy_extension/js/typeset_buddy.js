'use strict';

Array.prototype.find||(Array.prototype.find=function(r){if(null===this)throw new TypeError("Array.prototype.find called on null or undefined");if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var t,n=Object(this),e=n.length>>>0,o=arguments[1],i=0;i<e;i++)if(t=n[i],r.call(o,t,i,n))return t});

Array.prototype.findIndex||(Array.prototype.findIndex=function(r){if(null===this)throw new TypeError("Array.prototype.findIndex called on null or undefined");if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var n,e=Object(this),t=e.length>>>0,o=arguments[1],i=0;i<t;i++)if(n=e[i],r.call(o,n,i,e))return i;return-1});

var tbHelper = {

	emptyPages: ['blank', 'empty', 'no_text'],

	panelSeparators: [
		{
			label: 'Long dash',
			value: '–'
		},
		{
			label: 'Single dash',
			value: '-',
		},
		{
			label: 'Double dash',
			value: '--',
		},
		{
			label: 'Equal sign',
			value: '='
		}
	],

	styleProps: {
		'keyword': {
			label: 'Keyword',
			def: null
		},
		'layerGroup': {
			label: 'Layer Group',
			def: null
		},
		'fontName': {
			label: 'Font Name',
			values: [],
			def: 'ArialMT'
		},
		'size': {
			label: 'Size',
			def: 25,
			min: 1,
			max: 1000
		},
		'leading': {
			label: 'Leading',
			def: 0,
			min: 0,
			max: 1000
		},
		'tracking': {
			label: 'Tracking',
			def: 0,
			min: -1000,
			max: 10000
		},
		'vScale': {
			label: 'VScale',
			def: 100,
			min: 1,
			max: 1000
		},
		'hScale': {
			label: 'HScale',
			def: 100,
			min: 1,
			max: 1000
		},
		'capitalization': {
			label: 'Capitalization',
			values: [
				{value: 'ALLCAPS', label: 'All caps', descriptorValue: 'allCaps', descriptorType: 'string'},
				{value: 'NORMAL', label: 'Normal', descriptorValue: 'Nrml', descriptorType: 'char'},
				{value: 'SMALLCAPS', label: 'Small caps', descriptorValue: 'smallCaps', descriptorType: 'string'}
			],
			def: 'NORMAL'
		},
		'justification': {
			label: 'Justification',
			values: [
				{value: 'CENTER', label: 'Center', descriptorValue: 'Cntr', descriptorType: 'char'},
				{value: 'CENTERJUSTIFIED', label: 'Center justified', descriptorValue: 'justifyCenter', descriptorType: 'string'},
				{value: 'FULLYJUSTIFIED', label: 'Fully justified', descriptorValue: 'JstA', descriptorType: 'char'},
				{value: 'LEFT', label: 'Left', descriptorValue: 'Left', descriptorType: 'char'},
				{value: 'LEFTJUSTIFIED', label: 'Left justified', descriptorValue: 'justifyLeft', descriptorType: 'string'},
				{value: 'RIGHT', label: 'Right', descriptorValue: 'Rght', descriptorType: 'char'},
				{value: 'RIGHTJUSTIFIED', label: 'Right justified', descriptorValue: 'justifyRight', descriptorType: 'string'}
			],
			def: 'CENTER'
		},
		'antialias': {
			label: 'Antialias',
			values: [
				{value: 'CRISP', label: 'Crisp', descriptorValue: 'AnCr', descriptorType: 'char'},
				{value: 'SHARP', label: 'Sharp', descriptorValue: 'AnSh', descriptorType: 'char'},
				{value: 'SMOOTH', label: 'Smooth', descriptorValue: 'AnSm', descriptorType: 'char'},
				{value: 'STRONG', label: 'Strong', descriptorValue: 'AnSt', descriptorType: 'char'},
				{value: 'NONE', label: 'None', descriptorValue: 'Anno', descriptorType: 'char'}
			],
			def: 'SMOOTH'
		},
		'fauxBold': {
			label: 'FauxBold',
			def: false
		},
		'fauxItalic': {
			label: 'FauxItalic',
			def: false
		},
		'hyphenate': {
			label: 'Hyphenate',
			def: true
		},
		'kerning': {
			label: 'Kerning',
			values: [
				{value: 'METRICS', label: 'Metrics', descriptorValue: 'metricsKern', descriptorType: 'string'},
				{value: 'OPTICAL', label: 'Optical', descriptorValue: 'opticalKern', descriptorType: 'string'}
			],
			def: 'METRICS'
		},
		languages: {
			label: 'Spelling/Hyphen',
			def: 'englishLanguage',
			values: [
				{label: 'Arabic', value: 'arabicLanguage'},
				{label: 'Bangla India', value: 'bengaliIndiaLanguage'},
				{label: 'Bulgarian', value: 'bulgarianLanguage'},
				{label: 'Catalan', value: 'catalanLanguage'},
				{label: 'Croatian', value: 'croatianLanguage'},
				{label: 'Czech', value: 'czechLanguage'},
				{label: 'Danish', value: 'danishLanguage'},
				{label: 'Dutch 2005 reform', value: 'dutchLanguage'},
				{label: 'Dutch Old Rules', value: 'kdutchLanguageOldRules'},
				{label: 'English Canadian', value: 'canadianEnglishLanguage'},
				{label: 'English UK', value: 'ukenglishLanguage'},
				{label: 'English USA', value: 'englishLanguage'},
				{label: 'Estonian', value: 'estonianLanguage'},
				{label: 'Finnish', value: 'finnishLanguage'},
				{label: 'French Canadian', value: 'canadianFrenchLanguage'},
				{label: 'French', value: 'standardFrenchLanguage'},
				{label: 'German 1996 reform', value: 'germanLanguageReformed1996'},
				{label: 'German 2006 reform', value: 'standardGermanLanguage'},
				{label: 'German Old Rules', value: 'oldGermanLanguage'},
				{label: 'German Swiss 2006', value: 'swissGermanLanguage'},
				{label: 'German Swiss', value: 'swissGermanLanguageOldRules'},
				{label: 'Greek', value: 'greekLanguage'},
				{label: 'Gujarati', value: 'gujaratiLanguage'},
				{label: 'Hebrew', value: 'hebrewLanguage'},
				{label: 'Hindi', value: 'hindiLanguage'},
				{label: 'Hungarian', value: 'hungarianLanguage'},
				{label: 'Italian', value: 'italianLanguage'},
				{label: 'Kannada', value: 'kannadaLanguage'},
				{label: 'Latvian', value: 'latvianLanguage'},
				{label: 'Lithuanian', value: 'lithuanianLanguage'},
				{label: 'Malayaman', value: 'malayalamLanguage'},
				{label: 'Marathi', value: 'marathiLanguage'},
				{label: 'Norwegian Bokmal', value: 'bokmalNorwegianLanguage'},
				{label: 'Norwegian Nynorsk', value: 'nynorskNorwegianLanguage'},
				{label: 'Odia', value: 'oriyaLanguage'},
				{label: 'Polish', value: 'polishLanguage'},
				{label: 'Portuguese Brazilian', value: 'brazilianPortugueseLanguage'},
				{label: 'Portuguese', value: 'standardPortugueseLanguage'},
				{label: 'Punjabi', value: 'punjabiLanguage'},
				{label: 'Romanian', value: 'romanianLanguage'},
				{label: 'Russian', value: 'russianLanguage'},
				{label: 'Slovak', value: 'slovakLanguage'},
				{label: 'Slovenian', value: 'slovenianLanguage'},
				{label: 'Spanish', value: 'spanishLanguage'},
				{label: 'Swedish', value: 'swedishLanguage'},
				{label: 'Tamil', value: 'tamilLanguage'},
				{label: 'Telugu', value: 'teluguLanguage'},
				{label: 'Turkish', value: 'turkishLanguage'},
				{label: 'Ukrainian', value: 'ukranianLanguage'},
				// {label: 'Chinese', value: 'chineseLanguage'},
				// {label: 'Icelandic', value: 'icelandicLanguage'},
				// {label: 'Japanese', value: 'japaneseLanguage'},
				// {label: 'Serbian', value: 'serbianLanguage'},
			]
		}
	},

	getDefaultTextReplaceRules: function(){
		return [
			{
				id: this.uniqueId(),
				pattern: '‘|’',
				to: '\'',
				regex: true,
				regexG: true,
				regexI: false,
				active: true
			},
			{
				id: this.uniqueId(),
				pattern: '“|”',
				to: '"',
				regex: true,
				regexG: true,
				regexI: false,
				active: true
			},
			{
				id: this.uniqueId(),
				pattern: '?!',
				to: '!?',
				regex: false,
				regexG: true,
				regexI: false,
				active: true
			},
			{
				id: this.uniqueId(),
				pattern: '\\.{3,}',
				to: '...',
				regex: true,
				regexG: true,
				regexI: false,
				active: true
			},
			{
				id: this.uniqueId(),
				pattern: '…',
				to: '...',
				regex: true,
				regexG: true,
				regexI: false,
				active: true
			}
		];
	},

	getStyleProp: function(prop, value) {
		return this.styleProps[prop].values.find(function(one) { return one.value == value; });
	},

	uniqueId: function() {
		var idStrLen = 16;
		var idStr= '';
		idStr += (new Date()).getTime().toString(36) + '_';
		do {
			idStr += (Math.floor((Math.random() * 35))).toString(36);
		} while (idStr.length < idStrLen);
		return (idStr);
	},

	getDummyStyle: function(keyword) {
		var dummy = {};
		for (var prop in this.styleProps) {
			dummy[prop] = this.styleProps[prop].def;
		}
		if (!!keyword) dummy.keyword = keyword;
		return dummy;
	},

	getDummyStyleSet: function(name) {
		var dummy = {
			id: this.uniqueId(),
			name: null,
			language: this.styleProps.languages.def,
			styles: [
				this.getDummyStyle('default_style')
			]
		};
		if (!!name) dummy.name = name;
		return dummy;
	},

	getDummyTextReplaceRule: function() {
		return {
			id: this.uniqueId(),
			pattern: '',
			to: '',
			regex: false,
			regexG: false,
			regexI: false,
			active: true
		};
	},

	checkStyleSet: function(styleSet) {
		var defaultStyleCount = 0;
		if (styleSet.name == undefined || !!!styleSet.name || !!!styleSet.name.trim()) throw 'Styleset must have a name';
		if (styleSet.name.length > 25) throw 'Styleset name must be less than 25 characters';
		if (!!!styleSet.styles) throw 'No styles in set';
		for (var i = 0; i < styleSet.styles.length; i++) {
			if (!!!styleSet.styles[i].keyword) throw 'Some style keywords are undefined';
			styleSet.styles[i].keyword = styleSet.styles[i].keyword.trim().toLowerCase();
			if (styleSet.styles[i].keyword == 'default_style') defaultStyleCount++;
		}
		if (defaultStyleCount === 0) throw 'Missing default_style';
		if (defaultStyleCount > 1) throw 'Only one default_style allowed';
		styleSet.styles.sort(function(a, b) {
			if (a.keyword < b.keyword) return -1;
			if (a.keyword > b.keyword) return 1;
			return 0;
		});
		for (var i = 0; i < styleSet.styles.length; i++) {
			if (styleSet.styles[i+1] != undefined && styleSet.styles[i].keyword == styleSet.styles[i+1].keyword) throw 'The styleset contains duplicate style keywords';
		}
		// force default values if undefined
		for (var i = 0; i < styleSet.styles.length; i++) {
			styleSet.styles[i] = this.cleanStyle(styleSet.styles[i]);
		}
	},

	cleanStyle: function(style) {
		for (var prop in this.styleProps) {
			if (style[prop] == undefined || style[prop] === null) style[prop] = this.styleProps[prop].def;
		}
		return style;
	},

	cleanTextReplaceRules: function(rules) {
		var tmpRules = [];
		for (var i = 0; i < rules.length; i++) {
			var tmpRule = this.getDummyTextReplaceRule();
			for (var prop in tmpRule) {
				if (prop != 'id') {
					if ((prop == 'pattern' || prop == 'to') && rules[i][prop] == undefined) throw prop + ' is missing';
					if (prop == 'active' && rules[i][prop] == undefined) tmpRule[prop] = true;
					else {
						tmpRule[prop] = (rules[i][prop] == undefined)? false : rules[i][prop];
					}
				}
			}
			tmpRules.push(tmpRule);
		}
		return tmpRules;
	},

	getStyleFromStyleSet: function(set, keyword) {
		if (!!!set) throw 'No style set';
		if (!!!set.styles) throw 'No styles in set';
		var style = set.styles.find(function(one){ return one.keyword == keyword.toLowerCase(); });
		if (!!!style) throw 'Style not found';
		else return this.cleanStyle(style);
	},

	getFilePageNumber: function(filename) {
		// test for 0000-0000 format
		var reg = /^.*[-_\ ]([\d]{3,4}-[\d]{3,4})\.psd$/;
		var match = reg.exec(filename);
		if (!!match && !!match[1]) {
			return match[1];
		}
		else {
			// test for 00000 format
			reg = /^.*[-_\ ]([\d]{3,5})\.psd$/;
			match = reg.exec(filename);
			return (!!match && !!match[1])? match[1] : null;
		}
	},

	getPageNumbers: function(text) {
		var pageNumbers = [];
		var regex = /\b([\d-]{3,9})#/g;
		var match;
		while ((match = regex.exec(text)) !== null) {
			// failsafe to avoid infinite loops with zero-width matches
			if (match.index === regex.lastIndex) regex.lastIndex++;
			pageNumbers.push(match[1]);
		}
		pageNumbers.sort();
		for (var i = 0; i < pageNumbers.length -1; i++) {
			if (pageNumbers[i] == pageNumbers[i+1]) {
				throw 'Duplicate page number: ' + pageNumbers[i];
			}
		}
		return pageNumbers;
	},

	loadPage: function(text, pageNumber) {
		// pageNumber can be a double page, like "006-007"
		// returns array of matches or null
		// [0]: the whole match
		// [1]: undefined or a page note. Mainly used to apply a style to a whole page, like [italic]
		// [2]: the page's bubbles.
		// [3]: start of the next page or end
		var reg = new RegExp('\\b' + pageNumber + '#\\ ?(.*)?\\n([\\s\\S]*?)($|END#|[\\d-]{3,9}#)');
		var match = reg.exec(text);
		return (!!match)? match : null;
	},

	pageContainsText: function(text) {
		if (!!!text) return false;
		text = text.trim();
		if (text.length === 0) return false;
		else {
			for (var i = 0; i < this.emptyPages.length; i++) {
				if (text.indexOf('[' + this.emptyPages[i] + ']') == 0) return false;
			}
			return true;
		}
	},

	getTextStyles: function(text, fallback) {
		if (!!!text) return (!!fallback)? [fallback] : null;
		var reg = /\[(\[?\w+)\]/g;
		var match = reg.exec(text);
		if (!!match && !!match[1]) {
			reg.lastIndex = 0;
			var styles = [];
			while ((match = reg.exec(text)) !== null) {
				if (match.index === reg.lastIndex) {
					reg.lastIndex++;
				}
				if(match[1].indexOf('\[') != 0) styles.push(match[1].toLowerCase());
				else if (!!!styles.length) styles.push(fallback);
			}
			return styles;
		}
		else {
			return (!!fallback)? [fallback] : null;
		}
	},

	getNotes: function(text) {
		// notes are everything that's enclosed in double square brackets
		if(!!!text) return null;
		var reg = /\[{2}([^\[]+)\]{2}/g;
		var match = reg.exec(text);
		if (!!match && !!match[1]) {
			reg.lastIndex = 0;
			var notes = [];
			while ((match = reg.exec(text)) !== null) {
				if (match.index === reg.lastIndex) {
					reg.lastIndex++;
				}
				notes.push(match[1]);
			}
			return notes;
		}
		return null;
	},

	cleanLine: function(text) {
		if (!!!text) return null;
		// there could be a double slash followed by one or more style(s)
		// skip malformed styles, just in case
		var reg = /(\/{0,2}\ ?)?(\[[\s\w\d]*\]\ ?)*([^\[]*)/;
		var match = reg.exec(text);
		return (!!match && !!match[match.length - 1])? match[match.length - 1].trim() : null;
	},

	replaceText: function(text, rules) {
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			var pattern;
			if (!!rule.regex) {
				var opt = '';
				if (!!rule.regexG) opt += 'g';
				if (!!rule.regexI) opt += 'i';
				pattern = new RegExp(rule.pattern, opt);
			}
			else {
				pattern = rule.pattern;
			}
			if (rule.active) text = text.replace(pattern, rule.to);
		};
		return text;
	},

	// true if skippable, null if panel separator, false if not skipped
	skipThisLine: function(text, panelSeparator) {
		if (!!!text) return true;
		text = this.cleanLine(text);
		if (!!!text || text.length == 0) {
			return true;
		}
		else if (text.charCodeAt(0) == panelSeparator.charCodeAt(0) && text.length == panelSeparator.length) {
			return null;
		}
		else return false;
	},

	isMultiBubblePart: function(text) {
		if (!!!text) return false;
		text = text.trim();
		// multi-bubble parts always start with a double-slash "//"
		var reg = /^\/{2}.*$/;
		var match = reg.test(text);
		return !!match;
	}
};

'use strict';

var tb = angular.module('tb', [
	'templates',
	'ngSanitize',
	'ui.router',
	'ui.bootstrap',
	'ngStorage',
	'ngToast',
	'angular-clipboard'
]);

// these placeholders will be replaced when compiled
tb.constant('CONF', {
	appName: 'typeset_buddy',
	debug: false,
	version: '0.3.0',
	author: 'Ikkyusan',
	homepage: 'https://github.com/ikkyusan1/typeset-buddy',
	description: 'A typesetting tool for Photoshop CC'
});

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

tb.run(['CONF', '$transitions', '$state', '$stateParams', '$rootScope', '$trace', 'themeManager', '$localStorage',
	function(CONF, $transitions, $state, $stateParams, $rootScope, $trace, themeManager, $localStorage) {

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

tb.config(['$stateProvider', '$urlRouterProvider', '$localStorageProvider',
	function($stateProvider, $urlRouterProvider, $localStorageProvider) {

		// load last opened tab
		if($localStorageProvider.get('lastOpenedTab')) $urlRouterProvider.otherwise($localStorageProvider.get('lastOpenedTab'));
		else $urlRouterProvider.otherwise('/styles');

		$stateProvider
		.state('app', {
			url: '/',
			controller: 'AppCtrl',
			templateUrl: 'app.tpl.html',
		})
		.state('about', {
			url: 'about',
			parent: 'app',
			views: {
				app: {
					templateUrl: 'about.tpl.html'
				}
			}
		})
		.state('log_view', {
			url: 'log_view',
			parent: 'app',
			views: {
				app: {
					controller: ['$scope', function($scope){
						$scope.clearLog = function() {
							$scope.$root.logContent = [];
						};
					}],
					templateUrl: 'log_view.tpl.html',
				}
			}
		});
	}
]);

tb.controller('AppCtrl', ['$scope', 'SettingsService', 'Utils',
	function($scope, SettingsService, Utils) {

		$scope.resetLocalStorage = function() {
			Utils.showConfirmDialog('Are you sure you wish to reset the localstorage? Every style set will be deleted.')
			.then(
				function() {
					SettingsService.reset();
				},
				function() {}
			);
		};

		// build tabs
		$scope.routes = [];
		$scope.$state.get().forEach(function(one) {
			if (angular.isDefined(one.nav) && one.nav === true) {
				$scope.routes.push({
					name: one.name,
					label: one.label,
					order: one.order
				})
			}
		});
		$scope.routes.sort(function(a, b) {
			if (a.order < b.order) return -1;
  		if (a.order > b.order) return 1;
  		return 0;
		});

		$scope.goToHomepage = function() {
			window.cep.util.openURLInDefaultBrowser($scope.$root.CONF.homepage);
		}
	}
]);

tb.factory('Applier', ['$rootScope', '$localStorage', '$q',
	function($rootScope, $localStorage, $q) {
		var self = this;

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

		return self;
	}
]);

tb.factory('SettingsService', ['$rootScope', '$localStorage', '$q',
	function($rootScope, $localStorage, $q) {
		var self = this;

		self.init = function() {
			$rootScope.log('$localStorage', $localStorage);
			if (!!!$localStorage.styleSets) {
				let dummyStyleSet = tbHelper.getDummyStyleSet('Default set');
				dummyStyleSet.id = 0;
				$localStorage.styleSets = [dummyStyleSet];
				$localStorage.lastOpenedStyleSet = $localStorage.styleSets[0].id;
			}
			if (!angular.isDefined($localStorage.panelSeparator)) self.setting('panelSeparator', '–');
			if (!angular.isDefined($localStorage.useLayerGroups)) self.setting('useLayerGroups', true);
			if (!angular.isDefined($localStorage.mergeBubbles)) self.setting('mergeBubbles', false);
			if (!angular.isDefined($localStorage.skipSfxs)) self.setting('skipSfxs', false);
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


tb.factory('themeManager', ['$rootScope', 'Utils',
	function($rootScope, Utils) {
		var self = this;
		let panelBgColor;
		let bgColor;
		let fontColor;
		let isLight;
		let stylesheet = document.getElementById('theme');
		let body = document.getElementById('tb');

		self.updateThemeWithAppSkinInfo = function(appSkinInfo) {
			panelBgColor = appSkinInfo.panelBackgroundColor.color;
			bgColor = Utils.colorToHex(panelBgColor);
			fontColor = 'F0F0F0';
			isLight = panelBgColor.red >= 122;
			if (isLight) {
				fontColor = '000000';
				stylesheet.href = 'css/topcoat-desktop-light.css';
				body.classList.remove('dark');
				body.classList.add('light');
			}
			else {
				stylesheet.href = 'css/topcoat-desktop-dark.css';
				body.classList.remove('light');
				body.classList.add('dark');
			}
			body.style.backgroundColor = '#' + bgColor;
			body.style.color = '#' + fontColor;
		};

		self.onAppThemeColorChanged = function(event) {
			let skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
			self.updateThemeWithAppSkinInfo(skinInfo);
		};

		// add event listener to change skin whenever Photoshop's skin changes
		self.init = function() {
			self.updateThemeWithAppSkinInfo($rootScope.CSI.hostEnvironment.appSkinInfo);
			$rootScope.CSI.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, self.onAppThemeColorChanged);
		};

		return self;
	}
]);

tb.factory('Utils', ['$uibModal',
	function($uibModal) {
		var self = this;
		self.isNumeric = function (obj) {
			obj = typeof(obj) === "string" ? obj.replace(",", ".") : obj;
			return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== "[object array]";
		};
		self.endsWith = function(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		};
		self.uid = function() {
			let d = new Date().getTime();
			let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				let r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
			return uuid;
		};
		self.isDateString = function(s) {
			let parsed = Date.parse(s);
			return isNaN(s) && !isNaN(parsed);
		};
		self.isNumeric = function (obj) {
			obj = typeof(obj) === "string" ? obj.replace(",", ".") : obj;
			return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== "[object array]";
		};
		self.isEmpty = function(obj) {
			for (let i in obj) return false;
			return true;
		};
		self.simpleComparison = function(objA, objB) {
			return JSON.stringify(objA) === JSON.stringify(objB);
		};
		self.browserLocale = function() {
			return (navigator.language)? navigator.language : navigator.browserLanguage;
		};
		self.addTrailingSlash = function(txt) {
			return (self.endsWith(txt, '/'))? txt : txt + '/';
		};
		self.removeTrailingSlash = function(txt) {
			return (self.endsWith(txt, '/'))? txt.substr(0, txt.length-1) : txt;
		};
		self.extractFileExtension = function(filename, keepDot) {
			let dot = filename.lastIndexOf('.');
			let adjust = (keepDot)? 0 : 1;
			return (dot > -1)? filename.substr(dot + adjust).toLowerCase() : null;
		};
		self.extractFilename = function(url) {
			let slash = url.lastIndexOf('/');
			return (slash > -1)? url.substr(slash + 1) : null;
		};
		self.colorToHex = function(color, delta) {
			function computeValue(value, delta) {
				let computedValue = !isNaN(delta) ? value + delta : value;
				if (computedValue < 0) {
					computedValue = 0;
				}
				else if (computedValue > 255) {
					computedValue = 255;
				}
				computedValue = Math.floor(computedValue);
				computedValue = computedValue.toString(16);
				return computedValue.length === 1 ? '0' + computedValue : computedValue;
			}
			let hex = '';
			if (color) {
				hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
			}
			return hex;
		};
		self.getValidFileSuffix = function(inputStr) {
			let outputArr = new Array();
			if (0 == inputStr.length || -1 != inputStr.indexOf('.*')) {
				outputArr[0] = '*';
			}
			else {
				inputStr = ' ' + inputStr + ' ';
				inputStr = inputStr.replace(/\*/g, ' ');
				inputStr = inputStr.replace(/,/g, ' ');
				inputStr = inputStr.replace(/;/g, ' ');
				inputStr = inputStr.replace(/\./g, ' ');
				outputArr = inputStr.match(/\s\b\w*\b\s/g);
				outputArr.forEach(function(val, i, arr) {
					arr[i] = val.replace(/\s/g, '');
				});
			}
			return outputArr;
		};
		self.showConfirmDialog = function(message) {
			let modalInstance = $uibModal.open({
				templateUrl: 'confirm_dialog.tpl.html',
				backdrop: 'static',
				backdropClass: 'active',
				size: 'xs',
				resolve: {
					message: function() {
						return message;
					}
				},
				controller: ['$scope', 'message', function($scope, message) {
					$scope.message = message;
					$scope.cancel = function() {
						$scope.$dismiss();
					};
					$scope.submit = function() {
						$scope.$close();
					};
				}],
			});
			return modalInstance.result;
		};

		return self;
	}
]);

tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('script_view', {
			url: 'script_view',
			parent: 'app',
			nav: true,
			label: 'Script',
			order: 1,
			views: {
				app: {
					controller: 'ScriptViewCtrl',
					templateUrl: 'script_view.tpl.html',
				}
			}

		});
	}
]);

tb.controller('ScriptViewCtrl', ['$scope', 'SettingsService', 'ScriptService', 'StylesService', 'Utils', 'ngToast', '$timeout', 'clipboard',
	function($scope, SettingsService, ScriptService, StylesService, Utils, ngToast, $timeout, clipboard) {

		$scope.reset = function() {
			$scope.filename = '';
			$scope.scriptContent = '';
			$scope.pageContent = '';
			$scope.pageNumbers = [];
			$scope.pageScript = '';
			$scope.pageNotes = '';
			$scope.rawBubbles = '';
			$scope.bubbles = [];
			$scope.pageStyle = '';
			$scope.panelSeparator = SettingsService.setting('panelSeparator');
			$scope.useLayerGroups = SettingsService.setting('useLayerGroups');
			$scope.mergeBubbles = SettingsService.setting('mergeBubbles');
			$scope.skipSfxs = SettingsService.setting('skipSfxs');
			$scope.textReplace = SettingsService.setting('textReplace');
			$scope.styleSet = undefined;
			$scope.selectedStyleset = SettingsService.setting('lastOpenedStyleSet');
		};

		$scope.browseScript = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				$scope.loadScript(result.data[0]);
			}
		};

		$scope.loadScript = function(filepath, page, autoloadPage) {
			try {
				let result = window.cep.fs.readFile(filepath, cep.encoding.UTF8);
				if (result.err === 0) {
					SettingsService.setting('lastOpenedScript', filepath);
					$scope.filename = Utils.extractFilename(filepath);
					$scope.scriptContent = result.data;
					$scope.pageNumbers = tbHelper.getPageNumbers($scope.scriptContent);
					if ($scope.pageNumbers.length > 0) {
						if (!!!autoloadPage || page == null) {
							ngToast.create({className: 'info', content: $scope.pageNumbers.length + ' page(s) found in file'});
							$scope.selectedPage = $scope.pageNumbers[0];
						}
						else {
							$scope.selectedPage = page;
						}
					}
					else {
						throw 'Did not find any page number in the translation script';
					}
				}
				else {
					throw 'Could not open translation script';
				}
			}
			catch (e) {
				SettingsService.setting('lastOpenedScript', null);
				SettingsService.setting('lastOpenedPage', null);
				$scope.reset();
				ngToast.create({className: 'danger', content: e});
			}
		};

		$scope.reloadScript = function() {
			if (!!SettingsService.setting('lastOpenedScript')) {
				$scope.loadScript(SettingsService.setting('lastOpenedScript'), SettingsService.setting('lastOpenedPage'), true);
			}
		};

		$scope.setting = function(setting, val) {
			$scope[setting] = SettingsService.setting(setting, val);
		};

		$scope.loadPage = function(pageNumber) {
			if (angular.isDefined(pageNumber) && pageNumber != null && !Utils.isEmpty($scope.scriptContent)) {
				$scope.pageScript = tbHelper.loadPage($scope.scriptContent, pageNumber);
				if ($scope.pageScript != null) {
					let tmpPageStyle = tbHelper.getTextStyles($scope.pageScript[1], 'default_style')[0];
					$scope.pageStyle = ($scope.styleSet.styles.findIndex(function(one) { return one.keyword == tmpPageStyle; }) === -1)? {keyword: tmpPageStyle, inStyleSet: false} : {keyword: tmpPageStyle, inStyleSet: true};
					$scope.$root.log('pageStyle', $scope.pageStyle);
					$scope.pageNotes = tbHelper.getNotes($scope.pageScript[1]);
					$scope.$root.log('pageNotes', $scope.pageNotes);
					$scope.rawBubbles = $scope.pageScript[2];
					$scope.bubbles = [];
					$scope.$root.log('rawBubbles', $scope.rawBubbles);
					if (tbHelper.pageContainsText($scope.rawBubbles)) {
						$scope.$root.log('contains text');
						let lines = [];
						let previousStyle = $scope.pageStyle.keyword;
						lines = $scope.rawBubbles.split('\n');
						$scope.$root.log('lines', lines);
						lines.forEach(function(line) {
							let notes = tbHelper.getNotes(line);
							let skipIt = tbHelper.skipThisLine(line, $scope.panelSeparator);
							if (skipIt === false || !!notes) {
								let bubble = {
									text: tbHelper.cleanLine(line),
									styles: [],
									multibubblePart: false,
									notes: notes
								};
								let tmpStyles = [];
								if (bubble.text) {
									if ($scope.textReplace) {
										try {
											bubble.text = tbHelper.replaceText(bubble.text, SettingsService.setting('textReplaceRules'));
										}
										catch (e) {
											ngToast.create({className: 'danger', content: 'Text replace error: ' + e});
										}
									}
									if (tbHelper.isMultiBubblePart(line)) {
										tmpStyles = tbHelper.getTextStyles(line, previousStyle);
										bubble.multibubblePart = true;
									}
									else {
										tmpStyles = tbHelper.getTextStyles(line, $scope.pageStyle.keyword);
									}
									previousStyle = tmpStyles[0];
									bubble.styles = tmpStyles.map(function(one) {
										let idx = $scope.styleSet.styles.findIndex(function(available) { return available.keyword == one; });
										return (idx === -1 )? {keyword: one, inStyleSet: false} : {keyword: one, inStyleSet: true};
									});
								}
								if ($scope.mergeBubbles && bubble.multibubblePart == true) {
									let p = $scope.bubbles[$scope.bubbles.length -1];
									p.merged = true;
									if (!!!p.siblings) p.siblings = [];
									p.siblings.push(bubble);
									p.styles = p.styles.concat(bubble.styles.filter(function(item){
										return !!!p.styles.find(function(existing){
											return !!Utils.simpleComparison(existing, item);
										});
									}));
								}
								else {
									$scope.bubbles.push(bubble);
								}
							}
							else if (skipIt === null) {
								$scope.bubbles.push({panelSeparator: true});
							}
						});
					}
					SettingsService.setting('lastOpenedPage', pageNumber);
					$scope.$root.log('bubbles', $scope.bubbles);
				}
				else {
					ngToast.create({className: 'info', content: 'Could not find page ' + pageNumber + ' in file'});
					$scope.selectedPage = null;
					SettingsService.setting('lastOpenedPage', null);
					$scope.bubbles = [];
				}
			}
			else $scope.bubbles = [];
		};

		$scope.incPageNumber = function(forward) {
			let inc = (!!forward)? 1 : -1;
			if (!!$scope.pageNumbers.length) {
				if (angular.isDefined($scope.selectedPage)) {
					let idx = $scope.pageNumbers.findIndex(function(one) { return one == $scope.selectedPage; });
					if (angular.isDefined($scope.pageNumbers[idx + inc])) {
						$scope.selectedPage = $scope.pageNumbers[idx + inc];
						SettingsService.setting('lastOpenedPage', $scope.selectedPage);
					}
				}
				else {
					$scope.selectedPage = $scope.pageNumbers[0];
				}
			}
		};

		$scope.typeset = function(bubble, style) {
			if (!!$scope.selectedForcedStyle) {
				$scope.$root.log('force style', $scope.selectedForcedStyle);
				style = {keyword: $scope.selectedForcedStyle, inStyleSet: true};
			}
			if (!style.inStyleSet) {
				ngToast.create({className: 'info', content: 'Style "'+ style.keyword +'" not found in styleset. Fallback to default_style.'});
				style = 'default_style';
			}
			let stylePreset = $scope.styleSet.styles.find(function(one) { return one.keyword == style.keyword; });
			if (!!!stylePreset) stylePreset = $scope.styleSet.styles[0];
			if(!angular.isDefined($scope.styleSet.language)) {
				ngToast.create({className: 'info', content: 'The styleset\'s language is not defined. Fallback to default.'});
				stylePreset.language = tbHelper.styleProps.languages.def;
			}
			else{
				stylePreset.language = $scope.styleSet.language;
			}
			let text = bubble.text;
			if (!!bubble.siblings) {
				bubble.siblings.forEach(function(sibling){
					text += '\r' + sibling.text;
				});
			}
			let typesetObj = {text: text, style: stylePreset};
			ScriptService.maybeTypesetToPath(typesetObj)
			.then(
				function() {},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.typesetPage = function() {
			ScriptService.typesetPage(angular.copy($scope.pageScript), angular.copy($scope.styleSet));
		};

		$scope.tbRobot = function() {
			let extensionPath = $scope.$root.CSI.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
			let script = '$.evalFile("' + extensionPath + 'tb_robot.jsx");';
			$scope.$root.CSI.evalScript(script, function(result) {});
		};

		$scope.toClipboard = function(text, type) {
			clipboard.copyText(text);
			let txt = (!!type && type == 'note')? 'Note copied to clipboard' : 'Content copied to clipboard';
			ngToast.create({className: 'info', content: txt});
		};

		$scope.reset();

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		// autoload last openedscript
		$timeout(function() {
			if (!!SettingsService.setting('lastOpenedScript')) {
				$scope.loadScript(SettingsService.setting('lastOpenedScript'), SettingsService.setting('lastOpenedPage'), true);
			}
		}, 300);

		$scope.$watch('selectedPage', function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage(newVal);
			}
		});

		$scope.$watchGroup(['panelSeparator', 'mergeBubbles', 'textReplace'], function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage($scope.selectedPage);
			}
		});

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
				$scope.loadPage($scope.selectedPage);
			}
		});

	}
]);

tb.factory('ScriptService', ['$rootScope', 'SettingsService', '$q',
	function($rootScope, SettingsService, $q) {
		var self = this;

		self.maybeTypesetToPath = function(typesetObj) {
			let def = $q.defer();
			let tmpObj = angular.copy(typesetObj);
			tmpObj.useLayerGroups = SettingsService.setting('useLayerGroups');
			$rootScope.log('typesetObj', tmpObj);
			$rootScope.CSI.evalScript('tryExec("getSingleRectangleSelectionCoordinates");', function(res) {
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
						if (!angular.isDefined(res.x)) {
							def.reject('The coordinates were malformed.');
						}
						else {
							tmpObj.coordinates = res;
							return self.typeset(tmpObj);
						}
					}
					catch (e) {
						def.reject('Could not parse the coordinates.');
					}
				}
			});
			return def.promise;
		};

		self.typeset = function(typesetObj) {
			let def = $q.defer();
			$rootScope.CSI.evalScript('tryExec("typesetEX", ' + JSON.stringify(typesetObj) + ');', function(res) {
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

		self.typesetPage = function(pageScript, styleSet){
			let def = $q.defer();
			let options = {
				panelSeparator: SettingsService.setting('panelSeparator'),
				useLayerGroups: SettingsService.setting('useLayerGroups'),
				skipSfxs: SettingsService.setting('skipSfxs'),
				textReplaceRules: (SettingsService.setting('textReplace'))? SettingsService.setting('textReplaceRules') : []
			};
			$rootScope.CSI.evalScript('tryExec("typesetPage", ' + JSON.stringify(pageScript) + ',' + JSON.stringify(styleSet) + ',' + JSON.stringify(options) + ');', function(res) {
				$rootScope.log('typesetPage return', res);
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

		return self;
	}
]);

tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('styles', {
			url: 'styles',
			parent: 'app',
			nav: true,
			label: 'Styles',
			order: 0,
			views: {
				app: {
					controller: 'StylesCtrl',
					templateUrl: 'styles.tpl.html',
				}
			}
		});
	}
]);

tb.controller('StylesCtrl', ['$scope', 'StylesService', 'ScriptService', 'ngToast', 'Utils', 'Applier', '$sessionStorage', 'SettingsService',
	function($scope, StylesService, ScriptService, ngToast, Utils, Applier, $sessionStorage, SettingsService) {

		$scope.$sessionStorage = $sessionStorage.$default({
			styleFilter: ''
		});

		$scope.clearStyleFilter = function(){
			$scope.$sessionStorage.styleFilter = '';
		};

		$scope.newStyleSet = function() {
			$scope.styleSet = tbHelper.getDummyStyleSet();
			$scope.selectedStyleset = null;
		};

		$scope.saveStyleSet = function() {
			try {
				StylesService.saveStyleSet($scope.styleSet);
				$scope.loadCurrentStyleSet();
				ngToast.create({className: 'success', content: 'Saved'});
			}
			catch (e) {
				ngToast.create({className: 'danger', content: e});
			}
		};

		$scope.exportStyleSet = function() {
			if (angular.isDefined($scope.selectedStyleset)) {
				let styleSet = StylesService.getStyleSet($scope.selectedStyleset);
				delete styleSet.id;
				let result = window.cep.fs.showSaveDialogEx('Export styleset', undefined, Utils.getValidFileSuffix('*.json'), styleSet.name + '_styleset.json', undefined, 'Export style set', undefined);
				if (!!result.data) {
					let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(styleSet, null, 2), cep.encoding.UTF8);
					if (writeResult.err != 0) {
						ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
					}
				}
			}
		};

		$scope.maybeAddStyleToSet = function(keyword) {
			let idx = $scope.styleSet.styles.findIndex(function(one) {
				return one.keyword == keyword;
			});
			if (idx == -1) {
				$scope.styleSet.styles.push(tbHelper.getDummyStyle(keyword));
			}
		};

		$scope.extendStyleSet = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				let filehandle = window.cep.fs.readFile(result.data[0]);
				if (filehandle.err === 0) {
					let scriptContent = filehandle.data;
					let pageNumbers = ScriptService.getPageNumbers(scriptContent);
					let candidates = [];
					if (pageNumbers.length > 0) {
						pageNumbers.forEach(function(pageNumber) {
							let pageScript = ScriptService.loadPage(scriptContent, pageNumber);
							if (pageScript != null) {
								let pageStyles = [];
								pageStyles.push(ScriptService.getTextStyles(pageScript[1], 'default_style')[0]);
								if (ScriptService.pageContainsText(pageScript[2])) {
									let lines = pageScript[2].split('\n');
									lines.forEach(function(line) {
										let lineStyles = ScriptService.getTextStyles(line, 'default_style');
										pageStyles = pageStyles.concat(lineStyles.filter(function(item) {
											return pageStyles.indexOf(item) < 0;
										}));
									});
								}
								candidates = candidates.concat(pageStyles.filter(function(item) {
									return candidates.indexOf(item) < 0;
								}));
							}
						});
						candidates.forEach(function(one) {
							$scope.maybeAddStyleToSet(one);
						});
						ngToast.create({className: 'success', content: 'Done'});
					}
					else {
						ngToast.create({className: 'info', content: 'Did not find any page number in the script'});
					}
				}
				else {
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.importStyleSet = function() {
			let file = window.cep.fs.showOpenDialogEx(false, false, 'Select styleset file', '', Utils.getValidFileSuffix('*.json'), undefined, false);
			if (angular.isDefined(file.data[0])) {
				$scope.selectedStyleset = null;
				let result = window.cep.fs.readFile(file.data[0]);
				if (result.err === 0) {
					try{
						let tmp = JSON.parse(result.data);
						$scope.log('parsed', tmp);
						StylesService.cleanAndCheckStyleSet(tmp);
						delete tmp.id;
						$scope.styleSet = angular.copy(tmp);
					}
					catch (e) {
						$scope.styleSet = tbHelper.getDummyStyleSet();
						ngToast.create({className: 'danger', content: 'Import error: ' + e});
					}
				}
				else {
					$scope.styleSet = tbHelper.getDummyStyleSet();
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.exportStyleProps = function() {
			let result = window.cep.fs.showSaveDialogEx('Export fonts and style properties', undefined, Utils.getValidFileSuffix('*.json'), 'tb_fonts_and_styleprops.json', undefined, 'Export', undefined);
			if (!!result.data) {
				StylesService.getAppFonts()
				.then(
					function(fonts) {
						let constants = {
							styleProperties: angular.copy(tbHelper.styleProps),
							fonts: fonts
						}
						let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(constants, null, 2));
						if (writeResult.err != 0) {
							ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
						}
					}
				)
			}
		};

		$scope.addStyle = function() {
			$scope.styleSet.styles.push(tbHelper.getDummyStyle());
		};

		$scope.deleteStyleSet = function() {
			if (angular.isDefined($scope.styleSet.id)) {
				Utils.showConfirmDialog('Are you sure you want to delete the style set "'+ $scope.styleSet.name +'" ?')
				.then(
					function() {
						if (StylesService.deleteStyleSet($scope.styleSet.id) === true) {
							ngToast.create({className: 'success', content: 'Deleted'});
						}
					},
					function() {}
				);
			}
		};

		$scope.duplicateStyle = function(style) {
			let newStyle = angular.copy(style);
			newStyle.keyword = 'Copy of ' + newStyle.keyword;
			delete newStyle.default;
			let idx = $scope.styleSet.styles.indexOf(style);
			if (idx > -1) {
				$scope.styleSet.styles.splice(idx + 1, 0, newStyle);
			}
			else {
				$scope.styleSet.styles.push(newStyle);
			}
		};

		$scope.duplicateStyleSet = function() {
			if (angular.isDefined($scope.selectedStyleset)) {
				let tmp = StylesService.getStyleSet($scope.selectedStyleset);
				delete tmp.id;
				tmp.name = 'Copy of ' + tmp.name;
				$scope.styleSet = tmp;
				$scope.selectedStyleset = null;
			}
		};

		$scope.removeStyle = function(style) {
			Utils.showConfirmDialog('Remove style ?')
			.then(
				function() {
					let idx = $scope.styleSet.styles.indexOf(style);
					if (idx > -1) {
						$scope.styleSet.styles.splice(idx, 1);
					}
				},
				function() {}
			);
		};

		$scope.applyStyleSelectedLayers = function(style, resize) {
			let tmpStyle = angular.copy(style);
			tmpStyle.autoResize = !!resize;
			tmpStyle.language = $scope.styleSet.language;
			Applier.actionSelectedLayers('applyStyle', tmpStyle)
			.then(
				function() {
					ngToast.create({className: 'success', content: 'Done'});
				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.setStyle = function(style) {
			let tmpStyle = angular.copy(style);
			Applier.setStyle(tmpStyle)
			.then(
				function() {

				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.actionSelectedLayers = function(action, param) {
			Applier.actionSelectedLayers(action, param)
			.then(
				function() {
					ngToast.create({className: 'success', content: 'Done'});
				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		$scope.loadCurrentStyleSet = function() {
			$scope.selectedStyleset = SettingsService.setting('lastOpenedStyleSet');
		};

		$scope.loadCurrentStyleSet();

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
			}
		});
	}
]);

tb.directive('antialiasSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.antialias.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.antialias.def;
				}
			}
		};
	}
]);

tb.directive('capitalizationSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.capitalization.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.capitalization.def;
				}
			}
		};
	}
]);

tb.directive('fontSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices | orderBy: \'label\'" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				StylesService.getAppFonts()
				.then(
					function(list) {
						$scope.choices = list;
						if (!!!$scope.selectedValue) {
							$scope.selectedValue = tbHelper.styleProps.fontName.def;
						}
					}
				);
			}
		};
	}
]);

tb.directive('justificationSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.justification.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.justification.def;
				}
			}
		};
	}
]);

tb.directive('kerningSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.kerning.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.kerning.def;
				}
			}
		};
	}
]);

tb.directive('languageSelector', [
	function() {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.value as choice.label for choice in choices" | orderBy: \'label\'" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = tbHelper.styleProps.languages.values;
				if (!!!$scope.selectedValue) {
					$scope.selectedValue = tbHelper.styleProps.languages.def;
				}
			}
		};
	}
]);

tb.directive('tbStylePreset', [
	function() {
		return {
			restrict: 'E',
			scope: {
				preset: '=',
				removeAction: '&',
				duplicateAction: '&',
				applyAction: '&',
				setAction: '&'
			},
			templateUrl: 'style_preset.tpl.html',
			controller: ['$scope', 'StylesService',
				function($scope, StylesService) {

				}
			]
		};
	}
]);

tb.directive('tbStyleSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				styleset: '=',
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice as choice for choice in choices" ng-model="selectedValue"><option value="">-</option></select>',
			link: function($scope, $elem, $attrs) {

				$scope.refreshStyleList = function() {
					$scope.choices = [];
					$scope.styleset.styles.forEach(function(one) {
						$scope.choices.push(one.keyword);
					});
					if (!!!$scope.selectedValue) {
						$scope.selectedValue = null;
					}
				};

				$scope.$watch('styleset', function(newVal, oldVal) {
					if (angular.isDefined(newVal)) {
						$scope.refreshStyleList();
					}
					else {
						$scope.choices = [];
					}
				})
			}
		};
	}
]);

tb.directive('stylesetSelector', ['StylesService',
	function(StylesService) {
		return {
			restrict: 'E',
			scope: {
				selectedValue: '='
			},
			replace: true,
			template: '<select ng-options="choice.id as choice.name for choice in choices | orderBy: \'name\'" ng-model="selectedValue"></select>',
			link: function($scope, $elem, $attrs) {
				$scope.choices = [];

				$scope.refreshStylesetList = function() {
					$scope.choices = StylesService.getStyleSetList();
					if (!!!$scope.selectedValue) {
						$scope.selectedValue = $scope.choices[0].id;
					}
				};

				$scope.$on('refresh-styleset-list', $scope.refreshStylesetList);
				$scope.refreshStylesetList();
			}
		};
	}
]);

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

tb.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
		.state('text_replacer', {
			url: 'text_replacer',
			parent: 'app',
			nav: true,
			label: 'Text Replace',
			order: 3,
			views: {
				app: {
					controller: 'TextReplacerCtrl',
					templateUrl: 'text_replacer.tpl.html',
				}
			}
		});
	}
]);

tb.controller('TextReplacerCtrl', ['$scope', 'SettingsService', 'Utils', 'ngToast', 'Applier',
	function($scope, SettingsService, Utils, ngToast, Applier) {

		$scope.textReplaceRules = SettingsService.setting('textReplaceRules');

		$scope.moveRule = function(rule, up) {
			let mod = (!!up)? -1 : 1;
			let idx = $scope.textReplaceRules.findIndex(function(one) { return one.id == rule.id; });
			if (angular.isDefined($scope.textReplaceRules[idx + mod])) {
				$scope.textReplaceRules.splice(idx, 1);
				$scope.textReplaceRules.splice(idx + mod, 0, rule);
			}
		};

		$scope.addRule = function() {
			$scope.textReplaceRules.push(angular.copy(tbHelper.getDummyTextReplaceRule()));
		};

		$scope.removeRule = function(rule) {
			let idx = $scope.textReplaceRules.findIndex(function(one) { return one.id == rule.id; });
			$scope.textReplaceRules.splice(idx, 1);
		};

		$scope.exportRules = function() {
			let result = window.cep.fs.showSaveDialogEx('Export text replace rules', undefined, Utils.getValidFileSuffix('*.json'), 'text_replace_rules.json', undefined, 'Export text replace rules', undefined);
			if (!!result.data) {
				let tmpRules = angular.copy($scope.textReplaceRules);
				tmpRules.forEach(function(one) { delete one.id; });
				let obj = {textReplaceRules: tmpRules};
				let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(obj, null, 2), cep.encoding.UTF8);
				if (writeResult.err != 0) {
					ngToast.create({className: 'danger', content: 'Failed to write a file at the destination:' + result.data + ', error code:' + writeResult.err});
				}
			}
		};

		$scope.importRules = function() {
			let file = window.cep.fs.showOpenDialogEx(false, false, 'Select rules file', '', Utils.getValidFileSuffix('*.json'), undefined, false);
			if (angular.isDefined(file.data[0])) {
				let result = window.cep.fs.readFile(file.data[0]);
				if (result.err === 0) {
					try{
						let tmp = JSON.parse(result.data);
						$scope.log('parsed', tmp);
						let tmpRules;
						if (angular.isDefined(tmp.textReplaceRules)) {
							tmpRules = tmp.textReplaceRules;
						}
						else if (Array.isArray(tmp)) {
							tmpRules = tmp;
						}
						if (!angular.isDefined(tmp)) throw 'The file does not seem to contain any rule';
						$scope.textReplaceRules = $scope.textReplaceRules.concat(tbHelper.cleanTextReplaceRules(tmpRules));
					}
					catch (e) {
						ngToast.create({className: 'danger', content: 'Import error: ' + e});
					}
				}
				else {
					ngToast.create({className: 'danger', content: 'Could not read the file'});
				}
			}
		};

		$scope.appendDefaults = function() {
			$scope.textReplaceRules = $scope.textReplaceRules.concat(tbHelper.getDefaultTextReplaceRules());
		};

		$scope.replaceTextSelectedLayers = function() {
			Applier.actionSelectedLayers('replaceText', $scope.textReplaceRules)
			.then(
				function() {
					ngToast.create({className: 'success', content: 'Done'});
				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.$watch('textReplaceRules', function(newVal, oldVal) {
			SettingsService.setting('textReplaceRules', $scope.textReplaceRules);
		}, true);

	}
]);
