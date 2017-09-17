#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('toggleFauxItalicSelectedLayers');
if (res != 'done') alert(res);
