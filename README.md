# Typeset Buddy
A typesetting tool for Adobe Photoshop.
The extension will work on PS version 2015.5+. The standalone scripts should work on PS CS5+.


### What it can do :
- hopefully help you during your typesetting sessions.
- allow you to manage style sets. You can create presets for your projects and export/import them as json files.
- analyze a translation script and prepare all the styles used within it (provided you followed the translation script rules).
- display a translation script, page by page, in a comprehensive way (provided you followed the translation script rules).
- typeset text in one click, with the style you defined. No more copy/pasta.
- typeset text in a selection marquee.
- apply a style to selected text layers.
- increase/decrease font size and autoresize selected layers (via button click or standalone script execution).
- perform customizable text replacement.
- automatically typeset psd files (via a standalone script).


### What it *can't* do :
- automate the whole typesetting process.
- make you more attractive than you already are.


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

If you just want to use the standalone scripts (for instance, if you don't have PS CC), only the "jsx" folder is necessary. You can copy (and rename) it wherever you want.


## Potential issues :
- Text encoding : the extension expects files encoded in UTF8. So to avoid encoding problems (accented characters, etc, ...), please encode your translation scripts and style set files in UTF8.
- Beware of smart quotes and other exotic characters : some fonts don't have smart quotes (or tilde, ellipsis, etc...), resulting in missing glyphs or poor subsitutions when the text is inserted. If needed, use text replacement rules to change these characters to more regular ones. If you still have problems with smart quotes after that, you can disable them entirely in Photoshop's Preferences > Type.


## Known limitations :
- Font size adjustment using the extension's functions won't work correctly on text layers that have been "transformed". By "transformed", I mean text layers on which the textbox size has been changed using the transform controls (texbox size and text size is changed at the same time when doing so).


## Standalone scripts
There's currently no practical way to associate keyboard shortcuts to an HTML extension (we can hijack keypress events, but only when the extension is displayed and focused). So, in order to allow the use of some basic functions without having to click on a button (or even having the extension opened, for that matter) I've added some standalone scripts. You can find them in the "jsx/" folder. The available scripts are :
- tb_autoresize_selected_layers.jsx
- tb_decrease_font_size_selected_layers.jsx
- tb_increase_font_size_selected_layers.jsx
- tb_round_font_size_selected_layers.jsx
- tb_toggle_fauxbold_selected_layers.jsx
- tb_toggle_fauxitalic_selected_layers.jsx
- tb_toggle_hyphenation_selected_layers.jsx
- tb_robot.jsx

This way you can create a Photoshop Action to run these scripts and associate a keystroke to the action. (Running a script is done via the app menu File > Scripts > Browse...)


## TB Robot
The tb_robot.jsx standalone script is designed to automatically typeset psd files. It won't put the text inside the bubbles, but it will create all the text layers and apply the relevant styles on them. If you don't have PS CC, look at the provided example to create your stylesets. The robot has a button to export the expected style properties and their values, as well as the list of the fonts that are available on your system.
Quick note : keep in mind that if several styles are defined for a bubble, the robot will use only the last one for the typesetting.


## Style set format
If you don't (or can't) use the TB Extension and have to create your style set files manually, the basic rules are :
- it's a JSON file.
- it must be encoded in UTF8.
- the style set must have a name.
- the style set must have an array of styles.
- the style set must contain one (and only one) style with the keyword "default_style".
- a style set can't have duplicate styles (in other words : can't have two styles with the same keyword).
- the fontName property of each style actually corresponds to the font's postScriptName in Photoshop.


## Text replace rules format
If you don't (or can't) use the TB Extension and have to create your text replace rules manually, look at the provided example. You can use regular expressions or simple strings.


## PSD file naming convention
The files (aka the pages) must be numbered to be processed with TB Robot. The page number is the last part of the filename (before the extension, of course). It must be preceded with a space, or an hyphen, or an underscore. Double pages are allowed, their number is separated by an hyphen. Each page number is three or four digits long. e.g. :
```
your-awesome-book_009.psd
your-awesome-book-010.psd
your-awesome-book 011.psd
your-awesome-book_012-013.psd
your-super-long-book_2048-2049.psd
```


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
- When a page doesn't contain any text, or at least, nothing to be typesetted, you can make the script skip it using one of the empty page keywords (one of these: blank, empty, no_text). Between brackets, as usual. It must the first text of the page. Meaning, you can add a whole essay after that, it won't be taken into account.


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
035# [bolditalic]
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
