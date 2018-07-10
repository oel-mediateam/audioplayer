/*
 * Audio Player
 *
 * @author: Ethan Lin
 * @url: https://github.com/oel-mediateam/audioplayer
 * @version: 2.0.0
 *
 * @license: The MIT License (MIT)
 * Copyright (c) 2014 - 2018 Media Serivces
 *
 */
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var s=0;s<t.length;s++){var a=t[s];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,s,a){return s&&e(t.prototype,s),a&&e(t,a),t}}(),APlayer=function(){function e(){_classCallCheck(this,e),this.el={splash:"#ap-splash",main:"#ap-main",showProfileBtn:"#show-profile",closeProfileBtn:"#author-close-btn",profileDisplay:"#author-overlay",trackTitle:".track-info .title-wrapper .title",miniDisplay:".track-list .minimized-display",trackList:".track-list .tracks",expandTracksBtn:".track-list .expand-btn",ccSpecDisplay:".body .cc-spec-display",spectrumDisplay:".body .cc-spec-display .spectrum",captionDisplay:".body .cc-spec-display .caption",bodyControls:".body .controls",ccToggle:"#cc-toggle",spectrumToggle:"#spectrum-toggle",warning:".body .warning-msg",error:"#ap-error",errorIcon:"#ap-error .icon",errorTitle:"#ap-error .title",errorBody:"#ap-error .body",playerId:"#player",copyright:".copyright p",player:null},this.manifest={},this.album={url:"assets/album.xml"},this.program={},this.reference={names:window.location.href,params:new URLSearchParams(window.location.search)}}return _createClass(e,[{key:"go",value:function e(){var t=this;if(t.hasCoreFeaturesSupport())return void t.showError("🙈","",'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');t.hasAppearanceIusses()&&t.showWarning("For better viewing, try a different web browser."),t.getManifest()}},{key:"getManifest",value:function e(){var t=this,s=t._selector("#ap-manifest").getAttribute("href");t._requestFile(s,function(e){t.manifest=JSON.parse(e.response),0===t.manifest.ap_root_directory.length&&(t.manifest.ap_root_directory="source/"),t.setUIs()})}},{key:"setUIs",value:function e(){var t=this,s=t.manifest.ap_root_directory+"script/templates/apui.tpl";t._requestFile(s,function(e){var s=t._selector("body"),a=e.response.replace(/\{([source)]+)\}/gi,t.manifest.ap_root_directory);s.innerHTML+=a,t.getAlbum(),t._CCSpectrumDisplays(),t._expandTracksToggle(),t._setShowProfileListener()})}},{key:"getAlbum",value:function e(){var t=this;t._requestFile(t.album.url,function(e){var s=e.responseXML,a=t._xmlSelector(s,"album"),r=t._xmlSelector(s,"setup"),i=t._xmlSelector(s,"track",!0);t.album.settings={},t.album.settings.accent=a.getAttribute("accent"),t.album.settings.splashFormat=a.getAttribute("splashImgFormat"),t.album.settings.imgFormat=a.getAttribute("imgFormat"),t.album.settings.analytics=a.getAttribute("analytics"),t.album.settings.version=a.getAttribute("xmlVersion"),t.album.name=t._xmlSelector(r,"name").textContent,t.album.author=t._xmlSelector(r,"author").getAttribute("name"),t.album.authorProfile=t._xmlSelector(r,"author").textContent,t.album.length=t._xmlSelector(r,"length").textContent,t._isEmpty(a.getAttribute("program"))?(t.reference.names.split("?"),t.reference.names=t.reference.names[0],t.reference.names.lastIndexOf("/")!==t.reference.names.length-1&&(t.reference.names+="/"),t.reference.names=t.cleanArray(t.reference.names.split("/")),void 0!==t.reference.names[3]&&(t.program.name=t.reference.names[3])):t.program.name=a.getAttribute("program"),t._isEmpty(a.getAttribute("course"))||(t.program.course=a.getAttribute("course")),t.album.tracks=[],Array.prototype.forEach.call(i,function(e){var s={};s.img=e.getAttribute("img"),s.src=e.getAttribute("src"),s.title=e.querySelector("title").innerHTML,s.author=e.querySelector("author").innerHTML,t.album.tracks.push(s)}),console.log(t.album),t.setData(),t._setupAudioPlayer()})}},{key:"setData",value:function e(){var t=this._selector(this.el.trackTitle),s=this._selector(this.el.copyright),a=new Date,r=a.getFullYear();s.innerHTML+="&copy; "+r+". "+this.manifest.ap_copyright,this.setProgram(),this._marqueeEl(t)}},{key:"_setupAudioPlayer",value:function e(){var t=this,s=t.manifest.ap_root_directory+"script/templates/custom_plyr_controls.tpl";t._requestFile(s,function(e){var s=e.response.replace(/\{([source)]+)\}/gi,t.manifest.ap_root_directory);t.el.player=new Plyr(t.el.playerId,{controls:s,autoplay:!1,volume:.8,clickToPlay:!1,fullscreen:{enabled:!1,fallback:!1,iosNative:!1}}),t.el.player.on("ready",function(e){var s=e.detail.plyr,a=t._selector("#ap-playpause"),r=t._selector("#ap-muteunmute"),i=t._selector("#ap-loop"),n=t._selector("#ap-playbackRate");!0===s.playing&&a.classList.add("plyr__control--pressed");for(var l=0;l<n.options.length;l++)if(Number(n.options[l].value)===s.speed){n.selectedIndex=l;break}s.on("ended",function(){!1===s.loop&&(a.classList.contains("plyr__control--pressed")&&a.classList.add("plyr__control--pressed"),s.restart())}),i.addEventListener("click",function(){!1===s.loop?(s.loop=!0,i.classList.add("active")):(s.loop=!1,i.classList.remove("active"))}),n.addEventListener("change",function(e){s.speed=Number(e.target.options[e.target.selectedIndex].value)}),a.addEventListener("click",function(e){e.target.classList.contains("plyr__control--pressed")?e.target.classList.remove("plyr__control--pressed"):e.target.classList.add("plyr__control--pressed")}),r.addEventListener("click",function(e){e.target.classList.contains("plyr__control--pressed")?e.target.classList.remove("plyr__control--pressed"):e.target.classList.add("plyr__control--pressed")})})})}},{key:"setProgram",value:function e(){var t=this;t.manifest.ap_custom_themes&&(t.program=t.manifest.ap_custom_themes.find(function(e){return e.name===t.program.name}),void 0===t.program&&(t.program=t.manifest.ap_custom_themes.find(function(e){return e.name===t.manifest.ap_logo_default})));var s=t._selector(".program-theme");t.program.colors.forEach(function(e){var t=document.createElement("span");t.style.backgroundColor=e,s.appendChild(t)})}},{key:"hasCoreFeaturesSupport",value:function e(){return!!(!Modernizr.audio&&Modernizr.json&&Modernizr.svg&&Modernizr.csscalc&&Modernizr.flexbox)}},{key:"hasAppearanceIusses",value:function e(){return!Modernizr.canvas||(!Modernizr.cssanimations||(!Modernizr.bgsizecover||!Modernizr.objectfit))}},{key:"showError",value:function e(t,s,a){var r=this._selector(this.el.splash),i=this._selector(this.el.main),n=this._selector(this.el.error),l=this._selector(this.el.errorIcon),o=this._selector(this.el.errorTitle),c=this._selector(this.el.errorBody),u=document.createAttribute("aria-hidden");u.value=!1,l.innerHTML=t,o.innerHTML=s,c.innerHTML=a,r.style.display="none",i.style.display="none",n.style.display="flex",n.setAttributeNode(u),this._fadeIn(n)}},{key:"showWarning",value:function e(t){var s=this,a=s._selector(s.el.warning),r=6e3;a.innerHTML=t,a.style.display="block",s._fadeIn(a),window.setTimeout(function(){s._fadeOut(a,function(){a.innerHTML="",a.style.display="none"})},6e3)}},{key:"hideSplash",value:function e(){var t=this._selector(this.el.splash),s=document.createAttribute("aria-hidden");s.value=!0,t.classList.add("hide-splash"),t.setAttributeNode(s)}},{key:"showProfile",value:function e(){var t=this,s=this._selector(this.el.profileDisplay),a=this._selector(this.el.closeProfileBtn);s.style.display="block",this._fadeIn(s),a.addEventListener("click",function(){t.closeProfile()},{once:!0})}},{key:"closeProfile",value:function e(){var t=this._selector(this.el.profileDisplay);this._fadeOut(t,function(){t.style.display=""})}},{key:"_setShowProfileListener",value:function e(){var t=this;this._selector(this.el.showProfileBtn).addEventListener("click",function(){t.showProfile()})}},{key:"_expandTracksToggle",value:function e(){var t=this,s=t._selector(this.el.expandTracksBtn);s.addEventListener("click",function(){var e=t._selector(t.el.trackList),a=t._selector(t.el.miniDisplay);"none"==e.style.display||""==e.style.display?(e.style.display="block",a.style.display="none",t._hideCCSpectrum(),t._slideDown(s.parentNode,function(){s.classList.add("rotate")})):(e.style.display="none",a.style.display="flex",t._slideUp(s.parentNode,function(){s.classList.remove("rotate"),t._CCSpectrumDisplays()}))})}},{key:"toggleCC",value:function e(){var t=this._selector(this.el.captionDisplay),s=this._selector(this.el.spectrumDisplay),a=this._selector(this.el.ccToggle),r=this._selector(this.el.spectrumToggle);a.classList.add("disabled"),r.classList.remove("disabled"),t.classList.add("active"),s.classList.remove("active")}},{key:"toggleSpectrum",value:function e(){var t=this._selector(this.el.captionDisplay),s=this._selector(this.el.spectrumDisplay),a=this._selector(this.el.ccToggle);this._selector(this.el.spectrumToggle).classList.add("disabled"),a.classList.remove("disabled"),s.classList.add("active"),t.classList.remove("active")}},{key:"_CCSpectrumDisplays",value:function e(){var t=this,s=this._selector(this.el.bodyControls),a=this._selector(this.el.ccSpecDisplay),r=this._selector(this.el.ccToggle),i=this._selector(this.el.spectrumToggle);"none"===s.style.display?(s.style.display="",a.style.display=""):t.toggleCC(),r.addEventListener("click",function(){t.toggleCC()}),i.addEventListener("click",function(){t.toggleSpectrum()})}},{key:"_hideCCSpectrum",value:function e(){var t=this._selector(this.el.ccSpecDisplay);this._selector(this.el.bodyControls).style.display="none",t.style.display="none"}},{key:"_selector",value:function e(t){return document.querySelector(t)}},{key:"_xmlSelector",value:function e(t,s,a){return a="boolean"==typeof a&&a,a?t.querySelectorAll(s):t.querySelector(s)}},{key:"_isEmpty",value:function e(t){return""===t||void 0||null}},{key:"_requestFile",value:function e(t,s){var a=this,r=a._selector("body"),i=new XMLHttpRequest;i.open("GET",t,!0),i.onload=function(){this.status>=200&&this.status<400?s(this):r.innerHTML+='<div class="error">Error '+this.status+" while loading <code>"+t+"</code></div>",i.abort()},i.onerror=function(){r.innerHTML+='<div class="error">Connection Error. Check your network.</div>'},i.send()}},{key:"cleanArray",value:function e(t){return t.forEach(function(e,s){""===e&&t.splice(s,1)}),/(\w*|(\w*\-\w*)*)\.\w*/gi.test(t[t.length-1])&&t.pop(),t}},{key:"_marqueeEl",value:function e(t){var s=this;if(t.offsetWidth<t.scrollWidth)var a=15500,r=5e3,i=window.setInterval(function(){t.parentNode.classList.add("marquee"),t.style.width=t.scrollWidth+"px",window.clearInterval(i);var e=window.setTimeout(function(){t.style.width="initial",s._fadeIn(t),t.parentNode.classList.remove("marquee"),window.clearTimeout(e),s._marqueeEl(t)},15500)},5e3)}},{key:"_fadeIn",value:function e(t,s){t.classList.remove("fadeOut"),t.classList.add("fadeIn");var a=this._whichAnimationEvent();t.params={_event:a,_callback:s},t.addEventListener(a,this._fadeCallback)}},{key:"_fadeOut",value:function e(t,s){t.classList.remove("fadeIn"),t.classList.add("fadeOut");var a=this._whichAnimationEvent();t.params={_event:a,_callback:s},t.addEventListener(a,this._fadeCallback)}},{key:"_fadeCallback",value:function e(t){void 0!==t.target.params._callback&&"function"==typeof t.target.params._callback&&t.target.params._callback(),t.target.classList.remove("fadeIn"),t.target.classList.remove("fadeOut"),t.target.removeEventListener(t.target.params._event,this._fadeCallback)}},{key:"_slideDown",value:function e(t,s){t.classList.add("slideDown"),t.classList.remove("slideUp");var a=this._whichAnimationEvent();t.params={_event:a,_callback:s},t.addEventListener(a,this._slideCallback)}},{key:"_slideUp",value:function e(t,s){t.classList.add("slideUp"),t.classList.remove("slideDown");var a=this._whichAnimationEvent();t.params={_event:a,_callback:s},t.addEventListener(a,this._slideCallback)}},{key:"_slideCallback",value:function e(t){void 0!==t.target.params._callback&&"function"==typeof t.target.params._callback&&t.target.params._callback(),t.target.removeEventListener(t.target.params._event,this._slideCallback)}},{key:"_whichAnimationEvent",value:function e(){var t=void 0,s=document.createElement("fakeelement"),a={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(t in a)if(void 0!==s.style[t])return a[t]}}]),e}(),AP=null;!function e(t){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?t():document.addEventListener("DOMContentLoaded",t)}(function(){AP=new APlayer,AP.go()});
//# sourceMappingURL=./audio.js.map