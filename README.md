# Typeset Buddy
A typesetting extension for Adobe Photoshop CC. Tested with PS version 2015.5+.

## Installation:
1. Since this extension is not signed (and I don't intend to sign it anytime soon), you'll need to disable the check for signed extensions.
- Win: regedit > ```HKEY_CURRENT_USER/Software/Adobe/CSXS.7```, then add a new entry ```PlayerDebugMode``` of type ```string``` with the value of ```1```.
- Mac: In the terminal, type: ```defaults write com.adobe.CSXS.7 PlayerDebugMode 1```
		(The plist is also located at ~/Library/Preferences/com.adobe.CSXS.7.plist)

2. Download the [latest release](https://github.com/Ikkyusan1/typeset-buddy/releases/latest) and extract the archive in Photoshop's extension folder. It's one of these (create the folders if they don't exist):
- System extension folder
-- Win(x86): C:\Program Files\Common Files\Adobe\CEP\extensions
-- Win(x64): C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
-- Mac: /Library/Application Support/Adobe/CEP/extensions
- Per-user extension folder
-- Win: C:\Users\{USER}\AppData\Roaming\Adobe\CEP/extensions
-- Mac: ~/Library/Application Support/Adobe/CEP/extensions

3. Start Photoshop. You'll find the extension under the menu Windows > Extensions > Typeset Buddy.

