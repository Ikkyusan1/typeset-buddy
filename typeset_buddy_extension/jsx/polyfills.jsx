// polyfills and helper functions

/* JSON2.JS from https://github.com/douglascrockford/JSON-js */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?i+"":"null";case"boolean":case"null":return i+"";case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

Array.prototype.indexOf||(Array.prototype.indexOf=function(i,e){var r=this.length>>>0;if((e|=0)<0)e=Math.max(r-e,0);else if(e>=r)return-1;if(void 0===i){do{if(e in this&&void 0===this[e])return e}while(++e!==r)}else do{if(this[e]===i)return e}while(++e!==r);return-1});

Array.prototype.find||(Array.prototype.find=function(r){if(null===this)throw new TypeError("Array.prototype.find called on null or undefined");if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var t,n=Object(this),e=n.length>>>0,o=arguments[1],i=0;i<e;i++)if(t=n[i],r.call(o,t,i,n))return t});

Array.prototype.findIndex||(Array.prototype.findIndex=function(r){if(null===this)throw new TypeError("Array.prototype.findIndex called on null or undefined");if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var n,e=Object(this),t=e.length>>>0,o=arguments[1],i=0;i<t;i++)if(n=e[i],r.call(o,n,i,e))return i;return-1});

Array.prototype.map||(Array.prototype.map=function(r){var t,n,o;if(null==this)throw new TypeError("this is null or not defined");var e=Object(this),i=e.length>>>0;if("function"!=typeof r)throw new TypeError(r+" is not a function");for(arguments.length>1&&(t=arguments[1]),n=new Array(i),o=0;o<i;){var a,p;o in e&&(a=e[o],p=r.call(t,a,o,e),n[o]=p),o++}return n});

Array.isArray||(Array.isArray=function(r){return"[object Array]"===Object.prototype.toString.call(r)});

String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});

function isNumber(i){return!isNaN(parseFloat(i))&&isFinite(i)}

function clone(e){if(null===e||"object"!=typeof e)return e;var n;if(e instanceof Date)return(n=new Date).setTime(e.getTime()),n;if(e instanceof Array){n=[];for(var t=0,r=e.length;t<r;t++)n[t]=clone(e[t]);return n}if(e instanceof Object){n={};for(var o in e)e.hasOwnProperty(o)&&(n[o]=clone(e[o]));return n}throw new Error("Unable to copy obj! Its type is not supported.")}

function unique(n){var u,l={},r=[],e=n.length;for(u=0;u<e;++u)l[n[u]]=null;for(u in l)r.push(u);return l=null,r}

function range(r,n,u){for(var a=[r],e=r;e<n;)e+=u,a.push(e);return a}

var psdFilter, txtFilter, jsonFilter;
var os = $.os.toLowerCase().indexOf('mac') >= 0 ? 'Mac' : 'Windows';
if (os === 'Windows') {
	psdFilter = 'Adobe PSD:*.psd';
	txtFilter = 'Text File:*.txt';
	jsonFilter = 'JSON File:*.json';
}
else {
	psdFilter = function(filename) { return fileFilter(filename, ['psd']); }
	txtFilter = function(filename) {	return fileFilter(filename, ['txt']);	}
	jsonFilter = function(filename) {	return fileFilter(filename, ['json']); }
}

function fileFilter(filename, extensions) {
	if (filename instanceof Folder) return true;
	var dot = filename.toString().lastIndexOf('.');
	if (dot == -1) return false;
	var extension = filename.toString().substr(dot + 1, filename.toString().length - dot);
	extension = extension.toLowerCase();
	for (var i = 0; i < extensions.length; i++) {
		if (extension ==  extensions[i]) return true;
	}
	return false;
}
