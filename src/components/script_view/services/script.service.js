tb.factory('ScriptService', ['$rootScope', '$localStorage', '$q', 'StylesService', 'Utils',
	function($rootScope, $localStorage, $q, StylesService, Utils) {
		var self = this;

		self.init = function() {
			$rootScope.log('$localStorage', $localStorage);
			self.emptyPage = ['blank', 'empty', 'no_text'];
			self.doubleBubbleSplitter = '//';

			if (!angular.isDefined($localStorage.panelSeparator)) self.panelSeparator('–');
			if (!angular.isDefined($localStorage.useLayerGroups)) self.useLayerGroups(true);

			if (!angular.isDefined($localStorage.lastOpenedScript)) {
			 $localStorage.lastOpenedScript = '';
			}
		};

		self.lastOpenedScript = function(filepath) {
			if (angular.isDefined(filepath)) $localStorage.lastOpenedScript = filepath;
			return $localStorage.lastOpenedScript;
		};

		self.lastOpenedPage = function(pageNumber) {
			if (angular.isDefined(pageNumber)) $localStorage.lastOpenedPage = pageNumber;
			return $localStorage.lastOpenedPage;
		};

		self.lastDestinationFolder = function(folderPath) {
			if (angular.isDefined(folderPath)) $localStorage.lastDestinationFolder = folderPath;
			return $localStorage.lastDestinationFolder;
		};

		self.panelSeparator = function(panelSeparator) {
			if (angular.isDefined(panelSeparator)) $localStorage.panelSeparator = panelSeparator;
			return $localStorage.panelSeparator;
		};

		self.useLayerGroups = function(useLayerGroups) {
			if (angular.isDefined(useLayerGroups)) $localStorage.useLayerGroups = !!useLayerGroups;
			return $localStorage.useLayerGroups;
		};

		self.skipSfx = function(skip) {
			if (angular.isDefined(skip)) $localStorage.skipSfx = !!skip;
			return $localStorage.skipSfx;
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
			let reg = /\[(\w+)\]/g;
			let match = reg.exec(text);
			if (!!match && !!match[1]) {
				reg.lastIndex = 0;
				let styles = [];
				while ((match = reg.exec(text)) !== null) {
					if (match.index === reg.lastIndex) {
						reg.lastIndex++;
					}
					styles.push(match[1].toLowerCase());
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
			let reg = /(\[[\s\w\d]*\]\ ?)*(\/{0,2})([^\[]*)/;
			let match = reg.exec(text);
			return (!!match && !!match[match.length - 1])? match[match.length - 1].trim() : null;
		};

		self.skipThisLine = function(text, panelSeparator) {
			if (!!!text) return true;
			text = self.cleanLine(text);
			if (!!!text || text.length == 0) {
				return true;
			}
			else if (text == self.panelSeparator()) {
				return null;
			}
			else return false;
		};

		self.isDoubleBubblePart = function(text) {
			if (!!!text) return false;
			text = text.trim();
			let reg = /^\/{2}.*$/;
			let match = reg.test(text);
			return !!match;
		};

		self.typeset = function(typesetObj) {
			let def = $q.defer();
			$rootScope.$root.CSI.evalScript('typesetEX(' + JSON.stringify(typesetObj) + ')', function(res) {
				if(res === 'done') {
					def.resolve();
				}
				else{
					$rootScope.log('Typeset Error', res);
					def.reject(res)
				}
			});
			return def.promise;
		};


		self.init();
		return self;
	}
]);