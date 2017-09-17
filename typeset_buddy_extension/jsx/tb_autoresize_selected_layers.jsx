#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('autoResizeSelectedLayers');
if (res != 'done') alert(res);
