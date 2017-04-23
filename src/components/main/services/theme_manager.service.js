
tb.factory('themeManager', ['$rootScope', 'Utils',
	function($rootScope, Utils) {
		var self = this;

		self.updateThemeWithAppSkinInfo = function(appSkinInfo) {
			let panelBgColor = appSkinInfo.panelBackgroundColor.color;
			let bgColor = Utils.colorToHex(panelBgColor);
			let fontColor = 'F0F0F0';
			let isLight = panelBgColor.red >= 122;
			if (isLight) {
				fontColor = '000000';
				$('#theme').attr('href', 'css/topcoat-desktop-light.css');
				$('body').removeClass('dark');
				$('body').addClass('light');
			}
			else {
				$('#theme').attr('href', 'css/topcoat-desktop-dark.css');
				$('body').removeClass('light');
				$('body').addClass('dark');
			}
			$('body').css('background-color', '#' + bgColor);
			$('body').css('color', '#' + fontColor);
		}

		self.onAppThemeColorChanged = function(event) {
			let skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
			self.updateThemeWithAppSkinInfo(skinInfo);
		}

		// add event listener to change skin whenever Photoshop's skin changes
		self.init = function() {
			self.updateThemeWithAppSkinInfo($rootScope.CSI.hostEnvironment.appSkinInfo);
			$rootScope.CSI.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, self.onAppThemeColorChanged);
		}

		return self;
	}
]);


