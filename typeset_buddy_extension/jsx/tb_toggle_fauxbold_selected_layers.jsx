#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('toggleFauxBoldSelectedLayers');
if (res != 'done') alert(res);
