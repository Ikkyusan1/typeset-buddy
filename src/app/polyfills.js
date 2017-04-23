'use strict';
// polyfill array.prototype.find()
if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		let list = Object(this);
		let length = list.length >>> 0;
		let thisArg = arguments[1];
		let value;
		for (let i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}
// polyfill array.prototype.findIndex()
if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function(predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		let list = Object(this);
		let length = list.length >>> 0;
		let thisArg = arguments[1];
		let value;
		for (let i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return i;
			}
		}
		return -1;
	};
}