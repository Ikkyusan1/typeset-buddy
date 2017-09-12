tb.factory('ScriptService', ['$rootScope', '$localStorage', '$q', 'StylesService',
	function($rootScope, $localStorage, $q, StylesService) {
		var self = this;

		self.init = function() {
			$rootScope.log('$localStorage', $localStorage);
			self.emptyPage = ['blank', 'empty', 'no_text'];
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
			let pageNumbers = [];
			let regex = /\b([\d-]{3,9})#/g;
			let match;
			while((match = regex.exec(text)) !== null) {
				// failsafe to avoid infinite loops with zero-width matches
				if (match.index === regex.lastIndex) regex.lastIndex++;
				pageNumbers.push(match[1]);
			}
			return pageNumbers;
		};

		// pageNumber can be a double page, like "006-007"
		// returns array of matches or null
		// [0]: the whole match
		// [1]: undefined or a page note. Mainly used to apply a style to a whole page, like [italic]
		// [2]: the page's bubbles.
		// [3]: start of the next page or end
		self.loadPage = function(text, pageNumber) {
			let reg = new RegExp('\\b' + pageNumber + '#\\ ?(.*)?\\n([\\s\\S]*?)($|END|[\\d-]{3,9}#)');
			let match = reg.exec(text);
			$rootScope.log('page Match', match);
			return (!!match)? match : null;
		};

		self.pageContainsText = function(text) {
			if (!!!text) return false;
			text = text.trim();
			if (text.length === 0) return false;
			else {
				for (var i = 0; i < self.emptyPage.length; i++) {
					if (text.indexOf('[' + self.emptyPage[i] + ']') == 0) return false;
				}
				return true;
			}
		};

		self.getTextStyles = function(text, fallback) {
			if (!!!text) return (!!fallback)? [fallback] : null;
			let reg = /\[(\[?\w+)\]/g;
			let match = reg.exec(text);
			if (!!match && !!match[1]) {
				reg.lastIndex = 0;
				let styles = [];
				while ((match = reg.exec(text)) !== null) {
					if (match.index === reg.lastIndex) {
						reg.lastIndex++;
					}
					if(match[1].indexOf('\[') != 0)
						styles.push(match[1].toLowerCase());
					else if (!!!styles.length) styles.push(fallback);
				}
				return styles;
			}
			else {
				return (!!fallback)? [fallback] : null;
			}
		};

		self.getNotes = function(text) {
			if(!!!text) return null;
			let reg = /\[{2}([^\[]+)\]{2}/g;
			let match = reg.exec(text);
			if (!!match && !!match[1]) {
				reg.lastIndex = 0;
				let notes = [];
				while ((match = reg.exec(text)) !== null) {
					if (match.index === reg.lastIndex) {
						reg.lastIndex++;
					}
					notes.push(match[1]);
				}
				return notes;
			}
			return null;
		};

		self.cleanLine = function(text) {
			if (!!!text) return null;
			// there could be a double slash followed by one or more style(s)
			// skip malformed styles, just in case
			let reg = /(\/{0,2}\ ?)?(\[[\s\w\d]*\]\ ?)*([^\[]*)/;
			let match = reg.exec(text);
			return (!!match && !!match[match.length - 1])? match[match.length - 1].trim() : null;
		};

		self.skipThisLine = function(text) {
			if (!!!text) return true;
			text = self.cleanLine(text);
			if (!!!text || text.length == 0) {
				return true;
			}
			else if (text == self.setting('panelSeparator')) {
				return null;
			}
			else return false;
		};

		self.isDoubleBubblePart = function(text) {
			if (!!!text) return false;
			text = text.trim();
			// multi-bubble parts always start with a double-slash "//"
			let reg = /^\/{2}.*$/;
			let match = reg.test(text);
			return !!match;
		};

		self.maybeTypesetToPath = function(typesetObj) {
			let def = $q.defer();
			let tmpObj = angular.copy(typesetObj);
			tmpObj.style.useLayerGroups = self.setting('useLayerGroups');
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