# Typeset Buddy
A typesetting extension for Adobe Photoshop CC. Tested with PS version 2015.5+.

## Installation:
1. Download the [latest release](https://github.com/Ikkyusan1/typeset-buddy/releases/latest) and extract the archive in Photoshop's extension folder. It's one of these (create the folders if they don't exist):
- System extension folder
  - Win(x86): C:\Program Files\Common Files\Adobe\CEP\extensions
  - Win(x64): C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
  - Mac: /Library/Application Support/Adobe/CEP/extensions
- Per-user extension folder
  - Win: C:\Users\{USER}\AppData\Roaming\Adobe\CEP/extensions
  - Mac: ~/Library/Application Support/Adobe/CEP/extensions

2. Start Photoshop. You'll find the extension under the menu Window > Extensions > Typeset Buddy.

The disabling of the check for signed extensions is not necessary anymore for this extension. Disabling the check was done this way :
- Win: regedit > ```HKEY_CURRENT_USER/Software/Adobe/CSXS.7```, then add a new entry ```PlayerDebugMode``` of type ```string``` with the value of ```1```.
- Mac: In the terminal, type: ```defaults write com.adobe.CSXS.7 PlayerDebugMode 1```
		(The plist is also located at ~/Library/Preferences/com.adobe.CSXS.7.plist)

To re-enable the check, just put a value of 0 instead of 1.

## Translation script format
### Page numbers
- They must be written on three or four digits.
- They must be followed by a # character.
- Double-pages are numbered like this : ```010-011#```
- The end of the script is marked by the anchor ```END#```
- The working script is what's between the first page number anchor ```XXX#``` and ```END#```
- Text before and after these anchors will not be taken into account, so it's a good place to add translation notes and whatnot.

### Bubbles
- The rule is one bubble per line. In other words, bubbles are separated by a carriage return.
- Some lines can be ignored. For instance, to keep the script readable, empty lines are used to lighten the text. Also, sometimes it can be useful to separate the panels. In which case, the line must contain only the separation symbol (one of these : long dash, single dash, double dash or equal sign).
- The parts of a multi-bubble are considered to be different bubbles. But, we still need to know when a line is part of a multi-bubble. For this, we put a double slash at the beginning of the following parts. e.g. :
```
This is the first part of the multi-bubble.
// This line corresponds to the second part of the multi-bubble.
```
- When a page doesn't contain any text, or at least, nothing to be typesetted, you can make the script skip it using one of the empty page keywords (one of these: blank, empty, no_text). Between brackets, as usual. It must the first text of the page. Meaning, you can add a whole essay after that, it won't be typesetted.


### Styles and text type/placement
The text type (or placement) defines the nature of the text line. The text can be in a bubble, it can be not in a bubble (like some narrative stuff), it can be a sfx, or a sfx in a bubble, or a footnote...
Based on this, not only does the text type give us typesetters a clue as to where the text has to be inserted on the page, it also tells us what style should be applied.

Thus, text types/placements are actually text styles.

- They must be written between square brackets, like so : ```[italic]```
- They can be written at the beginning or just after a line. e.g. :
```
[nib] This text is not in a bubble.
This bubble should be in italic. [italic]
```
- Usually, the text type should be placed at the beginning of the line, not the end.
- Usually, the style should be added at the end of the line, not the beginning.
- There can be several styles defined for a single line. This gives some choice to the typesetter. Usually, the last defined style will be applied. e.g :
```
[nib] This text is supposed to be not in a bubble, and styled with a bold style. [bold]
```
- A style can be defined for a whole page. In which case, add the style right after the page number :
```
035# [shout]
All the bubbles will be written in "bolditalic style"
```
- It is possible to override this "page style" by adding the style at the beginning or the end of the line.
- What about the multi-bubbles ? Almost the same principle. The sister parts will inherit the style of the ***previous part***. You can of course override the style of each part of the bubble. e.g. :
```
This first part is a shout bubble. [shout]
// Second part will inherit the previous style.
// But we want the third part to be written in italic. [italic]
```


### Notes
Basically, notes are everything that doesn't correspond to the styles' keywords.
- They must be written between *TWO* square brackets.
- They must not contain any carriage return.
- They must be placed at the end of a line, ideally after the styles. e.g. :
```
Blah blah blah, Mr Freeman. [bold] [[Everything that's between these brackets won't be typesetted]]
```
You can add as many notes as you want. Just as a style can be defined for a whole page, you can have a note for a whole page too.
