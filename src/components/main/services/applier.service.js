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
