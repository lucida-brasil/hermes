"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function f(e){var r=e.toLowerCase().replace("table:","").trim(),l=_fs2["default"].readFileSync(r,"utf-8");return csv2json(l)}function csv2json(e){e=_replaceAll2["default"](e,"\r","");for(var r=[],l=e=e.split("\n"),t=0;t<l.length;t++)l[t]=l[t].split(";");for(var a=l.shift(),t=0;t<a.length;t++)0===a[t].indexOf("?")&&(a[t]=a[t].replace("?",""));for(var u=0;u<l.length;u++){for(var n=l[u],o=void 0,s={},t=0;t<a.length;t++)n[t]&&(o=a[t],s[o]=n[t],0===n[t].indexOf("table:")&&(s[o]=f(s[o])));r.push(s)}return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=csv2json;var _fs=require("fs"),_fs2=_interopRequireDefault(_fs),_replaceAll=require("./replace-all"),_replaceAll2=_interopRequireDefault(_replaceAll);module.exports=exports["default"];