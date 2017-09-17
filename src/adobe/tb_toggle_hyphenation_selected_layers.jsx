#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('toggleHyphenationSelectedLayers');
if (res != 'done') alert(res);
