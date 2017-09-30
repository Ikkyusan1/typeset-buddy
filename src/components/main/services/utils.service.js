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
