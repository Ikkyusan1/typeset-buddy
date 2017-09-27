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

	getDummyStyle: function(keyword) {
		var dummy = {};
		for (var prop in tbHelper.styleProps) {
			dummy[prop] = tbHelper.styleProps[prop].def;
		}
		if (!!keyword) dummy.keyword = keyword;
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
