
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

		self.init = function() {
			body.classList.add('os-'+ $rootScope.os.toLowerCase());
			// add event listener to change skin whenever Photoshop's skin changes
			self.updateThemeWithAppSkinInfo($rootScope.CSI.hostEnvironment.appSkinInfo);
			$rootScope.CSI.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, self.onAppThemeColorChanged);
		};

		return self;
	}
]);
