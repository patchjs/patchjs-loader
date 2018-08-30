!function(){"use strict";function t(){this.queue=[]}function e(t){this.url=t.url,this.onLoad=t.onLoad,this.code=null,this.reqUrl=null,this.ready=!1,this.complete=!1,this.fromCache=!1}function r(t,e){for(var r in e)t[r]=e[r];return t}function n(t,e){if(t&&/\S/.test(t)){var r="script";/\.css$/.test(e)&&(r="style");var n=document.createElement(r),i=document.createTextNode(t);n.appendChild(i),document.head.appendChild(n)}}function i(t,e,r){var n=new XMLHttpRequest;return n.open("GET",t,!0),e&&(n.withCredentials=!0),n.onreadystatechange=function(){if(4===n.readyState){var s=/-\d+\.\d+\.\d+/,a=s.test(t);if(200===n.status||304===n.status)r(n.responseText,a);else{if(404!==n.status)throw new Error("status: "+n.status+", statusText:"+n.statusText+", url: "+t);if(!a)throw new Error("url not found: "+t);i(t.replace(s,""),e,r)}}},n.send(null)}var s={cache:!1,increment:!1,diffCount:5,env:"",xhrWithCrediential:!1};t.prototype={push:function(t){t.url?this.queue.push(t):t.wait&&this.queue.push(r(t,{complete:!1}))},update:function(t,e){for(var n=0,i=this.queue.length;n<i;n++){var s=this.queue[n];if(s.url===t){r(s,e);break}}this.roll()},roll:function(){for(var t=0,e=0,r=this.queue.length;t<r;t++){var i=this.queue[t];if(i.complete)e++;else if(i.ready&&(n(i.code,i.reqUrl),i.onLoad&&i.onLoad(i.reqUrl,i.fromCache),i.complete=!0,e++),i.wait){if(t!==e)break;"[object Function]"===Object.prototype.toString.call(i.wait)&&i.wait(),i.complete=!0,e++}}}},patchjs.config=function(e){this.options=e||{};for(var r in s)s.hasOwnProperty(r)&&(this.options[r]=this.options[r]||s[r]);return this.assetsManager=new t,this},patchjs.load=function(t,r){return r&&(r=r.bind(this)),this.assetsManager.push(new e({url:t,onLoad:r})),this.req(t),this},patchjs.req=function(t){var e=this.options,r=e.env+e.path+t,n=this;this.cache.get(r,function(s){s=s||{};var a=s.version,o=s.code;if(e.cache&&a===e.version&&o){var c=n.combineReqUrl(t,!1);n.assetsManager.update(t,{ready:!0,code:o,reqUrl:c,fromCache:!0})}else{var u=e.cache&&e.increment&&o&&n.withinCertainDiffRange(a),h=n.combineReqUrl(t,u,a);i(h,e.xhrWithCredentials,function(i,s){if(s){var a=JSON.parse(i),c=a.c;o=a.m?n.mergeCode(o,a.l,c):o}else o=i;n.assetsManager.update(t,{ready:!0,code:o,reqUrl:h}),e.cache&&n.cache.set(r,{code:o,version:e.version},function(t,i){if(!t){n.cache.remove(r);var s=e.exceedQuotaErr;s&&s.call(n,h,i)}})})}})},patchjs.wait=function(t){return t&&(t=t.bind(this)),this.assetsManager.push({wait:t||!0}),this},patchjs.withinCertainDiffRange=function(t){if(t){var e=/(\d+)\.(\d+)\.(\d+)/,r=this.options.version.match(e),n=t.match(e);if(r[1]===n[1]&&r[2]===n[2]&&0<r[3]-n[3]&&r[3]-n[3]<this.options.diffCount)return!0}return!1},patchjs.combineReqUrl=function(t,e,r){if(e&&r){var n=t.substring(t.lastIndexOf("."));t=t.replace(new RegExp(n+"$","i"),"-"+r+n)}var i=this.options;return i.path+i.version+"/"+t},patchjs.mergeCode=function(t,e,r){for(var n="",i=0,s=r.length;i<s;i++){var a=r[i];if("[object String]"===Object.prototype.toString.call(a))n+=a;else{var o=a[0]*e,c=a[1]*e;n+=t.substr(o,c)}}return n},patchjs.Asset=e,patchjs.AssetsManager=t}();