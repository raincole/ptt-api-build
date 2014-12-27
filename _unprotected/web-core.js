function parseFromString(t){var e=document.implementation.createHTMLDocument("");return e.body.innerHTML=t,e}function parseTitle(t){return t.match(/\[(.+)\](.*)/)?t.match(/\[(.+)\](.*)/).slice(1):[null,t]}function getTail(t){return t?t.substring(0,78).match(/ *$/)[0]:""}function getHead(t){return t?t.substring(0,78).match(/^ */)[0]:""}function reformatContent(t){if(0===t.length)return"";for(var e="",r=0;r<t.length;r++){var n=!0,o=t[r+1],a=t[r],s=t[r-1];if(void 0!==o&&0!==o.removeSpace().length){var u=getTail(s),i=getTail(a);getTail(o);var l=getHead(a),c=getHead(o);u&&u.length+l.length<2&&(n=!1),u&&Math.abs(u.length-i.length)<=2&&l.length==c.length&&a.match(/.*[a-zA-Z]$/)&&(n=!1);var p=/(,|[^.]\.|!|\?|:|;|\(|\)|，|。|！|？|：|；|『|』|「|」|（|）|—)\s*$/,h=a.substring(0,78).match(p);null!==h&&l.length<2&&(e=e.replace(p,"$1"),n=!1),a.match(/^\s*\w/)&&o.match(/\w\s*$/)&&(n=!0)}e+=t[r].stripSpace(),n===!0&&(e+="\n")}return e}function parseQuotesAndReformatContent(t){function e(){r.push({blockType:"content",type:o.type,text:reformatContent(o.texts)})}for(var r=[],n=t,o={type:"normal",texts:[]},a=0;a<n.length;a++)if(void 0!==n[a]&&-1===n[a].indexOf("瀏覽 第")){if(":"===n[a][0]||"※"===n[a][0])var s="quote",u=n[a].substr(1);else var s="normal",u=n[a];console.log(s),console.log(n[a]),console.log(o.type),o.type!==s?(e(),o={type:s,texts:[u]}):0===n[a].removeSpace().length?(e(),o={type:"normal",texts:[]}):o.texts.push(u)}return r=r.filter(function(t){return""!==t.text})}function viewerSignForCount(t){return 100>t?"count":1e3>t?"hot":2e3>t?"white":5e3>t?"red":1e4>t?"blue":3e4>t?"cyan":6e4>t?"green":1e5>t?"yellow":"purple"}function AIDu(t,e,r){function n(t,e){for(var r="",n=0;n<e-t.length;n++)r="0"+r;return r+t}var o="";return"M"===t?o=o+="0000":"G"===t&&(o=o+="0001"),o+=n(parseInt(e).toString(2),32),o+=n(parseInt(r,16).toString(2),12)}function AIDc(t){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),r=e[parseInt(t.substr(0,6),2)]+e[parseInt(t.substr(6,6),2)]+e[parseInt(t.substr(12,6),2)]+e[parseInt(t.substr(18,6),2)]+e[parseInt(t.substr(24,6),2)]+e[parseInt(t.substr(30,6),2)]+e[parseInt(t.substr(36,6),2)]+e[parseInt(t.substr(42,6),2)];return r}function fileNameToAID(t){var e=t.match(/^(M|G)\.(\d+)\.A(?:\.([0-9A-F]{3}))?/);return AIDc(AIDu(e[1],e[2],e[3]))}function AIDtoFileName(t){function e(t,e){for(var r="",n=0;n<e-t.length;n++)r="0"+r;return r+t}for(var r="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),n={},o=0;o<r.length;o++)n[r[o]]=e(o.toString(2),6);var a=n[t[0]]+n[t[1]]+n[t[2]]+n[t[3]]+n[t[4]]+n[t[5]]+n[t[6]]+n[t[7]];return(0==parseInt(a.substr(0,4),2)?"M":"G")+"."+e(parseInt(a.substr(4,32),2).toString(),10)+".A."+e(parseInt(a.substr(36,12),2).toString(16).toUpperCase(),3)}String.prototype.removeSpace=function(){return this.replace(/\s/g,"")},String.prototype.removeTailingSpace=function(){return this.replace(/\s+$/g,"")},String.prototype.removeHeadingSpace=function(){return this.replace(/\s([^\s])/g,function(t,e){return e})},String.prototype.stripSpace=function(){return this.replace(/(^\s+)|(\s+$)/g,"")},String.prototype.fixFullWidthCharacters=function(){return this.replace(/ ([\u0080-\uffff])/g,"$1")},HTMLDocument.prototype.parseHotBoards=function(){function t(t){return t.match(/\[(.+)\](.*)/)?t.match(/\[(.+)\](.*)/).slice(1):[null,t]}for(var e=this.querySelectorAll("table tr"),r=[],n=0;n<e.length;n++){var o=e[n],a=o.cells[2].textContent.trim(),s=t(a),u=o.cells[0].textContent.replace("人氣：",""),i={name:o.cells[1].textContent.trim(),tag:s[0]?s[0].trim():"",title:s[1]?s[1]:"",viewerSign:viewerSignForCount(parseInt(u)),viewerCount:parseInt(u),isAccessible:!0};r.push(i)}return r},HTMLDocument.prototype.parseBoard=function(){function t(t){for(var e,r=t.querySelectorAll(".btn.wide"),n=0;n<r.length;n++)-1!==r[n].textContent.search("上頁")&&(e=r[n].href.match(/index(\d+)/)[1]);return e}for(var e=this.querySelectorAll(".r-ent"),r=[],n=t(this),o=0;o<e.length;o++){var a=e[o],s={author:a.querySelector(".meta .author").textContent,type:"normal",status:"unread",pagingAnchor:parseInt(n),pinned:!1,dateWithoutYear:a.querySelector(".meta .date").textContent},u=a.querySelector("a");if(u){var i=a.querySelector(".nrec").textContent;s.score="爆"===i?100:"X"===i[0]&&"X"!==i[1]?10*-parseInt(i[1]):"XX"===i?-100:""===i?0:parseInt(i),s.url="http://www.ptt.cc"+u.href,s.id="#"+fileNameToAID(s.url.match(/\/bbs\/[a-zA-Z0-9\-_]+\/(.*)/)[1]);var l=a.querySelector(".title").textContent.trim(),c=parseTitle(l);s.title=c[1].trim(),s.tag=c[0]?c[0]:"","Re:"===l.substr(0,3)&&(s.type="reply"),r.push(s)}}return r},HTMLDocument.prototype.parseArticle=function(){function t(t,e,n,o){r.push({blockType:"comment",type:t,author:e,content:n.removeTailingSpace(),datetime_without_year:o||null})}function e(e,r){t("authorComment",s.author,e,r)}var r=[],n=this.getElementById("main-content").childNodes,o=new Date(n[3].textContent.substr(2)),a=new Date(o.getTime()+288e5);date=a.toISOString();for(var s={blockType:"metadata",author:n[0].textContent.substr(2).match(/(.+)\((.*)\)/)[1],authorNickname:n[0].textContent.substr(2).match(/(.+)\((.*)\)/)[2],date:date},u=[],i=4;i<n.length;i++){var l=n[i].textContent.removeTailingSpace().split("\n");if(Array.prototype.push.apply(u,l),-1!==n[i].textContent.search("※ 發信站")){u.pop(),s.url=n[i+1].querySelector("a").href;break}}r.push(s),Array.prototype.push.apply(r,parseQuotesAndReformatContent(u));for(var c=!1,i=0;i<n.length;i++){var p=n[i];if(p.innerHTML)if(p.classList){var h=p.classList;if(h.contains("push")){var g,f=p.querySelector(".push-tag").textContent;"→ "===f?g="neutral":"噓 "===f?g="dislike":"推 "===f&&(g="like");var m=p.querySelector(".push-userid").textContent,y=p.querySelector(".push-content").textContent.substr(2),v=p.querySelector(".push-ipdatetime").textContent.trim();m===s.author?e(y,v):t(g,m,y,v)}}else c?e(p.nodeValue):c=!0}return r};