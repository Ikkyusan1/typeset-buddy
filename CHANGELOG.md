### 0.4.2 (2018-10-30)
Fix dimension units.
Improve panel separator detection.
Extend file detection up to 4 parts multi-pages.
Can now replace selected text layers' content with bubble content.


### 0.4.1rc2 (2018-09-16)
Fix redirect properly to last opened tab when on Windows.
Fixed the UI on Windows.
We can collapse the styles to dramatically limit the length of the list.


### 0.4.1rc1 (2018-09-13)
Fix attempt to allow the extension to work on Windows.


### 0.4.0 (2018-09-05)
Can now typeset vertical text.
Sanity checks for page numbers.


### 0.3.3 (2018-05-26)
Fix: properly handle line endings


### 0.3.2 (2018-04-19)
Fix positionning when typesetting a single bubble.
Fix a problem when typesetting when current active layer is empty.
Faster dimensions retrieval.
We're now 65% faster than v0.2.x


### 0.3.1 (2018-04-09)
Fix layer position when using marquee.
Fix page refresh on script reload.
Fix keywords retrieval.
Make bubbles with replaced text visible.
Place typesetted layers closer to the center of the image.
Minor tweaks.


### 0.3.0 (2018-03-24)
Use more ActionDescriptors, typeset actions are now almost twice as fast as before.
New: Spelling/hyphenation language added to the stylesets.
Various fixes.
Double click on bubble content/notes to copy them to clipboard.


### 0.2.1 (2017-11-03)
TB Robot can now be run from the extension.
Can typeset a whole page too, just like tb_robot would do it.


### 0.2.0 (2017-10-01)
New: text replacement functionality.


### 0.1.11 (2017-09-18)
Reworked code structure.
New: typeset-helper is back as a standalone script named tb_robot.


### 0.1.10 (2017-07-30)
Added more standalone scripts.
Some refactoring.


### 0.1.9 (2017-07-30)
Added standalone scripts to allow the user to create Photoshop  actions and associate shortcuts to them.
Minor tweaks.


### 0.1.8 (2017-07-29)
New: Add two buttons on style panel to increase/decrease font size of selected layers.
Use Paul Riggott’s method to retrieve the selected layers. Refactor part of the code.
Selected layers now stay selected when a process has failed.
And some other tweaks.


### 0.1.7 (2017-06-28)
Edge case of styles placed right after the double-slash of a multi-part  bubble.
Display notes even if there’s nothing else on a line.
Dirty trick to handle single word notes.


### 0.1.6 (2017-06-25)
Fix: Correctly apply the leading.
Fix: Load the first page when changing translation script.
New: Multi-bubbles can now be merged to be typesetted as one bubble.
New: Added a copy-to-clipboard button on every bubble content and notes.


### 0.1.5 (2017-05-26)
Bugfixes and error handling.
Use foreground color when applying style.
New: added a button to auto-resize the selected layers.


### 0.1.4 (2017-05-26)
Fix: default styleset definition.
Fix: logic error when saving a set.
New: if a selection marquee is present, typeset inside it.
New: possibility to apply a style to selected layers with or without auto-resizing the textbox.
New: ability to just set a style without typesetting anything.
New: the last opened tab will be automatically selected when opening the extension.


### 0.1.3 (2017-05-01)
Fix: for the layer dimension bug. Damn you, Adobe !
Fix: bug on style set import.
New: added a filter on styles panel.
Changed default panel.
Added some tooltips.
Made the bubbles' text selectable.
Prevent the generation of useless history states.


### 0.1.2 (2017-04-25)
Correction. Gotta get some sleep, bro...


### 0.1.1 (2017-04-25)
We can now apply a style to selected layers.
Corrected a path in gulp task.
Added version number in the compiled script.
Added changelog.


### 0.1.0 (2017-04-23)
Initial release
