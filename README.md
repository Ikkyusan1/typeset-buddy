# Typeset Buddy
A typesetting extension for Adobe Photoshop CC. Tested with PS version 2015.5+.

## Installation:
1. Disable signed extension check
	Since this extension is not signed (and I don't intend to sign it anytime soon), you'll need to disable the check for signed extensions.
	• Win: regedit > ```HKEY_CURRENT_USER/Software/Adobe/CSXS.7```, then add a new entry ```PlayerDebugMode``` of type ```string``` with the value of ```1```.
	• Mac: In the terminal, type: ```defaults write com.adobe.CSXS.7 PlayerDebugMode 1```
		(The plist is also located at ~/Library/Preferences/com.adobe.CSXS.7.plist)

2. Extension folder
	Extension are installed in one of these (create the folders if they don't exist):
		• System extension folder
			o Win(x86): C:\Program Files\Common Files\Adobe\CEP\extensions
			o Win(x64): C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
			o Mac: /Library/Application Support/Adobe/CEP/extensions
		• Per-user extension folder
			o Win: C:\Users\{USER}\AppData\Roaming\Adobe\CEP/extensions
			o Mac: ~/Library/Application Support/Adobe/CEP/extensions

3. Download the [latest release](https://github.com/Ikkyusan1/typeset-buddy/releases/latest) and extract the archive in Photoshop's extension folder.
