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
		'textOrientation': {
			label: 'Text orientation',
			values: [
				{value: 'HORIZONTAL', label: 'Horizontal', descriptorValue: 'Hrzn', descriptorType: 'char'},
				{value: 'VERTICAL', label: 'Vertical', descriptorValue: 'Vrtc', descriptorType: 'char'}
			],
			def: 'HORIZONTAL'
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
		var regs = [
			/^.*[-_\ ]([\d]{1,4}-[\d]{1,4}-[\d]{1,4}-[\d]{1,4})\.psd$/,
			/^.*[-_\ ]([\d]{1,4}-[\d]{1,4}-[\d]{1,4})\.psd$/,
			/^.*[-_\ ]([\d]{1,4}-[\d]{1,4})\.psd$/,
			/^.*[-_\ ]([\d]{1,4})\.psd$/
		];
		for (var i = 0; i < regs.length; i++) {
			var match = regs[i].exec(filename);
			if (!!match && !!match[1]) {
				return match[1];
			}
		}
		return null;
	},

	getPageNumbers: function(text) {
		var pageNumbers = [];
		var regex = /^(-?((\d{1,4})-*)+)#/gm;
		var match;
		while ((match = regex.exec(text)) !== null) {
			// failsafe to avoid infinite loops with zero-width matches
			if (match.index === regex.lastIndex) regex.lastIndex++;
			pageNumbers.push(match[1]);
		}
		return pageNumbers;
	},

	getPageNumberLine: function(text, pageNumber, offset) {
		if (typeof offset == 'undefined' || Number.isInteger(offset) && offset >= 0) {
			var lines = [];
			var regex = /^(-?((\d{1,4})-*)+)#|(^).*/gm;
			var match;
			while ((match = regex.exec(text)) !== null) {
				if (match.index === regex.lastIndex) regex.lastIndex++;
				lines.push(match[1]);
			}
			for (var i = 0; i < lines.length -1; i++) {
				if (!!lines[i]) {
					if (pageNumber.indexOf('-') > -1) {
						if (pageNumber == lines[i]) {
							if (!!!offset) return i+1;
							else offset--;
						}
					}
					else {
						var tmp = (!!lines[i] && lines[i].indexOf('-') > 0)? lines[i].split('-') : [lines[i]];
						for (var j =0; j < tmp.length; j++) {
							if (pageNumber == tmp[j]) {
								if (!!!offset) return i+1;
								else offset--;
							}
						}
					}
				}
			}
			return null;
		}
		else throw 'Invalid offset';
	},

	checkPageNumbersSeries: function(text, pageNumbers) {
		var self = this;
		var tmp = [];
		var warnings = [];
		var current = null;;
		var next = null;
		var currentLine = null;
		var nextLine = null;
		// split multipages
		pageNumbers.forEach(function(one) {
			if (one.indexOf('-') > -1) {
				var multi = one.split('-');
				// cehck for multiple consecutive dashes, or dash placed either at the beginning or the end of the page number
				if (!multi.every(function(n) {return n != '';})) {
					var line = self.getPageNumberLine(text, one);
					throw 'There\'s an invalid page number : ' + one + '# (line ' + line + ')';
				}
				tmp = tmp.concat(multi);
			}
			else {
				tmp.push(one);
			}
		});
		// check for duplicates
		var tmp2 = [].concat(tmp);
		tmp2 = tmp2.sort();
		for (var i = 0; i < tmp2.length -1; i++) {
			current = tmp2[i];
			next = tmp2[i+1];
			if (current == next) {
				currentLine = self.getPageNumberLine(text, current);
				nextLine = self.getPageNumberLine(text, next, 1);
				throw 'Duplicate page number: ' + current + ' on lines ' + currentLine + ' and ' + nextLine;
			}
		}
		// check for reverse numbering and gaps
		for (var i = 0; i < tmp.length -1; i++) {
			current = tmp[i];
			next = tmp[i+1];
			if (current > next) {
				currentLine = self.getPageNumberLine(text, current);
				nextLine = self.getPageNumberLine(text, next);
				throw 'Some pages are out of order: ' + current + ' (line ' + currentLine + ') appears before ' + next + ' (line '+ nextLine + ')';
			}
			if (parseInt(current) + 1 != parseInt(next)) {
				currentLine = self.getPageNumberLine(text, current);
				nextLine = self.getPageNumberLine(text, next);
				warnings.push('There\'s a gap between page ' + current + ' (line ' + currentLine + ') and page ' + next + ' (line ' + nextLine + ')');
			}
		}
		return warnings.reverse();
	},

	getActualPageCount: function(pageNumbers) {
		var count = 0;
		pageNumbers.forEach(function(one) {
			if (one.indexOf('-') > 0) {
				count += one.split('-').length;
			}
			else {
				count++;
			}
		});
		return count;
	},

	loadPage: function(text, pageNumber) {
		// pageNumber can be a double page, like "006-007"
		// regexp matches are :
		// [0]: the whole match
		// [1]: undefined or a page note. Mainly used to apply a style to a whole page, like [italic]
		// [2]: line ending
		// [3]: the page's bubbles.
		// [4]: start of the next page or end
		var reg = new RegExp('\\b' + pageNumber + '#\\ ?(.*)?(\\r\\n|\\n|\\r)([\\s\\S]*?)($|END#|[\\d-]{3,9}#)');
		var match = reg.exec(text);
		if (!!!match) return null;
		else {
			return {
				wholeMatch: match[0],
				pageNote: match[1],
				lineEnding: match[2],
				rawBubbles: match[3],
				next: match[4]
			}
		}
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
		else if (text.length == panelSeparator.length) {
			for(var i = 0; i < panelSeparator.length; i++) {
				if (text.charCodeAt(i) != panelSeparator.charCodeAt(i)) {
					return false;
				}
			}
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
