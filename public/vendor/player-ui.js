(()=>{var m={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},L={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},Er={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},Vo=Object.entries(Er),o=Vo.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{}),Fn={USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},it=Vo.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{...Fn}),gc=Object.entries(it).reduce((t,[e,i])=>{let a=o[e];return a&&(t[i]=a),t},{userinactivechange:"userinactive"}),Ko=Object.entries(o).reduce((t,[e,i])=>{let a=it[e];return a&&(t[i]=a),t},{userinactive:"userinactivechange"}),te={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"},$e={DISABLED:"disabled",HIDDEN:"hidden",SHOWING:"showing"};var Wi={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},ie={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},he={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"};var Go={INLINE:"inline",FULLSCREEN:"fullscreen",PICTURE_IN_PICTURE:"picture-in-picture"};function qo(t){return t?.map($n).join(" ")}function $n(t){if(t){let{id:e,width:i,height:a}=t;return[e,i,a].filter(r=>r!=null).join(":")}}function Yo(t){return t?.map(Wn).join(" ")}function Wn(t){if(t){let{id:e,kind:i,language:a,label:r}=t;return[e,i,a,r].filter(s=>s!=null).join(":")}}function gt(t){return typeof t=="number"&&!Number.isNaN(t)&&Number.isFinite(t)}var Vi=t=>new Promise(e=>setTimeout(e,t));var Qo={"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it.",hour:"hour",hours:"hours",minute:"minute",minutes:"minutes",second:"second",seconds:"seconds","{time} remaining":"{time} remaining","{currentTime} of {totalTime}":"{currentTime} of {totalTime}","video not loaded, unknown time.":"video not loaded, unknown time."};var zo,Xt={en:Qo},_t=((zo=globalThis.navigator)==null?void 0:zo.language)||"en",Zo=t=>{_t=t};var Vn=t=>{var e,i,a;let[r]=_t.split("-");return((e=Xt[_t])==null?void 0:e[t])||((i=Xt[r])==null?void 0:i[t])||((a=Xt.en)==null?void 0:a[t])||t},Xo=()=>{let[t]=_t.split("-");return Xt[_t]?_t:Xt[t]?t:"en"},h=(t,e={})=>Vn(t).replace(/\{(\w+)\}/g,(i,a)=>a in e?String(e[a]):`{${a}}`);var Jo=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],Kn=(t,e)=>{let i=t===1?h(Jo[e].singular):h(Jo[e].plural);return`${t} ${i}`},at=t=>{if(!gt(t))return"";let e=Math.abs(t),i=e!==t,a=new Date(0,0,0,0,0,e,0),s=[a.getHours(),a.getMinutes(),a.getSeconds()].map((n,d)=>n&&Kn(n,d)).filter(n=>n).join(", ");return i?h("{time} remaining",{time:s}):s};function pe(t,e){let i=!1;t<0&&(i=!0,t=0-t),t=t<0?0:t;let a=Math.floor(t%60),r=Math.floor(t/60%60),s=Math.floor(t/3600),n=Math.floor(e/60%60),d=Math.floor(e/3600);return(isNaN(t)||t===1/0)&&(s=r=a="0"),s=s>0||d>0?s+":":"",r=((s||n>=10)&&r<10?"0"+r:r)+":",a=a<10?"0"+a:a,(i?"-":"")+s+r+a}var yc=Object.freeze({length:0,start(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});var Ki=class{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}},Gi=class extends Ki{},qi=class extends Gi{constructor(){super(...arguments),this.role=null}},vr=class{observe(){}unobserve(){}disconnect(){}},jo={createElement:function(){return new Jt.HTMLElement},createElementNS:function(){return new Jt.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(t){return!1}},Jt={ResizeObserver:vr,document:jo,Node:Gi,Element:qi,HTMLElement:class extends qi{constructor(){super(...arguments),this.innerHTML=""}get content(){return new Jt.DocumentFragment}},DocumentFragment:class extends Ki{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(t){return null},setItem(t,e){},removeItem(t){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(t){return{matches:!1,media:t}},DOMParser:class{parseFromString(e,i){return{body:{textContent:e}}}}},es="global"in globalThis&&globalThis?.global===globalThis||typeof window>"u"||typeof window.customElements>"u",ts=Object.keys(Jt).every(t=>t in globalThis),l=es&&!ts?Jt:globalThis,G=es&&!ts?jo:globalThis.document;var is=new WeakMap,fr=t=>{let e=is.get(t);return e||is.set(t,e=new Set),e},as=new l.ResizeObserver(t=>{for(let e of t)for(let i of fr(e.target))i(e)});function Yi(t,e){fr(t).add(e),as.observe(t)}function Qi(t,e){let i=fr(t);i.delete(e),i.size||as.unobserve(t)}function $(t){let e={};for(let i of t)e[i.name]=i.value;return e}function rs(t){var e;return(e=qn(t))!=null?e:We(t,"media-controller")}function qn(t){var e;let{MEDIA_CONTROLLER:i}=L,a=t.getAttribute(i);if(a)return(e=Qn(t))==null?void 0:e.getElementById(a)}var zi=(t,e,i=".value")=>{let a=t.querySelector(i);a&&(a.textContent=e)},Yn=(t,e)=>{let i=`slot[name="${e}"]`,a=t.shadowRoot.querySelector(i);return a?a.children:[]},Zi=(t,e)=>Yn(t,e)[0],Se=(t,e)=>!t||!e?!1:t?.contains(e)?!0:Se(t,e.getRootNode().host),We=(t,e)=>{if(!t)return null;let i=t.closest(e);return i||We(t.getRootNode().host,e)};function gr(t=document){var e;let i=t?.activeElement;return i?(e=gr(i.shadowRoot))!=null?e:i:null}function Qn(t){var e;let i=(e=t?.getRootNode)==null?void 0:e.call(t);return i instanceof ShadowRoot||i instanceof Document?i:null}function Xi(t,{depth:e=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(t.checkVisibility)return t.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=t;for(;r&&e>0;){let s=getComputedStyle(r);if(i&&s.opacity==="0"||a&&s.visibility==="hidden"||s.display==="none")return!1;r=r.parentElement,e--}return!0}function os(t,e,i,a){let r=a.x-i.x,s=a.y-i.y,n=r*r+s*s;if(n===0)return 0;let d=((t-i.x)*r+(e-i.y)*s)/n;return Math.max(0,Math.min(1,d))}function P(t,e){let i=zn(t,a=>a===e);return i||_r(t,e)}function zn(t,e){var i,a;let r;for(r of(i=t.querySelectorAll("style:not([media])"))!=null?i:[]){let s;try{s=(a=r.sheet)==null?void 0:a.cssRules}catch{continue}for(let n of s??[])if(e(n.selectorText))return n}}function _r(t,e){var i,a;let r=(i=t.querySelectorAll("style:not([media])"))!=null?i:[],s=r?.[r.length-1];if(!s?.sheet)return console.warn("Media Chrome: No style sheet found on style tag of",t),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}};let n=s?.sheet.insertRule(`${e}{}`,s.sheet.cssRules.length);return(a=s.sheet.cssRules)==null?void 0:a[n]}function D(t,e,i=Number.NaN){let a=t.getAttribute(e);return a!=null?+a:i}function U(t,e,i){let a=+i;if(i==null||Number.isNaN(a)){t.hasAttribute(e)&&t.removeAttribute(e);return}D(t,e,void 0)!==a&&t.setAttribute(e,`${a}`)}function _(t,e){return t.hasAttribute(e)}function b(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}_(t,e)!=i&&t.toggleAttribute(e,i)}function R(t,e,i=null){var a;return(a=t.getAttribute(e))!=null?a:i}function w(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}let a=`${i}`;R(t,e,void 0)!==a&&t.setAttribute(e,a)}var ss=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ee=(t,e,i)=>(ss(t,e,"read from private field"),i?i.call(t):e.get(t)),Zn=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ji=(t,e,i,a)=>(ss(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),J;function Xn(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}var bt=class extends l.HTMLElement{constructor(){if(super(),Zn(this,J,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[L.MEDIA_CONTROLLER,o.MEDIA_PAUSED]}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===L.MEDIA_CONTROLLER&&(i&&((s=(r=Ee(this,J))==null?void 0:r.unassociateElement)==null||s.call(r,this),Ji(this,J,null)),a&&this.isConnected&&(Ji(this,J,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=Ee(this,J))==null?void 0:d.associateElement)==null||c.call(d,this)))}connectedCallback(){var e,i;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),Ji(this,J,Jn(this)),this.getAttribute(L.MEDIA_CONTROLLER)&&((i=(e=Ee(this,J))==null?void 0:e.associateElement)==null||i.call(e,this)),Ee(this,J)&&(Ee(this,J).addEventListener("pointerdown",this),Ee(this,J).addEventListener("click",this),Ee(this,J).hasAttribute("tabindex")||(Ee(this,J).tabIndex=0))}disconnectedCallback(){var e,i,a,r;this.getAttribute(L.MEDIA_CONTROLLER)&&((i=(e=Ee(this,J))==null?void 0:e.unassociateElement)==null||i.call(e,this)),(a=Ee(this,J))==null||a.removeEventListener("pointerdown",this),(r=Ee(this,J))==null||r.removeEventListener("click",this),Ji(this,J,null)}handleEvent(e){var i;let a=(i=e.composedPath())==null?void 0:i[0];if(["video","media-controller"].includes(a?.localName)){if(e.type==="pointerdown")this._pointerType=e.pointerType;else if(e.type==="click"){let{clientX:s,clientY:n}=e,{left:d,top:c,width:S,height:k}=this.getBoundingClientRect(),T=s-d,E=n-c;if(T<0||E<0||T>S||E>k||S===0&&k===0)return;let p=this._pointerType||"mouse";if(this._pointerType=void 0,p===Wi.TOUCH){this.handleTap(e);return}else if(p===Wi.MOUSE||p===Wi.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return _(this,o.MEDIA_PAUSED)}set mediaPaused(e){b(this,o.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let i=this.mediaPaused?m.MEDIA_PLAY_REQUEST:m.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new l.CustomEvent(i,{composed:!0,bubbles:!0}))}};J=new WeakMap;bt.shadowRootOptions={mode:"open"};bt.getTemplateHTML=Xn;function Jn(t){var e;let i=t.getAttribute(L.MEDIA_CONTROLLER);return i?(e=t.getRootNode())==null?void 0:e.getElementById(i):We(t,"media-controller")}l.customElements.get("media-gesture-receiver")||l.customElements.define("media-gesture-receiver",bt);var ji=bt;var Sr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},W=(t,e,i)=>(Sr(t,e,"read from private field"),i?i.call(t):e.get(t)),ee=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ve=(t,e,i,a)=>(Sr(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),fe=(t,e,i)=>(Sr(t,e,"access private method"),i),jt,ia,At,It,St,br,Tt,ea,Ar,ns,Tr,ls,ei,aa,ra,Ir,yt,ti,Ve,ta,A={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"};function jn(t){return`
    <style>
      
      :host([${o.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${A.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${A.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${A.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${A.AUDIO}])[${A.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${A.AUDIO}])[${A.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${A.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${A.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${A.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${A.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${A.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${A.USER_INACTIVE}]:not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_AIRPLAYING}]):not([${o.MEDIA_IS_CASTING}]):not([${A.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${A.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${A.USER_INACTIVE}]:not([${A.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${A.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${A.USER_INACTIVE}][${A.AUTOHIDE_OVER_CONTROLS}]:not([${A.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${A.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${A.AUDIO}])[${o.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${ji.shadowRootOptions.mode}">
          ${ji.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `}var el=Object.values(o),tl="sm:384 md:576 lg:768 xl:960";function il(t){ds(t.target,t.contentRect.width)}function ds(t,e){var i;if(!t.isConnected)return;let a=(i=t.getAttribute(A.BREAKPOINTS))!=null?i:tl,r=al(a),s=rl(r,e),n=!1;if(Object.keys(r).forEach(d=>{if(s.includes(d)){t.hasAttribute(`breakpoint${d}`)||(t.setAttribute(`breakpoint${d}`,""),n=!0);return}t.hasAttribute(`breakpoint${d}`)&&(t.removeAttribute(`breakpoint${d}`),n=!0)}),n){let d=new CustomEvent(it.BREAKPOINTS_CHANGE,{detail:s});t.dispatchEvent(d)}t.breakpointsComputed||(t.breakpointsComputed=!0,t.dispatchEvent(new CustomEvent(it.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function al(t){let e=t.split(/\s+/);return Object.fromEntries(e.map(i=>i.split(":")))}function rl(t,e){return Object.keys(t).filter(i=>e>=parseInt(t[i]))}var rt=class extends l.HTMLElement{constructor(){if(super(),ee(this,Ar),ee(this,Tr),ee(this,ei),ee(this,ra),ee(this,yt),ee(this,jt,void 0),ee(this,ia,0),ee(this,At,null),ee(this,It,null),ee(this,St,void 0),this.breakpointsComputed=!1,ee(this,br,e=>{let i=this.media;for(let a of e){if(a.type!=="childList")continue;let r=a.removedNodes;for(let s of r){if(s.slot!="media"||a.target!=this)continue;let n=a.previousSibling&&a.previousSibling.previousElementSibling;if(!n||!i)this.mediaUnsetCallback(s);else{let d=n.slot!=="media";for(;(n=n.previousSibling)!==null;)n.slot=="media"&&(d=!1);d&&this.mediaUnsetCallback(s)}}if(i)for(let s of a.addedNodes)s===i&&this.handleMediaUpdated(i)}}),ee(this,Tt,!1),ee(this,ea,e=>{W(this,Tt)||(setTimeout(()=>{il(e),ve(this,Tt,!1)},0),ve(this,Tt,!0))}),ee(this,Ve,void 0),ee(this,ta,()=>{if(!W(this,Ve).assignedElements({flatten:!0}).length){W(this,At)&&this.mediaUnsetCallback(W(this,At));return}this.handleMediaUpdated(this.media)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}ve(this,jt,new MutationObserver(W(this,br)))}static get observedAttributes(){return[A.AUTOHIDE,A.GESTURES_DISABLED].concat(el).filter(e=>![o.MEDIA_RENDITION_LIST,o.MEDIA_AUDIO_TRACK_LIST,o.MEDIA_CHAPTERS_CUES,o.MEDIA_WIDTH,o.MEDIA_HEIGHT,o.MEDIA_ERROR,o.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,i,a){e.toLowerCase()==A.AUTOHIDE&&(this.autohide=a)}get media(){let e=this.querySelector(":scope > [slot=media]");return e?.nodeName=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(ve(this,At,e),e.localName.includes("-")&&await l.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;W(this,jt).observe(this,{childList:!0,subtree:!0}),Yi(this,W(this,ea));let a=this.getAttribute(A.AUDIO)!=null?h("audio player"):h("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",a),this.handleMediaUpdated(this.media),this.setAttribute(A.USER_INACTIVE,""),ds(this,this.getBoundingClientRect().width);let r=this.querySelector(":scope > slot[slot=media]");r&&(ve(this,Ve,r),W(this,Ve).addEventListener("slotchange",W(this,ta))),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),(e=l.window)==null||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;Qi(this,W(this,ea)),clearTimeout(W(this,It)),W(this,jt).disconnect(),this.media&&this.mediaUnsetCallback(this.media),(e=l.window)==null||e.removeEventListener("mouseup",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointermove",this),this.removeEventListener("pointerup",this),this.removeEventListener("mouseleave",this),this.removeEventListener("keyup",this),W(this,Ve)&&(W(this,Ve).removeEventListener("slotchange",W(this,ta)),ve(this,Ve,null)),ve(this,Tt,!1)}mediaSetCallback(e){}mediaUnsetCallback(e){ve(this,At,null)}handleEvent(e){switch(e.type){case"pointerdown":ve(this,ia,e.timeStamp);break;case"pointermove":fe(this,Ar,ns).call(this,e);break;case"pointerup":fe(this,Tr,ls).call(this,e);break;case"mouseleave":fe(this,ei,aa).call(this);break;case"mouseup":this.removeAttribute(A.KEYBOARD_CONTROL);break;case"keyup":fe(this,yt,ti).call(this),this.setAttribute(A.KEYBOARD_CONTROL,"");break}}set autohide(e){let i=Number(e);ve(this,St,isNaN(i)?0:i)}get autohide(){return(W(this,St)===void 0?2:W(this,St)).toString()}get breakpoints(){return R(this,A.BREAKPOINTS)}set breakpoints(e){w(this,A.BREAKPOINTS,e)}get audio(){return _(this,A.AUDIO)}set audio(e){b(this,A.AUDIO,e)}get gesturesDisabled(){return _(this,A.GESTURES_DISABLED)}set gesturesDisabled(e){b(this,A.GESTURES_DISABLED,e)}get keyboardControl(){return _(this,A.KEYBOARD_CONTROL)}set keyboardControl(e){b(this,A.KEYBOARD_CONTROL,e)}get noAutohide(){return _(this,A.NO_AUTOHIDE)}set noAutohide(e){b(this,A.NO_AUTOHIDE,e)}get autohideOverControls(){return _(this,A.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){b(this,A.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return _(this,A.USER_INACTIVE)}set userInteractive(e){b(this,A.USER_INACTIVE,e)}};jt=new WeakMap;ia=new WeakMap;At=new WeakMap;It=new WeakMap;St=new WeakMap;br=new WeakMap;Tt=new WeakMap;ea=new WeakMap;Ar=new WeakSet;ns=function(t){if(t.pointerType!=="mouse"&&t.timeStamp-W(this,ia)<250)return;fe(this,ra,Ir).call(this),clearTimeout(W(this,It));let e=this.hasAttribute(A.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(t.target)||e)&&fe(this,yt,ti).call(this)};Tr=new WeakSet;ls=function(t){if(t.pointerType==="touch"){let e=!this.hasAttribute(A.USER_INACTIVE);[this,this.media].includes(t.target)&&e?fe(this,ei,aa).call(this):fe(this,yt,ti).call(this)}else t.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(e?.localName))&&fe(this,yt,ti).call(this)};ei=new WeakSet;aa=function(){if(W(this,St)<0||this.hasAttribute(A.USER_INACTIVE))return;this.setAttribute(A.USER_INACTIVE,"");let t=new l.CustomEvent(it.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(t)};ra=new WeakSet;Ir=function(){if(!this.hasAttribute(A.USER_INACTIVE))return;this.removeAttribute(A.USER_INACTIVE);let t=new l.CustomEvent(it.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(t)};yt=new WeakSet;ti=function(){fe(this,ra,Ir).call(this),clearTimeout(W(this,It));let t=parseInt(this.autohide);t<0||ve(this,It,setTimeout(()=>{fe(this,ei,aa).call(this)},t*1e3))};Ve=new WeakMap;ta=new WeakMap;rt.shadowRootOptions={mode:"open"};rt.getTemplateHTML=jn;l.customElements.get("media-container")||l.customElements.define("media-container",rt);var cs=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},z=(t,e,i)=>(cs(t,e,"read from private field"),i?i.call(t):e.get(t)),ii=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},oa=(t,e,i,a)=>(cs(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Mt,kt,sa,ot,He,Ke,Lt=class{constructor(e,i,{defaultValue:a}={defaultValue:void 0}){ii(this,He),ii(this,Mt,void 0),ii(this,kt,void 0),ii(this,sa,void 0),ii(this,ot,new Set),oa(this,Mt,e),oa(this,kt,i),oa(this,sa,new Set(a))}[Symbol.iterator](){return z(this,He,Ke).values()}get length(){return z(this,He,Ke).size}get value(){var e;return(e=[...z(this,He,Ke)].join(" "))!=null?e:""}set value(e){var i;e!==this.value&&(oa(this,ot,new Set),this.add(...(i=e?.split(" "))!=null?i:[]))}toString(){return this.value}item(e){return[...z(this,He,Ke)][e]}values(){return z(this,He,Ke).values()}forEach(e,i){z(this,He,Ke).forEach(e,i)}add(...e){var i,a;e.forEach(r=>z(this,ot).add(r)),!(this.value===""&&!((i=z(this,Mt))!=null&&i.hasAttribute(`${z(this,kt)}`)))&&((a=z(this,Mt))==null||a.setAttribute(`${z(this,kt)}`,`${this.value}`))}remove(...e){var i;e.forEach(a=>z(this,ot).delete(a)),(i=z(this,Mt))==null||i.setAttribute(`${z(this,kt)}`,`${this.value}`)}contains(e){return z(this,He,Ke).has(e)}toggle(e,i){return typeof i<"u"?i?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,i){return this.remove(e),this.add(i),e===i}};Mt=new WeakMap;kt=new WeakMap;sa=new WeakMap;ot=new WeakMap;He=new WeakSet;Ke=function(){return z(this,ot).size?z(this,ot):z(this,sa)};var ol=(t="")=>t.split(/\s+/),us=(t="")=>{let[e,i,a]=t.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:e==="cc"?te.CAPTIONS:te.SUBTITLES,language:i,label:r}},yr=(t="",e={})=>ol(t).map(i=>{let a=us(i);return{...e,...a}}),Mr=t=>t?Array.isArray(t)?t.map(e=>typeof e=="string"?us(e):e):typeof t=="string"?yr(t):[t]:[],sl=({kind:t,label:e,language:i}={kind:"subtitles"})=>e?`${t==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(e)}`:i,ai=(t=[])=>Array.prototype.map.call(t,sl).join(" "),nl=(t,e)=>i=>i[t]===e,ms=t=>{let e=Object.entries(t).map(([i,a])=>nl(i,a));return i=>e.every(a=>a(i))},st=(t,e=[],i=[])=>{let a=Mr(i).map(ms),r=s=>a.some(n=>n(s));Array.from(e).filter(r).forEach(s=>{s.mode=t})},nt=(t,e=()=>!0)=>{if(!t?.textTracks)return[];let i=typeof e=="function"?e:ms(e);return Array.from(t.textTracks).filter(i)},hs=t=>{var e;return!!((e=t.mediaSubtitlesShowing)!=null&&e.length)||t.hasAttribute(o.MEDIA_SUBTITLES_SHOWING)};var Es=t=>{var e;let{media:i,fullscreenElement:a}=t;try{let r=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(r){let s=(e=a[r])==null?void 0:e.call(a);if(s instanceof Promise)return s.catch(()=>{})}else i?.webkitEnterFullscreen?i.webkitEnterFullscreen():i?.requestFullscreen&&i.requestFullscreen()}catch(r){console.error(r)}},ps="exitFullscreen"in G?"exitFullscreen":"webkitExitFullscreen"in G?"webkitExitFullscreen":"webkitCancelFullScreen"in G?"webkitCancelFullScreen":void 0,vs=t=>{var e;let{documentElement:i}=t;if(ps){let a=(e=i?.[ps])==null?void 0:e.call(i);if(a instanceof Promise)return a.catch(()=>{})}},ri="fullscreenElement"in G?"fullscreenElement":"webkitFullscreenElement"in G?"webkitFullscreenElement":void 0,ll=t=>{let{documentElement:e,media:i}=t,a=e?.[ri];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===Go.FULLSCREEN?i:a},fs=t=>{var e;let{media:i,documentElement:a,fullscreenElement:r=i}=t;if(!i||!a)return!1;let s=ll(t);if(!s)return!1;if(s===r||s===i)return!0;if(s.localName.includes("-")){let n=s.shadowRoot;if(!(ri in n))return Se(s,r);for(;n?.[ri];){if(n[ri]===r)return!0;n=(e=n[ri])==null?void 0:e.shadowRoot}}return!1},dl="fullscreenEnabled"in G?"fullscreenEnabled":"webkitFullscreenEnabled"in G?"webkitFullscreenEnabled":void 0,gs=t=>{let{documentElement:e,media:i}=t;return!!e?.[dl]||i&&"webkitSupportsFullscreen"in i};var na,kr=()=>{var t,e;return na||(na=(e=(t=G)==null?void 0:t.createElement)==null?void 0:e.call(t,"video"),na)},_s=async(t=kr())=>{if(!t)return!1;let e=t.volume;t.volume=e/2+.1;let i=new AbortController,a=await Promise.race([cl(t,i.signal),ul(t,e)]);return i.abort(),a},cl=(t,e)=>new Promise(i=>{t.addEventListener("volumechange",()=>i(!0),{signal:e})}),ul=async(t,e)=>{for(let i=0;i<10;i++){if(t.volume===e)return!1;await Vi(10)}return t.volume!==e},ml=/.*Version\/.*Safari\/.*/.test(l.navigator.userAgent),Lr=(t=kr())=>l.matchMedia("(display-mode: standalone)").matches&&ml?!1:typeof t?.requestPictureInPicture=="function",wr=(t=kr())=>gs({documentElement:G,media:t}),bs=wr(),As=Lr(),Ts=!!l.WebKitPlaybackTargetAvailabilityEvent,Ss=!!l.chrome;var wt=t=>nt(t.media,e=>[te.SUBTITLES,te.CAPTIONS].includes(e.kind)).sort((e,i)=>e.kind>=i.kind?1:-1),Rr=t=>nt(t.media,e=>e.mode===$e.SHOWING&&[te.SUBTITLES,te.CAPTIONS].includes(e.kind)),la=(t,e)=>{let i=wt(t),a=Rr(t),r=!!a.length;if(i.length){if(e===!1||r&&e!==!0)st($e.DISABLED,i,a);else if(e===!0||!r&&e!==!1){let s=i[0],{options:n}=t;if(!n?.noSubtitlesLangPref){let k=l.localStorage.getItem("media-chrome-pref-subtitles-lang"),T=k?[k,...l.navigator.languages]:l.navigator.languages,E=i.filter(p=>T.some(g=>p.language.toLowerCase().startsWith(g.split("-")[0]))).sort((p,g)=>{let v=T.findIndex(I=>p.language.toLowerCase().startsWith(I.split("-")[0])),M=T.findIndex(I=>g.language.toLowerCase().startsWith(I.split("-")[0]));return v-M});E[0]&&(s=E[0])}let{language:d,label:c,kind:S}=s;st($e.DISABLED,i,a),st($e.SHOWING,i,[{language:d,label:c,kind:S}])}}},da=(t,e)=>t===e?!0:t==null||e==null||typeof t!=typeof e?!1:typeof t=="number"&&Number.isNaN(t)&&Number.isNaN(e)?!0:typeof t!="object"?!1:Array.isArray(t)?hl(t,e):Object.entries(t).every(([i,a])=>i in e&&da(a,e[i])),hl=(t,e)=>{let i=Array.isArray(t),a=Array.isArray(e);return i!==a?!1:i||a?t.length!==e.length?!1:t.every((r,s)=>da(r,e[s])):!0};var pl=Object.values(he),ca,El=_s().then(t=>(ca=t,ca)),Is=async(...t)=>{await Promise.all(t.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof l.HTMLElement))return;let i=e.localName;if(!i.includes("-"))return;let a=l.customElements.get(i);a&&e instanceof a||(await l.customElements.whenDefined(i),l.customElements.upgrade(e))}))},vl=new l.DOMParser,fl=t=>t&&(vl.parseFromString(t,"text/html").body.textContent||t),Rt={mediaError:{get(t,e){let{media:i}=t;if(e?.type!=="playing")return i?.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(t,e){var i;let{media:a}=t;if(e?.type!=="playing")return(i=a?.error)==null?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(t,e){var i,a;let{media:r}=t;if(e?.type!=="playing")return(a=(i=r?.error)==null?void 0:i.message)!=null?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(t){var e;let{media:i}=t;return(e=i?.videoWidth)!=null?e:0},mediaEvents:["resize"]},mediaHeight:{get(t){var e;let{media:i}=t;return(e=i?.videoHeight)!=null?e:0},mediaEvents:["resize"]},mediaPaused:{get(t){var e;let{media:i}=t;return(e=i?.paused)!=null?e:!0},set(t,e){var i;let{media:a}=e;a&&(t?a.pause():(i=a.play())==null||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(t,e){let{media:i}=t;return i?e?e.type==="playing":!i.paused:!1},mediaEvents:["playing","emptied"]},mediaEnded:{get(t){var e;let{media:i}=t;return(e=i?.ended)!=null?e:!1},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(t){var e;let{media:i}=t;return(e=i?.playbackRate)!=null?e:1},set(t,e){let{media:i}=e;i&&Number.isFinite(+t)&&(i.playbackRate=+t)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(t){var e;let{media:i}=t;return(e=i?.muted)!=null?e:!1},set(t,e){let{media:i,options:{noMutedPref:a}={}}=e;if(i){i.muted=t;try{let r=l.localStorage.getItem("media-chrome-pref-muted")!==null,s=i.hasAttribute("muted");if(a){r&&l.localStorage.removeItem("media-chrome-pref-muted");return}if(s&&!r)return;l.localStorage.setItem("media-chrome-pref-muted",t?"true":"false")}catch(r){console.debug("Error setting muted pref",r)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{let{options:{noMutedPref:i}}=e,{media:a}=e;if(!(!a||a.muted||i))try{let r=l.localStorage.getItem("media-chrome-pref-muted")==="true";Rt.mediaMuted.set(r,e),t(r)}catch(r){console.debug("Error getting muted pref",r)}}]},mediaLoop:{get(t){let{media:e}=t;return e?.loop},set(t,e){let{media:i}=e;i&&(i.loop=t)},mediaEvents:["medialooprequest"]},mediaVolume:{get(t){var e;let{media:i}=t;return(e=i?.volume)!=null?e:1},set(t,e){let{media:i,options:{noVolumePref:a}={}}=e;if(i){try{t==null?l.localStorage.removeItem("media-chrome-pref-volume"):!i.hasAttribute("muted")&&!a&&l.localStorage.setItem("media-chrome-pref-volume",t.toString())}catch(r){console.debug("Error setting volume pref",r)}Number.isFinite(+t)&&(i.volume=+t)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{let{options:{noVolumePref:i}}=e;if(!i)try{let{media:a}=e;if(!a)return;let r=l.localStorage.getItem("media-chrome-pref-volume");if(r==null)return;Rt.mediaVolume.set(+r,e),t(+r)}catch(a){console.debug("Error getting volume pref",a)}}]},mediaVolumeLevel:{get(t){let{media:e}=t;return typeof e?.volume>"u"?"high":e.muted||e.volume===0?"off":e.volume<.5?"low":e.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(t){var e;let{media:i}=t;return(e=i?.currentTime)!=null?e:0},set(t,e){let{media:i}=e;!i||!gt(t)||(i.currentTime=t)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(t){let{media:e,options:{defaultDuration:i}={}}=t;return i&&(!e||!e.duration||Number.isNaN(e.duration)||!Number.isFinite(e.duration))?i:Number.isFinite(e?.duration)?e.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(t){let{media:e}=t;return e?.readyState<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(t){var e;let{media:i}=t;if(!((e=i?.seekable)!=null&&e.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(!(!a&&!r))return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(t){var e;let{media:i}=t,a=(e=i?.buffered)!=null?e:[];return Array.from(a).map((r,s)=>[Number(a.start(s).toFixed(3)),Number(a.end(s).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(t){let{media:e,options:{defaultStreamType:i}={}}=t,a=[he.LIVE,he.ON_DEMAND].includes(i)?i:void 0;if(!e)return a;let{streamType:r}=e;if(pl.includes(r))return r===he.UNKNOWN?a:r;let s=e.duration;return s===1/0?he.LIVE:Number.isFinite(s)?he.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(t){let{media:e}=t;if(!e)return Number.NaN;let{targetLiveWindow:i}=e,a=Rt.mediaStreamType.get(t);return(i==null||Number.isNaN(i))&&a===he.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(t){let{media:e,options:{liveEdgeOffset:i=10}={}}=t;if(!e)return!1;if(typeof e.liveEdgeStart=="number")return Number.isNaN(e.liveEdgeStart)?!1:e.currentTime>=e.liveEdgeStart;if(!(Rt.mediaStreamType.get(t)===he.LIVE))return!1;let r=e.seekable;if(!r)return!0;if(!r.length)return!1;let s=r.end(r.length-1)-i;return e.currentTime>=s},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get(t){return wt(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get(t){return Rr(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i,a;let{media:r,options:s}=e;if(!r)return;let n=d=>{var c;!s.defaultSubtitles||d&&![te.CAPTIONS,te.SUBTITLES].includes((c=d?.track)==null?void 0:c.kind)||la(e,!0)};return r.addEventListener("loadstart",n),(i=r.textTracks)==null||i.addEventListener("addtrack",n),(a=r.textTracks)==null||a.addEventListener("removetrack",n),()=>{var d,c;r.removeEventListener("loadstart",n),(d=r.textTracks)==null||d.removeEventListener("addtrack",n),(c=r.textTracks)==null||c.removeEventListener("removetrack",n)}}]},mediaChaptersCues:{get(t){var e;let{media:i}=t;if(!i)return[];let[a]=nt(i,{kind:te.CHAPTERS});return Array.from((e=a?.cues)!=null?e:[]).map(({text:r,startTime:s,endTime:n})=>({text:fl(r),startTime:s,endTime:n}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),s=(i=a.shadowRoot)==null?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return r?.addEventListener("load",t),s?.addEventListener("load",t),()=>{r?.removeEventListener("load",t),s?.removeEventListener("load",t)}}]},mediaIsPip:{get(t){var e,i;let{media:a,documentElement:r}=t;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return(e=a.localName)!=null&&e.includes("-")?Se(a,r.pictureInPictureElement):!1;if(r.pictureInPictureElement.localName.includes("-")){let s=r.pictureInPictureElement.shadowRoot;for(;s?.pictureInPictureElement;){if(s.pictureInPictureElement===a)return!0;s=(i=s.pictureInPictureElement)==null?void 0:i.shadowRoot}}return!1},set(t,e){let{media:i}=e;if(i)if(t){if(!G.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}let a=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(r=>{if(r.code===11){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(i.readyState===0&&i.preload==="none"){let s=()=>{i.removeEventListener("loadedmetadata",n),i.preload="none"},n=()=>{i.requestPictureInPicture().catch(a),s()};i.addEventListener("loadedmetadata",n),i.preload="metadata",setTimeout(()=>{i.readyState===0&&a(),s()},1e3)}else throw r}else throw r})}else G.pictureInPictureElement&&G.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(t){var e;let{media:i}=t;return[...(e=i?.videoRenditions)!=null?e:[]].map(a=>({...a}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(t){var e,i,a;let{media:r}=t;return(a=(i=r?.videoRenditions)==null?void 0:i[(e=r.videoRenditions)==null?void 0:e.selectedIndex])==null?void 0:a.id},set(t,e){let{media:i}=e;if(!i?.videoRenditions){console.warn("MediaController: Rendition selection not supported by this media.");return}let a=t,r=Array.prototype.findIndex.call(i.videoRenditions,s=>s.id==a);i.videoRenditions.selectedIndex!=r&&(i.videoRenditions.selectedIndex=r)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(t){var e;let{media:i}=t;return[...(e=i?.audioTracks)!=null?e:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(t){var e,i;let{media:a}=t;return(i=[...(e=a?.audioTracks)!=null?e:[]].find(r=>r.enabled))==null?void 0:i.id},set(t,e){let{media:i}=e;if(!i?.audioTracks){console.warn("MediaChrome: Audio track selection not supported by this media.");return}let a=t;for(let r of i.audioTracks)r.enabled=a==r.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get(t){return fs(t)},set(t,e,i){var a,r;t?(Es(e),i.detail&&!((a=e.media)!=null&&a.inert)&&((r=e.media)==null||r.focus())):vs(e)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(t){var e;let{media:i}=t;return!i?.remote||((e=i.remote)==null?void 0:e.state)==="disconnected"?!1:i.remote.state==="connected"},set(t,e){var i,a;let{media:r}=e;if(r&&!(t&&((i=r.remote)==null?void 0:i.state)!=="disconnected")&&!(!t&&((a=r.remote)==null?void 0:a.state)!=="connected")){if(typeof r.remote.prompt!="function"){console.warn("MediaChrome: Casting is not supported in this environment");return}r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get(){return!1},set(t,e){let{media:i}=e;if(i){if(!(i.webkitShowPlaybackTargetPicker&&l.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(t){let{media:e}=t;if(!bs||!wr(e))return ie.UNSUPPORTED}},mediaPipUnavailable:{get(t){let{media:e}=t;if(!As||!Lr(e))return ie.UNSUPPORTED;if(e?.disablePictureInPicture)return ie.UNAVAILABLE}},mediaVolumeUnavailable:{get(t){let{media:e}=t;if(ca===!1||e?.volume==null)return ie.UNSUPPORTED},stateOwnersUpdateHandlers:[t=>{ca==null&&El.then(e=>t(e?void 0:ie.UNSUPPORTED))}]},mediaCastUnavailable:{get(t,{availability:e="not-available"}={}){var i;let{media:a}=t;if(!Ss||!((i=a?.remote)!=null&&i.state))return ie.UNSUPPORTED;if(!(e==null||e==="available"))return ie.UNAVAILABLE},stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaAirplayUnavailable:{get(t,e){if(!Ts)return ie.UNSUPPORTED;if(e?.availability==="not-available")return ie.UNAVAILABLE},mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaRenditionUnavailable:{get(t){var e;let{media:i}=t;if(!i?.videoRenditions)return ie.UNSUPPORTED;if(!((e=i.videoRenditions)!=null&&e.length))return ie.UNAVAILABLE},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(t){var e,i;let{media:a}=t;if(!a?.audioTracks)return ie.UNSUPPORTED;if(((i=(e=a.audioTracks)==null?void 0:e.length)!=null?i:0)<=1)return ie.UNAVAILABLE},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(t){let{options:{mediaLang:e}={}}=t;return e??"en"}}};var ys={[m.MEDIA_PREVIEW_REQUEST](t,e,{detail:i}){var a,r,s;let{media:n}=e,d=i??void 0,c,S;if(n&&d!=null){let[p]=nt(n,{kind:te.METADATA,label:"thumbnails"}),g=Array.prototype.find.call((a=p?.cues)!=null?a:[],(v,M,I)=>M===0?v.endTime>d:M===I.length-1?v.startTime<=d:v.startTime<=d&&v.endTime>d);if(g){let v=/'^(?:[a-z]+:)?\/\//i.test(g.text)||(r=n?.querySelector('track[label="thumbnails"]'))==null?void 0:r.src,M=new URL(g.text,v);S=new URLSearchParams(M.hash).get("#xywh").split(",").map(V=>+V),c=M.href}}let k=t.mediaDuration.get(e),E=(s=t.mediaChaptersCues.get(e).find((p,g,v)=>g===v.length-1&&k===p.endTime?p.startTime<=d&&p.endTime>=d:p.startTime<=d&&p.endTime>d))==null?void 0:s.text;return i!=null&&E==null&&(E=""),{mediaPreviewTime:d,mediaPreviewImage:c,mediaPreviewCoords:S,mediaPreviewChapter:E}},[m.MEDIA_PAUSE_REQUEST](t,e){t["mediaPaused"].set(!0,e)},[m.MEDIA_PLAY_REQUEST](t,e){var i,a,r,s;let n="mediaPaused",c=t.mediaStreamType.get(e)===he.LIVE,S=!((i=e.options)!=null&&i.noAutoSeekToLive),k=t.mediaTargetLiveWindow.get(e)>0;if(c&&S&&!k){let T=(a=t.mediaSeekable.get(e))==null?void 0:a[1];if(T){let E=(s=(r=e.options)==null?void 0:r.seekToLiveOffset)!=null?s:0,p=T-E;t.mediaCurrentTime.set(p,e)}}t[n].set(!1,e)},[m.MEDIA_PLAYBACK_RATE_REQUEST](t,e,{detail:i}){let a="mediaPlaybackRate",r=i;t[a].set(r,e)},[m.MEDIA_MUTE_REQUEST](t,e){t["mediaMuted"].set(!0,e)},[m.MEDIA_UNMUTE_REQUEST](t,e){let i="mediaMuted";t.mediaVolume.get(e)||t.mediaVolume.set(.25,e),t[i].set(!1,e)},[m.MEDIA_LOOP_REQUEST](t,e,{detail:i}){let a="mediaLoop",r=!!i;return t[a].set(r,e),{mediaLoop:r}},[m.MEDIA_VOLUME_REQUEST](t,e,{detail:i}){let a="mediaVolume",r=i;r&&t.mediaMuted.get(e)&&t.mediaMuted.set(!1,e),t[a].set(r,e)},[m.MEDIA_SEEK_REQUEST](t,e,{detail:i}){let a="mediaCurrentTime",r=i;t[a].set(r,e)},[m.MEDIA_SEEK_TO_LIVE_REQUEST](t,e){var i,a,r;let s="mediaCurrentTime",n=(i=t.mediaSeekable.get(e))==null?void 0:i[1];if(Number.isNaN(Number(n)))return;let d=(r=(a=e.options)==null?void 0:a.seekToLiveOffset)!=null?r:0,c=n-d;t[s].set(c,e)},[m.MEDIA_SHOW_SUBTITLES_REQUEST](t,e,{detail:i}){var a;let{options:r}=e,s=wt(e),n=Mr(i),d=(a=n[0])==null?void 0:a.language;d&&!r.noSubtitlesLangPref&&l.localStorage.setItem("media-chrome-pref-subtitles-lang",d),st($e.SHOWING,s,n)},[m.MEDIA_DISABLE_SUBTITLES_REQUEST](t,e,{detail:i}){let a=wt(e),r=i??[];st($e.DISABLED,a,r)},[m.MEDIA_TOGGLE_SUBTITLES_REQUEST](t,e,{detail:i}){la(e,i)},[m.MEDIA_RENDITION_REQUEST](t,e,{detail:i}){let a="mediaRenditionSelected",r=i;t[a].set(r,e)},[m.MEDIA_AUDIO_TRACK_REQUEST](t,e,{detail:i}){let a="mediaAudioTrackEnabled",r=i;t[a].set(r,e)},[m.MEDIA_ENTER_PIP_REQUEST](t,e){let i="mediaIsPip";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[m.MEDIA_EXIT_PIP_REQUEST](t,e){t["mediaIsPip"].set(!1,e)},[m.MEDIA_ENTER_FULLSCREEN_REQUEST](t,e,i){let a="mediaIsFullscreen";t.mediaIsPip.get(e)&&t.mediaIsPip.set(!1,e),t[a].set(!0,e,i)},[m.MEDIA_EXIT_FULLSCREEN_REQUEST](t,e){t["mediaIsFullscreen"].set(!1,e)},[m.MEDIA_ENTER_CAST_REQUEST](t,e){let i="mediaIsCasting";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[m.MEDIA_EXIT_CAST_REQUEST](t,e){t["mediaIsCasting"].set(!1,e)},[m.MEDIA_AIRPLAY_REQUEST](t,e){t["mediaIsAirplaying"].set(!0,e)}};var ua=({media:t,fullscreenElement:e,documentElement:i,stateMediator:a=Rt,requestMap:r=ys,options:s={},monitorStateOwnersOnlyWithSubscriptions:n=!0})=>{let d=[],c={options:{...s}},S=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),k=v=>{v!=null&&(da(v,S)||(S=Object.freeze({...S,...v}),d.forEach(M=>M(S))))},T=()=>{let v=Object.entries(a).reduce((M,[I,{get:V}])=>(M[I]=V(c),M),{});k(v)},E={},p,g=async(v,M)=>{var I,V,Te,Ne,ce,se,ue,je,X,Et,zt,y,B,et,tt,Bi;let Cn=!!p;if(p={...c,...p??{},...v},Cn)return;await Is(...Object.values(v));let vt=d.length>0&&M===0&&n,Io=c.media!==p.media,yo=((I=c.media)==null?void 0:I.textTracks)!==((V=p.media)==null?void 0:V.textTracks),Mo=((Te=c.media)==null?void 0:Te.videoRenditions)!==((Ne=p.media)==null?void 0:Ne.videoRenditions),ko=((ce=c.media)==null?void 0:ce.audioTracks)!==((se=p.media)==null?void 0:se.audioTracks),Lo=((ue=c.media)==null?void 0:ue.remote)!==((je=p.media)==null?void 0:je.remote),wo=c.documentElement!==p.documentElement,Ro=!!c.media&&(Io||vt),Co=!!((X=c.media)!=null&&X.textTracks)&&(yo||vt),Do=!!((Et=c.media)!=null&&Et.videoRenditions)&&(Mo||vt),xo=!!((zt=c.media)!=null&&zt.audioTracks)&&(ko||vt),Oo=!!((y=c.media)!=null&&y.remote)&&(Lo||vt),Uo=!!c.documentElement&&(wo||vt),pr=Ro||Co||Do||xo||Oo||Uo,ft=d.length===0&&M===1&&n,Po=!!p.media&&(Io||ft),No=!!((B=p.media)!=null&&B.textTracks)&&(yo||ft),Ho=!!((et=p.media)!=null&&et.videoRenditions)&&(Mo||ft),Fo=!!((tt=p.media)!=null&&tt.audioTracks)&&(ko||ft),Bo=!!((Bi=p.media)!=null&&Bi.remote)&&(Lo||ft),$o=!!p.documentElement&&(wo||ft),Wo=Po||No||Ho||Fo||Bo||$o;if(!(pr||Wo)){Object.entries(p).forEach(([O,Zt])=>{c[O]=Zt}),T(),p=void 0;return}Object.entries(a).forEach(([O,{get:Zt,mediaEvents:Dn=[],textTracksEvents:xn=[],videoRenditionsEvents:On=[],audioTracksEvents:Un=[],remoteEvents:Pn=[],rootEvents:Nn=[],stateOwnersUpdateHandlers:Hn=[]}])=>{E[O]||(E[O]={});let re=H=>{let K=Zt(c,H);k({[O]:K})},Q;Q=E[O].mediaEvents,Dn.forEach(H=>{Q&&Ro&&(c.media.removeEventListener(H,Q),E[O].mediaEvents=void 0),Po&&(p.media.addEventListener(H,re),E[O].mediaEvents=re)}),Q=E[O].textTracksEvents,xn.forEach(H=>{var K,me;Q&&Co&&((K=c.media.textTracks)==null||K.removeEventListener(H,Q),E[O].textTracksEvents=void 0),No&&((me=p.media.textTracks)==null||me.addEventListener(H,re),E[O].textTracksEvents=re)}),Q=E[O].videoRenditionsEvents,On.forEach(H=>{var K,me;Q&&Do&&((K=c.media.videoRenditions)==null||K.removeEventListener(H,Q),E[O].videoRenditionsEvents=void 0),Ho&&((me=p.media.videoRenditions)==null||me.addEventListener(H,re),E[O].videoRenditionsEvents=re)}),Q=E[O].audioTracksEvents,Un.forEach(H=>{var K,me;Q&&xo&&((K=c.media.audioTracks)==null||K.removeEventListener(H,Q),E[O].audioTracksEvents=void 0),Fo&&((me=p.media.audioTracks)==null||me.addEventListener(H,re),E[O].audioTracksEvents=re)}),Q=E[O].remoteEvents,Pn.forEach(H=>{var K,me;Q&&Oo&&((K=c.media.remote)==null||K.removeEventListener(H,Q),E[O].remoteEvents=void 0),Bo&&((me=p.media.remote)==null||me.addEventListener(H,re),E[O].remoteEvents=re)}),Q=E[O].rootEvents,Nn.forEach(H=>{Q&&Uo&&(c.documentElement.removeEventListener(H,Q),E[O].rootEvents=void 0),$o&&(p.documentElement.addEventListener(H,re),E[O].rootEvents=re)});let $i=E[O].stateOwnersUpdateHandlers;if($i&&pr&&(Array.isArray($i)?$i:[$i]).forEach(K=>{typeof K=="function"&&K()}),Wo){let H=Hn.map(K=>K(re,p)).filter(K=>typeof K=="function");E[O].stateOwnersUpdateHandlers=H.length===1?H[0]:H}else pr&&(E[O].stateOwnersUpdateHandlers=void 0)}),Object.entries(p).forEach(([O,Zt])=>{c[O]=Zt}),T(),p=void 0};return g({media:t,fullscreenElement:e,documentElement:i,options:s}),{dispatch(v){let{type:M,detail:I}=v;if(r[M]&&S.mediaErrorCode==null){k(r[M](a,c,v));return}M==="mediaelementchangerequest"?g({media:I}):M==="fullscreenelementchangerequest"?g({fullscreenElement:I}):M==="documentelementchangerequest"?g({documentElement:I}):M==="optionschangerequest"&&(Object.entries(I??{}).forEach(([V,Te])=>{c.options[V]=Te}),T())},getState(){return S},subscribe(v){return g({},d.length+1),d.push(v),v(S),()=>{let M=d.indexOf(v);M>=0&&(g({},d.length-1),d.splice(M,1))}}}};var Pr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},f=(t,e,i)=>(Pr(t,e,"read from private field"),i?i.call(t):e.get(t)),ne=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ge=(t,e,i,a)=>(Pr(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),oi=(t,e,i)=>(Pr(t,e,"access private method"),i),Fe,si,C,ye,ni,Ie,ma,li,ha,Cr,dt,pa,Dr,xr,Ds,xs=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],Ms=10,ks=.025,Ls=.25,gl=.25,_l=2,u={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"},Or=class extends rt{constructor(){super(),ne(this,ha),ne(this,pa),ne(this,xr),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,ne(this,Fe,new Lt(this,u.HOTKEYS)),ne(this,si,void 0),ne(this,C,void 0),ne(this,ye,null),ne(this,ni,void 0),ne(this,Ie,void 0),ne(this,ma,i=>{var a;(a=f(this,C))==null||a.dispatch(i)}),ne(this,li,void 0),ne(this,dt,i=>{let{key:a,shiftKey:r}=i;if(!(r&&(a==="/"||a==="?")||xs.includes(a))){this.removeEventListener("keyup",f(this,dt));return}this.keyboardShortcutHandler(i)}),this.associateElement(this);let e={};ge(this,ni,i=>{Object.entries(i).forEach(([a,r])=>{if(a in e&&e[a]===r)return;this.propagateMediaState(a,r);let s=a.toLowerCase(),n=new l.CustomEvent(Ko[s],{composed:!0,detail:r});this.dispatchEvent(n)}),e=i})}static get observedAttributes(){return super.observedAttributes.concat(u.NO_HOTKEYS,u.HOTKEYS,u.DEFAULT_STREAM_TYPE,u.DEFAULT_SUBTITLES,u.DEFAULT_DURATION,u.NO_MUTED_PREF,u.NO_VOLUME_PREF,u.LANG,u.LOOP,u.LIVE_EDGE_OFFSET,u.SEEK_TO_LIVE_OFFSET,u.NO_AUTO_SEEK_TO_LIVE)}get mediaStore(){return f(this,C)}set mediaStore(e){var i,a;if(f(this,C)&&((i=f(this,Ie))==null||i.call(this),ge(this,Ie,void 0)),ge(this,C,e),!f(this,C)&&!this.hasAttribute(u.NO_DEFAULT_STORE)){oi(this,ha,Cr).call(this);return}ge(this,Ie,(a=f(this,C))==null?void 0:a.subscribe(f(this,ni)))}get fullscreenElement(){var e;return(e=f(this,si))!=null?e:this}set fullscreenElement(e){var i;this.hasAttribute(u.FULLSCREEN_ELEMENT)&&this.removeAttribute(u.FULLSCREEN_ELEMENT),ge(this,si,e),(i=f(this,C))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return _(this,u.DEFAULT_SUBTITLES)}set defaultSubtitles(e){b(this,u.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return R(this,u.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){w(this,u.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return D(this,u.DEFAULT_DURATION)}set defaultDuration(e){U(this,u.DEFAULT_DURATION,e)}get noHotkeys(){return _(this,u.NO_HOTKEYS)}set noHotkeys(e){b(this,u.NO_HOTKEYS,e)}get keysUsed(){return R(this,u.KEYS_USED)}set keysUsed(e){w(this,u.KEYS_USED,e)}get liveEdgeOffset(){return D(this,u.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){U(this,u.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return _(this,u.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){b(this,u.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return _(this,u.NO_VOLUME_PREF)}set noVolumePref(e){b(this,u.NO_VOLUME_PREF,e)}get noMutedPref(){return _(this,u.NO_MUTED_PREF)}set noMutedPref(e){b(this,u.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return _(this,u.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){b(this,u.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return _(this,u.NO_DEFAULT_STORE)}set noDefaultStore(e){b(this,u.NO_DEFAULT_STORE,e)}get resolvedLang(){return Xo()}attributeChangedCallback(e,i,a){var r,s,n,d,c,S,k,T,E,p,g,v;if(super.attributeChangedCallback(e,i,a),e===u.NO_HOTKEYS)a!==i&&a===""?(this.hasAttribute(u.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):a!==i&&a===null&&this.enableHotkeys();else if(e===u.HOTKEYS)f(this,Fe).value=a;else if(e===u.DEFAULT_SUBTITLES&&a!==i)(r=f(this,C))==null||r.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(u.DEFAULT_SUBTITLES)}});else if(e===u.DEFAULT_STREAM_TYPE)(n=f(this,C))==null||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:(s=this.getAttribute(u.DEFAULT_STREAM_TYPE))!=null?s:void 0}});else if(e===u.LIVE_EDGE_OFFSET&&a!==i)(d=f(this,C))==null||d.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(u.LIVE_EDGE_OFFSET)?+this.getAttribute(u.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(u.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(u.SEEK_TO_LIVE_OFFSET):this.hasAttribute(u.LIVE_EDGE_OFFSET)?+this.getAttribute(u.LIVE_EDGE_OFFSET):void 0}});else if(e===u.SEEK_TO_LIVE_OFFSET&&a!==i)(c=f(this,C))==null||c.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(u.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(u.SEEK_TO_LIVE_OFFSET):this.hasAttribute(u.LIVE_EDGE_OFFSET)?+this.getAttribute(u.LIVE_EDGE_OFFSET):void 0}});else if(e===u.NO_AUTO_SEEK_TO_LIVE)(S=f(this,C))==null||S.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(u.NO_AUTO_SEEK_TO_LIVE)}});else if(e===u.FULLSCREEN_ELEMENT){let M=a?(k=this.getRootNode())==null?void 0:k.getElementById(a):void 0;ge(this,si,M),(T=f(this,C))==null||T.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===u.LANG&&a!==i?(Zo(a),(E=f(this,C))==null||E.dispatch({type:"optionschangerequest",detail:{mediaLang:a}})):e===u.LOOP&&a!==i?(p=f(this,C))==null||p.dispatch({type:m.MEDIA_LOOP_REQUEST,detail:a!=null}):e===u.NO_VOLUME_PREF&&a!==i?(g=f(this,C))==null||g.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(u.NO_VOLUME_PREF)}}):e===u.NO_MUTED_PREF&&a!==i&&((v=f(this,C))==null||v.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(u.NO_MUTED_PREF)}}))}connectedCallback(){var e,i,a;this.associateElement(this),!f(this,C)&&!this.hasAttribute(u.NO_DEFAULT_STORE)&&oi(this,ha,Cr).call(this),(e=f(this,C))==null||e.dispatch({type:"documentelementchangerequest",detail:G}),(i=f(this,C))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement}),super.connectedCallback(),f(this,C)&&!f(this,Ie)&&ge(this,Ie,(a=f(this,C))==null?void 0:a.subscribe(f(this,ni))),f(this,li)!==void 0&&f(this,C)&&this.media&&setTimeout(()=>{var r,s,n;(s=(r=this.media)==null?void 0:r.textTracks)!=null&&s.length&&((n=f(this,C))==null||n.dispatch({type:m.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:f(this,li)}))},0),this.hasAttribute(u.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,i,a,r,s,n;if((e=super.disconnectedCallback)==null||e.call(this),this.disableHotkeys(),f(this,C)){let d=f(this,C).getState();ge(this,li,!!((i=d.mediaSubtitlesShowing)!=null&&i.length)),(a=f(this,C))==null||a.dispatch({type:"fullscreenelementchangerequest",detail:void 0}),(r=f(this,C))==null||r.dispatch({type:"documentelementchangerequest",detail:void 0}),(s=f(this,C))==null||s.dispatch({type:m.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}f(this,Ie)&&((n=f(this,Ie))==null||n.call(this),ge(this,Ie,void 0)),this.unassociateElement(this),f(this,ye)&&(f(this,ye).remove(),ge(this,ye,null))}mediaSetCallback(e){var i;super.mediaSetCallback(e),(i=f(this,C))==null||i.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var i;super.mediaUnsetCallback(e),(i=f(this,C))==null||i.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,i){Cs(this.mediaStateReceivers,e,i)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:i}=this;if(i.has(e))return;let a=this.registerMediaStateReceiver.bind(this),r=this.unregisterMediaStateReceiver.bind(this),s=yl(e,a,r);Object.values(m).forEach(n=>{e.addEventListener(n,f(this,ma))}),i.set(e,s)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:i}=this;if(!i.has(e))return;i.get(e)(),i.delete(e),Object.values(m).forEach(r=>{e.removeEventListener(r,f(this,ma))})}registerMediaStateReceiver(e){if(!e)return;let i=this.mediaStateReceivers;i.indexOf(e)>-1||(i.push(e),f(this,C)&&Object.entries(f(this,C).getState()).forEach(([r,s])=>{Cs([e],r,s)}))}unregisterMediaStateReceiver(e){let i=this.mediaStateReceivers,a=i.indexOf(e);a<0||i.splice(a,1)}enableHotkeys(){this.addEventListener("keydown",oi(this,pa,Dr))}disableHotkeys(){this.removeEventListener("keydown",oi(this,pa,Dr)),this.removeEventListener("keyup",f(this,dt))}get hotkeys(){return f(this,Fe)}set hotkeys(e){w(this,u.HOTKEYS,e)}keyboardShortcutHandler(e){var i,a,r,s,n,d,c,S,k;let T=e.target;if(((r=(a=(i=T.getAttribute(u.KEYS_USED))==null?void 0:i.split(" "))!=null?a:T?.keysUsed)!=null?r:[]).map(I=>I==="Space"?" ":I).filter(Boolean).includes(e.key))return;let p,g,v;if(!(f(this,Fe).contains(`no${e.key.toLowerCase()}`)||e.key===" "&&f(this,Fe).contains("nospace")||e.shiftKey&&(e.key==="/"||e.key==="?")&&f(this,Fe).contains("noshift+/")))switch(e.key){case" ":case"k":p=f(this,C).getState().mediaPaused?m.MEDIA_PLAY_REQUEST:m.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new l.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"m":p=this.mediaStore.getState().mediaVolumeLevel==="off"?m.MEDIA_UNMUTE_REQUEST:m.MEDIA_MUTE_REQUEST,this.dispatchEvent(new l.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"f":p=this.mediaStore.getState().mediaIsFullscreen?m.MEDIA_EXIT_FULLSCREEN_REQUEST:m.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new l.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new l.CustomEvent(m.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let I=this.hasAttribute(u.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(u.KEYBOARD_BACKWARD_SEEK_OFFSET):Ms;g=Math.max(((s=this.mediaStore.getState().mediaCurrentTime)!=null?s:0)-I,0),v=new l.CustomEvent(m.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case"ArrowRight":case"l":{let I=this.hasAttribute(u.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(u.KEYBOARD_FORWARD_SEEK_OFFSET):Ms;g=Math.max(((n=this.mediaStore.getState().mediaCurrentTime)!=null?n:0)+I,0),v=new l.CustomEvent(m.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case"ArrowUp":{let I=this.hasAttribute(u.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(u.KEYBOARD_UP_VOLUME_STEP):ks;g=Math.min(((d=this.mediaStore.getState().mediaVolume)!=null?d:1)+I,1),v=new l.CustomEvent(m.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case"ArrowDown":{let I=this.hasAttribute(u.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(u.KEYBOARD_DOWN_VOLUME_STEP):ks;g=Math.max(((c=this.mediaStore.getState().mediaVolume)!=null?c:1)-I,0),v=new l.CustomEvent(m.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case"<":{let I=(S=this.mediaStore.getState().mediaPlaybackRate)!=null?S:1;g=Math.max(I-Ls,gl).toFixed(2),v=new l.CustomEvent(m.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case">":{let I=(k=this.mediaStore.getState().mediaPlaybackRate)!=null?k:1;g=Math.min(I+Ls,_l).toFixed(2),v=new l.CustomEvent(m.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:g}),this.dispatchEvent(v);break}case"/":case"?":{e.shiftKey&&oi(this,xr,Ds).call(this);break}case"p":{p=this.mediaStore.getState().mediaIsPip?m.MEDIA_EXIT_PIP_REQUEST:m.MEDIA_ENTER_PIP_REQUEST,v=new l.CustomEvent(p,{composed:!0,bubbles:!0}),this.dispatchEvent(v);break}default:break}}};Fe=new WeakMap;si=new WeakMap;C=new WeakMap;ye=new WeakMap;ni=new WeakMap;Ie=new WeakMap;ma=new WeakMap;li=new WeakMap;ha=new WeakSet;Cr=function(){var t;this.mediaStore=ua({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(u.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(u.DEFAULT_DURATION)?+this.getAttribute(u.DEFAULT_DURATION):void 0,defaultStreamType:(t=this.getAttribute(u.DEFAULT_STREAM_TYPE))!=null?t:void 0,liveEdgeOffset:this.hasAttribute(u.LIVE_EDGE_OFFSET)?+this.getAttribute(u.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(u.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(u.SEEK_TO_LIVE_OFFSET):this.hasAttribute(u.LIVE_EDGE_OFFSET)?+this.getAttribute(u.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(u.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(u.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(u.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(u.NO_SUBTITLES_LANG_PREF)}})};dt=new WeakMap;pa=new WeakSet;Dr=function(t){var e;let{metaKey:i,altKey:a,key:r,shiftKey:s}=t,n=s&&(r==="/"||r==="?");if(n&&((e=f(this,ye))!=null&&e.open)){this.removeEventListener("keyup",f(this,dt));return}if(i||a||!n&&!xs.includes(r)){this.removeEventListener("keyup",f(this,dt));return}let d=t.target,c=d instanceof HTMLElement&&(d.tagName.toLowerCase()==="media-volume-range"||d.tagName.toLowerCase()==="media-time-range");[" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)&&!(f(this,Fe).contains(`no${r.toLowerCase()}`)||r===" "&&f(this,Fe).contains("nospace"))&&!c&&t.preventDefault(),this.addEventListener("keyup",f(this,dt),{once:!0})};xr=new WeakSet;Ds=function(){f(this,ye)||(ge(this,ye,G.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(f(this,ye))),f(this,ye).open=!0};var bl=Object.values(o),Al=Object.values(Er),Os=t=>{var e,i,a,r;let{observedAttributes:s}=t.constructor;!s&&((e=t.nodeName)!=null&&e.includes("-"))&&(l.customElements.upgrade(t),{observedAttributes:s}=t.constructor);let n=(r=(a=(i=t?.getAttribute)==null?void 0:i.call(t,L.MEDIA_CHROME_ATTRIBUTES))==null?void 0:a.split)==null?void 0:r.call(a,/\s+/);return Array.isArray(s||n)?(s||n).filter(d=>bl.includes(d)):[]},Tl=t=>{var e,i;return(e=t.nodeName)!=null&&e.includes("-")&&l.customElements.get((i=t.nodeName)==null?void 0:i.toLowerCase())&&!(t instanceof l.customElements.get(t.nodeName.toLowerCase()))&&l.customElements.upgrade(t),Al.some(a=>a in t)},Ur=t=>Tl(t)||!!Os(t).length,ws=t=>{var e;return(e=t?.join)==null?void 0:e.call(t,":")},Rs={[o.MEDIA_SUBTITLES_LIST]:ai,[o.MEDIA_SUBTITLES_SHOWING]:ai,[o.MEDIA_SEEKABLE]:ws,[o.MEDIA_BUFFERED]:t=>t?.map(ws).join(" "),[o.MEDIA_PREVIEW_COORDS]:t=>t?.join(" "),[o.MEDIA_RENDITION_LIST]:qo,[o.MEDIA_AUDIO_TRACK_LIST]:Yo},Sl=async(t,e,i)=>{var a,r;if(t.isConnected||await Vi(0),typeof i=="boolean"||i==null)return b(t,e,i);if(typeof i=="number")return U(t,e,i);if(typeof i=="string")return w(t,e,i);if(Array.isArray(i)&&!i.length)return t.removeAttribute(e);let s=(r=(a=Rs[e])==null?void 0:a.call(Rs,i))!=null?r:i;return t.setAttribute(e,s)},Il=t=>{var e;return!!((e=t.closest)!=null&&e.call(t,'*[slot="media"]'))},lt=(t,e)=>{if(Il(t))return;let i=(r,s)=>{var n,d;Ur(r)&&s(r);let{children:c=[]}=r??{},S=(d=(n=r?.shadowRoot)==null?void 0:n.children)!=null?d:[];[...c,...S].forEach(T=>lt(T,s))},a=t?.nodeName.toLowerCase();if(a.includes("-")&&!Ur(t)){l.customElements.whenDefined(a).then(()=>{i(t,e)});return}i(t,e)},Cs=(t,e,i)=>{t.forEach(a=>{if(e in a){a[e]=i;return}let r=Os(a),s=e.toLowerCase();r.includes(s)&&Sl(a,s,i)})},yl=(t,e,i)=>{lt(t,e);let a=k=>{var T;let E=(T=k?.composedPath()[0])!=null?T:k.target;e(E)},r=k=>{var T;let E=(T=k?.composedPath()[0])!=null?T:k.target;i(E)};t.addEventListener(m.REGISTER_MEDIA_STATE_RECEIVER,a),t.addEventListener(m.UNREGISTER_MEDIA_STATE_RECEIVER,r);let s=k=>{k.forEach(T=>{let{addedNodes:E=[],removedNodes:p=[],type:g,target:v,attributeName:M}=T;g==="childList"?(Array.prototype.forEach.call(E,I=>lt(I,e)),Array.prototype.forEach.call(p,I=>lt(I,i))):g==="attributes"&&M===L.MEDIA_CHROME_ATTRIBUTES&&(Ur(v)?e(v):i(v))})},n=[],d=k=>{let T=k.target;T.name!=="media"&&(n.forEach(E=>lt(E,i)),n=[...T.assignedElements({flatten:!0})],n.forEach(E=>lt(E,e)))};t.addEventListener("slotchange",d);let c=new MutationObserver(s);return c.observe(t,{childList:!0,attributes:!0,subtree:!0}),()=>{lt(t,i),t.removeEventListener("slotchange",d),c.disconnect(),t.removeEventListener(m.REGISTER_MEDIA_STATE_RECEIVER,a),t.removeEventListener(m.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};l.customElements.get("media-controller")||l.customElements.define("media-controller",Or);var Ct={PLACEMENT:"placement",BOUNDS:"bounds"};function Ml(t){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `}var Dt=class extends l.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!Xi(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let i=this.placement;if(i==="left"||i==="right"){this.style.removeProperty("--media-tooltip-offset-x");return}let a=getComputedStyle(this),r=(e=We(this,"#"+this.bounds))!=null?e:rs(this);if(!r)return;let{x:s,width:n}=r.getBoundingClientRect(),{x:d,width:c}=this.getBoundingClientRect(),S=d+c,k=s+n,T=a.getPropertyValue("--media-tooltip-offset-x"),E=T?parseFloat(T.replace("px","")):0,p=a.getPropertyValue("--media-tooltip-container-margin"),g=p?parseFloat(p.replace("px","")):0,v=d-s+E-g,M=S-k+E+g;if(v<0){this.style.setProperty("--media-tooltip-offset-x",`${v}px`);return}if(M>0){this.style.setProperty("--media-tooltip-offset-x",`${M}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){let e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[Ct.PLACEMENT,Ct.BOUNDS]}get placement(){return R(this,Ct.PLACEMENT)}set placement(e){w(this,Ct.PLACEMENT,e)}get bounds(){return R(this,Ct.BOUNDS)}set bounds(e){w(this,Ct.BOUNDS,e)}};Dt.shadowRootOptions={mode:"open"};Dt.getTemplateHTML=Ml;l.customElements.get("media-tooltip")||l.customElements.define("media-tooltip",Dt);var Ea=Dt;var Hr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},q=(t,e,i)=>(Hr(t,e,"read from private field"),i?i.call(t):e.get(t)),xt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},va=(t,e,i,a)=>(Hr(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),kl=(t,e,i)=>(Hr(t,e,"access private method"),i),Me,Ut,qe,Ot,fa,Nr,Us,Ge={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};function Ll(t,e={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      slot[name="icon"] {
        display: inline-flex;
        align-items: center;
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${Ea.shadowRootOptions.mode}">
          ${Ea.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(t)}
        </slot>
      </media-tooltip>
    </slot>
  `}function wl(t,e){return`
    <slot></slot>
  `}function Rl(){return""}var x=class extends l.HTMLElement{constructor(){if(super(),xt(this,Nr),xt(this,Me,void 0),this.preventClick=!1,this.tooltipEl=null,xt(this,Ut,e=>{this.preventClick||this.handleClick(e),setTimeout(q(this,qe),0)}),xt(this,qe,()=>{var e,i;(i=(e=this.tooltipEl)==null?void 0:e.updateXOffset)==null||i.call(e)}),xt(this,Ot,e=>{let{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",q(this,Ot));return}this.preventClick||this.handleClick(e)}),xt(this,fa,e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!this.keysUsed.includes(r)){this.removeEventListener("keyup",q(this,Ot));return}this.addEventListener("keyup",q(this,Ot),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",Ge.TOOLTIP_PLACEMENT,L.MEDIA_CONTROLLER,o.MEDIA_LANG]}enable(){this.addEventListener("click",q(this,Ut)),this.addEventListener("keydown",q(this,fa)),this.tabIndex=0}disable(){this.removeEventListener("click",q(this,Ut)),this.removeEventListener("keydown",q(this,fa)),this.removeEventListener("keyup",q(this,Ot)),this.tabIndex=-1}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===L.MEDIA_CONTROLLER?(i&&((s=(r=q(this,Me))==null?void 0:r.unassociateElement)==null||s.call(r,this),va(this,Me,null)),a&&this.isConnected&&(va(this,Me,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=q(this,Me))==null?void 0:d.associateElement)==null||c.call(d,this))):e==="disabled"&&a!==i?a==null?this.enable():this.disable():e===Ge.TOOLTIP_PLACEMENT&&this.tooltipEl&&a!==i?this.tooltipEl.placement=a:e===o.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),q(this,qe).call(this)}connectedCallback(){var e,i,a;let{style:r}=P(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let s=this.getAttribute(L.MEDIA_CONTROLLER);s&&(va(this,Me,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=q(this,Me))==null?void 0:i.associateElement)==null||a.call(i,this)),l.customElements.whenDefined("media-tooltip").then(()=>kl(this,Nr,Us).call(this))}disconnectedCallback(){var e,i;this.disable(),(i=(e=q(this,Me))==null?void 0:e.unassociateElement)==null||i.call(e,this),va(this,Me,null),this.removeEventListener("mouseenter",q(this,qe)),this.removeEventListener("focus",q(this,qe)),this.removeEventListener("click",q(this,Ut))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return R(this,Ge.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){w(this,Ge.TOOLTIP_PLACEMENT,e)}get mediaController(){return R(this,L.MEDIA_CONTROLLER)}set mediaController(e){w(this,L.MEDIA_CONTROLLER,e)}get disabled(){return _(this,Ge.DISABLED)}set disabled(e){b(this,Ge.DISABLED,e)}get noTooltip(){return _(this,Ge.NO_TOOLTIP)}set noTooltip(e){b(this,Ge.NO_TOOLTIP,e)}handleClick(e){}};Me=new WeakMap;Ut=new WeakMap;qe=new WeakMap;Ot=new WeakMap;fa=new WeakMap;Nr=new WeakSet;Us=function(){this.addEventListener("mouseenter",q(this,qe)),this.addEventListener("focus",q(this,qe)),this.addEventListener("click",q(this,Ut));let t=this.tooltipPlacement;t&&this.tooltipEl&&(this.tooltipEl.placement=t)};x.shadowRootOptions={mode:"open"};x.getTemplateHTML=Ll;x.getSlotTemplateHTML=wl;x.getTooltipContentHTML=Rl;l.customElements.get("media-chrome-button")||l.customElements.define("media-chrome-button",x);var Ps=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function Cl(t){return`
    <style>
      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Ps}</slot>
      <slot name="exit">${Ps}</slot>
    </slot>
  `}function Dl(){return`
    <slot name="tooltip-enter">${h("start airplay")}</slot>
    <slot name="tooltip-exit">${h("stop airplay")}</slot>
  `}var Ns=t=>{let e=t.mediaIsAirplaying?h("stop airplay"):h("start airplay");t.setAttribute("aria-label",e)},di=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_AIRPLAYING,o.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Ns(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_AIRPLAYING&&Ns(this)}get mediaIsAirplaying(){return _(this,o.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){b(this,o.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return R(this,o.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){w(this,o.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new l.CustomEvent(m.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}};di.getSlotTemplateHTML=Cl;di.getTooltipContentHTML=Dl;l.customElements.get("media-airplay-button")||l.customElements.define("media-airplay-button",di);var xl=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,Ol=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Ul(t){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${xl}</slot>
      <slot name="off">${Ol}</slot>
    </slot>
  `}function Pl(){return`
    <slot name="tooltip-enable">${h("Enable captions")}</slot>
    <slot name="tooltip-disable">${h("Disable captions")}</slot>
  `}var Hs=t=>{t.setAttribute("aria-checked",hs(t).toString())},ci=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_SUBTITLES_LIST,o.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.setAttribute("aria-label",h("closed captions")),Hs(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_SUBTITLES_SHOWING&&Hs(this)}get mediaSubtitlesList(){return Fs(this,o.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Bs(this,o.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Fs(this,o.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Bs(this,o.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new l.CustomEvent(m.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}};ci.getSlotTemplateHTML=Ul;ci.getTooltipContentHTML=Pl;var Fs=(t,e)=>{let i=t.getAttribute(e);return i?yr(i):[]},Bs=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}let a=ai(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};l.customElements.get("media-captions-button")||l.customElements.define("media-captions-button",ci);var Nl='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>',Hl='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>';function Fl(t){return`
    <style>
      :host([${o.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Nl}</slot>
      <slot name="exit">${Hl}</slot>
    </slot>
  `}function Bl(){return`
    <slot name="tooltip-enter">${h("Start casting")}</slot>
    <slot name="tooltip-exit">${h("Stop casting")}</slot>
  `}var $s=t=>{let e=t.mediaIsCasting?h("stop casting"):h("start casting");t.setAttribute("aria-label",e)},ui=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_CASTING,o.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),$s(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_CASTING&&$s(this)}get mediaIsCasting(){return _(this,o.MEDIA_IS_CASTING)}set mediaIsCasting(e){b(this,o.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return R(this,o.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){w(this,o.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?m.MEDIA_EXIT_CAST_REQUEST:m.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};ui.getSlotTemplateHTML=Fl;ui.getTooltipContentHTML=Bl;l.customElements.get("media-cast-button")||l.customElements.define("media-cast-button",ui);var Gr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ut=(t,e,i)=>(Gr(t,e,"read from private field"),i?i.call(t):e.get(t)),Be=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},qr=(t,e,i,a)=>(Gr(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ct=(t,e,i)=>(Gr(t,e,"access private method"),i),_a,hi,mt,ga,Fr,Br,Ws,$r,Vs,Wr,Ks,Vr,Gs,Kr,qs;function $l(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(t)}
  `}function Wl(t){return`
    <slot id="content"></slot>
  `}var mi={OPEN:"open",ANCHOR:"anchor"},ke=class extends l.HTMLElement{constructor(){super(),Be(this,ga),Be(this,Br),Be(this,$r),Be(this,Wr),Be(this,Vr),Be(this,Kr),Be(this,_a,!1),Be(this,hi,null),Be(this,mt,null)}static get observedAttributes(){return[mi.OPEN,mi.ANCHOR]}get open(){return _(this,mi.OPEN)}set open(e){b(this,mi.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":ct(this,Wr,Ks).call(this,e);break;case"focusout":ct(this,Vr,Gs).call(this,e);break;case"keydown":ct(this,Kr,qs).call(this,e);break}}connectedCallback(){ct(this,ga,Fr).call(this),this.role||(this.role="dialog"),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}disconnectedCallback(){this.removeEventListener("invoke",this),this.removeEventListener("focusout",this),this.removeEventListener("keydown",this)}attributeChangedCallback(e,i,a){ct(this,ga,Fr).call(this),e===mi.OPEN&&a!==i&&(this.open?ct(this,Br,Ws).call(this):ct(this,$r,Vs).call(this))}focus(){qr(this,hi,gr());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),i=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||i)return;let a=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');a?.focus()}get keysUsed(){return["Escape","Tab"]}};_a=new WeakMap;hi=new WeakMap;mt=new WeakMap;ga=new WeakSet;Fr=function(){if(!ut(this,_a)&&(qr(this,_a,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let t=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t),queueMicrotask(()=>{let{style:e}=P(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}};Br=new WeakSet;Ws=function(){var t;(t=ut(this,mt))==null||t.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})};$r=new WeakSet;Vs=function(){var t;(t=ut(this,mt))==null||t.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))};Wr=new WeakSet;Ks=function(t){qr(this,mt,t.relatedTarget),Se(this,t.relatedTarget)||(this.open=!this.open)};Vr=new WeakSet;Gs=function(t){var e;Se(this,t.relatedTarget)||((e=ut(this,hi))==null||e.focus(),ut(this,mt)&&ut(this,mt)!==t.relatedTarget&&this.open&&(this.open=!1))};Kr=new WeakSet;qs=function(t){var e,i,a,r,s;let{key:n,ctrlKey:d,altKey:c,metaKey:S}=t;d||c||S||this.keysUsed.includes(n)&&(t.preventDefault(),t.stopPropagation(),n==="Tab"?(t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(r=(a=this.nextElementSibling)==null?void 0:a.focus)==null||r.call(a),this.blur()):n==="Escape"&&((s=ut(this,hi))==null||s.focus(),this.open=!1))};ke.shadowRootOptions={mode:"open"};ke.getTemplateHTML=$l;ke.getSlotTemplateHTML=Wl;l.customElements.get("media-chrome-dialog")||l.customElements.define("media-chrome-dialog",ke);var jr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},F=(t,e,i)=>(jr(t,e,"read from private field"),i?i.call(t):e.get(t)),j=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ye=(t,e,i,a)=>(jr(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),_e=(t,e,i)=>(jr(t,e,"access private method"),i),Le,wa,ba,Aa,be,ka,Ta,Sa,Ia,eo,Ys,ya,Yr,Ma,Qr,La,to,zr,Qs,Zr,zs,Xr,Zs,Jr,Xs;function Vl(t){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, 0);
        height: var(--media-time-range-hover-height, max(100% , 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, 0);
          height: var(--media-time-range-hover-height, max(100%, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }

      /* Visible label for accessibility - positioned off-screen but technically visible (Firefox requires visible labels) */
      #range-label {
        position: absolute;
        left: -10000px;
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        pointer-events: none;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments" aria-hidden="true"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
        <input id="range" type="range" min="0" max="1" step="any" value="0">
        <label for="range" id="range-label"></label>

      ${this.getContainerTemplateHTML(t)}
    </div>
    <div id="rightgap"></div>
  `}function Kl(t){return""}var we=class extends l.HTMLElement{constructor(){if(super(),j(this,eo),j(this,ya),j(this,Ma),j(this,La),j(this,zr),j(this,Zr),j(this,Xr),j(this,Jr),j(this,Le,void 0),j(this,wa,void 0),j(this,ba,void 0),j(this,Aa,void 0),j(this,be,{}),j(this,ka,[]),j(this,Ta,()=>{if(this.range.matches(":focus-visible")){let{style:e}=P(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),j(this,Sa,()=>{let{style:e}=P(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),j(this,Ia,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.container=this.shadowRoot.querySelector("#container"),Ye(this,ba,this.shadowRoot.querySelector("#startpoint")),Ye(this,Aa,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",L.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===L.MEDIA_CONTROLLER?(i&&((s=(r=F(this,Le))==null?void 0:r.unassociateElement)==null||s.call(r,this),Ye(this,Le,null)),a&&this.isConnected&&(Ye(this,Le,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=F(this,Le))==null?void 0:d.associateElement)==null||c.call(d,this))):(e==="disabled"||e==="aria-disabled"&&i!==a)&&(a==null?(this.range.removeAttribute(e),_e(this,ya,Yr).call(this)):(this.range.setAttribute(e,a),_e(this,Ma,Qr).call(this)))}connectedCallback(){var e,i,a;let{style:r}=P(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),F(this,be).pointer=P(this.shadowRoot,"#pointer"),F(this,be).progress=P(this.shadowRoot,"#progress"),F(this,be).thumb=P(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),F(this,be).activeSegment=P(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let s=this.getAttribute(L.MEDIA_CONTROLLER);s&&(Ye(this,Le,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=F(this,Le))==null?void 0:i.associateElement)==null||a.call(i,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",F(this,Ta)),this.shadowRoot.addEventListener("focusout",F(this,Sa)),_e(this,ya,Yr).call(this),Yi(this.container,F(this,Ia))}disconnectedCallback(){var e,i;_e(this,Ma,Qr).call(this),(i=(e=F(this,Le))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ye(this,Le,null),this.shadowRoot.removeEventListener("focusin",F(this,Ta)),this.shadowRoot.removeEventListener("focusout",F(this,Sa)),Qi(this.container,F(this,Ia))}updatePointerBar(e){var i;(i=F(this,be).pointer)==null||i.style.setProperty("width",`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,i;let a=this.range.valueAsNumber*100;(e=F(this,be).progress)==null||e.style.setProperty("width",`${a}%`),(i=F(this,be).thumb)==null||i.style.setProperty("left",`${a}%`)}updateSegments(e){let i=this.shadowRoot.querySelector("#segments-clipping");if(i.textContent="",this.container.classList.toggle("segments",!!e?.length),!e?.length)return;let a=[...new Set([+this.range.min,...e.flatMap(s=>[s.start,s.end]),+this.range.max])];Ye(this,ka,[...a]);let r=a.pop();for(let[s,n]of a.entries()){let[d,c]=[s===0,s===a.length-1],S=d?"calc(var(--segments-gap) / -1)":`${n*100}%`,T=`calc(${((c?r:a[s+1])-n)*100}%${d||c?"":" - var(--segments-gap)"})`,E=G.createElementNS("http://www.w3.org/2000/svg","rect"),p=_r(this.shadowRoot,`#segments-clipping rect:nth-child(${s+1})`);p.style.setProperty("x",S),p.style.setProperty("width",T),i.append(E)}}getPointerRatio(e){return os(e.clientX,e.clientY,F(this,ba).getBoundingClientRect(),F(this,Aa).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":_e(this,Jr,Xs).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":_e(this,zr,Qs).call(this,e);break;case"pointerdown":_e(this,La,to).call(this,e);break;case"pointerup":_e(this,Zr,zs).call(this);break;case"pointerleave":_e(this,Xr,Zs).call(this);break}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}};Le=new WeakMap;wa=new WeakMap;ba=new WeakMap;Aa=new WeakMap;be=new WeakMap;ka=new WeakMap;Ta=new WeakMap;Sa=new WeakMap;Ia=new WeakMap;eo=new WeakSet;Ys=function(t){let e=F(this,be).activeSegment;if(!e)return;let i=this.getPointerRatio(t),r=`#segments-clipping rect:nth-child(${F(this,ka).findIndex((s,n,d)=>{let c=d[n+1];return c!=null&&i>=s&&i<=c})+1})`;(e.selectorText!=r||!e.style.transform)&&(e.selectorText=r,e.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))};ya=new WeakSet;Yr=function(){this.hasAttribute("disabled")||!this.isConnected||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))};Ma=new WeakSet;Qr=function(){var t,e;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),this.removeEventListener("pointerleave",this),(t=l.window)==null||t.removeEventListener("pointerup",this),(e=l.window)==null||e.removeEventListener("pointermove",this)};La=new WeakSet;to=function(t){var e;Ye(this,wa,t.composedPath().includes(this.range)),(e=l.window)==null||e.addEventListener("pointerup",this,{once:!0})};zr=new WeakSet;Qs=function(t){var e;t.pointerType!=="mouse"&&_e(this,La,to).call(this,t),this.addEventListener("pointerleave",this,{once:!0}),(e=l.window)==null||e.addEventListener("pointermove",this)};Zr=new WeakSet;zs=function(){var t;(t=l.window)==null||t.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")};Xr=new WeakSet;Zs=function(){var t,e;this.removeEventListener("pointerleave",this),(t=l.window)==null||t.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),(e=F(this,be).activeSegment)==null||e.style.removeProperty("transform")};Jr=new WeakSet;Xs=function(t){t.pointerType==="pen"&&t.buttons===0||(this.toggleAttribute("dragging",t.buttons===1||t.pointerType!=="mouse"),this.updatePointerBar(t),_e(this,eo,Ys).call(this,t),this.dragging&&(t.pointerType!=="mouse"||!F(this,wa))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(t),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))};we.shadowRootOptions={mode:"open"};we.getTemplateHTML=Vl;we.getContainerTemplateHTML=Kl;l.customElements.get("media-chrome-range")||l.customElements.define("media-chrome-range",we);var Js=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ra=(t,e,i)=>(Js(t,e,"read from private field"),i?i.call(t):e.get(t)),Gl=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ca=(t,e,i,a)=>(Js(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Re;function ql(t){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `}var pi=class extends l.HTMLElement{constructor(){if(super(),Gl(this,Re,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[L.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===L.MEDIA_CONTROLLER&&(i&&((s=(r=Ra(this,Re))==null?void 0:r.unassociateElement)==null||s.call(r,this),Ca(this,Re,null)),a&&this.isConnected&&(Ca(this,Re,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=Ra(this,Re))==null?void 0:d.associateElement)==null||c.call(d,this)))}connectedCallback(){var e,i,a;let r=this.getAttribute(L.MEDIA_CONTROLLER);r&&(Ca(this,Re,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Ra(this,Re))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Ra(this,Re))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ca(this,Re,null)}};Re=new WeakMap;pi.shadowRootOptions={mode:"open"};pi.getTemplateHTML=ql;l.customElements.get("media-control-bar")||l.customElements.define("media-control-bar",pi);var js=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Da=(t,e,i)=>(js(t,e,"read from private field"),i?i.call(t):e.get(t)),Yl=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},xa=(t,e,i,a)=>(js(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ce;function Ql(t,e={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}
  `}function zl(t,e){return`
    <slot></slot>
  `}var ae=class extends l.HTMLElement{constructor(){if(super(),Yl(this,Ce,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[L.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===L.MEDIA_CONTROLLER&&(i&&((s=(r=Da(this,Ce))==null?void 0:r.unassociateElement)==null||s.call(r,this),xa(this,Ce,null)),a&&this.isConnected&&(xa(this,Ce,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=Da(this,Ce))==null?void 0:d.associateElement)==null||c.call(d,this)))}connectedCallback(){var e,i,a;let{style:r}=P(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let s=this.getAttribute(L.MEDIA_CONTROLLER);s&&(xa(this,Ce,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=Da(this,Ce))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Da(this,Ce))==null?void 0:e.unassociateElement)==null||i.call(e,this),xa(this,Ce,null)}};Ce=new WeakMap;ae.shadowRootOptions={mode:"open"};ae.getTemplateHTML=Ql;ae.getSlotTemplateHTML=zl;l.customElements.get("media-text-display")||l.customElements.define("media-text-display",ae);var tn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},en=(t,e,i)=>(tn(t,e,"read from private field"),i?i.call(t):e.get(t)),Zl=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Xl=(t,e,i,a)=>(tn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ei;function Jl(t,e){return`
    <slot>${pe(e.mediaDuration)}</slot>
  `}var Oa=class extends ae{constructor(){var e;super(),Zl(this,Ei,void 0),Xl(this,Ei,this.shadowRoot.querySelector("slot")),en(this,Ei).textContent=pe((e=this.mediaDuration)!=null?e:0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_DURATION]}attributeChangedCallback(e,i,a){e===o.MEDIA_DURATION&&(en(this,Ei).textContent=pe(+a)),super.attributeChangedCallback(e,i,a)}get mediaDuration(){return D(this,o.MEDIA_DURATION)}set mediaDuration(e){U(this,o.MEDIA_DURATION,e)}};Ei=new WeakMap;Oa.getSlotTemplateHTML=Jl;l.customElements.get("media-duration-display")||l.customElements.define("media-duration-display",Oa);var jl={2:h("Network Error"),3:h("Decode Error"),4:h("Source Not Supported"),5:h("Encryption Error")},ed={2:h("A network error caused the media download to fail."),3:h("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:h("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:h("The media is encrypted and there are no keys to decrypt it.")},Ua=t=>{var e,i;return t.code===1?null:{title:(e=jl[t.code])!=null?e:`Error ${t.code}`,message:(i=ed[t.code])!=null?i:t.message}};var rn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},td=(t,e,i)=>(rn(t,e,"read from private field"),i?i.call(t):e.get(t)),id=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ad=(t,e,i,a)=>(rn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Pa;function rd(t){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${t.mediaerrorcode}" id="content">
      ${on({code:+t.mediaerrorcode,message:t.mediaerrormessage})}
    </slot>
  `}function od(t){return t.code&&Ua(t)!==null}function on(t){var e;let{title:i,message:a}=(e=Ua(t))!=null?e:{},r="";return i&&(r+=`<slot name="error-${t.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${t.code}-message"><p>${a}</p></slot>`),r}var an=[o.MEDIA_ERROR_CODE,o.MEDIA_ERROR_MESSAGE],vi=class extends ke{constructor(){super(...arguments),id(this,Pa,null)}static get observedAttributes(){return[...super.observedAttributes,...an]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,i,a){var r;if(super.attributeChangedCallback(e,i,a),!an.includes(e))return;let s=(r=this.mediaError)!=null?r:{code:this.mediaErrorCode,message:this.mediaErrorMessage};if(this.open=od(s),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(s),!this.hasAttribute("aria-label"))){let{title:n}=Ua(s);n&&this.setAttribute("aria-label",n)}}get mediaError(){return td(this,Pa)}set mediaError(e){ad(this,Pa,e)}get mediaErrorCode(){return D(this,"mediaerrorcode")}set mediaErrorCode(e){U(this,"mediaerrorcode",e)}get mediaErrorMessage(){return R(this,"mediaerrormessage")}set mediaErrorMessage(e){w(this,"mediaerrormessage",e)}};Pa=new WeakMap;vi.getSlotTemplateHTML=rd;vi.formatErrorMessage=on;l.customElements.get("media-error-dialog")||l.customElements.define("media-error-dialog",vi);var sd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Qe=(t,e,i)=>(sd(t,e,"read from private field"),i?i.call(t):e.get(t)),sn=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Pt,Nt;function nd(t){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${ld()}
    </slot>
  `}function ld(){return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["\u2190","j"],description:"Seek back 10s"},{keys:["\u2192","l"],description:"Seek forward 10s"},{keys:["\u2191"],description:"Turn volume up"},{keys:["\u2193"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:i,description:a})=>`
      <tr>
        <td>
          <div class="key-combo">${i.map((s,n)=>n>0?`<span class="key-separator">or</span><span class="key">${s}</span>`:`<span class="key">${s}</span>`).join("")}</div>
        </td>
        <td class="description">${a}</td>
      </tr>
    `).join("")}</table>
  `}var Na=class extends ke{constructor(){super(...arguments),sn(this,Pt,e=>{var i;if(!this.open)return;let a=(i=this.shadowRoot)==null?void 0:i.querySelector("#content");if(!a)return;let r=e.composedPath(),s=r[0]===this||r.includes(this),n=r.includes(a);s&&!n&&(this.open=!1)}),sn(this,Nt,e=>{if(!this.open)return;let i=e.shiftKey&&(e.key==="/"||e.key==="?");(e.key==="Escape"||i)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",Qe(this,Pt)),document.addEventListener("keydown",Qe(this,Nt)))}disconnectedCallback(){this.removeEventListener("click",Qe(this,Pt)),document.removeEventListener("keydown",Qe(this,Nt))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e==="open"&&(this.open?(this.addEventListener("click",Qe(this,Pt)),document.addEventListener("keydown",Qe(this,Nt))):(this.removeEventListener("click",Qe(this,Pt)),document.removeEventListener("keydown",Qe(this,Nt))))}};Pt=new WeakMap;Nt=new WeakMap;Na.getSlotTemplateHTML=nd;l.customElements.get("media-keyboard-shortcuts-dialog")||l.customElements.define("media-keyboard-shortcuts-dialog",Na);var ln=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},dd=(t,e,i)=>(ln(t,e,"read from private field"),i?i.call(t):e.get(t)),cd=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ud=(t,e,i,a)=>(ln(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ha,md=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,hd=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function pd(t){return`
    <style>
      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${md}</slot>
      <slot name="exit">${hd}</slot>
    </slot>
  `}function Ed(){return`
    <slot name="tooltip-enter">${h("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${h("Exit fullscreen mode")}</slot>
  `}var nn=t=>{let e=t.mediaIsFullscreen?h("exit fullscreen mode"):h("enter fullscreen mode");t.setAttribute("aria-label",e)},fi=class extends x{constructor(){super(...arguments),cd(this,Ha,null)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_FULLSCREEN,o.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),nn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_FULLSCREEN&&nn(this)}get mediaFullscreenUnavailable(){return R(this,o.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){w(this,o.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return _(this,o.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){b(this,o.MEDIA_IS_FULLSCREEN,e)}handleClick(e){ud(this,Ha,e);let i=dd(this,Ha)instanceof PointerEvent,a=this.mediaIsFullscreen?new l.CustomEvent(m.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new l.CustomEvent(m.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:i});this.dispatchEvent(a)}};Ha=new WeakMap;fi.getSlotTemplateHTML=pd;fi.getTooltipContentHTML=Ed;l.customElements.get("media-fullscreen-button")||l.customElements.define("media-fullscreen-button",fi);var{MEDIA_TIME_IS_LIVE:Fa,MEDIA_PAUSED:gi}=o,{MEDIA_SEEK_TO_LIVE_REQUEST:vd,MEDIA_PLAY_REQUEST:fd}=m,gd='<svg viewBox="0 0 6 12" aria-hidden="true"><circle cx="3" cy="6" r="2"></circle></svg>';function _d(t){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${Fa}]:not([${gi}])) slot[name=indicator] > *,
      :host([${Fa}]:not([${gi}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${Fa}]:not([${gi}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${gd}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${h("live")}</slot>
  `}var dn=t=>{var e;let i=t.mediaPaused||!t.mediaTimeIsLive,a=i?h("seek to live"):h("playing live");t.setAttribute("aria-label",a);let r=(e=t.shadowRoot)==null?void 0:e.querySelector('slot[name="text"]');r&&(r.textContent=h("live")),i?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled","true")},Ba=class extends x{static get observedAttributes(){return[...super.observedAttributes,Fa,gi]}connectedCallback(){super.connectedCallback(),dn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),dn(this)}get mediaPaused(){return _(this,o.MEDIA_PAUSED)}set mediaPaused(e){b(this,o.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return _(this,o.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){b(this,o.MEDIA_TIME_IS_LIVE,e)}handleClick(){!this.mediaPaused&&this.mediaTimeIsLive||(this.dispatchEvent(new l.CustomEvent(vd,{composed:!0,bubbles:!0})),this.hasAttribute(gi)&&this.dispatchEvent(new l.CustomEvent(fd,{composed:!0,bubbles:!0})))}};Ba.getSlotTemplateHTML=_d;l.customElements.get("media-live-button")||l.customElements.define("media-live-button",Ba);var un=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},_i=(t,e,i)=>(un(t,e,"read from private field"),i?i.call(t):e.get(t)),cn=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},bi=(t,e,i,a)=>(un(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),De,Wa,$a={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},mn=500,bd=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;function Ad(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${mn}ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${bd}</slot>
    <div id="status" role="status" aria-live="polite">${h("media loading")}</div>
  `}var Ai=class extends l.HTMLElement{constructor(){if(super(),cn(this,De,void 0),cn(this,Wa,mn),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[L.MEDIA_CONTROLLER,o.MEDIA_PAUSED,o.MEDIA_LOADING,$a.LOADING_DELAY]}attributeChangedCallback(e,i,a){var r,s,n,d,c;e===$a.LOADING_DELAY&&i!==a?this.loadingDelay=Number(a):e===L.MEDIA_CONTROLLER&&(i&&((s=(r=_i(this,De))==null?void 0:r.unassociateElement)==null||s.call(r,this),bi(this,De,null)),a&&this.isConnected&&(bi(this,De,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=_i(this,De))==null?void 0:d.associateElement)==null||c.call(d,this)))}connectedCallback(){var e,i,a;let r=this.getAttribute(L.MEDIA_CONTROLLER);r&&(bi(this,De,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=_i(this,De))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=_i(this,De))==null?void 0:e.unassociateElement)==null||i.call(e,this),bi(this,De,null)}get loadingDelay(){return _i(this,Wa)}set loadingDelay(e){bi(this,Wa,e);let{style:i}=P(this.shadowRoot,":host");i.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return _(this,o.MEDIA_PAUSED)}set mediaPaused(e){b(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return _(this,o.MEDIA_LOADING)}set mediaLoading(e){b(this,o.MEDIA_LOADING,e)}get mediaController(){return R(this,L.MEDIA_CONTROLLER)}set mediaController(e){w(this,L.MEDIA_CONTROLLER,e)}get noAutohide(){return _(this,$a.NO_AUTOHIDE)}set noAutohide(e){b(this,$a.NO_AUTOHIDE,e)}};De=new WeakMap;Wa=new WeakMap;Ai.shadowRootOptions={mode:"open"};Ai.getTemplateHTML=Ad;l.customElements.get("media-loading-indicator")||l.customElements.define("media-loading-indicator",Ai);var Td=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,hn=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,Sd=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function Id(t){return`
    <style>
      :host(:not([${o.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${o.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${Td}</slot>
      <slot name="low">${hn}</slot>
      <slot name="medium">${hn}</slot>
      <slot name="high">${Sd}</slot>
    </slot>
  `}function yd(){return`
    <slot name="tooltip-mute">${h("Mute")}</slot>
    <slot name="tooltip-unmute">${h("Unmute")}</slot>
  `}var pn=t=>{let i=t.mediaVolumeLevel==="off"?h("unmute"):h("mute");t.setAttribute("aria-label",i)},Ti=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),pn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_VOLUME_LEVEL&&pn(this)}get mediaVolumeLevel(){return R(this,o.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){w(this,o.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e=this.mediaVolumeLevel==="off"?m.MEDIA_UNMUTE_REQUEST:m.MEDIA_MUTE_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Ti.getSlotTemplateHTML=Id;Ti.getTooltipContentHTML=yd;l.customElements.get("media-mute-button")||l.customElements.define("media-mute-button",Ti);var En=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function Md(t){return`
    <style>
      :host([${o.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${En}</slot>
      <slot name="exit">${En}</slot>
    </slot>
  `}function kd(){return`
    <slot name="tooltip-enter">${h("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${h("Exit picture in picture mode")}</slot>
  `}var vn=t=>{let e=t.mediaIsPip?h("exit picture in picture mode"):h("enter picture in picture mode");t.setAttribute("aria-label",e)},Si=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_PIP,o.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),vn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_PIP&&vn(this)}get mediaPipUnavailable(){return R(this,o.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){w(this,o.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return _(this,o.MEDIA_IS_PIP)}set mediaIsPip(e){b(this,o.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?m.MEDIA_EXIT_PIP_REQUEST:m.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Si.getSlotTemplateHTML=Md;Si.getTooltipContentHTML=kd;l.customElements.get("media-pip-button")||l.customElements.define("media-pip-button",Si);var Ld=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ht=(t,e,i)=>(Ld(t,e,"read from private field"),i?i.call(t):e.get(t)),wd=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ze,io={RATES:"rates"},Rd=[1,1.2,1.5,1.7,2],Ii=1;function ao(t){return Math.round(t*100)/100}function Cd(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate?ao(+t.mediaplaybackrate):Ii}x</slot>
  `}function Dd(){return h("Playback rate")}var yi=class extends x{constructor(){var e;super(),wd(this,ze,new Lt(this,io.RATES,{defaultValue:Rd})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${ao((e=this.mediaPlaybackRate)!=null?e:Ii)}x`}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE,io.RATES]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===io.RATES&&(Ht(this,ze).value=a),e===o.MEDIA_PLAYBACK_RATE){let r=a?+a:Number.NaN,s=ao(Number.isNaN(r)?Ii:r);this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",h("Playback rate {playbackRate}",{playbackRate:s}))}}get rates(){return Ht(this,ze)}set rates(e){e?Array.isArray(e)?Ht(this,ze).value=e.join(" "):typeof e=="string"&&(Ht(this,ze).value=e):Ht(this,ze).value=""}get mediaPlaybackRate(){return D(this,o.MEDIA_PLAYBACK_RATE,Ii)}set mediaPlaybackRate(e){U(this,o.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,i;let a=Array.from(Ht(this,ze).values(),n=>+n).sort((n,d)=>n-d),r=(i=(e=a.find(n=>n>this.mediaPlaybackRate))!=null?e:a[0])!=null?i:Ii,s=new l.CustomEvent(m.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:r});this.dispatchEvent(s)}};ze=new WeakMap;yi.getSlotTemplateHTML=Cd;yi.getTooltipContentHTML=Dd;l.customElements.get("media-playback-rate-button")||l.customElements.define("media-playback-rate-button",yi);var xd=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Od=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function Ud(t){return`
    <style>
      :host([${o.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${o.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${xd}</slot>
      <slot name="pause">${Od}</slot>
    </slot>
  `}function Pd(){return`
    <slot name="tooltip-play">${h("Play")}</slot>
    <slot name="tooltip-pause">${h("Pause")}</slot>
  `}var fn=t=>{let e=t.mediaPaused?h("play"):h("pause");t.setAttribute("aria-label",e)},Mi=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),fn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PAUSED||e===o.MEDIA_LANG)&&fn(this)}get mediaPaused(){return _(this,o.MEDIA_PAUSED)}set mediaPaused(e){b(this,o.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?m.MEDIA_PLAY_REQUEST:m.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Mi.getSlotTemplateHTML=Ud;Mi.getTooltipContentHTML=Pd;l.customElements.get("media-play-button")||l.customElements.define("media-play-button",Mi);var xe={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};function Nd(t){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `}var Hd=t=>{t.style.removeProperty("background-image")},Fd=(t,e)=>{t.style["background-image"]=`url('${e}')`},ki=class extends l.HTMLElement{static get observedAttributes(){return[xe.PLACEHOLDER_SRC,xe.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,i,a){e===xe.SRC&&(a==null?this.image.removeAttribute(xe.SRC):this.image.setAttribute(xe.SRC,a)),e===xe.PLACEHOLDER_SRC&&(a==null?Hd(this.image):Fd(this.image,a))}get placeholderSrc(){return R(this,xe.PLACEHOLDER_SRC)}set placeholderSrc(e){w(this,xe.SRC,e)}get src(){return R(this,xe.SRC)}set src(e){w(this,xe.SRC,e)}};ki.shadowRootOptions={mode:"open"};ki.getTemplateHTML=Nd;l.customElements.get("media-poster-image")||l.customElements.define("media-poster-image",ki);var gn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Bd=(t,e,i)=>(gn(t,e,"read from private field"),i?i.call(t):e.get(t)),$d=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Wd=(t,e,i,a)=>(gn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Va,ro=class extends ae{constructor(){super(),$d(this,Va,void 0),Wd(this,Va,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_LANG]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PREVIEW_CHAPTER||e===o.MEDIA_LANG)&&a!==i&&a!=null)if(Bd(this,Va).textContent=a,a!==""){let r=h("chapter: {chapterName}",{chapterName:a});this.setAttribute("aria-valuetext",r)}else this.removeAttribute("aria-valuetext")}get mediaPreviewChapter(){return R(this,o.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){w(this,o.MEDIA_PREVIEW_CHAPTER,e)}};Va=new WeakMap;l.customElements.get("media-preview-chapter-display")||l.customElements.define("media-preview-chapter-display",ro);var _n=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ka=(t,e,i)=>(_n(t,e,"read from private field"),i?i.call(t):e.get(t)),Vd=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ga=(t,e,i,a)=>(_n(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Oe;function Kd(t){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `}var Ft=class extends l.HTMLElement{constructor(){if(super(),Vd(this,Oe,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[L.MEDIA_CONTROLLER,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,i,a;let r=this.getAttribute(L.MEDIA_CONTROLLER);r&&(Ga(this,Oe,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Ka(this,Oe))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Ka(this,Oe))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ga(this,Oe,null)}attributeChangedCallback(e,i,a){var r,s,n,d,c;[o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===L.MEDIA_CONTROLLER&&(i&&((s=(r=Ka(this,Oe))==null?void 0:r.unassociateElement)==null||s.call(r,this),Ga(this,Oe,null)),a&&this.isConnected&&(Ga(this,Oe,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(d=Ka(this,Oe))==null?void 0:d.associateElement)==null||c.call(d,this)))}get mediaPreviewImage(){return R(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){w(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(o.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(i=>+i)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(o.MEDIA_PREVIEW_COORDS);return}this.setAttribute(o.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){let e=this.mediaPreviewCoords,i=this.mediaPreviewImage;if(!(e&&i))return;let[a,r,s,n]=e,d=i.split("#")[0],c=getComputedStyle(this),{maxWidth:S,maxHeight:k,minWidth:T,minHeight:E}=c,p=c.getPropertyValue("--media-preview-thumbnail-object-fit").trim()||"contain",g,v;if(p==="fill"){let se=parseInt(S)/s,ue=parseInt(k)/n,je=parseInt(T)/s,X=parseInt(E)/n;g=se<1?se:Math.max(se,je),v=ue<1?ue:Math.max(ue,X)}else{let se=Math.min(parseInt(S)/s,parseInt(k)/n),ue=Math.max(parseInt(T)/s,parseInt(E)/n),X=se<1?se:ue>1?ue:1;g=X,v=X}let{style:M}=P(this.shadowRoot,":host"),I=P(this.shadowRoot,"img").style,V=this.shadowRoot.querySelector("img"),Ne=Math.min(g,v)<1?"min":"max";M.setProperty(`${Ne}-width`,"initial","important"),M.setProperty(`${Ne}-height`,"initial","important"),M.width=`${s*g}px`,M.height=`${n*v}px`;let ce=()=>{I.width=`${this.imgWidth*g}px`,I.height=`${this.imgHeight*v}px`,I.display="block"};V.src!==d&&(V.onload=()=>{this.imgWidth=V.naturalWidth,this.imgHeight=V.naturalHeight,ce(),V.onload=null},V.src=d,ce()),ce(),I.transform=`translate(-${a*g}px, -${r*v}px)`}};Oe=new WeakMap;Ft.shadowRootOptions={mode:"open"};Ft.getTemplateHTML=Kd;l.customElements.get("media-preview-thumbnail")||l.customElements.define("media-preview-thumbnail",Ft);var qa=Ft;var An=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},bn=(t,e,i)=>(An(t,e,"read from private field"),i?i.call(t):e.get(t)),Gd=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},qd=(t,e,i,a)=>(An(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Li,oo=class extends ae{constructor(){super(),Gd(this,Li,void 0),qd(this,Li,this.shadowRoot.querySelector("slot")),bn(this,Li).textContent=pe(0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_PREVIEW_TIME&&a!=null&&(bn(this,Li).textContent=pe(parseFloat(a)))}get mediaPreviewTime(){return D(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){U(this,o.MEDIA_PREVIEW_TIME,e)}};Li=new WeakMap;l.customElements.get("media-preview-time-display")||l.customElements.define("media-preview-time-display",oo);var Bt={SEEK_OFFSET:"seekoffset"},so=30,Yd=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${t}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function Qd(t,e){return`
    <slot name="icon">${Yd(e.seekOffset)}</slot>
  `}var zd=(t,e)=>{t.setAttribute("aria-label",h("seek back {seekOffset} seconds",{seekOffset:e}))};function Zd(){return h("Seek backward")}var Xd=0,wi=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,Bt.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=D(this,Bt.SEEK_OFFSET,so)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),zd(this,this.seekOffset),e===Bt.SEEK_OFFSET&&(this.seekOffset=D(this,Bt.SEEK_OFFSET,so))}get seekOffset(){return D(this,Bt.SEEK_OFFSET,so)}set seekOffset(e){U(this,Bt.SEEK_OFFSET,e),this.setAttribute("aria-label",h("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),zi(Zi(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return D(this,o.MEDIA_CURRENT_TIME,Xd)}set mediaCurrentTime(e){U(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),i=new l.CustomEvent(m.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};wi.getSlotTemplateHTML=Qd;wi.getTooltipContentHTML=Zd;l.customElements.get("media-seek-backward-button")||l.customElements.define("media-seek-backward-button",wi);var $t={SEEK_OFFSET:"seekoffset"},no=30,Jd=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${t}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function jd(t,e){return`
    <slot name="icon">${Jd(e.seekOffset)}</slot>
  `}var ec=(t,e)=>{t.setAttribute("aria-label",h("seek forward {seekOffset} seconds",{seekOffset:e}))};function tc(){return h("Seek forward")}var ic=0,Ri=class extends x{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,$t.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=D(this,$t.SEEK_OFFSET,no)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),ec(this,this.seekOffset),e===$t.SEEK_OFFSET&&(this.seekOffset=D(this,$t.SEEK_OFFSET,no))}get seekOffset(){return D(this,$t.SEEK_OFFSET,no)}set seekOffset(e){U(this,$t.SEEK_OFFSET,e),this.setAttribute("aria-label",h("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),zi(Zi(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return D(this,o.MEDIA_CURRENT_TIME,ic)}set mediaCurrentTime(e){U(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,i=new l.CustomEvent(m.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};Ri.getSlotTemplateHTML=jd;Ri.getTooltipContentHTML=tc;l.customElements.get("media-seek-forward-button")||l.customElements.define("media-seek-forward-button",Ri);var uo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ae=(t,e,i)=>(uo(t,e,"read from private field"),i?i.call(t):e.get(t)),ht=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},mo=(t,e,i,a)=>(uo(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Xe=(t,e,i)=>(uo(t,e,"access private method"),i),Wt,Ue,Xa,ho,Sn,za,po,Ci,Ya,Qa,lo,Ze={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},Tn=[...Object.values(Ze),o.MEDIA_CURRENT_TIME,o.MEDIA_DURATION,o.MEDIA_SEEKABLE],In=["Enter"," "],ac="&nbsp;/&nbsp;",co=(t,{timesSep:e=ac}={})=>{var i,a;let r=(i=t.mediaCurrentTime)!=null?i:0,[,s]=(a=t.mediaSeekable)!=null?a:[],n=0;Number.isFinite(t.mediaDuration)?n=t.mediaDuration:Number.isFinite(s)&&(n=s);let d=t.remaining?pe(0-(n-r)):pe(r);return t.showDuration?`${d}${e}${pe(n)}`:d},rc=t=>{var e;let i=t.mediaCurrentTime,[,a]=(e=t.mediaSeekable)!=null?e:[],r=null;if(Number.isFinite(t.mediaDuration)?r=t.mediaDuration:Number.isFinite(a)&&(r=a),i==null||r===null){t.setAttribute("aria-description",h("video not loaded, unknown time."));return}let s=t.remaining?at(0-(r-i)):at(i);if(!t.showDuration){t.setAttribute("aria-description",s);return}let n=at(r),d=h("{currentTime} of {totalTime}",{currentTime:s,totalTime:n});t.setAttribute("aria-description",d)};function oc(t,e){return`
    <slot>${co(e)}</slot>
  `}var sc=t=>{t.setAttribute("aria-label",h("playback time"))},Za=class extends ae{constructor(){super(),ht(this,ho),ht(this,za),ht(this,Ci),ht(this,Qa),ht(this,Wt,void 0),ht(this,Ue,null),ht(this,Xa,e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!In.includes(r)){this.removeEventListener("keyup",Ae(this,Ue));return}this.addEventListener("keyup",Ae(this,Ue))}),mo(this,Wt,this.shadowRoot.querySelector("slot")),Ae(this,Wt).innerHTML=`${co(this)}`}static get observedAttributes(){return[...super.observedAttributes,...Tn,"disabled"]}connectedCallback(){let{style:e}=P(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.setAttribute("aria-label",h("playback time")),Xe(this,Ci,Ya).call(this),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),Xe(this,za,po).call(this),super.disconnectedCallback()}attributeChangedCallback(e,i,a){sc(this),Tn.includes(e)?this.update():e==="disabled"&&a!==i?a==null?Xe(this,Ci,Ya).call(this):Xe(this,Qa,lo).call(this):e===Ze.NO_TOGGLE&&a!==i&&(this.noToggle?Xe(this,Qa,lo).call(this):Xe(this,Ci,Ya).call(this)),super.attributeChangedCallback(e,i,a)}enable(){this.noToggle||(this.tabIndex=0)}disable(){this.tabIndex=-1}get remaining(){return _(this,Ze.REMAINING)}set remaining(e){b(this,Ze.REMAINING,e)}get showDuration(){return _(this,Ze.SHOW_DURATION)}set showDuration(e){b(this,Ze.SHOW_DURATION,e)}get noToggle(){return _(this,Ze.NO_TOGGLE)}set noToggle(e){b(this,Ze.NO_TOGGLE,e)}get mediaDuration(){return D(this,o.MEDIA_DURATION)}set mediaDuration(e){U(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return D(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){U(this,o.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}update(){let e=co(this);rc(this),e!==Ae(this,Wt).innerHTML&&(Ae(this,Wt).innerHTML=e)}};Wt=new WeakMap;Ue=new WeakMap;Xa=new WeakMap;ho=new WeakSet;Sn=function(){Ae(this,Ue)||(mo(this,Ue,t=>{let{key:e}=t;if(!In.includes(e)){this.removeEventListener("keyup",Ae(this,Ue));return}this.toggleTimeDisplay()}),this.addEventListener("keydown",Ae(this,Xa)),this.addEventListener("click",this.toggleTimeDisplay))};za=new WeakSet;po=function(){Ae(this,Ue)&&(this.removeEventListener("keyup",Ae(this,Ue)),this.removeEventListener("keydown",Ae(this,Xa)),this.removeEventListener("click",this.toggleTimeDisplay),mo(this,Ue,null))};Ci=new WeakSet;Ya=function(){!this.noToggle&&!this.hasAttribute("disabled")&&(this.setAttribute("role","button"),this.enable(),Xe(this,ho,Sn).call(this))};Qa=new WeakSet;lo=function(){this.removeAttribute("role"),this.disable(),Xe(this,za,po).call(this)};Za.getSlotTemplateHTML=oc;l.customElements.get("media-time-display")||l.customElements.define("media-time-display",Za);var yn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Z=(t,e,i)=>(yn(t,e,"read from private field"),i?i.call(t):e.get(t)),Pe=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},oe=(t,e,i,a)=>(yn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),nc=(t,e,i,a)=>({set _(r){oe(t,e,r,i)},get _(){return Z(t,e,a)}}),Vt,Ja,Kt,Di,ja,er,tr,Gt,pt,ir,ar=class{constructor(e,i,a){Pe(this,Vt,void 0),Pe(this,Ja,void 0),Pe(this,Kt,void 0),Pe(this,Di,void 0),Pe(this,ja,void 0),Pe(this,er,void 0),Pe(this,tr,void 0),Pe(this,Gt,void 0),Pe(this,pt,0),Pe(this,ir,(r=performance.now())=>{oe(this,pt,requestAnimationFrame(Z(this,ir))),oe(this,Di,performance.now()-Z(this,Kt));let s=1e3/this.fps;if(Z(this,Di)>s){oe(this,Kt,r-Z(this,Di)%s);let n=1e3/((r-Z(this,Ja))/++nc(this,ja)._),d=(r-Z(this,er))/1e3/this.duration,c=Z(this,tr)+d*this.playbackRate;c-Z(this,Vt).valueAsNumber>0?oe(this,Gt,this.playbackRate/this.duration/n):(oe(this,Gt,.995*Z(this,Gt)),c=Z(this,Vt).valueAsNumber+Z(this,Gt)),this.callback(c)}}),oe(this,Vt,e),this.callback=i,this.fps=a}start(){Z(this,pt)===0&&(oe(this,Kt,performance.now()),oe(this,Ja,Z(this,Kt)),oe(this,ja,0),Z(this,ir).call(this))}stop(){Z(this,pt)!==0&&(cancelAnimationFrame(Z(this,pt)),oe(this,pt,0))}update({start:e,duration:i,playbackRate:a}){let r=e-Z(this,Vt).valueAsNumber,s=Math.abs(i-this.duration);(r>0||r<-.03||s>=.5)&&this.callback(e),oe(this,tr,e),oe(this,er,performance.now()),this.duration=i,this.playbackRate=a}};Vt=new WeakMap;Ja=new WeakMap;Kt=new WeakMap;Di=new WeakMap;ja=new WeakMap;er=new WeakMap;tr=new WeakMap;Gt=new WeakMap;pt=new WeakMap;ir=new WeakMap;var _o=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},N=(t,e,i)=>(_o(t,e,"read from private field"),i?i.call(t):e.get(t)),Y=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},le=(t,e,i,a)=>(_o(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),de=(t,e,i)=>(_o(t,e,"access private method"),i),qt,Je,sr,Oi,nr,or,Ui,Pi,Yt,Qt,xi,Eo,Mn,vo,lr,bo,dr,Ao,cr,To,fo,kn,Ni,ur,go,Ln,lc=t=>{let e=t.range,i=at(+wn(t)),a=at(+t.mediaSeekableEnd),r=i&&a?h("{currentTime} of {totalTime}",{currentTime:i,totalTime:a}):h("video not loaded, unknown time.");e.setAttribute("aria-valuetext",r)};function dc(t){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${qa.shadowRootOptions.mode}">
            ${qa.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `}var rr=(t,e=t.mediaCurrentTime)=>{let i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;if(Number.isNaN(a))return 0;let r=(e-i)/(a-i);return Math.max(0,Math.min(r,1))},wn=(t,e=t.range.valueAsNumber)=>{let i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;return Number.isNaN(a)?0:e*(a-i)+i},Hi=class extends we{constructor(){super(),Y(this,Eo),Y(this,lr),Y(this,dr),Y(this,cr),Y(this,fo),Y(this,Ni),Y(this,go),Y(this,qt,null),Y(this,Je,void 0),Y(this,sr,void 0),Y(this,Oi,void 0),Y(this,nr,void 0),Y(this,or,void 0),Y(this,Ui,void 0),Y(this,Pi,void 0),Y(this,Yt,void 0),Y(this,Qt,void 0),Y(this,xi,()=>{de(this,Eo,Mn).call(this)?N(this,Je).start():N(this,Je).stop()}),Y(this,vo,a=>{this.dragging||(gt(a)&&(this.range.valueAsNumber=a),N(this,Qt)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),le(this,sr,this.shadowRoot.querySelectorAll('[part~="box"]')),le(this,nr,this.shadowRoot.querySelector('[part~="preview-box"]')),le(this,or,this.shadowRoot.querySelector('[part~="current-box"]'));let i=getComputedStyle(this);le(this,Ui,parseInt(i.getPropertyValue("--media-box-padding-left"))),le(this,Pi,parseInt(i.getPropertyValue("--media-box-padding-right"))),le(this,Je,new ar(this.range,N(this,vo),60))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_DURATION,o.MEDIA_SEEKABLE,o.MEDIA_CURRENT_TIME,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_TIME,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_BUFFERED,o.MEDIA_PLAYBACK_RATE,o.MEDIA_LOADING,o.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",h("seek")),N(this,xi).call(this),le(this,qt,this.getRootNode()),(e=N(this,qt))==null||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),N(this,Je).stop(),(e=N(this,qt))==null||e.removeEventListener("transitionstart",this),le(this,qt,null)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),i!=a&&(e===o.MEDIA_CURRENT_TIME||e===o.MEDIA_PAUSED||e===o.MEDIA_ENDED||e===o.MEDIA_LOADING||e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE?(N(this,Je).update({start:rr(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),N(this,xi).call(this),lc(this)):e===o.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=N(this,Yt),this.updateBar()))}get mediaChaptersCues(){return N(this,Yt)}set mediaChaptersCues(e){var i;le(this,Yt,e),this.updateSegments((i=N(this,Yt))==null?void 0:i.map(a=>({start:rr(this,a.startTime),end:rr(this,a.endTime)})))}get mediaPaused(){return _(this,o.MEDIA_PAUSED)}set mediaPaused(e){b(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return _(this,o.MEDIA_LOADING)}set mediaLoading(e){b(this,o.MEDIA_LOADING,e)}get mediaDuration(){return D(this,o.MEDIA_DURATION)}set mediaDuration(e){U(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return D(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){U(this,o.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return D(this,o.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){U(this,o.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(o.MEDIA_BUFFERED);return e?e.split(" ").map(i=>i.split(":").map(a=>+a)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(o.MEDIA_BUFFERED);return}let i=e.map(a=>a.join(":")).join(" ");this.setAttribute(o.MEDIA_BUFFERED,i)}get mediaSeekable(){let e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,i=this.mediaDuration]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaSeekableStart(){var e;let[i=0]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaPreviewImage(){return R(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){w(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return D(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){U(this,o.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return _(this,o.MEDIA_ENDED)}set mediaEnded(e){b(this,o.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let i=this.mediaBuffered;if(!i.length)return;let a;if(this.mediaEnded)a=1;else{let s=this.mediaCurrentTime,[,n=this.mediaSeekableStart]=(e=i.find(([d,c])=>d<=s&&s<=c))!=null?e:[];a=rr(this,n)}let{style:r}=P(this.shadowRoot,"#buffered");r.setProperty("width",`${a*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let i=P(this.shadowRoot,"#current-rail"),a=P(this.shadowRoot,'[part~="current-box"]'),r=de(this,lr,bo).call(this,N(this,or)),s=de(this,dr,Ao).call(this,r,this.range.valueAsNumber),n=de(this,cr,To).call(this,r,this.range.valueAsNumber);i.style.transform=`translateX(${s})`,i.style.setProperty("--_range-width",`${r.range.width}`),a.style.setProperty("--_box-shift",`${n}`),a.style.setProperty("--_box-width",`${r.box.width}px`),a.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":de(this,go,Ln).call(this);break;case"pointermove":de(this,fo,kn).call(this,e);break;case"pointerup":N(this,Qt)&&le(this,Qt,!1);break;case"pointerdown":le(this,Qt,!0);break;case"pointerleave":de(this,Ni,ur).call(this,null);break;case"transitionstart":Se(e.target,this)&&setTimeout(()=>N(this,xi).call(this),0);break}}};qt=new WeakMap;Je=new WeakMap;sr=new WeakMap;Oi=new WeakMap;nr=new WeakMap;or=new WeakMap;Ui=new WeakMap;Pi=new WeakMap;Yt=new WeakMap;Qt=new WeakMap;xi=new WeakMap;Eo=new WeakSet;Mn=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&Xi(this)};vo=new WeakMap;lr=new WeakSet;bo=function(t){var e;let a=((e=this.getAttribute("bounds")?We(this,`#${this.getAttribute("bounds")}`):this.parentElement)!=null?e:this).getBoundingClientRect(),r=this.range.getBoundingClientRect(),s=t.offsetWidth,n=-(r.left-a.left-s/2),d=a.right-r.left-s/2;return{box:{width:s,min:n,max:d},bounds:a,range:r}};dr=new WeakSet;Ao=function(t,e){let i=`${e*100}%`,{width:a,min:r,max:s}=t.box;if(!a)return i;if(Number.isNaN(r)||(i=`max(${`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`}, ${i})`),!Number.isNaN(s)){let d=`calc(1 / var(--_range-width) * 100 * ${s}% - var(--media-box-padding-right))`;i=`min(${i}, ${d})`}return i};cr=new WeakSet;To=function(t,e){let{width:i,min:a,max:r}=t.box,s=e*t.range.width;if(s<a+N(this,Ui)){let n=t.range.left-t.bounds.left-N(this,Ui);return`${s-i/2+n}px`}if(s>r-N(this,Pi)){let n=t.bounds.right-t.range.right-N(this,Pi);return`${s+i/2-n-t.range.width}px`}return 0};fo=new WeakSet;kn=function(t){let e=[...N(this,sr)].some(k=>t.composedPath().includes(k));if(!this.dragging&&(e||!t.composedPath().includes(this))){de(this,Ni,ur).call(this,null);return}let i=this.mediaSeekableEnd;if(!i)return;let a=P(this.shadowRoot,"#preview-rail"),r=P(this.shadowRoot,'[part~="preview-box"]'),s=de(this,lr,bo).call(this,N(this,nr)),n=(t.clientX-s.range.left)/s.range.width;n=Math.max(0,Math.min(1,n));let d=de(this,dr,Ao).call(this,s,n),c=de(this,cr,To).call(this,s,n);a.style.transform=`translateX(${d})`,a.style.setProperty("--_range-width",`${s.range.width}`),r.style.setProperty("--_box-shift",`${c}`),r.style.setProperty("--_box-width",`${s.box.width}px`);let S=Math.round(N(this,Oi))-Math.round(n*i);Math.abs(S)<1&&n>.01&&n<.99||(le(this,Oi,n*i),de(this,Ni,ur).call(this,N(this,Oi)))};Ni=new WeakSet;ur=function(t){this.dispatchEvent(new l.CustomEvent(m.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))};go=new WeakSet;Ln=function(){N(this,Je).stop();let t=wn(this);this.dispatchEvent(new l.CustomEvent(m.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))};Hi.shadowRootOptions={mode:"open"};Hi.getContainerTemplateHTML=dc;l.customElements.get("media-time-range")||l.customElements.define("media-time-range",Hi);var cc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Rn=(t,e,i)=>(cc(t,e,"read from private field"),i?i.call(t):e.get(t)),uc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},mr,mc=1,hc=t=>t.mediaMuted?0:t.mediaVolume,pc=t=>`${Math.round(t*100)}%`,So=class extends we{constructor(){super(...arguments),uc(this,mr,()=>{let e=this.range.value,i=new l.CustomEvent(m.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)})}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME,o.MEDIA_MUTED,o.MEDIA_VOLUME_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",h("volume")),this.range.addEventListener("input",Rn(this,mr))}disconnectedCallback(){this.range.removeEventListener("input",Rn(this,mr)),super.disconnectedCallback()}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_VOLUME||e===o.MEDIA_MUTED)&&(this.range.valueAsNumber=hc(this),this.range.setAttribute("aria-valuetext",pc(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return D(this,o.MEDIA_VOLUME,mc)}set mediaVolume(e){U(this,o.MEDIA_VOLUME,e)}get mediaMuted(){return _(this,o.MEDIA_MUTED)}set mediaMuted(e){b(this,o.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return R(this,o.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){w(this,o.MEDIA_VOLUME_UNAVAILABLE,e)}};mr=new WeakMap;l.customElements.get("media-volume-range")||l.customElements.define("media-volume-range",So);function Ec(t){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${o.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `}function vc(){return h("Loop")}var Fi=class extends x{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=((e=this.shadowRoot)==null?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=h("Loop"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return _(this,o.MEDIA_LOOP)}set mediaLoop(e){b(this,o.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,i=new l.CustomEvent(m.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};Fi.getSlotTemplateHTML=Ec;Fi.getTooltipContentHTML=vc;l.customElements.get("media-loop-button")||l.customElements.define("media-loop-button",Fi);var hr=t=>{let e=Math.max(0,Math.floor(t||0)),i=Math.floor(e/3600);return(i?i+":":"")+String(Math.floor(e/60)%60).padStart(i?2:1,"0")+":"+String(e%60).padStart(2,"0")};window.SteepleComponent={mount(t,e){let i=e.steepleTimeline,a=e.steepleIsLive,r=document.createElement("media-controller");r.className="component-player";for(let y of["noautohide","gesturesdisabled","nodefaultstore"])r.setAttribute(y,"");r.fullscreenElement=t,e.controls=!1,e.slot="media",e.before(r),r.append(e);let s=new AbortController,n=(y,B,et,tt={})=>y.addEventListener(B,et,{...tt,signal:s.signal}),d=document.createElement("media-control-bar");d.className="player-bar",d.innerHTML='<media-play-button class="desktop-play"></media-play-button><div class="player-volume"><media-mute-button></media-mute-button><media-volume-range></media-volume-range></div><span class="player-time"></span><media-time-range aria-label="Seek"></media-time-range><button class="player-live" type="button">Live</button><div class="player-actions"><media-captions-button></media-captions-button><media-pip-button></media-pip-button><media-fullscreen-button></media-fullscreen-button></div>';let c=document.createElement("media-play-button");c.className="touch-play",c.slot="centered-chrome";let S=document.createElement("div");S.className="player-top",S.slot="top-chrome";let k=d.querySelector(".player-time"),T=d.querySelector("media-time-range"),E=d.querySelector(".player-live"),p=d.querySelector(".player-actions");d.querySelector("media-volume-range").range.step="0.05",T.hidden=a&&!i,E.hidden=!a||!i,E.disabled=!i,n(E,"click",()=>i?.goLive()),r.append(S,c,d);for(let y of[S,c,d])y.setAttribute("noautohide","");let g=!1,v=null,M=matchMedia("(pointer: coarse)").matches,I,V=ua({media:e,fullscreenElement:t,documentElement:document,options:{noAutoSeekToLive:!0,noVolumePref:!0,noMutedPref:!0}}),Te=new Set,Ne=()=>{let y=V.getState();if(!i)return y;let B=i.getState();return{...y,mediaCurrentTime:v??B.current,mediaDuration:B.end,mediaSeekable:[B.start,B.end],mediaBuffered:[],mediaStreamType:"live",mediaTimeIsLive:B.live,mediaLoading:y.mediaLoading||B.busy}},ce=()=>{let y=Ne(),B=i?.getState(),et=y.mediaCurrentTime||0;p.querySelector("media-captions-button").hidden=!y.mediaSubtitlesList?.length,k.textContent=a?i?hr(et):"":hr(et)+" / "+hr(y.mediaDuration),B&&(T.toggleAttribute("disabled",!B.available),T.title=B.available?"Available from "+hr(B.start)+" after meeting start":"Rewind history is not available yet",E.textContent=B.live?"Live":"Back to live",E.setAttribute("aria-label",E.textContent),E.dataset.live=String(B.live));let tt=(y.mediaDuration||0)-(B?.start||0);if(tt>0&&(T.range.step=String(Math.min(1,5/tt))),r.toggleAttribute("data-paused",!!y.mediaPaused),!g)for(let Bi of Te)Bi(y)},se=y=>i?i.seek(y):V.dispatch({type:"mediaseekrequest",detail:y});r.mediaStore={getState:Ne,subscribe(y){return Te.add(y),y(Ne()),()=>Te.delete(y)},dispatch(y){if(y.type==="mediaseekrequest"){g?v=y.detail:se(y.detail);return}if(i&&y.type==="mediaseektoliverequest")return i.goLive();V.dispatch(y)}};let ue=V.subscribe(ce),je=i?.subscribe(ce),X=()=>{r.removeAttribute("data-hidden"),clearTimeout(I),I=setTimeout(()=>{!g&&!e.paused&&!r.matches(":focus-within")&&r.setAttribute("data-hidden","")},3e3)},Et=y=>{M=y,r.toggleAttribute("data-touch",y);let B=y?S:d;p.parentElement!==B&&B.append(p),X()};Et(M),n(r,"pointerdown",y=>{Et(y.pointerType==="touch"||y.pointerType==="pen"),X()},{capture:!0}),n(r,"pointermove",y=>{y.pointerType==="mouse"&&(M&&Et(!1),X())}),n(e,"click",()=>{M||(e.paused?e.play().catch(()=>{}):e.pause())}),n(r,"focusin",X),n(r,"focusout",X),n(e,"pause",X),n(e,"playing",X),n(T,"pointerdown",()=>{g=!0,v=null,X()},{capture:!0});let zt=()=>{if(!g)return;g=!1;let y=v;v=null,y!==null&&se(y),ce(),X()};return n(window,"pointerup",zt),n(window,"pointercancel",()=>{v=null,zt()}),ce(),()=>{clearTimeout(I),s.abort(),je?.(),ue(),r.remove(),Te.clear()}}};})();
