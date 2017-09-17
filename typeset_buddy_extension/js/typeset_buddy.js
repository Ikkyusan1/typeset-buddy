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
				{value: 'ALLCAPS', label: 'All caps'},
				{value: 'NORMAL', label: 'Normal'},
				{value: 'SMALLCAPS', label: 'Small caps'}
			],
			def: 'NORMAL'
		},
		'justification': {
			label: 'Justification',
			values: [
				{value: 'CENTER', label: 'Center'},
				{value: 'CENTERJUSTIFIED', label: 'Center justified'},
				{value: 'FULLYJUSTIFIED', label: 'Fully justified'},
				{value: 'LEFT', label: 'Left'},
				{value: 'LEFTJUSTIFIED', label: 'Left justified'},
				{value: 'RIGHT', label: 'Right'},
				{value: 'RIGHTJUSTIFIED', label: 'Right justified'}
			],
			def: 'CENTER'
		},
		'antialias': {
			label: 'Antialias',
			values: [
				{value: 'CRISP', label: 'Crisp'},
				{value: 'SHARP', label: 'Sharp'},
				{value: 'SMOOTH', label: 'Smooth'},
				{value: 'STRONG', label: 'Strong'},
				{value: 'NONE', label: 'None'}
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
				{value: 'METRICS', label: 'Metrics'},
				{value: 'OPTICAL', label: 'Optical'}
			],
			def: 'METRICS'
		}
	},

	getSylePropValues: function(prop) {
		var values = [];
		for (var i = 0; i < this.styleProps[prop].values.length; i++) {
			values.push(styleProps[prop].values[i].value);
		}
		return values;
	},

	getDummyStyle: function(keyword, isDefault) {
		var dummy = {};
		for (var prop in tbHelper.styleProps) {
			dummy[prop] = tbHelper.styleProps[prop].def;
		}
		if (!!keyword) dummy.keyword = keyword;
		if (!!isDefault) dummy.default = true;
		return dummy;
	},

	getDummyStyleSet: function() {
		var dummy = {
			name: null,
			styles: [
				this.getDummyStyle('default_style', true)
			]
		};
		return dummy;
	},

	checkStyleSet: function(styleSet) {
		var defaultStyleCount = 0;
		if (!!!styleSet.styles) throw 'No styles in set';
		for (var i = 0; i < styleSet.styles.length; i++) {
			if (!!!styleSet.styles[i].keyword) throw 'Some style keywords are undefined';
			styleSet.styles[i].keyword = styleSet.styles[i].keyword.trim().toLowerCase();
			if (styleSet.styles[i].default != undefined && styleSet.styles[i].default == true) {
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
		for (var i = 0; i < styleSet.styles.length; i++) {
			styleSet.styles[i] = this.cleanStyle(styleSet.styles[i]);
		}
	},

	cleanStyle: function(style) {
		for (var prop in tbHelper.styleProps) {
			if (style[prop] == undefined || style[prop] === null) style[prop] = tbHelper.styleProps[prop].def;
		}
		return style;
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
		while((match = regex.exec(text)) !== null) {
			// failsafe to avoid infinite loops with zero-width matches
			if (match.index === regex.lastIndex) regex.lastIndex++;
			pageNumbers.push(match[1]);
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
		var reg = new RegExp('\\b' + pageNumber + '#\\ ?(.*)?\\n([\\s\\S]*?)($|END|[\\d-]{3,9}#)');
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

	// true if skippable, null if panel separator, false if not skipped
	skipThisLine: function(text, panelSeparator) {
		if (!!!text) return true;
		text = this.cleanLine(text);
		if (!!!text || text.length == 0) {
			return true;
		}
		else if (text.charCodeAt(0) == panelSeparator.charCodeAt(0)) {
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
tb.constant('CONF', {
	appName: 'typeset_buddy', // will be replaced by package.json name when compiled
	debug: false,	// will be true when compiled for dev environment, false otherwise
	version: '0.1.10' // will be replaced when compiled
});
tb.config(['$localStorageProvider', 'ngToastProvider',
	function($localStorageProvider, ngToastProvider) {

		$localStorageProvider.setKeyPrefix('tb_');

		ngToastProvider.configure({
			verticalPosition: 'bottom',
			maxNumber: 10
		});
	}
]);

tb.run(['CONF', '$transitions', '$state', '$stateParams', '$rootScope', '$trace', 'themeManager', '$localStorage',
	function(CONF, $transitions, $state, $stateParams, $rootScope, $trace, themeManager, $localStorage) {

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
		$stateProvider
		.state('log_view', {
			url: '/log_view',
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

tb.controller('AppCtrl', ['$scope', '$localStorage', '$uibModal', 'Utils',
	function($scope, $localStorage, $uibModal, Utils) {

		$scope.resetLocalStorage = function() {
			Utils.showConfirmDialog('Are you sure you reset the localstorage? Every style set will be deleted.')
			.then(
				function() {
					$localStorage.$reset();
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
tb.controller('ScriptViewCtrl', ['$scope', 'ScriptService', 'StylesService', 'Utils', 'ngToast', '$timeout', 'clipboard',
	function($scope, ScriptService, StylesService, Utils, ngToast, $timeout, clipboard) {

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
			$scope.panelSeparator = ScriptService.setting('panelSeparator');
			$scope.useLayerGroups = ScriptService.setting('useLayerGroups');
			$scope.mergeBubbles = ScriptService.setting('mergeBubbles');
			$scope.styleSet = StylesService.getStyleSet();
			$scope.selectedStyleset = $scope.styleSet.id;
		};

		$scope.browseScript = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				$scope.loadScript(result.data[0]);
			}
		};

		$scope.loadScript = function(filepath, page, silent) {
			let result = window.cep.fs.readFile(filepath);
			if (result.err === 0) {
				ScriptService.setting('lastOpenedScript', filepath);
				$scope.filename = Utils.extractFilename(filepath);
				$scope.scriptContent = result.data;
				$scope.pageNumbers = ScriptService.getPageNumbers($scope.scriptContent);
				if ($scope.pageNumbers.length > 0) {
					if (!!!silent) {
						ngToast.create({className: 'info', content: $scope.pageNumbers.length + ' page(s) found in file'});
						$scope.selectedPage = $scope.pageNumbers[0];
					}
					if (page != null) {
						$scope.selectedPage = page;
					}
				}
				else {
					ngToast.create({className: 'info', content: 'Did not find any page number in the script'});
					ScriptService.setting('lastOpenedScript', null);
					ScriptService.setting('lastOpenedPage', null);
					$scope.reset();
				}
			}
			else {
				ScriptService.setting('lastOpenedScript', null);
				ScriptService.setting('lastOpenedPage', null);
				$scope.reset();
				ngToast.create({className: 'danger', content: 'Could not read the file'});
			}
		};

		$scope.setting = function(setting, val) {
			$scope[setting] = ScriptService.setting(setting, val);
		};

		$scope.loadPage = function(pageNumber) {
			if (angular.isDefined(pageNumber) && pageNumber != null && !Utils.isEmpty($scope.scriptContent)) {
				$scope.pageScript = ScriptService.loadPage($scope.scriptContent, pageNumber);
				if ($scope.pageScript != null) {
					let tmpPageStyle = ScriptService.getTextStyles($scope.pageScript[1], 'default_style')[0];
					$scope.pageStyle = ($scope.styleSet.styles.findIndex(function(one) { return one.keyword == tmpPageStyle; }) === -1)? {keyword: tmpPageStyle, inStyleSet: false} : {keyword: tmpPageStyle, inStyleSet: true};
					$scope.$root.log('pageStyle', $scope.pageStyle);
					$scope.pageNotes = ScriptService.getNotes($scope.pageScript[1]);
					$scope.$root.log('pageNotes', $scope.pageNotes);
					$scope.rawBubbles = $scope.pageScript[2];
					$scope.bubbles = [];
					$scope.$root.log('rawBubbles', $scope.rawBubbles);
					if (ScriptService.pageContainsText($scope.rawBubbles)) {
						$scope.$root.log('contains text');
						let lines = [];
						let previousStyle = $scope.pageStyle.keyword;
						lines = $scope.rawBubbles.split('\n');
						$scope.$root.log('lines', lines);
						lines.forEach(function(line) {
							let notes = ScriptService.getNotes(line);
							let skipIt = ScriptService.skipThisLine(line);
							if (skipIt === false || !!notes) {
								let bubble = {
									text: ScriptService.cleanLine(line),
									styles: [],
									multibubblePart: false,
									notes: notes
								};
								let tmpStyles = [];
								if (bubble.text) {
									if (ScriptService.isMultiBubblePart(line)) {
										tmpStyles = ScriptService.getTextStyles(line, previousStyle);
										bubble.multibubblePart = true;
									}
									else {
										tmpStyles = ScriptService.getTextStyles(line, $scope.pageStyle.keyword);
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
					ScriptService.setting('lastOpenedPage', pageNumber);
					$scope.$root.log('bubbles', $scope.bubbles);
				}
				else {
					ngToast.create({className: 'info', content: 'Could not find page ' + pageNumber + ' in file'});
					$scope.selectedPage = null;
					ScriptService.setting('lastOpenedPage', null);
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
						ScriptService.setting('lastOpenedPage', $scope.selectedPage);
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
				ngToast.create({className: 'danger', content: 'Style "'+ style.keyword +'" not found in styleset'});
			}
			else {
				let stylePreset = $scope.styleSet.styles.find(function(one) { return one.keyword == style.keyword; });
				if (!!!stylePreset) stylePreset = $scope.styleSet.styles[0];
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
			}
		};

		$scope.toClipboard = function(text) {
			clipboard.copyText(text);
		};

		$scope.reset();

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		// autoload last openedscript
		$timeout(function() {
			if (!!ScriptService.setting('lastOpenedScript')) {
				$scope.loadScript(ScriptService.setting('lastOpenedScript'), ScriptService.setting('lastOpenedPage'), true);
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
tb.controller('StylesCtrl', ['$scope', 'StylesService', 'ScriptService', 'ngToast', 'Utils', '$uibModal',
	function($scope, StylesService, ScriptService, ngToast, Utils, $uibModal) {

		$scope.clearStyleFilter = function(){
			$scope.styleFilter = undefined;
		}

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
					let writeResult = window.cep.fs.writeFile(result.data, JSON.stringify(styleSet, null, 2));
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
							$scope.selectedStyleset = 0;
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
			tmpStyle.noResize = !!!resize;
			StylesService.actionSelectedLayers('applyStyle', tmpStyle)
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
			StylesService.setStyle(tmpStyle)
			.then(
				function() {

				},
				function(err) {
					ngToast.create({className: 'danger', content: err});
				}
			);
		};

		$scope.actionSelectedLayers = function(action, param) {
			StylesService.actionSelectedLayers(action, param)
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
			$scope.styleSet = StylesService.getStyleSet();
			$scope.selectedStyleset = $scope.styleSet.id;
		};

		$scope.loadCurrentStyleSet();

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
			}
		});
	}
]);



tb.directive('antialiasSelector', ['StylesService',
	function(StylesService) {
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
tb.directive('capitalizationSelector', ['StylesService',
	function(StylesService) {
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
tb.directive('justificationSelector', ['StylesService',
	function(StylesService) {
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
tb.directive('kerningSelector', ['StylesService',
	function(StylesService) {
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
					let tmp = StylesService.getStyleSet($scope.styleset);
					tmp.styles.forEach(function(one) {
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
			template: '<select ng-options="choice.id as choice.name for choice in choices" ng-model="selectedValue"></select>',
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
			if (!angular.isDefined(styleSet.name) || !!!styleSet.name || !!!styleSet.name.trim()) throw 'Need a name';
			if (styleSet.name.length > 25) throw 'Name must be less than 25 characters';
			tbHelper.checkStyleSet(styleSet);
			let idx = $localStorage.styleSets.findIndex(function(one) { return one.id == styleSet.id; });
			let existingId = -1;
			if (idx > -1) existingId = $localStorage.styleSets[idx].id;
			for (let i = 0; i < $localStorage.styleSets.length; i++) {
				if ($localStorage.styleSets[i].name.trim().toLowerCase() == styleSet.name.trim().toLowerCase() && $localStorage.styleSets[i].id != existingId) throw 'A styleset with the same name already exists';
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