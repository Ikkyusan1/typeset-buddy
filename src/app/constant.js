tb.constant('CONF', {
	appName: appNamePlaceholder, // will be replaced by package.json name when compiled
	debug: appDebugPlaceholder,	// will be true when compiled for dev environment, false otherwise
	version: appVersionPlaceholder // will be replaced when compiled
});