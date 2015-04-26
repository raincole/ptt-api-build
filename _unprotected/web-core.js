(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){WebCore=require("./web_core")},{"./web_core":2}],2:[function(require,module,exports){var cheerio=require("cheerio");function parseFromString(html){var doc=document.implementation.createHTMLDocument("");doc.body.innerHTML=html;return doc}function parseTitle(string){if(string.match(/\[(.+)\](.*)/)){return string.match(/\[(.+)\](.*)/).slice(1)}else{return[null,string]}}function getTail(str){return str?str.substring(0,78).match(/ *$/)[0]:""}function getHead(str){return str?str.substring(0,78).match(/^ */)[0]:""}String.prototype.removeSpace=function(){return this.replace(/\s/g,"")};String.prototype.removeTailingSpace=function(){return this.replace(/\s+$/g,"")};String.prototype.removeHeadingSpace=function(){return this.replace(/\s([^\s])/g,function(m,p1){return p1})};String.prototype.stripSpace=function(){return this.replace(/(^\s+)|(\s+$)/g,"")};String.prototype.fixFullWidthCharacters=function(){return this.replace(/ ([\u0080-\uffff])/g,"$1")};function reformatContent(rawContentLines){if(rawContentLines.length===0)return"";var content="";for(var i=0;i<rawContentLines.length;i++){var breakline=true;var nextLine=rawContentLines[i+1];var thisLine=rawContentLines[i];var prevLine=rawContentLines[i-1];if(nextLine!==undefined&&nextLine.removeSpace().length!==0){var prevTail=getTail(prevLine);var thisTail=getTail(thisLine);var nextTail=getTail(nextLine);var thisHead=getHead(thisLine);var nextHead=getHead(nextLine);if(prevTail&&prevTail.length+thisHead.length<2)breakline=false;if(prevTail&&Math.abs(prevTail.length-thisTail.length)<=2&&thisHead.length==nextHead.length&&thisLine.match(/.*[a-zA-Z]$/))breakline=false;var endCommaPattern=/(,|[^.]\.|!|\?|:|;|\(|\)|，|。|！|？|：|；|『|』|「|」|（|）|—)\s*$/;var endWithComma=thisLine.substring(0,78).match(endCommaPattern);if(endWithComma!==null&&thisHead.length<2){content=content.replace(endCommaPattern,"$1");breakline=false}if(thisLine.match(/^\s*\w/)&&nextLine.match(/\w\s*$/))breakline=true}content+=rawContentLines[i].stripSpace();if(breakline===true)content+="\n"}return content}function parseQuotesAndReformatContent(rawContentLines){var content=[];var lines=rawContentLines;var currentChunk={type:"normal",texts:[]};function addContent(){content.push({blockType:"content",type:currentChunk.type,text:reformatContent(currentChunk.texts)})}for(var i=0;i<lines.length;i++){if(lines[i]===undefined)continue;if(lines[i].indexOf("瀏覽 第")!==-1)continue;if(lines[i][0]===":"||lines[i][0]==="※"){var type="quote";var text=lines[i].substr(1)}else{var type="normal";var text=lines[i]}if(currentChunk.type!==type){addContent();currentChunk={type:type,texts:[text]}}else if(lines[i].removeSpace().length===0){addContent();currentChunk={type:"normal",texts:[]}}else{currentChunk.texts.push(text)}}content=content.filter(function(c){return c.text!==""});return content}function viewerSignForCount(count){if(count<100){return"count"}else if(count<1e3){return"hot"}else if(count<2e3){return"white"}else if(count<5e3){return"red"}else if(count<1e4){return"blue"}else if(count<3e4){return"cyan"}else if(count<6e4){return"green"}else if(count<1e5){return"yellow"}else{return"purple"}}function AIDu(info,v1,v2){function fillupToBits(raw,num){var prefix="";for(var i=0;i<num-raw.length;i++){prefix="0"+prefix}return prefix+raw}var s="";if(info==="M"){s=s+="0000"}else if(info==="G"){s=s+="0001"}s=s+fillupToBits(parseInt(v1).toString(2),32);s=s+fillupToBits(parseInt(v2,16).toString(2),12);return s}function AIDc(uncompressed){var mapping="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split("");var result=mapping[parseInt(uncompressed.substr(0,6),2)]+mapping[parseInt(uncompressed.substr(6,6),2)]+mapping[parseInt(uncompressed.substr(12,6),2)]+mapping[parseInt(uncompressed.substr(18,6),2)]+mapping[parseInt(uncompressed.substr(24,6),2)]+mapping[parseInt(uncompressed.substr(30,6),2)]+mapping[parseInt(uncompressed.substr(36,6),2)]+mapping[parseInt(uncompressed.substr(42,6),2)];return result}function fileNameToAID(filename){var matches=filename.match(/^(M|G)\.(\d+)\.A(?:\.([0-9A-F]{3}))?/);return AIDc(AIDu(matches[1],matches[2],matches[3]))}function AIDtoFileName(AID){function fillupToBits(raw,num){var prefix="";for(var i=0;i<num-raw.length;i++){prefix="0"+prefix}return prefix+raw}var mapping="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split("");var reverse={};for(var i=0;i<mapping.length;i++){reverse[mapping[i]]=fillupToBits(i.toString(2),6)}var bits=reverse[AID[0]]+reverse[AID[1]]+reverse[AID[2]]+reverse[AID[3]]+reverse[AID[4]]+reverse[AID[5]]+reverse[AID[6]]+reverse[AID[7]];return(parseInt(bits.substr(0,4),2)==0?"M":"G")+"."+fillupToBits(parseInt(bits.substr(4,32),2).toString(),10)+".A."+fillupToBits(parseInt(bits.substr(36,12),2).toString(16).toUpperCase(),3)}var load=function(html){var $=cheerio.load(html);$.prototype.getPreviousPageAnchor=function(){var list=this.find(".btn.wide");var anchor;for(var i=0;i<list.length;i++){var $ele=$(list[i]);if($ele.text().search("上頁")!==-1){anchor=$ele.attr("href").match(/index(\d+)/)[1]}}return anchor};return{parseHotBoards:function(){function parseTitle(string){if(string.match(/\[(.+)\](.*)/)){return string.match(/\[(.+)\](.*)/).slice(1)}else{return[null,string]}}var boards=[];$("table tr").each(function(idx,ele){var $rowElement=$(ele);var rawTitle=$rowElement.find("td").eq(2).text().trim();var tagAndTitle=parseTitle(rawTitle);var count=$rowElement.find("td").eq(0).text().replace("人氣：","");var board={name:$rowElement.find("td").eq(1).text().trim(),tag:tagAndTitle[0]?tagAndTitle[0].trim():"",title:tagAndTitle[1]?tagAndTitle[1]:"",viewerSign:viewerSignForCount(parseInt(count)),viewerCount:parseInt(count),isAccessible:true};boards.push(board)});return boards},parseBoard:function(){var articles=[];var anchor=$.root().getPreviousPageAnchor();$(".r-ent").each(function(idx,ele){var $div=$(this);var article={author:$div.find(".meta .author").text(),type:"normal",status:"unread",pagingAnchor:parseInt(anchor),pinned:false,dateWithoutYear:$div.find(".meta .date").text()};if($div.find("a").length==0){return true}var webLink=$div.find("a").first();var rawScore=$div.find(".nrec").first().text();if(rawScore==="爆"){article.score=100}else if(rawScore[0]==="X"&&rawScore[1]!=="X"){article.score=-parseInt(rawScore[1])*10}else if(rawScore==="XX"){article.score=-100}else if(rawScore===""){article.score=0}else{article.score=parseInt(rawScore)}article.url="https://www.ptt.cc"+webLink.attr("href");article.id="#"+fileNameToAID(article.url.match(/\/bbs\/[a-zA-Z0-9\-_]+\/(.*)/)[1]);var rawTitle=$div.find(".title").first().text().trim();var tagAndTitle=parseTitle(rawTitle);article.title=tagAndTitle[1].trim();article.tag=tagAndTitle[0]?tagAndTitle[0]:"";if(rawTitle.substr(0,3)==="Re:"){article.type="reply"}articles.push(article)});return articles},parseArticle:function(){var blocks=[];var nodes=$("#main-content").contents();var rawDate=new Date(nodes.eq(3).text().substr(2));var offsetDate=new Date(rawDate.getTime()+8*60*60*1e3);date=offsetDate.toISOString();var metaBlock={blockType:"metadata",author:nodes.eq(0).text().substr(2).match(/(.+)\((.*)\)/)[1],authorNickname:nodes.eq(0).text().substr(2).match(/(.+)\((.*)\)/)[2],date:date};var textChunks=[];for(var i=4;i<nodes.length;i++){var contents=nodes.eq(i).text().removeTailingSpace().split("\n");Array.prototype.push.apply(textChunks,contents);if(nodes.eq(i).text().search("※ 發信站")!==-1){textChunks.pop();metaBlock["url"]=nodes.eq(i+1).find("a").first().attr("href");break}}blocks.push(metaBlock);Array.prototype.push.apply(blocks,parseQuotesAndReformatContent(textChunks));function addComment(type,author,content,datetime_without_year){blocks.push({blockType:"comment",type:type,author:author,content:content.removeTailingSpace(),datetime_without_year:datetime_without_year||null})}function addAuthorComment(content,datetime_without_year){addComment("authorComment",metaBlock.author,content,datetime_without_year)}var gotMainContent=false;for(var i=0;i<nodes.length;i++){var node=nodes.eq(i);if(!node.html())continue;if(!node.attr("class")){if(gotMainContent){addAuthorComment(node.text())}else{gotMainContent=true}}else{if(node.hasClass("push")){var rawPushTag=node.find(".push-tag").first().text();var pushType;if(rawPushTag==="→ "){pushType="neutral"}else if(rawPushTag==="噓 "){pushType="dislike"}else if(rawPushTag==="推 "){pushType="like"}var author=node.find(".push-userid").first().text();var content=node.find(".push-content").first().text().substr(2);var datetime_without_year=node.find(".push-ipdatetime").first().text().trim();if(author===metaBlock.author){addAuthorComment(content,datetime_without_year)}else{addComment(pushType,author,content,datetime_without_year)}}}}return blocks}}};module.exports={load:load,fileNameToAID:fileNameToAID,AIDtoFileName:AIDtoFileName}},{cheerio:undefined}]},{},[1]);