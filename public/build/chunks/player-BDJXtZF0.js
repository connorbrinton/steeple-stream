var e={MEDIA_PLAY_REQUEST:`mediaplayrequest`,MEDIA_PAUSE_REQUEST:`mediapauserequest`,MEDIA_MUTE_REQUEST:`mediamuterequest`,MEDIA_UNMUTE_REQUEST:`mediaunmuterequest`,MEDIA_LOOP_REQUEST:`medialooprequest`,MEDIA_VOLUME_REQUEST:`mediavolumerequest`,MEDIA_SEEK_REQUEST:`mediaseekrequest`,MEDIA_AIRPLAY_REQUEST:`mediaairplayrequest`,MEDIA_ENTER_FULLSCREEN_REQUEST:`mediaenterfullscreenrequest`,MEDIA_EXIT_FULLSCREEN_REQUEST:`mediaexitfullscreenrequest`,MEDIA_PREVIEW_REQUEST:`mediapreviewrequest`,MEDIA_ENTER_PIP_REQUEST:`mediaenterpiprequest`,MEDIA_EXIT_PIP_REQUEST:`mediaexitpiprequest`,MEDIA_ENTER_CAST_REQUEST:`mediaentercastrequest`,MEDIA_EXIT_CAST_REQUEST:`mediaexitcastrequest`,MEDIA_SHOW_TEXT_TRACKS_REQUEST:`mediashowtexttracksrequest`,MEDIA_HIDE_TEXT_TRACKS_REQUEST:`mediahidetexttracksrequest`,MEDIA_SHOW_SUBTITLES_REQUEST:`mediashowsubtitlesrequest`,MEDIA_DISABLE_SUBTITLES_REQUEST:`mediadisablesubtitlesrequest`,MEDIA_TOGGLE_SUBTITLES_REQUEST:`mediatogglesubtitlesrequest`,MEDIA_PLAYBACK_RATE_REQUEST:`mediaplaybackraterequest`,MEDIA_RENDITION_REQUEST:`mediarenditionrequest`,MEDIA_AUDIO_TRACK_REQUEST:`mediaaudiotrackrequest`,MEDIA_SEEK_TO_LIVE_REQUEST:`mediaseektoliverequest`,REGISTER_MEDIA_STATE_RECEIVER:`registermediastatereceiver`,UNREGISTER_MEDIA_STATE_RECEIVER:`unregistermediastatereceiver`},t={MEDIA_CHROME_ATTRIBUTES:`mediachromeattributes`,MEDIA_CONTROLLER:`mediacontroller`},n={MEDIA_AIRPLAY_UNAVAILABLE:`mediaAirplayUnavailable`,MEDIA_AUDIO_TRACK_ENABLED:`mediaAudioTrackEnabled`,MEDIA_AUDIO_TRACK_LIST:`mediaAudioTrackList`,MEDIA_AUDIO_TRACK_UNAVAILABLE:`mediaAudioTrackUnavailable`,MEDIA_BUFFERED:`mediaBuffered`,MEDIA_CAST_UNAVAILABLE:`mediaCastUnavailable`,MEDIA_CHAPTERS_CUES:`mediaChaptersCues`,MEDIA_CURRENT_TIME:`mediaCurrentTime`,MEDIA_DURATION:`mediaDuration`,MEDIA_ENDED:`mediaEnded`,MEDIA_ERROR:`mediaError`,MEDIA_ERROR_CODE:`mediaErrorCode`,MEDIA_ERROR_MESSAGE:`mediaErrorMessage`,MEDIA_FULLSCREEN_UNAVAILABLE:`mediaFullscreenUnavailable`,MEDIA_HAS_PLAYED:`mediaHasPlayed`,MEDIA_HEIGHT:`mediaHeight`,MEDIA_IS_AIRPLAYING:`mediaIsAirplaying`,MEDIA_IS_CASTING:`mediaIsCasting`,MEDIA_IS_FULLSCREEN:`mediaIsFullscreen`,MEDIA_IS_PIP:`mediaIsPip`,MEDIA_LOADING:`mediaLoading`,MEDIA_MUTED:`mediaMuted`,MEDIA_LOOP:`mediaLoop`,MEDIA_PAUSED:`mediaPaused`,MEDIA_PIP_UNAVAILABLE:`mediaPipUnavailable`,MEDIA_PLAYBACK_RATE:`mediaPlaybackRate`,MEDIA_PREVIEW_CHAPTER:`mediaPreviewChapter`,MEDIA_PREVIEW_COORDS:`mediaPreviewCoords`,MEDIA_PREVIEW_IMAGE:`mediaPreviewImage`,MEDIA_PREVIEW_TIME:`mediaPreviewTime`,MEDIA_RENDITION_LIST:`mediaRenditionList`,MEDIA_RENDITION_SELECTED:`mediaRenditionSelected`,MEDIA_RENDITION_UNAVAILABLE:`mediaRenditionUnavailable`,MEDIA_SEEKABLE:`mediaSeekable`,MEDIA_STREAM_TYPE:`mediaStreamType`,MEDIA_SUBTITLES_LIST:`mediaSubtitlesList`,MEDIA_SUBTITLES_SHOWING:`mediaSubtitlesShowing`,MEDIA_TARGET_LIVE_WINDOW:`mediaTargetLiveWindow`,MEDIA_TIME_IS_LIVE:`mediaTimeIsLive`,MEDIA_VOLUME:`mediaVolume`,MEDIA_VOLUME_LEVEL:`mediaVolumeLevel`,MEDIA_VOLUME_UNAVAILABLE:`mediaVolumeUnavailable`,MEDIA_LANG:`mediaLang`,MEDIA_WIDTH:`mediaWidth`},r=Object.entries(n),i=r.reduce((e,[t,n])=>(e[t]=n.toLowerCase(),e),{}),a=r.reduce((e,[t,n])=>(e[t]=n.toLowerCase(),e),{USER_INACTIVE_CHANGE:`userinactivechange`,BREAKPOINTS_CHANGE:`breakpointchange`,BREAKPOINTS_COMPUTED:`breakpointscomputed`});Object.entries(a).reduce((e,[t,n])=>{let r=i[t];return r&&(e[n]=r),e},{userinactivechange:`userinactive`});var o=Object.entries(i).reduce((e,[t,n])=>{let r=a[t];return r&&(e[n]=r),e},{userinactive:`userinactivechange`}),s={SUBTITLES:`subtitles`,CAPTIONS:`captions`,DESCRIPTIONS:`descriptions`,CHAPTERS:`chapters`,METADATA:`metadata`},c={DISABLED:`disabled`,HIDDEN:`hidden`,SHOWING:`showing`},l={MOUSE:`mouse`,PEN:`pen`,TOUCH:`touch`},u={UNAVAILABLE:`unavailable`,UNSUPPORTED:`unsupported`},d={LIVE:`live`,ON_DEMAND:`on-demand`,UNKNOWN:`unknown`},f={INLINE:`inline`,FULLSCREEN:`fullscreen`,PICTURE_IN_PICTURE:`picture-in-picture`};function p(e){return e?.map(m).join(` `)}function m(e){if(e){let{id:t,width:n,height:r}=e;return[t,n,r].filter(e=>e!=null).join(`:`)}}function h(e){return e?.map(g).join(` `)}function g(e){if(e){let{id:t,kind:n,language:r,label:i}=e;return[t,n,r,i].filter(e=>e!=null).join(`:`)}}function _(e){return typeof e==`number`&&!Number.isNaN(e)&&Number.isFinite(e)}var v=e=>new Promise(t=>setTimeout(t,e)),y={en:{"Start airplay":`Start airplay`,"Stop airplay":`Stop airplay`,Audio:`Audio`,Captions:`Captions`,"Enable captions":`Enable captions`,"Disable captions":`Disable captions`,"Start casting":`Start casting`,"Stop casting":`Stop casting`,"Enter fullscreen mode":`Enter fullscreen mode`,"Exit fullscreen mode":`Exit fullscreen mode`,Mute:`Mute`,Unmute:`Unmute`,Loop:`Loop`,"Enter picture in picture mode":`Enter picture in picture mode`,"Exit picture in picture mode":`Exit picture in picture mode`,Play:`Play`,Pause:`Pause`,"Playback rate":`Playback rate`,"Playback rate {playbackRate}":`Playback rate {playbackRate}`,Quality:`Quality`,"Seek backward":`Seek backward`,"Seek forward":`Seek forward`,Settings:`Settings`,Auto:`Auto`,"audio player":`audio player`,"video player":`video player`,volume:`volume`,seek:`seek`,"closed captions":`closed captions`,"current playback rate":`current playback rate`,"playback time":`playback time`,"media loading":`media loading`,settings:`settings`,"audio tracks":`audio tracks`,quality:`quality`,play:`play`,pause:`pause`,mute:`mute`,unmute:`unmute`,"chapter: {chapterName}":`chapter: {chapterName}`,live:`live`,Off:`Off`,"start airplay":`start airplay`,"stop airplay":`stop airplay`,"start casting":`start casting`,"stop casting":`stop casting`,"enter fullscreen mode":`enter fullscreen mode`,"exit fullscreen mode":`exit fullscreen mode`,"enter picture in picture mode":`enter picture in picture mode`,"exit picture in picture mode":`exit picture in picture mode`,"seek to live":`seek to live`,"playing live":`playing live`,"seek back {seekOffset} seconds":`seek back {seekOffset} seconds`,"seek forward {seekOffset} seconds":`seek forward {seekOffset} seconds`,"Network Error":`Network Error`,"Decode Error":`Decode Error`,"Source Not Supported":`Source Not Supported`,"Encryption Error":`Encryption Error`,"A network error caused the media download to fail.":`A network error caused the media download to fail.`,"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":`A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.`,"An unsupported error occurred. The server or network failed, or your browser does not support this format.":`An unsupported error occurred. The server or network failed, or your browser does not support this format.`,"The media is encrypted and there are no keys to decrypt it.":`The media is encrypted and there are no keys to decrypt it.`,hour:`hour`,hours:`hours`,minute:`minute`,minutes:`minutes`,second:`second`,seconds:`seconds`,"{time} remaining":`{time} remaining`,"{currentTime} of {totalTime}":`{currentTime} of {totalTime}`,"video not loaded, unknown time.":`video not loaded, unknown time.`}},b=globalThis.navigator?.language||`en`,ee=e=>{b=e},te=e=>{let[t]=b.split(`-`);return y[b]?.[e]||y[t]?.[e]||y.en?.[e]||e},ne=()=>{let[e]=b.split(`-`);return y[b]?b:y[e]?e:`en`},x=(e,t={})=>te(e).replace(/\{(\w+)\}/g,(e,n)=>n in t?String(t[n]):`{${n}}`),S=[{singular:`hour`,plural:`hours`},{singular:`minute`,plural:`minutes`},{singular:`second`,plural:`seconds`}],re=(e,t)=>`${e} ${x(e===1?S[t].singular:S[t].plural)}`,ie=e=>{if(!_(e))return``;let t=Math.abs(e),n=t!==e,r=new Date(0,0,0,0,0,t,0),i=[r.getHours(),r.getMinutes(),r.getSeconds()].map((e,t)=>e&&re(e,t)).filter(e=>e).join(`, `);return n?x(`{time} remaining`,{time:i}):i};function ae(e,t){let n=!1;e<0&&(n=!0,e=0-e),e=e<0?0:e;let r=Math.floor(e%60),i=Math.floor(e/60%60),a=Math.floor(e/3600),o=Math.floor(t/60%60),s=Math.floor(t/3600);return(isNaN(e)||e===1/0)&&(a=i=r=`0`),a=a>0||s>0?a+`:`:``,i=((a||o>=10)&&i<10?`0`+i:i)+`:`,r=r<10?`0`+r:r,(n?`-`:``)+a+i+r}Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});var oe=class{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}},se=class extends oe{},ce=class extends se{constructor(){super(...arguments),this.role=null}},le=class{observe(){}unobserve(){}disconnect(){}},ue={createElement:function(){return new de.HTMLElement},createElementNS:function(){return new de.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(e){return!1}},de={ResizeObserver:le,document:ue,Node:se,Element:ce,HTMLElement:class extends ce{constructor(){super(...arguments),this.innerHTML=``}get content(){return new de.DocumentFragment}},DocumentFragment:class extends oe{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(e){return null},setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return``}},matchMedia(e){return{matches:!1,media:e}},DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},fe=`global`in globalThis&&(globalThis==null?void 0:globalThis.global)===globalThis||typeof window>`u`||window.customElements===void 0,pe=Object.keys(de).every(e=>e in globalThis),C=fe&&!pe?de:globalThis,w=fe&&!pe?ue:globalThis.document,me=new WeakMap,he=e=>{let t=me.get(e);return t||me.set(e,t=new Set),t},ge=new C.ResizeObserver(e=>{for(let t of e)for(let e of he(t.target))e(t)});function _e(e,t){he(e).add(t),ge.observe(e)}function ve(e,t){let n=he(e);n.delete(t),n.size||ge.unobserve(e)}function ye(e){let t={};for(let n of e)t[n.name]=n.value;return t}function be(e){return xe(e)??Ee(e,`media-controller`)}function xe(e){let{MEDIA_CONTROLLER:n}=t,r=e.getAttribute(n);if(r)return Oe(e)?.getElementById(r)}var Se=(e,t,n=`.value`)=>{let r=e.querySelector(n);r&&(r.textContent=t)},Ce=(e,t)=>{let n=`slot[name="${t}"]`,r=e.shadowRoot.querySelector(n);return r?r.children:[]},we=(e,t)=>Ce(e,t)[0],Te=(e,t)=>!e||!t?!1:e?.contains(t)?!0:Te(e,t.getRootNode().host),Ee=(e,t)=>e?e.closest(t)||Ee(e.getRootNode().host,t):null;function De(e=document){let t=e?.activeElement;return t?De(t.shadowRoot)??t:null}function Oe(e){let t=(e?.getRootNode)?.call(e);return t instanceof ShadowRoot||t instanceof Document?t:null}function ke(e,{depth:t=3,checkOpacity:n=!0,checkVisibilityCSS:r=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:n,checkVisibilityCSS:r});let i=e;for(;i&&t>0;){let e=getComputedStyle(i);if(n&&e.opacity===`0`||r&&e.visibility===`hidden`||e.display===`none`)return!1;i=i.parentElement,t--}return!0}function Ae(e,t,n,r){let i=r.x-n.x,a=r.y-n.y,o=i*i+a*a;if(o===0)return 0;let s=((e-n.x)*i+(t-n.y)*a)/o;return Math.max(0,Math.min(1,s))}function T(e,t){return je(e,e=>e===t)||Me(e,t)}function je(e,t){let n;for(n of e.querySelectorAll(`style:not([media])`)??[]){let e;try{e=n.sheet?.cssRules}catch{continue}for(let n of e??[])if(t(n.selectorText))return n}}function Me(e,t){let n=e.querySelectorAll(`style:not([media])`)??[],r=n?.[n.length-1];if(!r?.sheet)return console.warn(`Media Chrome: No style sheet found on style tag of`,e),{style:{setProperty:()=>{},removeProperty:()=>``,getPropertyValue:()=>``}};let i=r?.sheet.insertRule(`${t}{}`,r.sheet.cssRules.length);return r.sheet.cssRules?.[i]}function E(e,t,n=NaN){let r=e.getAttribute(t);return r==null?n:+r}function D(e,t,n){let r=+n;if(n==null||Number.isNaN(r)){e.hasAttribute(t)&&e.removeAttribute(t);return}E(e,t,void 0)!==r&&e.setAttribute(t,`${r}`)}function O(e,t){return e.hasAttribute(t)}function k(e,t,n){if(n==null){e.hasAttribute(t)&&e.removeAttribute(t);return}O(e,t)!=n&&e.toggleAttribute(t,n)}function A(e,t,n=null){return e.getAttribute(t)??n}function j(e,t,n){if(n==null){e.hasAttribute(t)&&e.removeAttribute(t);return}let r=`${n}`;A(e,t,void 0)!==r&&e.setAttribute(t,r)}var Ne=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},M=(e,t,n)=>(Ne(e,t,`read from private field`),n?n.call(e):t.get(e)),Pe=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Fe=(e,t,n,r)=>(Ne(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),N;function Ie(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}var Le=class extends C.HTMLElement{constructor(){if(super(),Pe(this,N,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[t.MEDIA_CONTROLLER,i.MEDIA_PAUSED]}attributeChangedCallback(e,n,r){var i,a,o,s;e===t.MEDIA_CONTROLLER&&(n&&((a=(i=M(this,N))?.unassociateElement)==null||a.call(i,this),Fe(this,N,null)),r&&this.isConnected&&(Fe(this,N,this.getRootNode()?.getElementById(r)),(s=(o=M(this,N))?.associateElement)==null||s.call(o,this)))}connectedCallback(){var e,n;this.tabIndex=-1,this.setAttribute(`aria-hidden`,`true`),Fe(this,N,Re(this)),this.getAttribute(t.MEDIA_CONTROLLER)&&((n=(e=M(this,N))?.associateElement)==null||n.call(e,this)),M(this,N)&&(M(this,N).addEventListener(`pointerdown`,this),M(this,N).addEventListener(`click`,this),M(this,N).hasAttribute(`tabindex`)||(M(this,N).tabIndex=0))}disconnectedCallback(){var e,n,r,i;this.getAttribute(t.MEDIA_CONTROLLER)&&((n=(e=M(this,N))?.unassociateElement)==null||n.call(e,this)),(r=M(this,N))==null||r.removeEventListener(`pointerdown`,this),(i=M(this,N))==null||i.removeEventListener(`click`,this),Fe(this,N,null)}handleEvent(e){let t=e.composedPath()?.[0];if([`video`,`media-controller`].includes(t?.localName)){if(e.type===`pointerdown`)this._pointerType=e.pointerType;else if(e.type===`click`){let{clientX:t,clientY:n}=e,{left:r,top:i,width:a,height:o}=this.getBoundingClientRect(),s=t-r,c=n-i;if(s<0||c<0||s>a||c>o||a===0&&o===0)return;let u=this._pointerType||`mouse`;if(this._pointerType=void 0,u===l.TOUCH){this.handleTap(e);return}if(u===l.MOUSE||u===l.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return O(this,i.MEDIA_PAUSED)}set mediaPaused(e){k(this,i.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(t){let n=this.mediaPaused?e.MEDIA_PLAY_REQUEST:e.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new C.CustomEvent(n,{composed:!0,bubbles:!0}))}};N=new WeakMap,Le.shadowRootOptions={mode:`open`},Le.getTemplateHTML=Ie;function Re(e){let n=e.getAttribute(t.MEDIA_CONTROLLER);return n?e.getRootNode()?.getElementById(n):Ee(e,`media-controller`)}C.customElements.get(`media-gesture-receiver`)||C.customElements.define(`media-gesture-receiver`,Le);var ze=Le,Be=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},P=(e,t,n)=>(Be(e,t,`read from private field`),n?n.call(e):t.get(e)),F=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Ve=(e,t,n,r)=>(Be(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),I=(e,t,n)=>(Be(e,t,`access private method`),n),He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,L={AUDIO:`audio`,AUTOHIDE:`autohide`,BREAKPOINTS:`breakpoints`,GESTURES_DISABLED:`gesturesdisabled`,KEYBOARD_CONTROL:`keyboardcontrol`,NO_AUTOHIDE:`noautohide`,USER_INACTIVE:`userinactive`,AUTOHIDE_OVER_CONTROLS:`autohideovercontrols`};function ct(e){return`
    <style>
      
      :host([${i.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
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

      :host(:not([${L.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
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

      
      :host([${L.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${L.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${L.AUDIO}])[${L.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${L.AUDIO}])[${L.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${L.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${L.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${L.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
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

      
      :host(:not([${L.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${L.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${L.USER_INACTIVE}]:not([${i.MEDIA_PAUSED}]):not([${i.MEDIA_IS_AIRPLAYING}]):not([${i.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${L.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${L.USER_INACTIVE}]:not([${L.NO_AUTOHIDE}]):not([${i.MEDIA_PAUSED}]):not([${i.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${L.USER_INACTIVE}][${L.AUTOHIDE_OVER_CONTROLS}]:not([${L.NO_AUTOHIDE}]):not([${i.MEDIA_PAUSED}]):not([${i.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${L.AUDIO}])[${i.MEDIA_HAS_PLAYED}]) slot[name=poster] {
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
        <template shadowrootmode="${ze.shadowRootOptions.mode}">
          ${ze.getTemplateHTML({})}
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
  `}var lt=Object.values(i),ut=`sm:384 md:576 lg:768 xl:960`;function dt(e){ft(e.target,e.contentRect.width)}function ft(e,t){if(!e.isConnected)return;let n=pt(e.getAttribute(L.BREAKPOINTS)??ut),r=mt(n,t),i=!1;if(Object.keys(n).forEach(t=>{if(r.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,``),i=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),i=!0)}),i){let t=new CustomEvent(a.BREAKPOINTS_CHANGE,{detail:r});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(a.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function pt(e){let t=e.split(/\s+/);return Object.fromEntries(t.map(e=>e.split(`:`)))}function mt(e,t){return Object.keys(e).filter(n=>t>=parseInt(e[n]))}var ht=class extends C.HTMLElement{constructor(){if(super(),F(this,Xe),F(this,Qe),F(this,et),F(this,nt),F(this,it),F(this,He,void 0),F(this,Ue,0),F(this,We,null),F(this,Ge,null),F(this,Ke,void 0),this.breakpointsComputed=!1,F(this,qe,e=>{let t=this.media;for(let n of e){if(n.type!==`childList`)continue;let e=n.removedNodes;for(let r of e){if(r.slot!=`media`||n.target!=this)continue;let e=n.previousSibling&&n.previousSibling.previousElementSibling;if(!e||!t)this.mediaUnsetCallback(r);else{let t=e.slot!==`media`;for(;(e=e.previousSibling)!==null;)e.slot==`media`&&(t=!1);t&&this.mediaUnsetCallback(r)}}if(t)for(let e of n.addedNodes)e===t&&this.handleMediaUpdated(t)}}),F(this,Je,!1),F(this,Ye,e=>{P(this,Je)||(setTimeout(()=>{dt(e),Ve(this,Je,!1)},0),Ve(this,Je,!0))}),F(this,ot,void 0),F(this,st,()=>{if(!P(this,ot).assignedElements({flatten:!0}).length){P(this,We)&&this.mediaUnsetCallback(P(this,We));return}this.handleMediaUpdated(this.media)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}Ve(this,He,new MutationObserver(P(this,qe)))}static get observedAttributes(){return[L.AUTOHIDE,L.GESTURES_DISABLED].concat(lt).filter(e=>![i.MEDIA_RENDITION_LIST,i.MEDIA_AUDIO_TRACK_LIST,i.MEDIA_CHAPTERS_CUES,i.MEDIA_WIDTH,i.MEDIA_HEIGHT,i.MEDIA_ERROR,i.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,n){e.toLowerCase()==L.AUTOHIDE&&(this.autohide=n)}get media(){let e=this.querySelector(`:scope > [slot=media]`);return e?.nodeName==`SLOT`&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(Ve(this,We,e),e.localName.includes(`-`)&&await C.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;P(this,He).observe(this,{childList:!0,subtree:!0}),_e(this,P(this,Ye));let t=this.getAttribute(L.AUDIO)==null?x(`video player`):x(`audio player`);this.setAttribute(`role`,`region`),this.setAttribute(`aria-label`,t),this.handleMediaUpdated(this.media),this.setAttribute(L.USER_INACTIVE,``),ft(this,this.getBoundingClientRect().width);let n=this.querySelector(`:scope > slot[slot=media]`);n&&(Ve(this,ot,n),P(this,ot).addEventListener(`slotchange`,P(this,st))),this.addEventListener(`pointerdown`,this),this.addEventListener(`pointermove`,this),this.addEventListener(`pointerup`,this),this.addEventListener(`mouseleave`,this),this.addEventListener(`keyup`,this),(e=C.window)==null||e.addEventListener(`mouseup`,this)}disconnectedCallback(){var e;ve(this,P(this,Ye)),clearTimeout(P(this,Ge)),P(this,He).disconnect(),this.media&&this.mediaUnsetCallback(this.media),(e=C.window)==null||e.removeEventListener(`mouseup`,this),this.removeEventListener(`pointerdown`,this),this.removeEventListener(`pointermove`,this),this.removeEventListener(`pointerup`,this),this.removeEventListener(`mouseleave`,this),this.removeEventListener(`keyup`,this),P(this,ot)&&(P(this,ot).removeEventListener(`slotchange`,P(this,st)),Ve(this,ot,null)),Ve(this,Je,!1)}mediaSetCallback(e){}mediaUnsetCallback(e){Ve(this,We,null)}handleEvent(e){switch(e.type){case`pointerdown`:Ve(this,Ue,e.timeStamp);break;case`pointermove`:I(this,Xe,Ze).call(this,e);break;case`pointerup`:I(this,Qe,$e).call(this,e);break;case`mouseleave`:I(this,et,tt).call(this);break;case`mouseup`:this.removeAttribute(L.KEYBOARD_CONTROL);break;case`keyup`:I(this,it,at).call(this),this.setAttribute(L.KEYBOARD_CONTROL,``)}}set autohide(e){let t=Number(e);Ve(this,Ke,isNaN(t)?0:t)}get autohide(){return(P(this,Ke)===void 0?2:P(this,Ke)).toString()}get breakpoints(){return A(this,L.BREAKPOINTS)}set breakpoints(e){j(this,L.BREAKPOINTS,e)}get audio(){return O(this,L.AUDIO)}set audio(e){k(this,L.AUDIO,e)}get gesturesDisabled(){return O(this,L.GESTURES_DISABLED)}set gesturesDisabled(e){k(this,L.GESTURES_DISABLED,e)}get keyboardControl(){return O(this,L.KEYBOARD_CONTROL)}set keyboardControl(e){k(this,L.KEYBOARD_CONTROL,e)}get noAutohide(){return O(this,L.NO_AUTOHIDE)}set noAutohide(e){k(this,L.NO_AUTOHIDE,e)}get autohideOverControls(){return O(this,L.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){k(this,L.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return O(this,L.USER_INACTIVE)}set userInteractive(e){k(this,L.USER_INACTIVE,e)}};He=new WeakMap,Ue=new WeakMap,We=new WeakMap,Ge=new WeakMap,Ke=new WeakMap,qe=new WeakMap,Je=new WeakMap,Ye=new WeakMap,Xe=new WeakSet,Ze=function(e){if(e.pointerType!==`mouse`&&e.timeStamp-P(this,Ue)<250)return;I(this,nt,rt).call(this),clearTimeout(P(this,Ge));let t=this.hasAttribute(L.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(e.target)||t)&&I(this,it,at).call(this)},Qe=new WeakSet,$e=function(e){if(e.pointerType===`touch`){let t=!this.hasAttribute(L.USER_INACTIVE);[this,this.media].includes(e.target)&&t?I(this,et,tt).call(this):I(this,it,at).call(this)}else e.composedPath().some(e=>[`media-play-button`,`media-fullscreen-button`].includes(e?.localName))&&I(this,it,at).call(this)},et=new WeakSet,tt=function(){if(P(this,Ke)<0||this.hasAttribute(L.USER_INACTIVE))return;this.setAttribute(L.USER_INACTIVE,``);let e=new C.CustomEvent(a.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},nt=new WeakSet,rt=function(){if(!this.hasAttribute(L.USER_INACTIVE))return;this.removeAttribute(L.USER_INACTIVE);let e=new C.CustomEvent(a.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},it=new WeakSet,at=function(){I(this,nt,rt).call(this),clearTimeout(P(this,Ge));let e=parseInt(this.autohide);e<0||Ve(this,Ge,setTimeout(()=>{I(this,et,tt).call(this)},e*1e3))},ot=new WeakMap,st=new WeakMap,ht.shadowRootOptions={mode:`open`},ht.getTemplateHTML=ct,C.customElements.get(`media-container`)||C.customElements.define(`media-container`,ht);var gt=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},R=(e,t,n)=>(gt(e,t,`read from private field`),n?n.call(e):t.get(e)),_t=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},vt=(e,t,n,r)=>(gt(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),yt,bt,xt,St,Ct,wt,Tt=class{constructor(e,t,{defaultValue:n}={defaultValue:void 0}){_t(this,Ct),_t(this,yt,void 0),_t(this,bt,void 0),_t(this,xt,void 0),_t(this,St,new Set),vt(this,yt,e),vt(this,bt,t),vt(this,xt,new Set(n))}[Symbol.iterator](){return R(this,Ct,wt).values()}get length(){return R(this,Ct,wt).size}get value(){return[...R(this,Ct,wt)].join(` `)??``}set value(e){e!==this.value&&(vt(this,St,new Set),this.add(...e?.split(` `)??[]))}toString(){return this.value}item(e){return[...R(this,Ct,wt)][e]}values(){return R(this,Ct,wt).values()}forEach(e,t){R(this,Ct,wt).forEach(e,t)}add(...e){var t;e.forEach(e=>R(this,St).add(e)),(this.value!==``||R(this,yt)?.hasAttribute(`${R(this,bt)}`))&&((t=R(this,yt))==null||t.setAttribute(`${R(this,bt)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>R(this,St).delete(e)),(t=R(this,yt))==null||t.setAttribute(`${R(this,bt)}`,`${this.value}`)}contains(e){return R(this,Ct,wt).has(e)}toggle(e,t){return t===void 0?this.contains(e)?(this.remove(e),!1):(this.add(e),!0):t?(this.add(e),!0):(this.remove(e),!1)}replace(e,t){return this.remove(e),this.add(t),e===t}};yt=new WeakMap,bt=new WeakMap,xt=new WeakMap,St=new WeakMap,Ct=new WeakSet,wt=function(){return R(this,St).size?R(this,St):R(this,xt)};var Et=(e=``)=>e.split(/\s+/),Dt=(e=``)=>{let[t,n,r]=e.split(`:`),i=r?decodeURIComponent(r):void 0;return{kind:t===`cc`?s.CAPTIONS:s.SUBTITLES,language:n,label:i}},Ot=(e=``,t={})=>Et(e).map(e=>{let n=Dt(e);return{...t,...n}}),kt=e=>e?Array.isArray(e)?e.map(e=>typeof e==`string`?Dt(e):e):typeof e==`string`?Ot(e):[e]:[],At=({kind:e,label:t,language:n}={kind:`subtitles`})=>t?`${e===`captions`?`cc`:`sb`}:${n}:${encodeURIComponent(t)}`:n,jt=(e=[])=>Array.prototype.map.call(e,At).join(` `),Mt=(e,t)=>n=>n[e]===t,Nt=e=>{let t=Object.entries(e).map(([e,t])=>Mt(e,t));return e=>t.every(t=>t(e))},Pt=(e,t=[],n=[])=>{let r=kt(n).map(Nt);Array.from(t).filter(e=>r.some(t=>t(e))).forEach(t=>{t.mode=e})},Ft=(e,t=()=>!0)=>{if(!e?.textTracks)return[];let n=typeof t==`function`?t:Nt(t);return Array.from(e.textTracks).filter(n)},It=e=>!!e.mediaSubtitlesShowing?.length||e.hasAttribute(i.MEDIA_SUBTITLES_SHOWING),Lt=e=>{let{media:t,fullscreenElement:n}=e;try{let e=n&&`requestFullscreen`in n?`requestFullscreen`:n&&`webkitRequestFullScreen`in n?`webkitRequestFullScreen`:void 0;if(e){let t=n[e]?.call(n);if(t instanceof Promise)return t.catch(()=>{})}else t?.webkitEnterFullscreen?t.webkitEnterFullscreen():t?.requestFullscreen&&t.requestFullscreen()}catch(e){console.error(e)}},Rt=`exitFullscreen`in w?`exitFullscreen`:`webkitExitFullscreen`in w?`webkitExitFullscreen`:`webkitCancelFullScreen`in w?`webkitCancelFullScreen`:void 0,zt=e=>{let{documentElement:t}=e;if(Rt){let e=(t?.[Rt])?.call(t);if(e instanceof Promise)return e.catch(()=>{})}},Bt=`fullscreenElement`in w?`fullscreenElement`:`webkitFullscreenElement`in w?`webkitFullscreenElement`:void 0,Vt=e=>{let{documentElement:t,media:n}=e,r=t?.[Bt];return!r&&`webkitDisplayingFullscreen`in n&&`webkitPresentationMode`in n&&n.webkitDisplayingFullscreen&&n.webkitPresentationMode===f.FULLSCREEN?n:r},Ht=e=>{let{media:t,documentElement:n,fullscreenElement:r=t}=e;if(!t||!n)return!1;let i=Vt(e);if(!i)return!1;if(i===r||i===t)return!0;if(i.localName.includes(`-`)){let e=i.shadowRoot;if(!(Bt in e))return Te(i,r);for(;e?.[Bt];){if(e[Bt]===r)return!0;e=e[Bt]?.shadowRoot}}return!1},Ut=`fullscreenEnabled`in w?`fullscreenEnabled`:`webkitFullscreenEnabled`in w?`webkitFullscreenEnabled`:void 0,Wt=e=>{let{documentElement:t,media:n}=e;return!!t?.[Ut]||n&&`webkitSupportsFullscreen`in n},Gt,Kt=()=>{var e;return Gt||(Gt=((e=w)?.createElement)?.call(e,`video`),Gt)},qt=async(e=Kt())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let n=new AbortController,r=await Promise.race([Jt(e,n.signal),Yt(e,t)]);return n.abort(),r},Jt=(e,t)=>new Promise(n=>{e.addEventListener(`volumechange`,()=>n(!0),{signal:t})}),Yt=async(e,t)=>{for(let n=0;n<10;n++){if(e.volume===t)return!1;await v(10)}return e.volume!==t},Xt=/.*Version\/.*Safari\/.*/.test(C.navigator.userAgent),Zt=(e=Kt())=>C.matchMedia(`(display-mode: standalone)`).matches&&Xt?!1:typeof e?.requestPictureInPicture==`function`,Qt=(e=Kt())=>Wt({documentElement:w,media:e}),$t=Qt(),en=Zt(),tn=!!C.WebKitPlaybackTargetAvailabilityEvent,nn=!!C.chrome,rn=e=>Ft(e.media,e=>[s.SUBTITLES,s.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),an=e=>Ft(e.media,e=>e.mode===c.SHOWING&&[s.SUBTITLES,s.CAPTIONS].includes(e.kind)),on=(e,t)=>{let n=rn(e),r=an(e),i=!!r.length;if(n.length){if(t===!1||i&&t!==!0)Pt(c.DISABLED,n,r);else if(t===!0||!i&&t!==!1){let t=n[0],{options:i}=e;if(!i?.noSubtitlesLangPref){let e=C.localStorage.getItem(`media-chrome-pref-subtitles-lang`),r=e?[e,...C.navigator.languages]:C.navigator.languages,i=n.filter(e=>r.some(t=>e.language.toLowerCase().startsWith(t.split(`-`)[0]))).sort((e,t)=>r.findIndex(t=>e.language.toLowerCase().startsWith(t.split(`-`)[0]))-r.findIndex(e=>t.language.toLowerCase().startsWith(e.split(`-`)[0])));i[0]&&(t=i[0])}let{language:a,label:o,kind:s}=t;Pt(c.DISABLED,n,r),Pt(c.SHOWING,n,[{language:a,label:o,kind:s}])}}},sn=(e,t)=>e===t?!0:e==null||t==null||typeof e!=typeof t?!1:typeof e==`number`&&Number.isNaN(e)&&Number.isNaN(t)?!0:typeof e==`object`?Array.isArray(e)?cn(e,t):Object.entries(e).every(([e,n])=>e in t&&sn(n,t[e])):!1,cn=(e,t)=>{let n=Array.isArray(e),r=Array.isArray(t);return n===r?n||r?e.length===t.length&&e.every((e,n)=>sn(e,t[n])):!0:!1},ln=Object.values(d),un,dn=qt().then(e=>(un=e,un)),fn=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!(`localName`in e&&e instanceof C.HTMLElement))return;let t=e.localName;if(!t.includes(`-`))return;let n=C.customElements.get(t);n&&e instanceof n||(await C.customElements.whenDefined(t),C.customElements.upgrade(e))}))},pn=new C.DOMParser,mn=e=>e&&(pn.parseFromString(e,`text/html`).body.textContent||e),hn={mediaError:{get(e,t){let{media:n}=e;if(t?.type!==`playing`)return n?.error},mediaEvents:[`emptied`,`error`,`playing`]},mediaErrorCode:{get(e,t){let{media:n}=e;if(t?.type!==`playing`)return n?.error?.code},mediaEvents:[`emptied`,`error`,`playing`]},mediaErrorMessage:{get(e,t){let{media:n}=e;if(t?.type!==`playing`)return n?.error?.message??``},mediaEvents:[`emptied`,`error`,`playing`]},mediaWidth:{get(e){let{media:t}=e;return t?.videoWidth??0},mediaEvents:[`resize`]},mediaHeight:{get(e){let{media:t}=e;return t?.videoHeight??0},mediaEvents:[`resize`]},mediaPaused:{get(e){let{media:t}=e;return t?.paused??!0},set(e,t){var n;let{media:r}=t;r&&(e?r.pause():(n=r.play())==null||n.catch(()=>{}))},mediaEvents:[`play`,`playing`,`pause`,`emptied`]},mediaHasPlayed:{get(e,t){let{media:n}=e;return n?t?t.type===`playing`:!n.paused:!1},mediaEvents:[`playing`,`emptied`]},mediaEnded:{get(e){let{media:t}=e;return t?.ended??!1},mediaEvents:[`seeked`,`ended`,`emptied`]},mediaPlaybackRate:{get(e){let{media:t}=e;return t?.playbackRate??1},set(e,t){let{media:n}=t;n&&Number.isFinite(+e)&&(n.playbackRate=+e)},mediaEvents:[`ratechange`,`loadstart`]},mediaMuted:{get(e){let{media:t}=e;return t?.muted??!1},set(e,t){let{media:n,options:{noMutedPref:r}={}}=t;if(n){n.muted=e;try{let t=C.localStorage.getItem(`media-chrome-pref-muted`)!==null,i=n.hasAttribute(`muted`);if(r){t&&C.localStorage.removeItem(`media-chrome-pref-muted`);return}if(i&&!t)return;C.localStorage.setItem(`media-chrome-pref-muted`,e?`true`:`false`)}catch(e){console.debug(`Error setting muted pref`,e)}}},mediaEvents:[`volumechange`],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:n}}=t,{media:r}=t;if(!(!r||r.muted||n))try{let n=C.localStorage.getItem(`media-chrome-pref-muted`)===`true`;hn.mediaMuted.set(n,t),e(n)}catch(e){console.debug(`Error getting muted pref`,e)}}]},mediaLoop:{get(e){let{media:t}=e;return t?.loop},set(e,t){let{media:n}=t;n&&(n.loop=e)},mediaEvents:[`medialooprequest`]},mediaVolume:{get(e){let{media:t}=e;return t?.volume??1},set(e,t){let{media:n,options:{noVolumePref:r}={}}=t;if(n){try{e==null?C.localStorage.removeItem(`media-chrome-pref-volume`):!n.hasAttribute(`muted`)&&!r&&C.localStorage.setItem(`media-chrome-pref-volume`,e.toString())}catch(e){console.debug(`Error setting volume pref`,e)}Number.isFinite(+e)&&(n.volume=+e)}},mediaEvents:[`volumechange`],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:n}}=t;if(!n)try{let{media:n}=t;if(!n)return;let r=C.localStorage.getItem(`media-chrome-pref-volume`);if(r==null)return;hn.mediaVolume.set(+r,t),e(+r)}catch(e){console.debug(`Error getting volume pref`,e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return t?.volume===void 0?`high`:t.muted||t.volume===0?`off`:t.volume<.5?`low`:t.volume<.75?`medium`:`high`},mediaEvents:[`volumechange`]},mediaCurrentTime:{get(e){let{media:t}=e;return t?.currentTime??0},set(e,t){let{media:n}=t;n&&_(e)&&(n.currentTime=e)},mediaEvents:[`timeupdate`,`loadedmetadata`]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:n}={}}=e;return n&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?n:Number.isFinite(t?.duration)?t.duration:NaN},mediaEvents:[`durationchange`,`loadedmetadata`,`emptied`]},mediaLoading:{get(e){let{media:t}=e;return t?.readyState<3},mediaEvents:[`waiting`,`playing`,`emptied`]},mediaSeekable:{get(e){let{media:t}=e;if(!t?.seekable?.length)return;let n=t.seekable.start(0),r=t.seekable.end(t.seekable.length-1);if(n||r)return[Number(n.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:[`loadedmetadata`,`emptied`,`progress`,`seekablechange`]},mediaBuffered:{get(e){let{media:t}=e,n=t?.buffered??[];return Array.from(n).map((e,t)=>[Number(n.start(t).toFixed(3)),Number(n.end(t).toFixed(3))])},mediaEvents:[`progress`,`emptied`]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:n}={}}=e,r=[d.LIVE,d.ON_DEMAND].includes(n)?n:void 0;if(!t)return r;let{streamType:i}=t;if(ln.includes(i))return i===d.UNKNOWN?r:i;let a=t.duration;return a===1/0?d.LIVE:Number.isFinite(a)?d.ON_DEMAND:r},mediaEvents:[`emptied`,`durationchange`,`loadedmetadata`,`streamtypechange`]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return NaN;let{targetLiveWindow:n}=t,r=hn.mediaStreamType.get(e);return(n==null||Number.isNaN(n))&&r===d.LIVE?0:n},mediaEvents:[`emptied`,`durationchange`,`loadedmetadata`,`streamtypechange`,`targetlivewindowchange`]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:n=10}={}}=e;if(!t)return!1;if(typeof t.liveEdgeStart==`number`)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;if(hn.mediaStreamType.get(e)!==d.LIVE)return!1;let r=t.seekable;if(!r)return!0;if(!r.length)return!1;let i=r.end(r.length-1)-n;return t.currentTime>=i},mediaEvents:[`playing`,`timeupdate`,`progress`,`waiting`,`emptied`]},mediaSubtitlesList:{get(e){return rn(e).map(({kind:e,label:t,language:n})=>({kind:e,label:t,language:n}))},mediaEvents:[`loadstart`],textTracksEvents:[`addtrack`,`removetrack`]},mediaSubtitlesShowing:{get(e){return an(e).map(({kind:e,label:t,language:n})=>({kind:e,label:t,language:n}))},mediaEvents:[`loadstart`],textTracksEvents:[`addtrack`,`removetrack`,`change`],stateOwnersUpdateHandlers:[(e,t)=>{var n,r;let{media:i,options:a}=t;if(!i)return;let o=e=>{a.defaultSubtitles&&(!e||[s.CAPTIONS,s.SUBTITLES].includes(e?.track?.kind))&&on(t,!0)};return i.addEventListener(`loadstart`,o),(n=i.textTracks)==null||n.addEventListener(`addtrack`,o),(r=i.textTracks)==null||r.addEventListener(`removetrack`,o),()=>{var e,t;i.removeEventListener(`loadstart`,o),(e=i.textTracks)==null||e.removeEventListener(`addtrack`,o),(t=i.textTracks)==null||t.removeEventListener(`removetrack`,o)}}]},mediaChaptersCues:{get(e){let{media:t}=e;if(!t)return[];let[n]=Ft(t,{kind:s.CHAPTERS});return Array.from(n?.cues??[]).map(({text:e,startTime:t,endTime:n})=>({text:mn(e),startTime:t,endTime:n}))},mediaEvents:[`loadstart`,`loadedmetadata`],textTracksEvents:[`addtrack`,`removetrack`,`change`],stateOwnersUpdateHandlers:[(e,t)=>{let{media:n}=t;if(!n)return;let r=n.querySelector(`track[kind="chapters"][default][src]`),i=n.shadowRoot?.querySelector(`:is(video,audio) > track[kind="chapters"][default][src]`);return r?.addEventListener(`load`,e),i?.addEventListener(`load`,e),()=>{r?.removeEventListener(`load`,e),i?.removeEventListener(`load`,e)}}]},mediaIsPip:{get(e){let{media:t,documentElement:n}=e;if(!t||!n||!n.pictureInPictureElement)return!1;if(n.pictureInPictureElement===t)return!0;if(n.pictureInPictureElement instanceof HTMLMediaElement)return t.localName?.includes(`-`)?Te(t,n.pictureInPictureElement):!1;if(n.pictureInPictureElement.localName.includes(`-`)){let e=n.pictureInPictureElement.shadowRoot;for(;e?.pictureInPictureElement;){if(e.pictureInPictureElement===t)return!0;e=e.pictureInPictureElement?.shadowRoot}}return!1},set(e,t){let{media:n}=t;if(n){if(e){if(!w.pictureInPictureEnabled){console.warn(`MediaChrome: Picture-in-picture is not enabled`);return}if(!n.requestPictureInPicture){console.warn(`MediaChrome: The current media does not support picture-in-picture`);return}let e=()=>{console.warn(`MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.`)};n.requestPictureInPicture().catch(t=>{if(t.code===11){if(!n.src){console.warn(`MediaChrome: The media is not ready for picture-in-picture. It must have a src set.`);return}if(n.readyState===0&&n.preload===`none`){let t=()=>{n.removeEventListener(`loadedmetadata`,r),n.preload=`none`},r=()=>{n.requestPictureInPicture().catch(e),t()};n.addEventListener(`loadedmetadata`,r),n.preload=`metadata`,setTimeout(()=>{n.readyState===0&&e(),t()},1e3)}else throw t}else throw t})}else w.pictureInPictureElement&&w.exitPictureInPicture()}},mediaEvents:[`enterpictureinpicture`,`leavepictureinpicture`]},mediaRenditionList:{get(e){let{media:t}=e;return[...t?.videoRenditions??[]].map(e=>({...e}))},mediaEvents:[`emptied`,`loadstart`],videoRenditionsEvents:[`addrendition`,`removerendition`]},mediaRenditionSelected:{get(e){let{media:t}=e;return t?.videoRenditions?.[t.videoRenditions?.selectedIndex]?.id},set(e,t){let{media:n}=t;if(!n?.videoRenditions){console.warn(`MediaController: Rendition selection not supported by this media.`);return}let r=e,i=Array.prototype.findIndex.call(n.videoRenditions,e=>e.id==r);n.videoRenditions.selectedIndex!=i&&(n.videoRenditions.selectedIndex=i)},mediaEvents:[`emptied`],videoRenditionsEvents:[`addrendition`,`removerendition`,`change`]},mediaAudioTrackList:{get(e){let{media:t}=e;return[...t?.audioTracks??[]]},mediaEvents:[`emptied`,`loadstart`],audioTracksEvents:[`addtrack`,`removetrack`]},mediaAudioTrackEnabled:{get(e){let{media:t}=e;return[...t?.audioTracks??[]].find(e=>e.enabled)?.id},set(e,t){let{media:n}=t;if(!n?.audioTracks){console.warn(`MediaChrome: Audio track selection not supported by this media.`);return}let r=e;for(let e of n.audioTracks)e.enabled=r==e.id},mediaEvents:[`emptied`],audioTracksEvents:[`addtrack`,`removetrack`,`change`]},mediaIsFullscreen:{get(e){return Ht(e)},set(e,t,n){var r;e?(Lt(t),n.detail&&!t.media?.inert&&((r=t.media)==null||r.focus())):zt(t)},rootEvents:[`fullscreenchange`,`webkitfullscreenchange`],mediaEvents:[`webkitbeginfullscreen`,`webkitendfullscreen`,`webkitpresentationmodechanged`]},mediaIsCasting:{get(e){let{media:t}=e;return!t?.remote||t.remote?.state===`disconnected`?!1:t.remote.state===`connected`},set(e,t){let{media:n}=t;if(n&&!(e&&n.remote?.state!==`disconnected`)&&(e||n.remote?.state===`connected`)){if(typeof n.remote.prompt!=`function`){console.warn(`MediaChrome: Casting is not supported in this environment`);return}n.remote.prompt().catch(()=>{})}},remoteEvents:[`connect`,`connecting`,`disconnect`]},mediaIsAirplaying:{get(){return!1},set(e,t){let{media:n}=t;if(n){if(!(n.webkitShowPlaybackTargetPicker&&C.WebKitPlaybackTargetAvailabilityEvent)){console.error(`MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment`);return}n.webkitShowPlaybackTargetPicker()}},mediaEvents:[`webkitcurrentplaybacktargetiswirelesschanged`]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!$t||!Qt(t))return u.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;if(!en||!Zt(t))return u.UNSUPPORTED;if(t?.disablePictureInPicture)return u.UNAVAILABLE}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(un===!1||t?.volume==null)return u.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{un??dn.then(t=>e(t?void 0:u.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t=`not-available`}={}){let{media:n}=e;if(!nn||!n?.remote?.state)return u.UNSUPPORTED;if(t!=null&&t!==`available`)return u.UNAVAILABLE},stateOwnersUpdateHandlers:[(e,t)=>{var n;let{media:r}=t;if(r)return r.disableRemotePlayback||r.hasAttribute(`disableremoteplayback`)||(n=r?.remote)==null||n.watchAvailability(t=>{e({availability:t?`available`:`not-available`})}).catch(t=>{t.name===`NotSupportedError`?e({availability:null}):e({availability:`not-available`})}),()=>{var e;(e=r?.remote)==null||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get(e,t){if(!tn)return u.UNSUPPORTED;if(t?.availability===`not-available`)return u.UNAVAILABLE},mediaEvents:[`webkitplaybacktargetavailabilitychanged`],stateOwnersUpdateHandlers:[(e,t)=>{var n;let{media:r}=t;if(r)return r.disableRemotePlayback||r.hasAttribute(`disableremoteplayback`)||(n=r?.remote)==null||n.watchAvailability(t=>{e({availability:t?`available`:`not-available`})}).catch(t=>{t.name===`NotSupportedError`?e({availability:null}):e({availability:`not-available`})}),()=>{var e;(e=r?.remote)==null||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){let{media:t}=e;if(!t?.videoRenditions)return u.UNSUPPORTED;if(!t.videoRenditions?.length)return u.UNAVAILABLE},mediaEvents:[`emptied`,`loadstart`],videoRenditionsEvents:[`addrendition`,`removerendition`]},mediaAudioTrackUnavailable:{get(e){let{media:t}=e;if(!t?.audioTracks)return u.UNSUPPORTED;if((t.audioTracks?.length??0)<=1)return u.UNAVAILABLE},mediaEvents:[`emptied`,`loadstart`],audioTracksEvents:[`addtrack`,`removetrack`]},mediaLang:{get(e){let{options:{mediaLang:t}={}}=e;return t??`en`}}},gn={[e.MEDIA_PREVIEW_REQUEST](e,t,{detail:n}){let{media:r}=t,i=n??void 0,a,o;if(r&&i!=null){let[e]=Ft(r,{kind:s.METADATA,label:`thumbnails`}),t=Array.prototype.find.call(e?.cues??[],(e,t,n)=>t===0?e.endTime>i:t===n.length-1?e.startTime<=i:e.startTime<=i&&e.endTime>i);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)?void 0:r?.querySelector(`track[label="thumbnails"]`)?.src,n=new URL(t.text,e);o=new URLSearchParams(n.hash).get(`#xywh`).split(`,`).map(e=>+e),a=n.href}}let c=e.mediaDuration.get(t),l=e.mediaChaptersCues.get(t).find((e,t,n)=>t===n.length-1&&c===e.endTime?e.startTime<=i&&e.endTime>=i:e.startTime<=i&&e.endTime>i)?.text;return n!=null&&l==null&&(l=``),{mediaPreviewTime:i,mediaPreviewImage:a,mediaPreviewCoords:o,mediaPreviewChapter:l}},[e.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[e.MEDIA_PLAY_REQUEST](e,t){let n=e.mediaStreamType.get(t)===d.LIVE,r=!t.options?.noAutoSeekToLive,i=e.mediaTargetLiveWindow.get(t)>0;if(n&&r&&!i){let n=e.mediaSeekable.get(t)?.[1];if(n){let r=n-(t.options?.seekToLiveOffset??0);e.mediaCurrentTime.set(r,t)}}e.mediaPaused.set(!1,t)},[e.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:n}){let r=n;e.mediaPlaybackRate.set(r,t)},[e.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[e.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[e.MEDIA_LOOP_REQUEST](e,t,{detail:n}){let r=!!n;return e.mediaLoop.set(r,t),{mediaLoop:r}},[e.MEDIA_VOLUME_REQUEST](e,t,{detail:n}){let r=n;r&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(r,t)},[e.MEDIA_SEEK_REQUEST](e,t,{detail:n}){let r=n;e.mediaCurrentTime.set(r,t)},[e.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){let n=e.mediaSeekable.get(t)?.[1];if(Number.isNaN(Number(n)))return;let r=n-(t.options?.seekToLiveOffset??0);e.mediaCurrentTime.set(r,t)},[e.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:n}){let{options:r}=t,i=rn(t),a=kt(n),o=a[0]?.language;o&&!r.noSubtitlesLangPref&&C.localStorage.setItem(`media-chrome-pref-subtitles-lang`,o),Pt(c.SHOWING,i,a)},[e.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:n}){let r=rn(t),i=n??[];Pt(c.DISABLED,r,i)},[e.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:n}){on(t,n)},[e.MEDIA_RENDITION_REQUEST](e,t,{detail:n}){let r=n;e.mediaRenditionSelected.set(r,t)},[e.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:n}){let r=n;e.mediaAudioTrackEnabled.set(r,t)},[e.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[e.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[e.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t,n){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t,n)},[e.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[e.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[e.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[e.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}},_n=({media:e,fullscreenElement:t,documentElement:n,stateMediator:r=hn,requestMap:i=gn,options:a={},monitorStateOwnersOnlyWithSubscriptions:o=!0})=>{let s=[],c={options:{...a}},l=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),u=e=>{e!=null&&(sn(e,l)||(l=Object.freeze({...l,...e}),s.forEach(e=>e(l))))},d=()=>{let e=Object.entries(r).reduce((e,[t,{get:n}])=>(e[t]=n(c),e),{});u(e)},f={},p,m=async(e,t)=>{let n=!!p;if(p={...c,...p??{},...e},n)return;await fn(...Object.values(e));let i=s.length>0&&t===0&&o,a=c.media!==p.media,l=c.media?.textTracks!==p.media?.textTracks,m=c.media?.videoRenditions!==p.media?.videoRenditions,h=c.media?.audioTracks!==p.media?.audioTracks,g=c.media?.remote!==p.media?.remote,_=c.documentElement!==p.documentElement,v=!!c.media&&(a||i),y=!!c.media?.textTracks&&(l||i),b=!!c.media?.videoRenditions&&(m||i),ee=!!c.media?.audioTracks&&(h||i),te=!!c.media?.remote&&(g||i),ne=!!c.documentElement&&(_||i),x=v||y||b||ee||te||ne,S=s.length===0&&t===1&&o,re=!!p.media&&(a||S),ie=!!p.media?.textTracks&&(l||S),ae=!!p.media?.videoRenditions&&(m||S),oe=!!p.media?.audioTracks&&(h||S),se=!!p.media?.remote&&(g||S),ce=!!p.documentElement&&(_||S),le=re||ie||ae||oe||se||ce;if(!(x||le)){Object.entries(p).forEach(([e,t])=>{c[e]=t}),d(),p=void 0;return}Object.entries(r).forEach(([e,{get:t,mediaEvents:n=[],textTracksEvents:r=[],videoRenditionsEvents:i=[],audioTracksEvents:a=[],remoteEvents:o=[],rootEvents:s=[],stateOwnersUpdateHandlers:l=[]}])=>{f[e]||(f[e]={});let d=n=>{let r=t(c,n);u({[e]:r})},m;m=f[e].mediaEvents,n.forEach(t=>{m&&v&&(c.media.removeEventListener(t,m),f[e].mediaEvents=void 0),re&&(p.media.addEventListener(t,d),f[e].mediaEvents=d)}),m=f[e].textTracksEvents,r.forEach(t=>{var n,r;m&&y&&((n=c.media.textTracks)==null||n.removeEventListener(t,m),f[e].textTracksEvents=void 0),ie&&((r=p.media.textTracks)==null||r.addEventListener(t,d),f[e].textTracksEvents=d)}),m=f[e].videoRenditionsEvents,i.forEach(t=>{var n,r;m&&b&&((n=c.media.videoRenditions)==null||n.removeEventListener(t,m),f[e].videoRenditionsEvents=void 0),ae&&((r=p.media.videoRenditions)==null||r.addEventListener(t,d),f[e].videoRenditionsEvents=d)}),m=f[e].audioTracksEvents,a.forEach(t=>{var n,r;m&&ee&&((n=c.media.audioTracks)==null||n.removeEventListener(t,m),f[e].audioTracksEvents=void 0),oe&&((r=p.media.audioTracks)==null||r.addEventListener(t,d),f[e].audioTracksEvents=d)}),m=f[e].remoteEvents,o.forEach(t=>{var n,r;m&&te&&((n=c.media.remote)==null||n.removeEventListener(t,m),f[e].remoteEvents=void 0),se&&((r=p.media.remote)==null||r.addEventListener(t,d),f[e].remoteEvents=d)}),m=f[e].rootEvents,s.forEach(t=>{m&&ne&&(c.documentElement.removeEventListener(t,m),f[e].rootEvents=void 0),ce&&(p.documentElement.addEventListener(t,d),f[e].rootEvents=d)});let h=f[e].stateOwnersUpdateHandlers;if(h&&x&&(Array.isArray(h)?h:[h]).forEach(e=>{typeof e==`function`&&e()}),le){let t=l.map(e=>e(d,p)).filter(e=>typeof e==`function`);f[e].stateOwnersUpdateHandlers=t.length===1?t[0]:t}else x&&(f[e].stateOwnersUpdateHandlers=void 0)}),Object.entries(p).forEach(([e,t])=>{c[e]=t}),d(),p=void 0};return m({media:e,fullscreenElement:t,documentElement:n,options:a}),{dispatch(e){let{type:t,detail:n}=e;if(i[t]&&l.mediaErrorCode==null){u(i[t](r,c,e));return}t===`mediaelementchangerequest`?m({media:n}):t===`fullscreenelementchangerequest`?m({fullscreenElement:n}):t===`documentelementchangerequest`?m({documentElement:n}):t===`optionschangerequest`&&(Object.entries(n??{}).forEach(([e,t])=>{c.options[e]=t}),d())},getState(){return l},subscribe(e){return m({},s.length+1),s.push(e),e(l),()=>{let t=s.indexOf(e);t>=0&&(m({},s.length-1),s.splice(t,1))}}}},vn=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},z=(e,t,n)=>(vn(e,t,`read from private field`),n?n.call(e):t.get(e)),B=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},yn=(e,t,n,r)=>(vn(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),bn=(e,t,n)=>(vn(e,t,`access private method`),n),xn,Sn,V,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn=[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Enter`,` `,`f`,`m`,`k`,`c`,`l`,`j`,`>`,`<`,`p`],In=10,Ln=.025,Rn=.25,zn=.25,Bn=2,H={DEFAULT_SUBTITLES:`defaultsubtitles`,DEFAULT_STREAM_TYPE:`defaultstreamtype`,DEFAULT_DURATION:`defaultduration`,FULLSCREEN_ELEMENT:`fullscreenelement`,HOTKEYS:`hotkeys`,KEYBOARD_BACKWARD_SEEK_OFFSET:`keyboardbackwardseekoffset`,KEYBOARD_FORWARD_SEEK_OFFSET:`keyboardforwardseekoffset`,KEYBOARD_DOWN_VOLUME_STEP:`keyboarddownvolumestep`,KEYBOARD_UP_VOLUME_STEP:`keyboardupvolumestep`,KEYS_USED:`keysused`,LANG:`lang`,LOOP:`loop`,LIVE_EDGE_OFFSET:`liveedgeoffset`,NO_AUTO_SEEK_TO_LIVE:`noautoseektolive`,NO_DEFAULT_STORE:`nodefaultstore`,NO_HOTKEYS:`nohotkeys`,NO_MUTED_PREF:`nomutedpref`,NO_SUBTITLES_LANG_PREF:`nosubtitleslangpref`,NO_VOLUME_PREF:`novolumepref`,SEEK_TO_LIVE_OFFSET:`seektoliveoffset`},Vn=class extends ht{constructor(){super(),B(this,On),B(this,jn),B(this,Nn),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,B(this,xn,new Tt(this,H.HOTKEYS)),B(this,Sn,void 0),B(this,V,void 0),B(this,Cn,null),B(this,wn,void 0),B(this,Tn,void 0),B(this,En,e=>{var t;(t=z(this,V))==null||t.dispatch(e)}),B(this,Dn,void 0),B(this,An,e=>{let{key:t,shiftKey:n}=e;if(!(n&&(t===`/`||t===`?`)||Fn.includes(t))){this.removeEventListener(`keyup`,z(this,An));return}this.keyboardShortcutHandler(e)}),this.associateElement(this);let e={};yn(this,wn,t=>{Object.entries(t).forEach(([t,n])=>{if(t in e&&e[t]===n)return;this.propagateMediaState(t,n);let r=t.toLowerCase(),i=new C.CustomEvent(o[r],{composed:!0,detail:n});this.dispatchEvent(i)}),e=t})}static get observedAttributes(){return super.observedAttributes.concat(H.NO_HOTKEYS,H.HOTKEYS,H.DEFAULT_STREAM_TYPE,H.DEFAULT_SUBTITLES,H.DEFAULT_DURATION,H.NO_MUTED_PREF,H.NO_VOLUME_PREF,H.LANG,H.LOOP,H.LIVE_EDGE_OFFSET,H.SEEK_TO_LIVE_OFFSET,H.NO_AUTO_SEEK_TO_LIVE)}get mediaStore(){return z(this,V)}set mediaStore(e){var t;if(z(this,V)&&((t=z(this,Tn))==null||t.call(this),yn(this,Tn,void 0)),yn(this,V,e),!z(this,V)&&!this.hasAttribute(H.NO_DEFAULT_STORE)){bn(this,On,kn).call(this);return}yn(this,Tn,z(this,V)?.subscribe(z(this,wn)))}get fullscreenElement(){return z(this,Sn)??this}set fullscreenElement(e){var t;this.hasAttribute(H.FULLSCREEN_ELEMENT)&&this.removeAttribute(H.FULLSCREEN_ELEMENT),yn(this,Sn,e),(t=z(this,V))==null||t.dispatch({type:`fullscreenelementchangerequest`,detail:this.fullscreenElement})}get defaultSubtitles(){return O(this,H.DEFAULT_SUBTITLES)}set defaultSubtitles(e){k(this,H.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return A(this,H.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){j(this,H.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return E(this,H.DEFAULT_DURATION)}set defaultDuration(e){D(this,H.DEFAULT_DURATION,e)}get noHotkeys(){return O(this,H.NO_HOTKEYS)}set noHotkeys(e){k(this,H.NO_HOTKEYS,e)}get keysUsed(){return A(this,H.KEYS_USED)}set keysUsed(e){j(this,H.KEYS_USED,e)}get liveEdgeOffset(){return E(this,H.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){D(this,H.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return O(this,H.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){k(this,H.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return O(this,H.NO_VOLUME_PREF)}set noVolumePref(e){k(this,H.NO_VOLUME_PREF,e)}get noMutedPref(){return O(this,H.NO_MUTED_PREF)}set noMutedPref(e){k(this,H.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return O(this,H.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){k(this,H.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return O(this,H.NO_DEFAULT_STORE)}set noDefaultStore(e){k(this,H.NO_DEFAULT_STORE,e)}get resolvedLang(){return ne()}attributeChangedCallback(t,n,r){var i,a,o,s,c,l,u,d,f,p;if(super.attributeChangedCallback(t,n,r),t===H.NO_HOTKEYS)r!==n&&r===``?(this.hasAttribute(H.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):r!==n&&r===null&&this.enableHotkeys();else if(t===H.HOTKEYS)z(this,xn).value=r;else if(t===H.DEFAULT_SUBTITLES&&r!==n)(i=z(this,V))==null||i.dispatch({type:`optionschangerequest`,detail:{defaultSubtitles:this.hasAttribute(H.DEFAULT_SUBTITLES)}});else if(t===H.DEFAULT_STREAM_TYPE)(a=z(this,V))==null||a.dispatch({type:`optionschangerequest`,detail:{defaultStreamType:this.getAttribute(H.DEFAULT_STREAM_TYPE)??void 0}});else if(t===H.LIVE_EDGE_OFFSET&&r!==n)(o=z(this,V))==null||o.dispatch({type:`optionschangerequest`,detail:{liveEdgeOffset:this.hasAttribute(H.LIVE_EDGE_OFFSET)?+this.getAttribute(H.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(H.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(H.SEEK_TO_LIVE_OFFSET):this.hasAttribute(H.LIVE_EDGE_OFFSET)?+this.getAttribute(H.LIVE_EDGE_OFFSET):void 0}});else if(t===H.SEEK_TO_LIVE_OFFSET&&r!==n)(s=z(this,V))==null||s.dispatch({type:`optionschangerequest`,detail:{seekToLiveOffset:this.hasAttribute(H.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(H.SEEK_TO_LIVE_OFFSET):this.hasAttribute(H.LIVE_EDGE_OFFSET)?+this.getAttribute(H.LIVE_EDGE_OFFSET):void 0}});else if(t===H.NO_AUTO_SEEK_TO_LIVE)(c=z(this,V))==null||c.dispatch({type:`optionschangerequest`,detail:{noAutoSeekToLive:this.hasAttribute(H.NO_AUTO_SEEK_TO_LIVE)}});else if(t===H.FULLSCREEN_ELEMENT){let e=r?this.getRootNode()?.getElementById(r):void 0;yn(this,Sn,e),(l=z(this,V))==null||l.dispatch({type:`fullscreenelementchangerequest`,detail:this.fullscreenElement})}else t===H.LANG&&r!==n?(ee(r),(u=z(this,V))==null||u.dispatch({type:`optionschangerequest`,detail:{mediaLang:r}})):t===H.LOOP&&r!==n?(d=z(this,V))==null||d.dispatch({type:e.MEDIA_LOOP_REQUEST,detail:r!=null}):t===H.NO_VOLUME_PREF&&r!==n?(f=z(this,V))==null||f.dispatch({type:`optionschangerequest`,detail:{noVolumePref:this.hasAttribute(H.NO_VOLUME_PREF)}}):t===H.NO_MUTED_PREF&&r!==n&&((p=z(this,V))==null||p.dispatch({type:`optionschangerequest`,detail:{noMutedPref:this.hasAttribute(H.NO_MUTED_PREF)}}))}connectedCallback(){var t,n;this.associateElement(this),!z(this,V)&&!this.hasAttribute(H.NO_DEFAULT_STORE)&&bn(this,On,kn).call(this),(t=z(this,V))==null||t.dispatch({type:`documentelementchangerequest`,detail:w}),(n=z(this,V))==null||n.dispatch({type:`fullscreenelementchangerequest`,detail:this.fullscreenElement}),super.connectedCallback(),z(this,V)&&!z(this,Tn)&&yn(this,Tn,z(this,V)?.subscribe(z(this,wn))),z(this,Dn)!==void 0&&z(this,V)&&this.media&&setTimeout(()=>{var t;this.media?.textTracks?.length&&((t=z(this,V))==null||t.dispatch({type:e.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:z(this,Dn)}))},0),this.hasAttribute(H.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var t,n,r,i,a;if((t=super.disconnectedCallback)==null||t.call(this),this.disableHotkeys(),z(this,V)){let t=z(this,V).getState();yn(this,Dn,!!t.mediaSubtitlesShowing?.length),(n=z(this,V))==null||n.dispatch({type:`fullscreenelementchangerequest`,detail:void 0}),(r=z(this,V))==null||r.dispatch({type:`documentelementchangerequest`,detail:void 0}),(i=z(this,V))==null||i.dispatch({type:e.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}z(this,Tn)&&((a=z(this,Tn))==null||a.call(this),yn(this,Tn,void 0)),this.unassociateElement(this),z(this,Cn)&&(z(this,Cn).remove(),yn(this,Cn,null))}mediaSetCallback(e){var t;super.mediaSetCallback(e),(t=z(this,V))==null||t.dispatch({type:`mediaelementchangerequest`,detail:e}),e.hasAttribute(`tabindex`)||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),(t=z(this,V))==null||t.dispatch({type:`mediaelementchangerequest`,detail:void 0})}propagateMediaState(e,t){Qn(this.mediaStateReceivers,e,t)}associateElement(t){if(!t)return;let{associatedElementSubscriptions:n}=this;if(n.has(t))return;let r=$n(t,this.registerMediaStateReceiver.bind(this),this.unregisterMediaStateReceiver.bind(this));Object.values(e).forEach(e=>{t.addEventListener(e,z(this,En))}),n.set(t,r)}unassociateElement(t){if(!t)return;let{associatedElementSubscriptions:n}=this;n.has(t)&&(n.get(t)(),n.delete(t),Object.values(e).forEach(e=>{t.removeEventListener(e,z(this,En))}))}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers;t.indexOf(e)>-1||(t.push(e),z(this,V)&&Object.entries(z(this,V).getState()).forEach(([t,n])=>{Qn([e],t,n)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,n=t.indexOf(e);n<0||t.splice(n,1)}enableHotkeys(){this.addEventListener(`keydown`,bn(this,jn,Mn))}disableHotkeys(){this.removeEventListener(`keydown`,bn(this,jn,Mn)),this.removeEventListener(`keyup`,z(this,An))}get hotkeys(){return z(this,xn)}set hotkeys(e){j(this,H.HOTKEYS,e)}keyboardShortcutHandler(t){let n=t.target;if((n.getAttribute(H.KEYS_USED)?.split(` `)??n?.keysUsed??[]).map(e=>e===`Space`?` `:e).filter(Boolean).includes(t.key))return;let r,i,a;if(!z(this,xn).contains(`no${t.key.toLowerCase()}`)&&!(t.key===` `&&z(this,xn).contains(`nospace`))&&(!t.shiftKey||t.key!==`/`&&t.key!==`?`||!z(this,xn).contains(`noshift+/`)))switch(t.key){case` `:case`k`:r=z(this,V).getState().mediaPaused?e.MEDIA_PLAY_REQUEST:e.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new C.CustomEvent(r,{composed:!0,bubbles:!0}));break;case`m`:r=this.mediaStore.getState().mediaVolumeLevel===`off`?e.MEDIA_UNMUTE_REQUEST:e.MEDIA_MUTE_REQUEST,this.dispatchEvent(new C.CustomEvent(r,{composed:!0,bubbles:!0}));break;case`f`:r=this.mediaStore.getState().mediaIsFullscreen?e.MEDIA_EXIT_FULLSCREEN_REQUEST:e.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new C.CustomEvent(r,{composed:!0,bubbles:!0}));break;case`c`:this.dispatchEvent(new C.CustomEvent(e.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case`ArrowLeft`:case`j`:{let t=this.hasAttribute(H.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(H.KEYBOARD_BACKWARD_SEEK_OFFSET):In;i=Math.max((this.mediaStore.getState().mediaCurrentTime??0)-t,0),a=new C.CustomEvent(e.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`ArrowRight`:case`l`:{let t=this.hasAttribute(H.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(H.KEYBOARD_FORWARD_SEEK_OFFSET):In;i=Math.max((this.mediaStore.getState().mediaCurrentTime??0)+t,0),a=new C.CustomEvent(e.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`ArrowUp`:{let t=this.hasAttribute(H.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(H.KEYBOARD_UP_VOLUME_STEP):Ln;i=Math.min((this.mediaStore.getState().mediaVolume??1)+t,1),a=new C.CustomEvent(e.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`ArrowDown`:{let t=this.hasAttribute(H.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(H.KEYBOARD_DOWN_VOLUME_STEP):Ln;i=Math.max((this.mediaStore.getState().mediaVolume??1)-t,0),a=new C.CustomEvent(e.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`<`:{let t=this.mediaStore.getState().mediaPlaybackRate??1;i=Math.max(t-Rn,zn).toFixed(2),a=new C.CustomEvent(e.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`>`:{let t=this.mediaStore.getState().mediaPlaybackRate??1;i=Math.min(t+Rn,Bn).toFixed(2),a=new C.CustomEvent(e.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:i}),this.dispatchEvent(a);break}case`/`:case`?`:t.shiftKey&&bn(this,Nn,Pn).call(this);break;case`p`:r=this.mediaStore.getState().mediaIsPip?e.MEDIA_EXIT_PIP_REQUEST:e.MEDIA_ENTER_PIP_REQUEST,a=new C.CustomEvent(r,{composed:!0,bubbles:!0}),this.dispatchEvent(a)}}};xn=new WeakMap,Sn=new WeakMap,V=new WeakMap,Cn=new WeakMap,wn=new WeakMap,Tn=new WeakMap,En=new WeakMap,Dn=new WeakMap,On=new WeakSet,kn=function(){this.mediaStore=_n({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(H.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(H.DEFAULT_DURATION)?+this.getAttribute(H.DEFAULT_DURATION):void 0,defaultStreamType:this.getAttribute(H.DEFAULT_STREAM_TYPE)??void 0,liveEdgeOffset:this.hasAttribute(H.LIVE_EDGE_OFFSET)?+this.getAttribute(H.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(H.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(H.SEEK_TO_LIVE_OFFSET):this.hasAttribute(H.LIVE_EDGE_OFFSET)?+this.getAttribute(H.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(H.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(H.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(H.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(H.NO_SUBTITLES_LANG_PREF)}})},An=new WeakMap,jn=new WeakSet,Mn=function(e){let{metaKey:t,altKey:n,key:r,shiftKey:i}=e,a=i&&(r===`/`||r===`?`);if(a&&z(this,Cn)?.open){this.removeEventListener(`keyup`,z(this,An));return}if(t||n||!a&&!Fn.includes(r)){this.removeEventListener(`keyup`,z(this,An));return}let o=e.target,s=o instanceof HTMLElement&&(o.tagName.toLowerCase()===`media-volume-range`||o.tagName.toLowerCase()===`media-time-range`);[` `,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`].includes(r)&&!(z(this,xn).contains(`no${r.toLowerCase()}`)||r===` `&&z(this,xn).contains(`nospace`))&&!s&&e.preventDefault(),this.addEventListener(`keyup`,z(this,An),{once:!0})},Nn=new WeakSet,Pn=function(){z(this,Cn)||(yn(this,Cn,w.createElement(`media-keyboard-shortcuts-dialog`)),this.appendChild(z(this,Cn))),z(this,Cn).open=!0};var Hn=Object.values(i),Un=Object.values(n),Wn=e=>{var n;let{observedAttributes:r}=e.constructor;!r&&e.nodeName?.includes(`-`)&&(C.customElements.upgrade(e),{observedAttributes:r}=e.constructor);let i=((n=(e?.getAttribute)?.call(e,t.MEDIA_CHROME_ATTRIBUTES))?.split)?.call(n,/\s+/);return Array.isArray(r||i)?(r||i).filter(e=>Hn.includes(e)):[]},Gn=e=>(e.nodeName?.includes(`-`)&&C.customElements.get(e.nodeName?.toLowerCase())&&!(e instanceof C.customElements.get(e.nodeName.toLowerCase()))&&C.customElements.upgrade(e),Un.some(t=>t in e)),Kn=e=>Gn(e)||!!Wn(e).length,qn=e=>(e?.join)?.call(e,`:`),Jn={[i.MEDIA_SUBTITLES_LIST]:jt,[i.MEDIA_SUBTITLES_SHOWING]:jt,[i.MEDIA_SEEKABLE]:qn,[i.MEDIA_BUFFERED]:e=>e?.map(qn).join(` `),[i.MEDIA_PREVIEW_COORDS]:e=>e?.join(` `),[i.MEDIA_RENDITION_LIST]:p,[i.MEDIA_AUDIO_TRACK_LIST]:h},Yn=async(e,t,n)=>{if(e.isConnected||await v(0),typeof n==`boolean`||n==null)return k(e,t,n);if(typeof n==`number`)return D(e,t,n);if(typeof n==`string`)return j(e,t,n);if(Array.isArray(n)&&!n.length)return e.removeAttribute(t);let r=Jn[t]?.call(Jn,n)??n;return e.setAttribute(t,r)},Xn=e=>!!e.closest?.call(e,`*[slot="media"]`),Zn=(e,t)=>{if(Xn(e))return;let n=(e,t)=>{Kn(e)&&t(e);let{children:n=[]}=e??{},r=e?.shadowRoot?.children??[];[...n,...r].forEach(e=>Zn(e,t))},r=e?.nodeName.toLowerCase();if(r.includes(`-`)&&!Kn(e)){C.customElements.whenDefined(r).then(()=>{n(e,t)});return}n(e,t)},Qn=(e,t,n)=>{e.forEach(e=>{if(t in e){e[t]=n;return}let r=Wn(e),i=t.toLowerCase();r.includes(i)&&Yn(e,i,n)})},$n=(n,r,i)=>{Zn(n,r);let a=e=>{r(e?.composedPath()[0]??e.target)},o=e=>{i(e?.composedPath()[0]??e.target)};n.addEventListener(e.REGISTER_MEDIA_STATE_RECEIVER,a),n.addEventListener(e.UNREGISTER_MEDIA_STATE_RECEIVER,o);let s=e=>{e.forEach(e=>{let{addedNodes:n=[],removedNodes:a=[],type:o,target:s,attributeName:c}=e;o===`childList`?(Array.prototype.forEach.call(n,e=>Zn(e,r)),Array.prototype.forEach.call(a,e=>Zn(e,i))):o===`attributes`&&c===t.MEDIA_CHROME_ATTRIBUTES&&(Kn(s)?r(s):i(s))})},c=[],l=e=>{let t=e.target;t.name!==`media`&&(c.forEach(e=>Zn(e,i)),c=[...t.assignedElements({flatten:!0})],c.forEach(e=>Zn(e,r)))};n.addEventListener(`slotchange`,l);let u=new MutationObserver(s);return u.observe(n,{childList:!0,attributes:!0,subtree:!0}),()=>{Zn(n,i),n.removeEventListener(`slotchange`,l),u.disconnect(),n.removeEventListener(e.REGISTER_MEDIA_STATE_RECEIVER,a),n.removeEventListener(e.UNREGISTER_MEDIA_STATE_RECEIVER,o)}};C.customElements.get(`media-controller`)||C.customElements.define(`media-controller`,Vn);var er={PLACEMENT:`placement`,BOUNDS:`bounds`};function tr(e){return`
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
  `}var nr=class extends C.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{if(!ke(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let e=this.placement;if(e===`left`||e===`right`){this.style.removeProperty(`--media-tooltip-offset-x`);return}let t=getComputedStyle(this),n=Ee(this,`#`+this.bounds)??be(this);if(!n)return;let{x:r,width:i}=n.getBoundingClientRect(),{x:a,width:o}=this.getBoundingClientRect(),s=a+o,c=r+i,l=t.getPropertyValue(`--media-tooltip-offset-x`),u=l?parseFloat(l.replace(`px`,``)):0,d=t.getPropertyValue(`--media-tooltip-container-margin`),f=d?parseFloat(d.replace(`px`,``)):0,p=a-r+u-f,m=s-c+u+f;if(p<0){this.style.setProperty(`--media-tooltip-offset-x`,`${p}px`);return}if(m>0){this.style.setProperty(`--media-tooltip-offset-x`,`${m}px`);return}this.style.removeProperty(`--media-tooltip-offset-x`)},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector(`#arrow`),Object.prototype.hasOwnProperty.call(this,`placement`)){let e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[er.PLACEMENT,er.BOUNDS]}get placement(){return A(this,er.PLACEMENT)}set placement(e){j(this,er.PLACEMENT,e)}get bounds(){return A(this,er.BOUNDS)}set bounds(e){j(this,er.BOUNDS,e)}};nr.shadowRootOptions={mode:`open`},nr.getTemplateHTML=tr,C.customElements.get(`media-tooltip`)||C.customElements.define(`media-tooltip`,nr);var rr=nr,ir=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},U=(e,t,n)=>(ir(e,t,`read from private field`),n?n.call(e):t.get(e)),ar=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},or=(e,t,n,r)=>(ir(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),sr=(e,t,n)=>(ir(e,t,`access private method`),n),cr,lr,ur,dr,fr,pr,mr,hr={TOOLTIP_PLACEMENT:`tooltipplacement`,DISABLED:`disabled`,NO_TOOLTIP:`notooltip`};function gr(e,t={}){return`
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

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${rr.shadowRootOptions.mode}">
          ${rr.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `}function _r(e,t){return`
    <slot></slot>
  `}function vr(){return``}var W=class extends C.HTMLElement{constructor(){if(super(),ar(this,pr),ar(this,cr,void 0),this.preventClick=!1,this.tooltipEl=null,ar(this,lr,e=>{this.preventClick||this.handleClick(e),setTimeout(U(this,ur),0)}),ar(this,ur,()=>{var e,t;(t=(e=this.tooltipEl)?.updateXOffset)==null||t.call(e)}),ar(this,dr,e=>{let{key:t}=e;if(!this.keysUsed.includes(t)){this.removeEventListener(`keyup`,U(this,dr));return}this.preventClick||this.handleClick(e)}),ar(this,fr,e=>{let{metaKey:t,altKey:n,key:r}=e;if(t||n||!this.keysUsed.includes(r)){this.removeEventListener(`keyup`,U(this,dr));return}this.addEventListener(`keyup`,U(this,dr),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector(`media-tooltip`)}static get observedAttributes(){return[`disabled`,hr.TOOLTIP_PLACEMENT,t.MEDIA_CONTROLLER,i.MEDIA_LANG]}enable(){this.addEventListener(`click`,U(this,lr)),this.addEventListener(`keydown`,U(this,fr)),this.tabIndex=0}disable(){this.removeEventListener(`click`,U(this,lr)),this.removeEventListener(`keydown`,U(this,fr)),this.removeEventListener(`keyup`,U(this,dr)),this.tabIndex=-1}attributeChangedCallback(e,n,r){var a,o,s,c;e===t.MEDIA_CONTROLLER?(n&&((o=(a=U(this,cr))?.unassociateElement)==null||o.call(a,this),or(this,cr,null)),r&&this.isConnected&&(or(this,cr,this.getRootNode()?.getElementById(r)),(c=(s=U(this,cr))?.associateElement)==null||c.call(s,this))):e===`disabled`&&r!==n?r==null?this.enable():this.disable():e===hr.TOOLTIP_PLACEMENT&&this.tooltipEl&&r!==n?this.tooltipEl.placement=r:e===i.MEDIA_LANG&&(this.shadowRoot.querySelector(`slot[name="tooltip-content"]`).innerHTML=this.constructor.getTooltipContentHTML()),U(this,ur).call(this)}connectedCallback(){var e,n;let{style:r}=T(this.shadowRoot,`:host`);r.setProperty(`display`,`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute(`disabled`)?this.disable():this.enable(),this.setAttribute(`role`,`button`);let i=this.getAttribute(t.MEDIA_CONTROLLER);i&&(or(this,cr,this.getRootNode()?.getElementById(i)),(n=(e=U(this,cr))?.associateElement)==null||n.call(e,this)),C.customElements.whenDefined(`media-tooltip`).then(()=>sr(this,pr,mr).call(this))}disconnectedCallback(){var e,t;this.disable(),(t=(e=U(this,cr))?.unassociateElement)==null||t.call(e,this),or(this,cr,null),this.removeEventListener(`mouseenter`,U(this,ur)),this.removeEventListener(`focus`,U(this,ur)),this.removeEventListener(`click`,U(this,lr))}get keysUsed(){return[`Enter`,` `]}get tooltipPlacement(){return A(this,hr.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){j(this,hr.TOOLTIP_PLACEMENT,e)}get mediaController(){return A(this,t.MEDIA_CONTROLLER)}set mediaController(e){j(this,t.MEDIA_CONTROLLER,e)}get disabled(){return O(this,hr.DISABLED)}set disabled(e){k(this,hr.DISABLED,e)}get noTooltip(){return O(this,hr.NO_TOOLTIP)}set noTooltip(e){k(this,hr.NO_TOOLTIP,e)}handleClick(e){}};cr=new WeakMap,lr=new WeakMap,ur=new WeakMap,dr=new WeakMap,fr=new WeakMap,pr=new WeakSet,mr=function(){this.addEventListener(`mouseenter`,U(this,ur)),this.addEventListener(`focus`,U(this,ur)),this.addEventListener(`click`,U(this,lr));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},W.shadowRootOptions={mode:`open`},W.getTemplateHTML=gr,W.getSlotTemplateHTML=_r,W.getTooltipContentHTML=vr,C.customElements.get(`media-chrome-button`)||C.customElements.define(`media-chrome-button`,W);var yr=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function br(e){return`
    <style>
      :host([${i.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${i.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${i.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${i.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${yr}</slot>
      <slot name="exit">${yr}</slot>
    </slot>
  `}function xr(){return`
    <slot name="tooltip-enter">${x(`start airplay`)}</slot>
    <slot name="tooltip-exit">${x(`stop airplay`)}</slot>
  `}var Sr=e=>{let t=e.mediaIsAirplaying?x(`stop airplay`):x(`start airplay`);e.setAttribute(`aria-label`,t)},Cr=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_IS_AIRPLAYING,i.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Sr(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_IS_AIRPLAYING&&Sr(this)}get mediaIsAirplaying(){return O(this,i.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){k(this,i.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return A(this,i.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){j(this,i.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let t=new C.CustomEvent(e.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(t)}};Cr.getSlotTemplateHTML=br,Cr.getTooltipContentHTML=xr,C.customElements.get(`media-airplay-button`)||C.customElements.define(`media-airplay-button`,Cr);var wr=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,Tr=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Er(e){return`
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
      <slot name="on">${wr}</slot>
      <slot name="off">${Tr}</slot>
    </slot>
  `}function Dr(){return`
    <slot name="tooltip-enable">${x(`Enable captions`)}</slot>
    <slot name="tooltip-disable">${x(`Disable captions`)}</slot>
  `}var Or=e=>{e.setAttribute(`aria-checked`,It(e).toString())},kr=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_SUBTITLES_LIST,i.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`button`),this.setAttribute(`aria-label`,x(`closed captions`)),Or(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_SUBTITLES_SHOWING&&Or(this)}get mediaSubtitlesList(){return Ar(this,i.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){jr(this,i.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Ar(this,i.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){jr(this,i.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new C.CustomEvent(e.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}};kr.getSlotTemplateHTML=Er,kr.getTooltipContentHTML=Dr;var Ar=(e,t)=>{let n=e.getAttribute(t);return n?Ot(n):[]},jr=(e,t,n)=>{if(!n?.length){e.removeAttribute(t);return}let r=jt(n);e.getAttribute(t)!==r&&e.setAttribute(t,r)};C.customElements.get(`media-captions-button`)||C.customElements.define(`media-captions-button`,kr);var Mr=`<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>`,Nr=`<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>`;function Pr(e){return`
    <style>
      :host([${i.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${i.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${i.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${i.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Mr}</slot>
      <slot name="exit">${Nr}</slot>
    </slot>
  `}function Fr(){return`
    <slot name="tooltip-enter">${x(`Start casting`)}</slot>
    <slot name="tooltip-exit">${x(`Stop casting`)}</slot>
  `}var Ir=e=>{let t=e.mediaIsCasting?x(`stop casting`):x(`start casting`);e.setAttribute(`aria-label`,t)},Lr=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_IS_CASTING,i.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Ir(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_IS_CASTING&&Ir(this)}get mediaIsCasting(){return O(this,i.MEDIA_IS_CASTING)}set mediaIsCasting(e){k(this,i.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return A(this,i.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){j(this,i.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let t=this.mediaIsCasting?e.MEDIA_EXIT_CAST_REQUEST:e.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new C.CustomEvent(t,{composed:!0,bubbles:!0}))}};Lr.getSlotTemplateHTML=Pr,Lr.getTooltipContentHTML=Fr,C.customElements.get(`media-cast-button`)||C.customElements.define(`media-cast-button`,Lr);var Rr=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},zr=(e,t,n)=>(Rr(e,t,`read from private field`),n?n.call(e):t.get(e)),Br=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Vr=(e,t,n,r)=>(Rr(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Hr=(e,t,n)=>(Rr(e,t,`access private method`),n),Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri;function ii(e){return`
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
    ${this.getSlotTemplateHTML(e)}
  `}function ai(e){return`
    <slot id="content"></slot>
  `}var oi={OPEN:`open`,ANCHOR:`anchor`},si=class extends C.HTMLElement{constructor(){super(),Br(this,Kr),Br(this,Jr),Br(this,Xr),Br(this,Qr),Br(this,ei),Br(this,ni),Br(this,Ur,!1),Br(this,Wr,null),Br(this,Gr,null)}static get observedAttributes(){return[oi.OPEN,oi.ANCHOR]}get open(){return O(this,oi.OPEN)}set open(e){k(this,oi.OPEN,e)}handleEvent(e){switch(e.type){case`invoke`:Hr(this,Qr,$r).call(this,e);break;case`focusout`:Hr(this,ei,ti).call(this,e);break;case`keydown`:Hr(this,ni,ri).call(this,e)}}connectedCallback(){Hr(this,Kr,qr).call(this),this.role||=`dialog`,this.addEventListener(`invoke`,this),this.addEventListener(`focusout`,this),this.addEventListener(`keydown`,this)}disconnectedCallback(){this.removeEventListener(`invoke`,this),this.removeEventListener(`focusout`,this),this.removeEventListener(`keydown`,this)}attributeChangedCallback(e,t,n){Hr(this,Kr,qr).call(this),e===oi.OPEN&&n!==t&&(this.open?Hr(this,Jr,Yr).call(this):Hr(this,Xr,Zr).call(this))}focus(){Vr(this,Wr,De());let e=!this.dispatchEvent(new Event(`focus`,{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event(`focusin`,{composed:!0,bubbles:!0,cancelable:!0}));e||t||this.querySelector(`[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]`)?.focus()}get keysUsed(){return[`Escape`,`Tab`]}};Ur=new WeakMap,Wr=new WeakMap,Gr=new WeakMap,Kr=new WeakSet,qr=function(){if(!zr(this,Ur)&&(Vr(this,Ur,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=T(this.shadowRoot,`:host`);e.setProperty(`transition`,`display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in`)})}},Jr=new WeakSet,Yr=function(){var e;(e=zr(this,Gr))==null||e.setAttribute(`aria-expanded`,`true`),this.dispatchEvent(new Event(`open`,{composed:!0,bubbles:!0})),this.addEventListener(`transitionend`,()=>this.focus(),{once:!0})},Xr=new WeakSet,Zr=function(){var e;(e=zr(this,Gr))==null||e.setAttribute(`aria-expanded`,`false`),this.dispatchEvent(new Event(`close`,{composed:!0,bubbles:!0}))},Qr=new WeakSet,$r=function(e){Vr(this,Gr,e.relatedTarget),Te(this,e.relatedTarget)||(this.open=!this.open)},ei=new WeakSet,ti=function(e){var t;Te(this,e.relatedTarget)||((t=zr(this,Wr))==null||t.focus(),zr(this,Gr)&&zr(this,Gr)!==e.relatedTarget&&this.open&&(this.open=!1))},ni=new WeakSet,ri=function(e){var t,n,r,i,a;let{key:o,ctrlKey:s,altKey:c,metaKey:l}=e;s||c||l||this.keysUsed.includes(o)&&(e.preventDefault(),e.stopPropagation(),o===`Tab`?(e.shiftKey?(n=(t=this.previousElementSibling)?.focus)==null||n.call(t):(i=(r=this.nextElementSibling)?.focus)==null||i.call(r),this.blur()):o===`Escape`&&((a=zr(this,Wr))==null||a.focus(),this.open=!1))},si.shadowRootOptions={mode:`open`},si.getTemplateHTML=ii,si.getSlotTemplateHTML=ai,C.customElements.get(`media-chrome-dialog`)||C.customElements.define(`media-chrome-dialog`,si);var ci=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},G=(e,t,n)=>(ci(e,t,`read from private field`),n?n.call(e):t.get(e)),K=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},li=(e,t,n,r)=>(ci(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),q=(e,t,n)=>(ci(e,t,`access private method`),n),ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi;function Fi(e){return`
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

      ${this.getContainerTemplateHTML(e)}
    </div>
    <div id="rightgap"></div>
  `}function Ii(e){return``}var Li=class extends C.HTMLElement{constructor(){if(super(),K(this,yi),K(this,xi),K(this,Ci),K(this,Ti),K(this,Di),K(this,ki),K(this,ji),K(this,Ni),K(this,ui,void 0),K(this,di,void 0),K(this,fi,void 0),K(this,pi,void 0),K(this,mi,{}),K(this,hi,[]),K(this,gi,()=>{if(this.range.matches(`:focus-visible`)){let{style:e}=T(this.shadowRoot,`:host`);e.setProperty(`--_focus-visible-box-shadow`,`var(--_focus-box-shadow)`)}}),K(this,_i,()=>{let{style:e}=T(this.shadowRoot,`:host`);e.removeProperty(`--_focus-visible-box-shadow`)}),K(this,vi,()=>{let e=this.shadowRoot.querySelector(`#segments-clipping`);e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector(`#container`),li(this,fi,this.shadowRoot.querySelector(`#startpoint`)),li(this,pi,this.shadowRoot.querySelector(`#endpoint`)),this.range=this.shadowRoot.querySelector(`#range`),this.appearance=this.shadowRoot.querySelector(`#appearance`)}static get observedAttributes(){return[`disabled`,`aria-disabled`,t.MEDIA_CONTROLLER]}attributeChangedCallback(e,n,r){var i,a,o,s;e===t.MEDIA_CONTROLLER?(n&&((a=(i=G(this,ui))?.unassociateElement)==null||a.call(i,this),li(this,ui,null)),r&&this.isConnected&&(li(this,ui,this.getRootNode()?.getElementById(r)),(s=(o=G(this,ui))?.associateElement)==null||s.call(o,this))):(e===`disabled`||e===`aria-disabled`&&n!==r)&&(r==null?(this.range.removeAttribute(e),q(this,xi,Si).call(this)):(this.range.setAttribute(e,r),q(this,Ci,wi).call(this)))}connectedCallback(){var e,n;let{style:r}=T(this.shadowRoot,`:host`);r.setProperty(`display`,`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),G(this,mi).pointer=T(this.shadowRoot,`#pointer`),G(this,mi).progress=T(this.shadowRoot,`#progress`),G(this,mi).thumb=T(this.shadowRoot,`#thumb, ::slotted([slot="thumb"])`),G(this,mi).activeSegment=T(this.shadowRoot,`#segments-clipping rect:nth-child(0)`);let i=this.getAttribute(t.MEDIA_CONTROLLER);i&&(li(this,ui,this.getRootNode()?.getElementById(i)),(n=(e=G(this,ui))?.associateElement)==null||n.call(e,this)),this.updateBar(),this.shadowRoot.addEventListener(`focusin`,G(this,gi)),this.shadowRoot.addEventListener(`focusout`,G(this,_i)),q(this,xi,Si).call(this),_e(this.container,G(this,vi))}disconnectedCallback(){var e,t;q(this,Ci,wi).call(this),(t=(e=G(this,ui))?.unassociateElement)==null||t.call(e,this),li(this,ui,null),this.shadowRoot.removeEventListener(`focusin`,G(this,gi)),this.shadowRoot.removeEventListener(`focusout`,G(this,_i)),ve(this.container,G(this,vi))}updatePointerBar(e){var t;(t=G(this,mi).pointer)==null||t.style.setProperty(`width`,`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,t;let n=this.range.valueAsNumber*100;(e=G(this,mi).progress)==null||e.style.setProperty(`width`,`${n}%`),(t=G(this,mi).thumb)==null||t.style.setProperty(`left`,`${n}%`)}updateSegments(e){let t=this.shadowRoot.querySelector(`#segments-clipping`);if(t.textContent=``,this.container.classList.toggle(`segments`,!!e?.length),!e?.length)return;let n=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];li(this,hi,[...n]);let r=n.pop();for(let[e,i]of n.entries()){let[a,o]=[e===0,e===n.length-1],s=a?`calc(var(--segments-gap) / -1)`:`${i*100}%`,c=`calc(${((o?r:n[e+1])-i)*100}%${a||o?``:` - var(--segments-gap)`})`,l=w.createElementNS(`http://www.w3.org/2000/svg`,`rect`),u=Me(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);u.style.setProperty(`x`,s),u.style.setProperty(`width`,c),t.append(l)}}getPointerRatio(e){return Ae(e.clientX,e.clientY,G(this,fi).getBoundingClientRect(),G(this,pi).getBoundingClientRect())}get dragging(){return this.hasAttribute(`dragging`)}handleEvent(e){switch(e.type){case`pointermove`:q(this,Ni,Pi).call(this,e);break;case`input`:this.updateBar();break;case`pointerenter`:q(this,Di,Oi).call(this,e);break;case`pointerdown`:q(this,Ti,Ei).call(this,e);break;case`pointerup`:q(this,ki,Ai).call(this);break;case`pointerleave`:q(this,ji,Mi).call(this)}}get keysUsed(){return[`ArrowUp`,`ArrowRight`,`ArrowDown`,`ArrowLeft`]}};ui=new WeakMap,di=new WeakMap,fi=new WeakMap,pi=new WeakMap,mi=new WeakMap,hi=new WeakMap,gi=new WeakMap,_i=new WeakMap,vi=new WeakMap,yi=new WeakSet,bi=function(e){let t=G(this,mi).activeSegment;if(!t)return;let n=this.getPointerRatio(e),r=`#segments-clipping rect:nth-child(${G(this,hi).findIndex((e,t,r)=>{let i=r[t+1];return i!=null&&n>=e&&n<=i})+1})`;(t.selectorText!=r||!t.style.transform)&&(t.selectorText=r,t.style.setProperty(`transform`,`var(--media-range-segment-hover-transform, scaleY(2))`))},xi=new WeakSet,Si=function(){!this.hasAttribute(`disabled`)&&this.isConnected&&(this.addEventListener(`input`,this),this.addEventListener(`pointerdown`,this),this.addEventListener(`pointerenter`,this))},Ci=new WeakSet,wi=function(){var e,t;this.removeEventListener(`input`,this),this.removeEventListener(`pointerdown`,this),this.removeEventListener(`pointerenter`,this),this.removeEventListener(`pointerleave`,this),(e=C.window)==null||e.removeEventListener(`pointerup`,this),(t=C.window)==null||t.removeEventListener(`pointermove`,this)},Ti=new WeakSet,Ei=function(e){var t;li(this,di,e.composedPath().includes(this.range)),(t=C.window)==null||t.addEventListener(`pointerup`,this,{once:!0})},Di=new WeakSet,Oi=function(e){var t;e.pointerType!==`mouse`&&q(this,Ti,Ei).call(this,e),this.addEventListener(`pointerleave`,this,{once:!0}),(t=C.window)==null||t.addEventListener(`pointermove`,this)},ki=new WeakSet,Ai=function(){var e;(e=C.window)==null||e.removeEventListener(`pointerup`,this),this.toggleAttribute(`dragging`,!1),this.range.disabled=this.hasAttribute(`disabled`)},ji=new WeakSet,Mi=function(){var e,t;this.removeEventListener(`pointerleave`,this),(e=C.window)==null||e.removeEventListener(`pointermove`,this),this.toggleAttribute(`dragging`,!1),this.range.disabled=this.hasAttribute(`disabled`),(t=G(this,mi).activeSegment)==null||t.style.removeProperty(`transform`)},Ni=new WeakSet,Pi=function(e){(e.pointerType!==`pen`||e.buttons!==0)&&(this.toggleAttribute(`dragging`,e.buttons===1||e.pointerType!==`mouse`),this.updatePointerBar(e),q(this,yi,bi).call(this,e),this.dragging&&(e.pointerType!==`mouse`||!G(this,di))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0}))))},Li.shadowRootOptions={mode:`open`},Li.getTemplateHTML=Fi,Li.getContainerTemplateHTML=Ii,C.customElements.get(`media-chrome-range`)||C.customElements.define(`media-chrome-range`,Li);var Ri=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},zi=(e,t,n)=>(Ri(e,t,`read from private field`),n?n.call(e):t.get(e)),Bi=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Vi=(e,t,n,r)=>(Ri(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Hi;function Ui(e){return`
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
  `}var Wi=class extends C.HTMLElement{constructor(){if(super(),Bi(this,Hi,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[t.MEDIA_CONTROLLER]}attributeChangedCallback(e,n,r){var i,a,o,s;e===t.MEDIA_CONTROLLER&&(n&&((a=(i=zi(this,Hi))?.unassociateElement)==null||a.call(i,this),Vi(this,Hi,null)),r&&this.isConnected&&(Vi(this,Hi,this.getRootNode()?.getElementById(r)),(s=(o=zi(this,Hi))?.associateElement)==null||s.call(o,this)))}connectedCallback(){var e,n;let r=this.getAttribute(t.MEDIA_CONTROLLER);r&&(Vi(this,Hi,this.getRootNode()?.getElementById(r)),(n=(e=zi(this,Hi))?.associateElement)==null||n.call(e,this))}disconnectedCallback(){var e,t;(t=(e=zi(this,Hi))?.unassociateElement)==null||t.call(e,this),Vi(this,Hi,null)}};Hi=new WeakMap,Wi.shadowRootOptions={mode:`open`},Wi.getTemplateHTML=Ui,C.customElements.get(`media-control-bar`)||C.customElements.define(`media-control-bar`,Wi);var Gi=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Ki=(e,t,n)=>(Gi(e,t,`read from private field`),n?n.call(e):t.get(e)),qi=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Ji=(e,t,n,r)=>(Gi(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Yi;function Xi(e,t={}){return`
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

    ${this.getSlotTemplateHTML(e,t)}
  `}function Zi(e,t){return`
    <slot></slot>
  `}var Qi=class extends C.HTMLElement{constructor(){if(super(),qi(this,Yi,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[t.MEDIA_CONTROLLER]}attributeChangedCallback(e,n,r){var i,a,o,s;e===t.MEDIA_CONTROLLER&&(n&&((a=(i=Ki(this,Yi))?.unassociateElement)==null||a.call(i,this),Ji(this,Yi,null)),r&&this.isConnected&&(Ji(this,Yi,this.getRootNode()?.getElementById(r)),(s=(o=Ki(this,Yi))?.associateElement)==null||s.call(o,this)))}connectedCallback(){var e,n;let{style:r}=T(this.shadowRoot,`:host`);r.setProperty(`display`,`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let i=this.getAttribute(t.MEDIA_CONTROLLER);i&&(Ji(this,Yi,this.getRootNode()?.getElementById(i)),(n=(e=Ki(this,Yi))?.associateElement)==null||n.call(e,this))}disconnectedCallback(){var e,t;(t=(e=Ki(this,Yi))?.unassociateElement)==null||t.call(e,this),Ji(this,Yi,null)}};Yi=new WeakMap,Qi.shadowRootOptions={mode:`open`},Qi.getTemplateHTML=Xi,Qi.getSlotTemplateHTML=Zi,C.customElements.get(`media-text-display`)||C.customElements.define(`media-text-display`,Qi);var $i=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},ea=(e,t,n)=>($i(e,t,`read from private field`),n?n.call(e):t.get(e)),ta=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},na=(e,t,n,r)=>($i(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ra;function ia(e,t){return`
    <slot>${ae(t.mediaDuration)}</slot>
  `}var aa=class extends Qi{constructor(){super(),ta(this,ra,void 0),na(this,ra,this.shadowRoot.querySelector(`slot`)),ea(this,ra).textContent=ae(this.mediaDuration??0)}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_DURATION]}attributeChangedCallback(e,t,n){e===i.MEDIA_DURATION&&(ea(this,ra).textContent=ae(+n)),super.attributeChangedCallback(e,t,n)}get mediaDuration(){return E(this,i.MEDIA_DURATION)}set mediaDuration(e){D(this,i.MEDIA_DURATION,e)}};ra=new WeakMap,aa.getSlotTemplateHTML=ia,C.customElements.get(`media-duration-display`)||C.customElements.define(`media-duration-display`,aa);var oa={2:x(`Network Error`),3:x(`Decode Error`),4:x(`Source Not Supported`),5:x(`Encryption Error`)},sa={2:x(`A network error caused the media download to fail.`),3:x(`A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.`),4:x(`An unsupported error occurred. The server or network failed, or your browser does not support this format.`),5:x(`The media is encrypted and there are no keys to decrypt it.`)},ca=e=>e.code===1?null:{title:oa[e.code]??`Error ${e.code}`,message:sa[e.code]??e.message},la=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},ua=(e,t,n)=>(la(e,t,`read from private field`),n?n.call(e):t.get(e)),da=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},fa=(e,t,n,r)=>(la(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),pa;function ma(e){return`
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
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${ga({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `}function ha(e){return e.code&&ca(e)!==null}function ga(e){let{title:t,message:n}=ca(e)??{},r=``;return t&&(r+=`<slot name="error-${e.code}-title"><h3>${t}</h3></slot>`),n&&(r+=`<slot name="error-${e.code}-message"><p>${n}</p></slot>`),r}var _a=[i.MEDIA_ERROR_CODE,i.MEDIA_ERROR_MESSAGE],va=class extends si{constructor(){super(...arguments),da(this,pa,null)}static get observedAttributes(){return[...super.observedAttributes,..._a]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,n){if(super.attributeChangedCallback(e,t,n),!_a.includes(e))return;let r=this.mediaError??{code:this.mediaErrorCode,message:this.mediaErrorMessage};if(this.open=ha(r),this.open&&(this.shadowRoot.querySelector(`slot`).name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector(`#content`).innerHTML=this.formatErrorMessage(r),!this.hasAttribute(`aria-label`))){let{title:e}=ca(r);e&&this.setAttribute(`aria-label`,e)}}get mediaError(){return ua(this,pa)}set mediaError(e){fa(this,pa,e)}get mediaErrorCode(){return E(this,`mediaerrorcode`)}set mediaErrorCode(e){D(this,`mediaerrorcode`,e)}get mediaErrorMessage(){return A(this,`mediaerrormessage`)}set mediaErrorMessage(e){j(this,`mediaerrormessage`,e)}};pa=new WeakMap,va.getSlotTemplateHTML=ma,va.formatErrorMessage=ga,C.customElements.get(`media-error-dialog`)||C.customElements.define(`media-error-dialog`,va);var ya=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},ba=(e,t,n)=>(ya(e,t,`read from private field`),n?n.call(e):t.get(e)),xa=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Sa,Ca;function wa(e){return`
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
      ${Ta()}
    </slot>
  `}function Ta(){return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${[{keys:[`Space`,`k`],description:`Toggle Playback`},{keys:[`m`],description:`Toggle mute`},{keys:[`f`],description:`Toggle fullscreen`},{keys:[`c`],description:`Toggle captions or subtitles, if available`},{keys:[`p`],description:`Toggle Picture in Picture`},{keys:[`←`,`j`],description:`Seek back 10s`},{keys:[`→`,`l`],description:`Seek forward 10s`},{keys:[`↑`],description:`Turn volume up`},{keys:[`↓`],description:`Turn volume down`},{keys:[`< (SHIFT+,)`],description:`Decrease playback rate`},{keys:[`> (SHIFT+.)`],description:`Increase playback rate`}].map(({keys:e,description:t})=>`
      <tr>
        <td>
          <div class="key-combo">${e.map((e,t)=>t>0?`<span class="key-separator">or</span><span class="key">${e}</span>`:`<span class="key">${e}</span>`).join(``)}</div>
        </td>
        <td class="description">${t}</td>
      </tr>
    `).join(``)}</table>
  `}var Ea=class extends si{constructor(){super(...arguments),xa(this,Sa,e=>{if(!this.open)return;let t=this.shadowRoot?.querySelector(`#content`);if(!t)return;let n=e.composedPath(),r=n[0]===this||n.includes(this),i=n.includes(t);r&&!i&&(this.open=!1)}),xa(this,Ca,e=>{if(!this.open)return;let t=e.shiftKey&&(e.key===`/`||e.key===`?`);(e.key===`Escape`||t)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener(`click`,ba(this,Sa)),document.addEventListener(`keydown`,ba(this,Ca)))}disconnectedCallback(){this.removeEventListener(`click`,ba(this,Sa)),document.removeEventListener(`keydown`,ba(this,Ca))}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===`open`&&(this.open?(this.addEventListener(`click`,ba(this,Sa)),document.addEventListener(`keydown`,ba(this,Ca))):(this.removeEventListener(`click`,ba(this,Sa)),document.removeEventListener(`keydown`,ba(this,Ca))))}};Sa=new WeakMap,Ca=new WeakMap,Ea.getSlotTemplateHTML=wa,C.customElements.get(`media-keyboard-shortcuts-dialog`)||C.customElements.define(`media-keyboard-shortcuts-dialog`,Ea);var Da=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Oa=(e,t,n)=>(Da(e,t,`read from private field`),n?n.call(e):t.get(e)),ka=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Aa=(e,t,n,r)=>(Da(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ja,Ma=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,Na=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function Pa(e){return`
    <style>
      :host([${i.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${i.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${i.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${i.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Ma}</slot>
      <slot name="exit">${Na}</slot>
    </slot>
  `}function Fa(){return`
    <slot name="tooltip-enter">${x(`Enter fullscreen mode`)}</slot>
    <slot name="tooltip-exit">${x(`Exit fullscreen mode`)}</slot>
  `}var Ia=e=>{let t=e.mediaIsFullscreen?x(`exit fullscreen mode`):x(`enter fullscreen mode`);e.setAttribute(`aria-label`,t)},La=class extends W{constructor(){super(...arguments),ka(this,ja,null)}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_IS_FULLSCREEN,i.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Ia(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_IS_FULLSCREEN&&Ia(this)}get mediaFullscreenUnavailable(){return A(this,i.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){j(this,i.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return O(this,i.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){k(this,i.MEDIA_IS_FULLSCREEN,e)}handleClick(t){Aa(this,ja,t);let n=Oa(this,ja)instanceof PointerEvent,r=this.mediaIsFullscreen?new C.CustomEvent(e.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new C.CustomEvent(e.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:n});this.dispatchEvent(r)}};ja=new WeakMap,La.getSlotTemplateHTML=Pa,La.getTooltipContentHTML=Fa,C.customElements.get(`media-fullscreen-button`)||C.customElements.define(`media-fullscreen-button`,La);var{MEDIA_TIME_IS_LIVE:Ra,MEDIA_PAUSED:za}=i,{MEDIA_SEEK_TO_LIVE_REQUEST:Ba,MEDIA_PLAY_REQUEST:Va}=e,Ha=`<svg viewBox="0 0 6 12" aria-hidden="true"><circle cx="3" cy="6" r="2"></circle></svg>`;function Ua(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${Ra}]:not([${za}])) slot[name=indicator] > *,
      :host([${Ra}]:not([${za}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${Ra}]:not([${za}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${Ha}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${x(`live`)}</slot>
  `}var Wa=e=>{let t=e.mediaPaused||!e.mediaTimeIsLive,n=x(t?`seek to live`:`playing live`);e.setAttribute(`aria-label`,n);let r=e.shadowRoot?.querySelector(`slot[name="text"]`);r&&(r.textContent=x(`live`)),t?e.removeAttribute(`aria-disabled`):e.setAttribute(`aria-disabled`,`true`)},Ga=class extends W{static get observedAttributes(){return[...super.observedAttributes,Ra,za]}connectedCallback(){super.connectedCallback(),Wa(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),Wa(this)}get mediaPaused(){return O(this,i.MEDIA_PAUSED)}set mediaPaused(e){k(this,i.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return O(this,i.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){k(this,i.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new C.CustomEvent(Ba,{composed:!0,bubbles:!0})),this.hasAttribute(za)&&this.dispatchEvent(new C.CustomEvent(Va,{composed:!0,bubbles:!0})))}};Ga.getSlotTemplateHTML=Ua,C.customElements.get(`media-live-button`)||C.customElements.define(`media-live-button`,Ga);var Ka=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},qa=(e,t,n)=>(Ka(e,t,`read from private field`),n?n.call(e):t.get(e)),Ja=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Ya=(e,t,n,r)=>(Ka(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Xa,Za,Qa={LOADING_DELAY:`loadingdelay`,NO_AUTOHIDE:`noautohide`},$a=500,eo=`
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
`;function to(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${$a}ms);
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

      :host([${i.MEDIA_LOADING}]:not([${i.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${i.MEDIA_LOADING}]:not([${i.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${i.MEDIA_LOADING}]:not([${i.MEDIA_PAUSED}])) #status {
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

    <slot name="icon">${eo}</slot>
    <div id="status" role="status" aria-live="polite">${x(`media loading`)}</div>
  `}var no=class extends C.HTMLElement{constructor(){if(super(),Ja(this,Xa,void 0),Ja(this,Za,$a),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[t.MEDIA_CONTROLLER,i.MEDIA_PAUSED,i.MEDIA_LOADING,Qa.LOADING_DELAY]}attributeChangedCallback(e,n,r){var i,a,o,s;e===Qa.LOADING_DELAY&&n!==r?this.loadingDelay=Number(r):e===t.MEDIA_CONTROLLER&&(n&&((a=(i=qa(this,Xa))?.unassociateElement)==null||a.call(i,this),Ya(this,Xa,null)),r&&this.isConnected&&(Ya(this,Xa,this.getRootNode()?.getElementById(r)),(s=(o=qa(this,Xa))?.associateElement)==null||s.call(o,this)))}connectedCallback(){var e,n;let r=this.getAttribute(t.MEDIA_CONTROLLER);r&&(Ya(this,Xa,this.getRootNode()?.getElementById(r)),(n=(e=qa(this,Xa))?.associateElement)==null||n.call(e,this))}disconnectedCallback(){var e,t;(t=(e=qa(this,Xa))?.unassociateElement)==null||t.call(e,this),Ya(this,Xa,null)}get loadingDelay(){return qa(this,Za)}set loadingDelay(e){Ya(this,Za,e);let{style:t}=T(this.shadowRoot,`:host`);t.setProperty(`--_loading-indicator-delay`,`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return O(this,i.MEDIA_PAUSED)}set mediaPaused(e){k(this,i.MEDIA_PAUSED,e)}get mediaLoading(){return O(this,i.MEDIA_LOADING)}set mediaLoading(e){k(this,i.MEDIA_LOADING,e)}get mediaController(){return A(this,t.MEDIA_CONTROLLER)}set mediaController(e){j(this,t.MEDIA_CONTROLLER,e)}get noAutohide(){return O(this,Qa.NO_AUTOHIDE)}set noAutohide(e){k(this,Qa.NO_AUTOHIDE,e)}};Xa=new WeakMap,Za=new WeakMap,no.shadowRootOptions={mode:`open`},no.getTemplateHTML=to,C.customElements.get(`media-loading-indicator`)||C.customElements.define(`media-loading-indicator`,no);var ro=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,io=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,ao=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function oo(e){return`
    <style>
      :host(:not([${i.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${i.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${i.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${i.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${i.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${i.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${i.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${ro}</slot>
      <slot name="low">${io}</slot>
      <slot name="medium">${io}</slot>
      <slot name="high">${ao}</slot>
    </slot>
  `}function so(){return`
    <slot name="tooltip-mute">${x(`Mute`)}</slot>
    <slot name="tooltip-unmute">${x(`Unmute`)}</slot>
  `}var co=e=>{let t=e.mediaVolumeLevel===`off`?x(`unmute`):x(`mute`);e.setAttribute(`aria-label`,t)},lo=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),co(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_VOLUME_LEVEL&&co(this)}get mediaVolumeLevel(){return A(this,i.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){j(this,i.MEDIA_VOLUME_LEVEL,e)}handleClick(){let t=this.mediaVolumeLevel===`off`?e.MEDIA_UNMUTE_REQUEST:e.MEDIA_MUTE_REQUEST;this.dispatchEvent(new C.CustomEvent(t,{composed:!0,bubbles:!0}))}};lo.getSlotTemplateHTML=oo,lo.getTooltipContentHTML=so,C.customElements.get(`media-mute-button`)||C.customElements.define(`media-mute-button`,lo);var uo=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function fo(e){return`
    <style>
      :host([${i.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${i.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${i.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${i.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${uo}</slot>
      <slot name="exit">${uo}</slot>
    </slot>
  `}function po(){return`
    <slot name="tooltip-enter">${x(`Enter picture in picture mode`)}</slot>
    <slot name="tooltip-exit">${x(`Exit picture in picture mode`)}</slot>
  `}var mo=e=>{let t=e.mediaIsPip?x(`exit picture in picture mode`):x(`enter picture in picture mode`);e.setAttribute(`aria-label`,t)},ho=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_IS_PIP,i.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),mo(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_IS_PIP&&mo(this)}get mediaPipUnavailable(){return A(this,i.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){j(this,i.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return O(this,i.MEDIA_IS_PIP)}set mediaIsPip(e){k(this,i.MEDIA_IS_PIP,e)}handleClick(){let t=this.mediaIsPip?e.MEDIA_EXIT_PIP_REQUEST:e.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new C.CustomEvent(t,{composed:!0,bubbles:!0}))}};ho.getSlotTemplateHTML=fo,ho.getTooltipContentHTML=po,C.customElements.get(`media-pip-button`)||C.customElements.define(`media-pip-button`,ho);var go=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},_o=(e,t,n)=>(go(e,t,`read from private field`),n?n.call(e):t.get(e)),vo=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},yo,bo={RATES:`rates`},xo=[1,1.2,1.5,1.7,2];function So(e){return Math.round(e*100)/100}function Co(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate?So(+e.mediaplaybackrate):1}x</slot>
  `}function wo(){return x(`Playback rate`)}var To=class extends W{constructor(){super(),vo(this,yo,new Tt(this,bo.RATES,{defaultValue:xo})),this.container=this.shadowRoot.querySelector(`slot[name="icon"]`),this.container.innerHTML=`${So(this.mediaPlaybackRate??1)}x`}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_PLAYBACK_RATE,bo.RATES]}attributeChangedCallback(e,t,n){if(super.attributeChangedCallback(e,t,n),e===bo.RATES&&(_o(this,yo).value=n),e===i.MEDIA_PLAYBACK_RATE){let e=n?+n:NaN,t=So(Number.isNaN(e)?1:e);this.container.innerHTML=`${t}x`,this.setAttribute(`aria-label`,x(`Playback rate {playbackRate}`,{playbackRate:t}))}}get rates(){return _o(this,yo)}set rates(e){e?Array.isArray(e)?_o(this,yo).value=e.join(` `):typeof e==`string`&&(_o(this,yo).value=e):_o(this,yo).value=``}get mediaPlaybackRate(){return E(this,i.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){D(this,i.MEDIA_PLAYBACK_RATE,e)}handleClick(){let t=Array.from(_o(this,yo).values(),e=>+e).sort((e,t)=>e-t),n=t.find(e=>e>this.mediaPlaybackRate)??t[0]??1,r=new C.CustomEvent(e.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:n});this.dispatchEvent(r)}};yo=new WeakMap,To.getSlotTemplateHTML=Co,To.getTooltipContentHTML=wo,C.customElements.get(`media-playback-rate-button`)||C.customElements.define(`media-playback-rate-button`,To);var Eo=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Do=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function Oo(e){return`
    <style>
      :host([${i.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${i.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${i.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${i.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${Eo}</slot>
      <slot name="pause">${Do}</slot>
    </slot>
  `}function ko(){return`
    <slot name="tooltip-play">${x(`Play`)}</slot>
    <slot name="tooltip-pause">${x(`Pause`)}</slot>
  `}var Ao=e=>{let t=e.mediaPaused?x(`play`):x(`pause`);e.setAttribute(`aria-label`,t)},jo=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_PAUSED,i.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),Ao(this)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),(e===i.MEDIA_PAUSED||e===i.MEDIA_LANG)&&Ao(this)}get mediaPaused(){return O(this,i.MEDIA_PAUSED)}set mediaPaused(e){k(this,i.MEDIA_PAUSED,e)}handleClick(){let t=this.mediaPaused?e.MEDIA_PLAY_REQUEST:e.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new C.CustomEvent(t,{composed:!0,bubbles:!0}))}};jo.getSlotTemplateHTML=Oo,jo.getTooltipContentHTML=ko,C.customElements.get(`media-play-button`)||C.customElements.define(`media-play-button`,jo);var Mo={PLACEHOLDER_SRC:`placeholdersrc`,SRC:`src`};function No(e){return`
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
  `}var Po=e=>{e.style.removeProperty(`background-image`)},Fo=(e,t)=>{e.style[`background-image`]=`url('${t}')`},Io=class extends C.HTMLElement{static get observedAttributes(){return[Mo.PLACEHOLDER_SRC,Mo.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector(`#image`)}attributeChangedCallback(e,t,n){e===Mo.SRC&&(n==null?this.image.removeAttribute(Mo.SRC):this.image.setAttribute(Mo.SRC,n)),e===Mo.PLACEHOLDER_SRC&&(n==null?Po(this.image):Fo(this.image,n))}get placeholderSrc(){return A(this,Mo.PLACEHOLDER_SRC)}set placeholderSrc(e){j(this,Mo.SRC,e)}get src(){return A(this,Mo.SRC)}set src(e){j(this,Mo.SRC,e)}};Io.shadowRootOptions={mode:`open`},Io.getTemplateHTML=No,C.customElements.get(`media-poster-image`)||C.customElements.define(`media-poster-image`,Io);var Lo=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Ro=(e,t,n)=>(Lo(e,t,`read from private field`),n?n.call(e):t.get(e)),zo=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Bo=(e,t,n,r)=>(Lo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Vo,Ho=class extends Qi{constructor(){super(),zo(this,Vo,void 0),Bo(this,Vo,this.shadowRoot.querySelector(`slot`))}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_PREVIEW_CHAPTER,i.MEDIA_LANG]}attributeChangedCallback(e,t,n){if(super.attributeChangedCallback(e,t,n),(e===i.MEDIA_PREVIEW_CHAPTER||e===i.MEDIA_LANG)&&n!==t&&n!=null){if(Ro(this,Vo).textContent=n,n!==``){let e=x(`chapter: {chapterName}`,{chapterName:n});this.setAttribute(`aria-valuetext`,e)}else this.removeAttribute(`aria-valuetext`)}}get mediaPreviewChapter(){return A(this,i.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){j(this,i.MEDIA_PREVIEW_CHAPTER,e)}};Vo=new WeakMap,C.customElements.get(`media-preview-chapter-display`)||C.customElements.define(`media-preview-chapter-display`,Ho);var Uo=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Wo=(e,t,n)=>(Uo(e,t,`read from private field`),n?n.call(e):t.get(e)),Go=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Ko=(e,t,n,r)=>(Uo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),qo;function Jo(e){return`
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
  `}var Yo=class extends C.HTMLElement{constructor(){if(super(),Go(this,qo,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=ye(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[t.MEDIA_CONTROLLER,i.MEDIA_PREVIEW_IMAGE,i.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,n;let r=this.getAttribute(t.MEDIA_CONTROLLER);r&&(Ko(this,qo,this.getRootNode()?.getElementById(r)),(n=(e=Wo(this,qo))?.associateElement)==null||n.call(e,this))}disconnectedCallback(){var e,t;(t=(e=Wo(this,qo))?.unassociateElement)==null||t.call(e,this),Ko(this,qo,null)}attributeChangedCallback(e,n,r){var a,o,s,c;[i.MEDIA_PREVIEW_IMAGE,i.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===t.MEDIA_CONTROLLER&&(n&&((o=(a=Wo(this,qo))?.unassociateElement)==null||o.call(a,this),Ko(this,qo,null)),r&&this.isConnected&&(Ko(this,qo,this.getRootNode()?.getElementById(r)),(c=(s=Wo(this,qo))?.associateElement)==null||c.call(s,this)))}get mediaPreviewImage(){return A(this,i.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){j(this,i.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(i.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(i.MEDIA_PREVIEW_COORDS);return}this.setAttribute(i.MEDIA_PREVIEW_COORDS,e.join(` `))}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[n,r,i,a]=e,o=t.split(`#`)[0],s=getComputedStyle(this),{maxWidth:c,maxHeight:l,minWidth:u,minHeight:d}=s,f=s.getPropertyValue(`--media-preview-thumbnail-object-fit`).trim()||`contain`,p,m;if(f===`fill`){let e=parseInt(c)/i,t=parseInt(l)/a,n=parseInt(u)/i,r=parseInt(d)/a;p=e<1?e:Math.max(e,n),m=t<1?t:Math.max(t,r)}else{let e=Math.min(parseInt(c)/i,parseInt(l)/a),t=Math.max(parseInt(u)/i,parseInt(d)/a),n=e<1?e:t>1?t:1;p=n,m=n}let{style:h}=T(this.shadowRoot,`:host`),g=T(this.shadowRoot,`img`).style,_=this.shadowRoot.querySelector(`img`),v=Math.min(p,m)<1?`min`:`max`;h.setProperty(`${v}-width`,`initial`,`important`),h.setProperty(`${v}-height`,`initial`,`important`),h.width=`${i*p}px`,h.height=`${a*m}px`;let y=()=>{g.width=`${this.imgWidth*p}px`,g.height=`${this.imgHeight*m}px`,g.display=`block`};_.src!==o&&(_.onload=()=>{this.imgWidth=_.naturalWidth,this.imgHeight=_.naturalHeight,y(),_.onload=null},_.src=o,y()),y(),g.transform=`translate(-${n*p}px, -${r*m}px)`}};qo=new WeakMap,Yo.shadowRootOptions={mode:`open`},Yo.getTemplateHTML=Jo,C.customElements.get(`media-preview-thumbnail`)||C.customElements.define(`media-preview-thumbnail`,Yo);var Xo=Yo,Zo=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Qo=(e,t,n)=>(Zo(e,t,`read from private field`),n?n.call(e):t.get(e)),$o=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},es=(e,t,n,r)=>(Zo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ts,ns=class extends Qi{constructor(){super(),$o(this,ts,void 0),es(this,ts,this.shadowRoot.querySelector(`slot`)),Qo(this,ts).textContent=ae(0)}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_PREVIEW_TIME&&n!=null&&(Qo(this,ts).textContent=ae(parseFloat(n)))}get mediaPreviewTime(){return E(this,i.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){D(this,i.MEDIA_PREVIEW_TIME,e)}};ts=new WeakMap,C.customElements.get(`media-preview-time-display`)||C.customElements.define(`media-preview-time-display`,ns);var rs={SEEK_OFFSET:`seekoffset`},is=30,as=e=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${e}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function os(e,t){return`
    <slot name="icon">${as(t.seekOffset)}</slot>
  `}var ss=(e,t)=>{e.setAttribute(`aria-label`,x(`seek back {seekOffset} seconds`,{seekOffset:t}))};function cs(){return x(`Seek backward`)}var ls=0,us=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_CURRENT_TIME,rs.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=E(this,rs.SEEK_OFFSET,is)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),ss(this,this.seekOffset),e===rs.SEEK_OFFSET&&(this.seekOffset=E(this,rs.SEEK_OFFSET,is))}get seekOffset(){return E(this,rs.SEEK_OFFSET,is)}set seekOffset(e){D(this,rs.SEEK_OFFSET,e),this.setAttribute(`aria-label`,x(`seek back {seekOffset} seconds`,{seekOffset:this.seekOffset})),Se(we(this,`icon`),this.seekOffset)}get mediaCurrentTime(){return E(this,i.MEDIA_CURRENT_TIME,ls)}set mediaCurrentTime(e){D(this,i.MEDIA_CURRENT_TIME,e)}handleClick(){let t=Math.max(this.mediaCurrentTime-this.seekOffset,0),n=new C.CustomEvent(e.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(n)}};us.getSlotTemplateHTML=os,us.getTooltipContentHTML=cs,C.customElements.get(`media-seek-backward-button`)||C.customElements.define(`media-seek-backward-button`,us);var ds={SEEK_OFFSET:`seekoffset`},fs=30,ps=e=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${e}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function ms(e,t){return`
    <slot name="icon">${ps(t.seekOffset)}</slot>
  `}var hs=(e,t)=>{e.setAttribute(`aria-label`,x(`seek forward {seekOffset} seconds`,{seekOffset:t}))};function gs(){return x(`Seek forward`)}var _s=0,vs=class extends W{static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_CURRENT_TIME,ds.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=E(this,ds.SEEK_OFFSET,fs)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),hs(this,this.seekOffset),e===ds.SEEK_OFFSET&&(this.seekOffset=E(this,ds.SEEK_OFFSET,fs))}get seekOffset(){return E(this,ds.SEEK_OFFSET,fs)}set seekOffset(e){D(this,ds.SEEK_OFFSET,e),this.setAttribute(`aria-label`,x(`seek forward {seekOffset} seconds`,{seekOffset:this.seekOffset})),Se(we(this,`icon`),this.seekOffset)}get mediaCurrentTime(){return E(this,i.MEDIA_CURRENT_TIME,_s)}set mediaCurrentTime(e){D(this,i.MEDIA_CURRENT_TIME,e)}handleClick(){let t=this.mediaCurrentTime+this.seekOffset,n=new C.CustomEvent(e.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(n)}};vs.getSlotTemplateHTML=ms,vs.getTooltipContentHTML=gs,C.customElements.get(`media-seek-forward-button`)||C.customElements.define(`media-seek-forward-button`,vs);var ys=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},bs=(e,t,n)=>(ys(e,t,`read from private field`),n?n.call(e):t.get(e)),xs=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Ss=(e,t,n,r)=>(ys(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Cs=(e,t,n)=>(ys(e,t,`access private method`),n),ws,Ts,Es,Ds,Os,ks,As,js,Ms,Ns,Ps,Fs={REMAINING:`remaining`,SHOW_DURATION:`showduration`,NO_TOGGLE:`notoggle`},Is=[...Object.values(Fs),i.MEDIA_CURRENT_TIME,i.MEDIA_DURATION,i.MEDIA_SEEKABLE],Ls=[`Enter`,` `],Rs=`&nbsp;/&nbsp;`,zs=(e,{timesSep:t=Rs}={})=>{let n=e.mediaCurrentTime??0,[,r]=e.mediaSeekable??[],i=0;Number.isFinite(e.mediaDuration)?i=e.mediaDuration:Number.isFinite(r)&&(i=r);let a=e.remaining?ae(0-(i-n)):ae(n);return e.showDuration?`${a}${t}${ae(i)}`:a},Bs=e=>{let t=e.mediaCurrentTime,[,n]=e.mediaSeekable??[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(n)&&(r=n),t==null||r===null){e.setAttribute(`aria-description`,x(`video not loaded, unknown time.`));return}let i=e.remaining?ie(0-(r-t)):ie(t);if(!e.showDuration){e.setAttribute(`aria-description`,i);return}let a=x(`{currentTime} of {totalTime}`,{currentTime:i,totalTime:ie(r)});e.setAttribute(`aria-description`,a)};function Vs(e,t){return`
    <slot>${zs(t)}</slot>
  `}var Hs=e=>{e.setAttribute(`aria-label`,x(`playback time`))},Us=class extends Qi{constructor(){super(),xs(this,Ds),xs(this,ks),xs(this,js),xs(this,Ns),xs(this,ws,void 0),xs(this,Ts,null),xs(this,Es,e=>{let{metaKey:t,altKey:n,key:r}=e;if(t||n||!Ls.includes(r)){this.removeEventListener(`keyup`,bs(this,Ts));return}this.addEventListener(`keyup`,bs(this,Ts))}),Ss(this,ws,this.shadowRoot.querySelector(`slot`)),bs(this,ws).innerHTML=`${zs(this)}`}static get observedAttributes(){return[...super.observedAttributes,...Is,`disabled`]}connectedCallback(){let{style:e}=T(this.shadowRoot,`:host(:hover:not([notoggle]))`);e.setProperty(`cursor`,`var(--media-cursor, pointer)`),e.setProperty(`background`,`var(--media-control-hover-background, rgba(50 50 70 / .7))`),this.setAttribute(`aria-label`,x(`playback time`)),Cs(this,js,Ms).call(this),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute(`remaining`)?this.removeAttribute(`remaining`):this.setAttribute(`remaining`,``))}disconnectedCallback(){this.disable(),Cs(this,ks,As).call(this),super.disconnectedCallback()}attributeChangedCallback(e,t,n){Hs(this),Is.includes(e)?this.update():e===`disabled`&&n!==t?n==null?Cs(this,js,Ms).call(this):Cs(this,Ns,Ps).call(this):e===Fs.NO_TOGGLE&&n!==t&&(this.noToggle?Cs(this,Ns,Ps).call(this):Cs(this,js,Ms).call(this)),super.attributeChangedCallback(e,t,n)}enable(){this.noToggle||(this.tabIndex=0)}disable(){this.tabIndex=-1}get remaining(){return O(this,Fs.REMAINING)}set remaining(e){k(this,Fs.REMAINING,e)}get showDuration(){return O(this,Fs.SHOW_DURATION)}set showDuration(e){k(this,Fs.SHOW_DURATION,e)}get noToggle(){return O(this,Fs.NO_TOGGLE)}set noToggle(e){k(this,Fs.NO_TOGGLE,e)}get mediaDuration(){return E(this,i.MEDIA_DURATION)}set mediaDuration(e){D(this,i.MEDIA_DURATION,e)}get mediaCurrentTime(){return E(this,i.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){D(this,i.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(i.MEDIA_SEEKABLE);if(e)return e.split(`:`).map(e=>+e)}set mediaSeekable(e){if(e==null){this.removeAttribute(i.MEDIA_SEEKABLE);return}this.setAttribute(i.MEDIA_SEEKABLE,e.join(`:`))}update(){let e=zs(this);Bs(this),e!==bs(this,ws).innerHTML&&(bs(this,ws).innerHTML=e)}};ws=new WeakMap,Ts=new WeakMap,Es=new WeakMap,Ds=new WeakSet,Os=function(){bs(this,Ts)||(Ss(this,Ts,e=>{let{key:t}=e;if(!Ls.includes(t)){this.removeEventListener(`keyup`,bs(this,Ts));return}this.toggleTimeDisplay()}),this.addEventListener(`keydown`,bs(this,Es)),this.addEventListener(`click`,this.toggleTimeDisplay))},ks=new WeakSet,As=function(){bs(this,Ts)&&(this.removeEventListener(`keyup`,bs(this,Ts)),this.removeEventListener(`keydown`,bs(this,Es)),this.removeEventListener(`click`,this.toggleTimeDisplay),Ss(this,Ts,null))},js=new WeakSet,Ms=function(){!this.noToggle&&!this.hasAttribute(`disabled`)&&(this.setAttribute(`role`,`button`),this.enable(),Cs(this,Ds,Os).call(this))},Ns=new WeakSet,Ps=function(){this.removeAttribute(`role`),this.disable(),Cs(this,ks,As).call(this)},Us.getSlotTemplateHTML=Vs,C.customElements.get(`media-time-display`)||C.customElements.define(`media-time-display`,Us);var Ws=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},J=(e,t,n)=>(Ws(e,t,`read from private field`),n?n.call(e):t.get(e)),Gs=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Y=(e,t,n,r)=>(Ws(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ks=(e,t,n,r)=>({set _(r){Y(e,t,r,n)},get _(){return J(e,t,r)}}),qs,Js,Ys,Xs,Zs,Qs,$s,ec,tc,nc,rc=class{constructor(e,t,n){Gs(this,qs,void 0),Gs(this,Js,void 0),Gs(this,Ys,void 0),Gs(this,Xs,void 0),Gs(this,Zs,void 0),Gs(this,Qs,void 0),Gs(this,$s,void 0),Gs(this,ec,void 0),Gs(this,tc,0),Gs(this,nc,(e=performance.now())=>{Y(this,tc,requestAnimationFrame(J(this,nc))),Y(this,Xs,performance.now()-J(this,Ys));let t=1e3/this.fps;if(J(this,Xs)>t){Y(this,Ys,e-J(this,Xs)%t);let n=1e3/((e-J(this,Js))/++Ks(this,Zs)._),r=(e-J(this,Qs))/1e3/this.duration,i=J(this,$s)+r*this.playbackRate;i-J(this,qs).valueAsNumber>0?Y(this,ec,this.playbackRate/this.duration/n):(Y(this,ec,.995*J(this,ec)),i=J(this,qs).valueAsNumber+J(this,ec)),this.callback(i)}}),Y(this,qs,e),this.callback=t,this.fps=n}start(){J(this,tc)===0&&(Y(this,Ys,performance.now()),Y(this,Js,J(this,Ys)),Y(this,Zs,0),J(this,nc).call(this))}stop(){J(this,tc)!==0&&(cancelAnimationFrame(J(this,tc)),Y(this,tc,0))}update({start:e,duration:t,playbackRate:n}){let r=e-J(this,qs).valueAsNumber,i=Math.abs(t-this.duration);(r>0||r<-.03||i>=.5)&&this.callback(e),Y(this,$s,e),Y(this,Qs,performance.now()),this.duration=t,this.playbackRate=n}};qs=new WeakMap,Js=new WeakMap,Ys=new WeakMap,Xs=new WeakMap,Zs=new WeakMap,Qs=new WeakMap,$s=new WeakMap,ec=new WeakMap,tc=new WeakMap,nc=new WeakMap;var ic=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},X=(e,t,n)=>(ic(e,t,`read from private field`),n?n.call(e):t.get(e)),Z=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},Q=(e,t,n,r)=>(ic(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),$=(e,t,n)=>(ic(e,t,`access private method`),n),ac,oc,sc,cc,lc,uc,dc,fc,pc,mc,hc,gc,_c,vc,yc,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac,jc=e=>{let t=e.range,n=ie(+Pc(e)),r=ie(+e.mediaSeekableEnd),i=n&&r?x(`{currentTime} of {totalTime}`,{currentTime:n,totalTime:r}):x(`video not loaded, unknown time.`);t.setAttribute(`aria-valuetext`,i)};function Mc(e){return`
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

      :host(:is([${i.MEDIA_PREVIEW_IMAGE}], [${i.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${i.MEDIA_PREVIEW_IMAGE}], [${i.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
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

      :host([${i.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${i.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${i.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${i.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${i.MEDIA_PREVIEW_TIME}]:hover) {
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

      :host([${i.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${i.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${i.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${i.MEDIA_PREVIEW_CHAPTER}]) {
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

      :host([${i.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${i.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${i.MEDIA_PREVIEW_TIME}]:hover) {
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
          <template shadowrootmode="${Xo.shadowRootOptions.mode}">
            ${Xo.getTemplateHTML({})}
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
  `}var Nc=(e,t=e.mediaCurrentTime)=>{let n=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,r=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;if(Number.isNaN(r))return 0;let i=(t-n)/(r-n);return Math.max(0,Math.min(i,1))},Pc=(e,t=e.range.valueAsNumber)=>{let n=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,r=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(r)?0:t*(r-n)+n},Fc=class extends Li{constructor(){super(),Z(this,gc),Z(this,yc),Z(this,xc),Z(this,Cc),Z(this,Tc),Z(this,Dc),Z(this,kc),Z(this,ac,null),Z(this,oc,void 0),Z(this,sc,void 0),Z(this,cc,void 0),Z(this,lc,void 0),Z(this,uc,void 0),Z(this,dc,void 0),Z(this,fc,void 0),Z(this,pc,void 0),Z(this,mc,void 0),Z(this,hc,()=>{$(this,gc,_c).call(this)?X(this,oc).start():X(this,oc).stop()}),Z(this,vc,e=>{this.dragging||(_(e)&&(this.range.valueAsNumber=e),X(this,mc)||this.updateBar())}),this.shadowRoot.querySelector(`#track`).insertAdjacentHTML(`afterbegin`,`<div id="buffered" part="buffered"></div>`),Q(this,sc,this.shadowRoot.querySelectorAll(`[part~="box"]`)),Q(this,lc,this.shadowRoot.querySelector(`[part~="preview-box"]`)),Q(this,uc,this.shadowRoot.querySelector(`[part~="current-box"]`));let e=getComputedStyle(this);Q(this,dc,parseInt(e.getPropertyValue(`--media-box-padding-left`))),Q(this,fc,parseInt(e.getPropertyValue(`--media-box-padding-right`))),Q(this,oc,new rc(this.range,X(this,vc),60))}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_PAUSED,i.MEDIA_DURATION,i.MEDIA_SEEKABLE,i.MEDIA_CURRENT_TIME,i.MEDIA_PREVIEW_IMAGE,i.MEDIA_PREVIEW_TIME,i.MEDIA_PREVIEW_CHAPTER,i.MEDIA_BUFFERED,i.MEDIA_PLAYBACK_RATE,i.MEDIA_LOADING,i.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute(`aria-label`,x(`seek`)),X(this,hc).call(this),Q(this,ac,this.getRootNode()),(e=X(this,ac))==null||e.addEventListener(`transitionstart`,this)}disconnectedCallback(){var e;super.disconnectedCallback(),X(this,oc).stop(),(e=X(this,ac))==null||e.removeEventListener(`transitionstart`,this),Q(this,ac,null)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),t!=n&&(e===i.MEDIA_CURRENT_TIME||e===i.MEDIA_PAUSED||e===i.MEDIA_ENDED||e===i.MEDIA_LOADING||e===i.MEDIA_DURATION||e===i.MEDIA_SEEKABLE?(X(this,oc).update({start:Nc(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),X(this,hc).call(this),jc(this)):e===i.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===i.MEDIA_DURATION||e===i.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=X(this,pc),this.updateBar()))}get mediaChaptersCues(){return X(this,pc)}set mediaChaptersCues(e){Q(this,pc,e),this.updateSegments(X(this,pc)?.map(e=>({start:Nc(this,e.startTime),end:Nc(this,e.endTime)})))}get mediaPaused(){return O(this,i.MEDIA_PAUSED)}set mediaPaused(e){k(this,i.MEDIA_PAUSED,e)}get mediaLoading(){return O(this,i.MEDIA_LOADING)}set mediaLoading(e){k(this,i.MEDIA_LOADING,e)}get mediaDuration(){return E(this,i.MEDIA_DURATION)}set mediaDuration(e){D(this,i.MEDIA_DURATION,e)}get mediaCurrentTime(){return E(this,i.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){D(this,i.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return E(this,i.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){D(this,i.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(i.MEDIA_BUFFERED);return e?e.split(` `).map(e=>e.split(`:`).map(e=>+e)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(i.MEDIA_BUFFERED);return}let t=e.map(e=>e.join(`:`)).join(` `);this.setAttribute(i.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(i.MEDIA_SEEKABLE);if(e)return e.split(`:`).map(e=>+e)}set mediaSeekable(e){if(e==null){this.removeAttribute(i.MEDIA_SEEKABLE);return}this.setAttribute(i.MEDIA_SEEKABLE,e.join(`:`))}get mediaSeekableEnd(){let[,e=this.mediaDuration]=this.mediaSeekable??[];return e}get mediaSeekableStart(){let[e=0]=this.mediaSeekable??[];return e}get mediaPreviewImage(){return A(this,i.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){j(this,i.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return E(this,i.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){D(this,i.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return O(this,i.MEDIA_ENDED)}set mediaEnded(e){k(this,i.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){let e=this.mediaBuffered;if(!e.length)return;let t;if(this.mediaEnded)t=1;else{let n=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=e.find(([e,t])=>e<=n&&n<=t)??[];t=Nc(this,r)}let{style:n}=T(this.shadowRoot,`#buffered`);n.setProperty(`width`,`${t*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector(`slot[name="current"]`).assignedElements().length)return;let e=T(this.shadowRoot,`#current-rail`),t=T(this.shadowRoot,`[part~="current-box"]`),n=$(this,yc,bc).call(this,X(this,uc)),r=$(this,xc,Sc).call(this,n,this.range.valueAsNumber),i=$(this,Cc,wc).call(this,n,this.range.valueAsNumber);e.style.transform=`translateX(${r})`,e.style.setProperty(`--_range-width`,`${n.range.width}`),t.style.setProperty(`--_box-shift`,`${i}`),t.style.setProperty(`--_box-width`,`${n.box.width}px`),t.style.setProperty(`visibility`,`initial`)}handleEvent(e){switch(super.handleEvent(e),e.type){case`input`:$(this,kc,Ac).call(this);break;case`pointermove`:$(this,Tc,Ec).call(this,e);break;case`pointerup`:X(this,mc)&&Q(this,mc,!1);break;case`pointerdown`:Q(this,mc,!0);break;case`pointerleave`:$(this,Dc,Oc).call(this,null);break;case`transitionstart`:Te(e.target,this)&&setTimeout(()=>X(this,hc).call(this),0)}}};ac=new WeakMap,oc=new WeakMap,sc=new WeakMap,cc=new WeakMap,lc=new WeakMap,uc=new WeakMap,dc=new WeakMap,fc=new WeakMap,pc=new WeakMap,mc=new WeakMap,hc=new WeakMap,gc=new WeakSet,_c=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&ke(this)},vc=new WeakMap,yc=new WeakSet,bc=function(e){let t=((this.getAttribute(`bounds`)?Ee(this,`#${this.getAttribute(`bounds`)}`):this.parentElement)??this).getBoundingClientRect(),n=this.range.getBoundingClientRect(),r=e.offsetWidth;return{box:{width:r,min:-(n.left-t.left-r/2),max:t.right-n.left-r/2},bounds:t,range:n}},xc=new WeakSet,Sc=function(e,t){let n=`${t*100}%`,{width:r,min:i,max:a}=e.box;if(!r)return n;if(Number.isNaN(i)||(n=`max(${`calc(1 / var(--_range-width) * 100 * ${i}% + var(--media-box-padding-left))`}, ${n})`),!Number.isNaN(a)){let e=`calc(1 / var(--_range-width) * 100 * ${a}% - var(--media-box-padding-right))`;n=`min(${n}, ${e})`}return n},Cc=new WeakSet,wc=function(e,t){let{width:n,min:r,max:i}=e.box,a=t*e.range.width;if(a<r+X(this,dc)){let t=e.range.left-e.bounds.left-X(this,dc);return`${a-n/2+t}px`}if(a>i-X(this,fc)){let t=e.bounds.right-e.range.right-X(this,fc);return`${a+n/2-t-e.range.width}px`}return 0},Tc=new WeakSet,Ec=function(e){let t=[...X(this,sc)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this))){$(this,Dc,Oc).call(this,null);return}let n=this.mediaSeekableEnd;if(!n)return;let r=T(this.shadowRoot,`#preview-rail`),i=T(this.shadowRoot,`[part~="preview-box"]`),a=$(this,yc,bc).call(this,X(this,lc)),o=(e.clientX-a.range.left)/a.range.width;o=Math.max(0,Math.min(1,o));let s=$(this,xc,Sc).call(this,a,o),c=$(this,Cc,wc).call(this,a,o);r.style.transform=`translateX(${s})`,r.style.setProperty(`--_range-width`,`${a.range.width}`),i.style.setProperty(`--_box-shift`,`${c}`),i.style.setProperty(`--_box-width`,`${a.box.width}px`);let l=Math.round(X(this,cc))-Math.round(o*n);Math.abs(l)<1&&o>.01&&o<.99||(Q(this,cc,o*n),$(this,Dc,Oc).call(this,X(this,cc)))},Dc=new WeakSet,Oc=function(t){this.dispatchEvent(new C.CustomEvent(e.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))},kc=new WeakSet,Ac=function(){X(this,oc).stop();let t=Pc(this);this.dispatchEvent(new C.CustomEvent(e.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))},Fc.shadowRootOptions={mode:`open`},Fc.getContainerTemplateHTML=Mc,C.customElements.get(`media-time-range`)||C.customElements.define(`media-time-range`,Fc);var Ic=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},Lc=(e,t,n)=>(Ic(e,t,`read from private field`),n?n.call(e):t.get(e)),Rc=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},zc,Bc=1,Vc=e=>e.mediaMuted?0:e.mediaVolume,Hc=e=>`${Math.round(e*100)}%`,Uc=class extends Li{constructor(){super(...arguments),Rc(this,zc,()=>{let t=this.range.value,n=new C.CustomEvent(e.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(n)})}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_VOLUME,i.MEDIA_MUTED,i.MEDIA_VOLUME_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.range.setAttribute(`aria-label`,x(`volume`)),this.range.addEventListener(`input`,Lc(this,zc))}disconnectedCallback(){this.range.removeEventListener(`input`,Lc(this,zc)),super.disconnectedCallback()}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),(e===i.MEDIA_VOLUME||e===i.MEDIA_MUTED)&&(this.range.valueAsNumber=Vc(this),this.range.setAttribute(`aria-valuetext`,Hc(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return E(this,i.MEDIA_VOLUME,Bc)}set mediaVolume(e){D(this,i.MEDIA_VOLUME,e)}get mediaMuted(){return O(this,i.MEDIA_MUTED)}set mediaMuted(e){k(this,i.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return A(this,i.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){j(this,i.MEDIA_VOLUME_UNAVAILABLE,e)}};zc=new WeakMap,C.customElements.get(`media-volume-range`)||C.customElements.define(`media-volume-range`,Uc);function Wc(e){return`
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

        :host([${i.MEDIA_LOOP}]) #checked-indicator {
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
    `}function Gc(){return x(`Loop`)}var Kc=class extends W{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,i.MEDIA_LOOP]}connectedCallback(){super.connectedCallback(),this.container=this.shadowRoot?.querySelector(`#icon`)||null,this.container&&(this.container.textContent=x(`Loop`))}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===i.MEDIA_LOOP&&this.container&&this.setAttribute(`aria-checked`,this.mediaLoop?`true`:`false`)}get mediaLoop(){return O(this,i.MEDIA_LOOP)}set mediaLoop(e){k(this,i.MEDIA_LOOP,e)}handleClick(){let t=!this.mediaLoop,n=new C.CustomEvent(e.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(n)}};Kc.getSlotTemplateHTML=Wc,Kc.getTooltipContentHTML=Gc,C.customElements.get(`media-loop-button`)||C.customElements.define(`media-loop-button`,Kc);var qc=e=>{let t=Math.max(0,Math.floor(e||0)),n=Math.floor(t/3600);return(n?n+`:`:``)+String(Math.floor(t/60)%60).padStart(n?2:1,`0`)+`:`+String(t%60).padStart(2,`0`)};window.SteepleComponent={mount(e,t){let n=t.steepleTimeline,r=t.steepleIsLive,i=document.createElement(`media-controller`);i.className=`component-player`;for(let e of[`noautohide`,`gesturesdisabled`,`nodefaultstore`])i.setAttribute(e,``);i.fullscreenElement=e,t.controls=!1,t.slot=`media`,t.before(i),i.append(t);let a=new AbortController,o=(e,t,n,r={})=>e.addEventListener(t,n,{...r,signal:a.signal}),s=document.createElement(`media-control-bar`);s.className=`player-bar`,s.innerHTML=`<media-play-button class="desktop-play"></media-play-button><div class="player-volume"><media-mute-button></media-mute-button><media-volume-range></media-volume-range></div><span class="player-time"></span><media-time-range aria-label="Seek"></media-time-range><button class="player-live" type="button">Live</button><div class="player-actions"><media-captions-button></media-captions-button><media-pip-button></media-pip-button><media-fullscreen-button></media-fullscreen-button></div>`;let c=document.createElement(`media-play-button`);c.className=`touch-play`,c.slot=`centered-chrome`;let l=document.createElement(`div`);l.className=`player-top`,l.slot=`top-chrome`;let u=s.querySelector(`.player-time`),d=s.querySelector(`media-time-range`),f=s.querySelector(`.player-live`),p=s.querySelector(`.player-actions`);s.querySelector(`media-volume-range`).range.step=`0.05`,d.hidden=r&&!n,f.hidden=!r||!n,f.disabled=!n,o(f,`click`,()=>n?.goLive()),i.append(l,c,s);for(let e of[l,c,s])e.setAttribute(`noautohide`,``);let m=!1,h=null,g=matchMedia(`(pointer: coarse)`).matches,_,v=_n({media:t,fullscreenElement:e,documentElement:document,options:{noAutoSeekToLive:!0,noVolumePref:!0,noMutedPref:!0}}),y=new Set,b=()=>{let e=v.getState();if(!n)return e;let t=n.getState();return{...e,mediaCurrentTime:h??t.current,mediaDuration:t.end,mediaSeekable:[t.start,t.end],mediaBuffered:[],mediaStreamType:`live`,mediaTimeIsLive:t.live,mediaLoading:e.mediaLoading||t.busy}},ee=()=>{let e=b(),t=n?.getState(),a=e.mediaCurrentTime||0;p.querySelector(`media-captions-button`).hidden=!e.mediaSubtitlesList?.length,u.textContent=r?n?qc(a):``:qc(a)+` / `+qc(e.mediaDuration),t&&(d.toggleAttribute(`disabled`,!t.available),d.title=t.available?`Available from `+qc(t.start)+` after meeting start`:`Rewind history is not available yet`,f.textContent=t.live?`Live`:`Back to live`,f.setAttribute(`aria-label`,f.textContent),f.dataset.live=String(t.live));let o=(e.mediaDuration||0)-(t?.start||0);if(o>0&&(d.range.step=String(Math.min(1,5/o))),i.toggleAttribute(`data-paused`,!!e.mediaPaused),!m)for(let t of y)t(e)},te=e=>n?n.seek(e):v.dispatch({type:`mediaseekrequest`,detail:e});i.mediaStore={getState:b,subscribe(e){return y.add(e),e(b()),()=>y.delete(e)},dispatch(e){if(e.type===`mediaseekrequest`){m?h=e.detail:te(e.detail);return}if(n&&e.type===`mediaseektoliverequest`)return n.goLive();v.dispatch(e)}};let ne=v.subscribe(ee),x=n?.subscribe(ee),S=()=>{i.removeAttribute(`data-hidden`),clearTimeout(_),_=setTimeout(()=>{!m&&!t.paused&&!i.matches(`:focus-within`)&&i.setAttribute(`data-hidden`,``)},3e3)},re=e=>{g=e,i.toggleAttribute(`data-touch`,e);let t=e?l:s;p.parentElement!==t&&t.append(p),S()};re(g),o(i,`pointerdown`,e=>{re(e.pointerType===`touch`||e.pointerType===`pen`),S()},{capture:!0}),o(i,`pointermove`,e=>{e.pointerType===`mouse`&&(g&&re(!1),S())}),o(t,`click`,()=>{g||(t.paused?t.play().catch(()=>{}):t.pause())}),o(i,`focusin`,S),o(i,`focusout`,S),o(t,`pause`,S),o(t,`playing`,S),o(d,`pointerdown`,()=>{m=!0,h=null,S()},{capture:!0});let ie=()=>{if(!m)return;m=!1;let e=h;h=null,e!==null&&te(e),ee(),S()};return o(window,`pointerup`,ie),o(window,`pointercancel`,()=>{h=null,ie()}),ee(),()=>{clearTimeout(_),a.abort(),x?.(),ne(),i.remove(),y.clear()}}},window.SteeplePlayer={renderPreviewStatus(e,t,n=`broadcaster`){return!(t?.type===`ndi`?t.ndi?.sourceName:t?.type===`capture`?t.capture?.videoDevice&&t.capture?.audioDevice:t?.network?.uri)&&(this.renderSlate(e,`Camera preview not configured`,n===`admin`?`No video source is selected.`:`An administrator needs to select a video source.`),!0)},async renderWebRtc(e,t,n={}){let r=n.streamKey?`webrtc:${t}:${n.streamKey}`:t;if(e.steepleSrc===r&&e.querySelector(`video`))return e.querySelector(`video`);Jc(e),e.steepleSrc=r;let i=Yc(e),a=e.steepleGeneration;i.controls=n.controls!==!1,i.autoplay=!!n.autoplay,i.playsInline=!0,i.steepleObserverCleanup=n.onVideo?.(i),al(e,i,`WebRTC`),ml(e,i,n);let o=async()=>{try{await nl(e,i,t,n)}catch{if(e.steepleGeneration!==a)return;pl(e,`Waiting for video`,`The video is temporarily unavailable. Retrying automatically.`),e.steeplePeer?.close(),e.steepleWhepResource&&=(fetch(e.steepleWhepResource,{method:`DELETE`}).catch(()=>{}),null),n.retry!==!1&&(e.steepleRetryTimer=setTimeout(()=>{e.isConnected&&e.steepleGeneration===a&&o()},n.retryDelayMs||5e3))}};return await o(),i},renderRecording(e,t,n={}){if(e.steepleSrc===t&&e.querySelector(`video`))return e.querySelector(`video`);Jc(e),e.steepleSrc=t;let r=Yc(e);return r.controls=!0,r.autoplay=!!n.autoplay,r.playsInline=!0,r.steepleObserverCleanup=n.onVideo?.(r),r.src=t,al(e,r,`Replay`),ml(e,r,{...n,recording:!0}),r},renderHls(e,t,n={}){if(n.controls===`live`)return this.renderHybridLive(e,{hlsUrl:t},n);let r=n.streamKey?`hls:${t}:${n.streamKey}`:t;if(e.steepleSrc===r&&e.querySelector(`video`))return e.querySelector(`video`);Jc(e),e.steepleSrc=r;let i=Yc(e);return i.controls=n.controls!==!1&&n.controls!==`live`,i.autoplay=!!n.autoplay,i.playsInline=!0,i.steepleObserverCleanup=n.onVideo?.(i),al(e,i,`HLS`),rl(e,i,t,n),i},renderHybridLive(e,t,n={}){let r=t?.hlsUrl,i=t?.webrtcUrl,a=n.timeline!==!1,o=`hybrid:${i||``}:${r||``}:${a}:${n.timelineStartAt||``}:${n.streamKey||``}`;return e.steepleSrc===o&&e.querySelector(`video`)?e.querySelector(`video`):!r&&!i?(Jc(e),e.steepleSrc=null,fl(e,`Preview Unavailable`,`No local preview URL is configured.`),null):(Jc(e),e.steepleSrc=o,Xc(e,{hlsUrl:r,webrtcUrl:i},n),e.querySelector(`video`))},renderSlate(e,t,n){let r=`${t}\n${n}`;e.steepleSlate!==r&&(Jc(e),e.steepleSrc=null,e.steepleSlate=r,fl(e,t,n))}};function Jc(e){e.steepleControlsCleanup&&=(e.steepleControlsCleanup(),null);let t=e.steepleVideo;il(e,t),t?.steepleUiCleanup?.(),t&&(t.steepleTimeline=null),e.steepleSlate=null}function Yc(e){return e.steepleVideo||=document.createElement(`video`)}function Xc(e,t,n={}){let r=document.createElement(`div`);r.className=`live-player`;let i=Yc(e),a=null,o=!1,s=null,c=!0,l=null,u,d,f=new Set,p=Date.parse(n.timelineStartAt||``)||Date.now(),m=()=>Math.max(0,(Date.now()-p)/1e3),h=()=>{for(let e of f)e()},g=()=>{let t=e.steepleHls,n=(t?.levels?.[t.currentLevel]?.details?.fragments)?.find(e=>Number.isFinite(e.programDateTime));if(n)return(n.programDateTime-p)/1e3-n.start;let r=ul(i);return r&&l?l.end-r.end:null},_=()=>{let e=m(),t=a===`hls`?g():null,n=s??(t===null?e:i.currentTime+t),r=l&&Date.now()-l.updatedAt<15e3;return{start:r?Math.max(0,l.start):e,end:e,current:dl(n,0,e),live:c,available:!!(r&&l.end>Math.max(0,l.start)+1),busy:s!==null}},v=t=>{il(e,i),a=t,i.steepleObserverCleanup=n.onVideo?.(i),ml(e,i,n)},y=()=>{if(s===null||a!==`hls`)return;let e=ul(i),t=g();e&&t!==null&&(i.currentTime=dl(s-t,e.start,e.end-.5),s=null,i.play().catch(()=>{}),h())},b=(r=null,l=null)=>{if(t.hlsUrl&&!o){if(s=r,c=r===null,a!==`hls`){v(`hls`),n.onTransport?.({transport:`hls`,fallbackReason:l});let r=new AbortController;e.steepleTransportCleanup=()=>r.abort();for(let e of[`loadedmetadata`,`progress`,`canplay`])i.addEventListener(e,y,{signal:r.signal});rl(e,i,t.hlsUrl,n)}if(y(),r===null){let e=ul(i);e&&(i.currentTime=e.end-.5),i.play().catch(()=>{})}h()}},ee=async()=>{if(o)return;if(s=null,c=!0,!t.webrtcUrl)return b();if(a===`webrtc`){i.play().catch(()=>{});return}v(`webrtc`);let r=e.steepleGeneration;try{await nl(e,i,t.webrtcUrl,n)}catch(t){!o&&r===e.steepleGeneration&&b(null,t.message)}h()},te={getState:_,subscribe(e){return f.add(e),()=>f.delete(e)},seek(e){let t=_();if(e>=t.end-1.5)return ee();t.available&&b(dl(e,t.start,Math.min(t.end,l.end)-.5))},goLive:ee};i.steepleTimeline=n.timeline===!1?null:te,i.steepleIsLive=!0,i.autoplay=!!n.autoplay,i.playsInline=!0,r.append(i),e.replaceChildren(r),ll(r,i);let ne=async()=>{if(!t.hlsUrl||o)return;d=new AbortController;let e=setTimeout(()=>d?.abort(),8e3);try{let e=new URL(t.hlsUrl,window.location.href),n=await fetch(e,{signal:d.signal,cache:`no-store`});if(!n.ok)throw Error(`HLS playlist unavailable`);let r=await n.text(),i=Zc(r);if(i){if(e=new URL(i,e),n=await fetch(e,{signal:d.signal,cache:`no-store`}),!n.ok)throw Error(`HLS playlist unavailable`);r=await n.text()}if(o)return;let a=Qc(r);a&&(l={start:(a.start-p)/1e3,end:(a.end-p)/1e3,updatedAt:Date.now()}),y(),h()}catch{}finally{clearTimeout(e),o||(u=setTimeout(ne,3e3))}},x=setInterval(h,500);e.steepleControlsCleanup=()=>{o=!0,clearInterval(x),clearTimeout(u),d?.abort(),f.clear()},n.timeline!==!1&&ne(),ee()}function Zc(e){let t=e.split(/\r?\n/).map(e=>e.trim()),n=t.findIndex(e=>e.startsWith(`#EXT-X-STREAM-INF:`));return n<0?null:t.slice(n+1).find(e=>e&&!e.startsWith(`#`))}function Qc(e){let t=null,n=null,r=null,i=null;for(let a of e.split(/\r?\n/).map(e=>e.trim()))if(a.startsWith(`#EXT-X-PROGRAM-DATE-TIME:`)){let e=Date.parse(a.slice(25));t=Number.isFinite(e)?e:null}else a.startsWith(`#EXTINF:`)?n=Number.parseFloat(a.slice(8)):a&&!a.startsWith(`#`)&&t!==null&&Number.isFinite(n)&&n>0&&(r??=t,t+=n*1e3,i=t,n=null);return r!==null&&i>r?{start:r,end:i}:null}function $c(e,t){return e.iceGatheringState===`complete`?Promise.resolve():new Promise(n=>{let r=setTimeout(n,t);e.addEventListener(`icegatheringstatechange`,function t(){e.iceGatheringState===`complete`&&(clearTimeout(r),e.removeEventListener(`icegatheringstatechange`,t),n())})})}function el(e,t,n){return e.readyState>=3?e.play().catch(()=>{}):new Promise((r,i)=>{let a=t=>{clearTimeout(c),e.removeEventListener(`playing`,o),n?.removeEventListener(`abort`,s),t?i(t):r()},o=()=>a(),s=()=>a(Error(`WebRTC source changed`)),c=setTimeout(()=>a(Error(`WebRTC playback timed out`)),t);e.addEventListener(`playing`,o,{once:!0}),n?.addEventListener(`abort`,s,{once:!0}),e.play().catch(e=>{e.name===`NotAllowedError`&&a()})})}async function tl(e){let t=await e.getStats(),n=null;for(let e of t.values())e.type===`transport`&&e.selectedCandidatePairId&&(n=t.get(e.selectedCandidatePairId)),!n&&e.type===`candidate-pair`&&e.nominated&&e.state===`succeeded`&&(n=e);return(n?t.get(n.remoteCandidateId):null)?.candidateType||`unknown`}async function nl(e,t,n,r={}){let i=new RTCPeerConnection;e.steeplePeer=i;let a=new AbortController;e.steepleTransportCleanup=()=>a.abort();let o=()=>e.steeplePeer===i,s=()=>{if(!o())throw Error(`WebRTC source changed`)},c=new MediaStream;t.srcObject=c,i.ontrack=e=>c.addTrack(e.track),i.addTransceiver(`video`,{direction:`recvonly`}),i.addTransceiver(`audio`,{direction:`recvonly`});let l=await i.createOffer();s(),await i.setLocalDescription(l),await $c(i,3e3),s();let u=await fetch(n,{method:`POST`,headers:{"content-type":`application/sdp`},body:i.localDescription.sdp}),d=u.headers.get(`location`),f=d?new URL(d,new URL(n,window.location.href)).href:null;if(o()||(f&&fetch(f,{method:`DELETE`,keepalive:!0}).catch(()=>{}),s()),!u.ok)throw Error(`WHEP returned HTTP ${u.status}`);e.steepleWhepResource=f;let p=await u.text();s(),await i.setRemoteDescription({type:`answer`,sdp:p}),s(),await el(t,r.timeoutMs||4e3,a.signal),s();let m=await tl(i);s(),r.onTransport?.({transport:`webrtc-${m}`,candidateType:m})}function rl(e,t,n,r={}){let i=e.steepleGeneration,a=!1,o=(o={})=>{if(e.steepleGeneration!==i||!e.contains(t))return;let s=[401,403].includes(o.response?.code);if(!a||s){if(pl(e,s?`Access expired`:`Waiting for video`,s?`Reload this page to sign in again.`:`The video is temporarily unavailable. Retrying automatically.`),clearTimeout(e.steepleRetryTimer),s||r.retry===!1){e.steepleMediaCleanup?.(),e.steepleMediaCleanup=null,e.steepleHls?.stopLoad();return}a=!0,e.steepleRetryTimer=setTimeout(()=>{e.isConnected&&e.steepleGeneration===i&&(e.steepleHls?.destroy(),e.steepleHls=null,rl(e,t,n,r))},r.retryDelayMs||5e3)}};if(e.steepleMediaCleanup?.(),ml(e,t,{...r,onStall:()=>o(),onProgress:()=>{a&&=(clearTimeout(e.steepleRetryTimer),!1)}}),window.Hls?.isSupported()){let r=new window.Hls({lowLatencyMode:!0,backBufferLength:30});return e.steepleHls=r,r.loadSource(n),r.attachMedia(t),r.on(window.Hls.Events.ERROR,(e,t)=>{t.fatal&&o(t)}),t}return t.canPlayType(`application/vnd.apple.mpegurl`)?(t.onerror=()=>o(),t.src=n,t):(pl(e,`Video unavailable in this browser`,`Try another browser to watch this video.`),null)}function il(e,t){e.steepleGeneration=(e.steepleGeneration||0)+1,e.steepleTransportCleanup?.(),e.steepleTransportCleanup=null,clearTimeout(e.steepleRetryTimer),e.steepleMediaCleanup?.(),e.steepleMediaCleanup=null,e.steeplePeer&&=(e.steeplePeer.ontrack=null,e.steeplePeer.close(),null),e.steepleWhepResource&&=(fetch(e.steepleWhepResource,{method:`DELETE`,keepalive:!0}).catch(()=>{}),null),e.steepleHls&&=(e.steepleHls.destroy(),null),t&&(t.steepleObserverCleanup?.(),t.steepleObserverCleanup=null,t.onerror=null,t.pause(),t.removeAttribute(`src`),t.srcObject=null,t.load?.()),e.querySelector(`.playback-status`)?.remove()}function al(e,t,n){t.steepleIsLive=n!==`Replay`;let r=document.createElement(`div`);r.className=`live-player`,r.append(t),e.replaceChildren(r),ll(r,t)}var ol=`steeple-stream:audio`,sl={volume:1,muted:!1};function cl(){try{let e=JSON.parse(localStorage.getItem(ol));e&&typeof e.volume==`number`&&Number.isFinite(e.volume)&&e.volume>=0&&e.volume<=1&&typeof e.muted==`boolean`&&(sl={volume:e.volume,muted:e.muted})}catch{}return sl}function ll(e,t){let n=cl();t.volume=n.volume,t.muted=n.muted;let r=()=>{sl={volume:t.volume,muted:t.muted};try{localStorage.setItem(ol,JSON.stringify(sl))}catch{}},i=window.SteepleComponent.mount(e,t,n);t.addEventListener(`volumechange`,r),t.steepleUiCleanup=()=>{t.removeEventListener(`volumechange`,r),i?.(),t.steepleUiCleanup=null}}function ul(e){let t=e.seekable;if(!t.length)return null;let n=t.length-1,r=t.start(n),i=t.end(n);return!Number.isFinite(r)||!Number.isFinite(i)||i<=r?null:{start:r,end:i}}function dl(e,t,n){return Math.min(Math.max(e,t),n)}function fl(e,t,n){e.replaceChildren();let r=document.createElement(`div`);r.className=`slate`,r.setAttribute(`role`,`status`);let i=document.createElement(`div`),a=document.createElement(`h2`),o=document.createElement(`p`);a.textContent=t,o.textContent=n,i.append(a,o),r.append(i),e.append(r)}function pl(e,t,n){let r=e.querySelector(`.playback-status`);if(!r){r=document.createElement(`div`),r.className=`slate playback-status`,r.setAttribute(`role`,`status`);let t=document.createElement(`div`);t.append(document.createElement(`h2`),document.createElement(`p`)),r.append(t),e.append(r)}r.querySelector(`h2`).textContent!==t&&(r.querySelector(`h2`).textContent=t),r.querySelector(`p`).textContent!==n&&(r.querySelector(`p`).textContent=n)}function ml(e,t,n){let r=!1,i=null,a=performance.now(),o=t.currentTime,s=!1,c=!1;e.querySelector(`.playback-status`)||pl(e,n.recording?`Loading recording`:`Connecting to video`,``);let l=()=>{s=!0,c=!1,i=null,e.querySelector(`.playback-status`)?.remove()},u=()=>t.seeking||t.currentTime===o?!1:(o=t.currentTime,a=performance.now(),n.onProgress?.(),l(),!0),d=()=>{if(!n.autoplay)return l();t.play().catch(n=>{if(r||!e.contains(t)||n.name!==`NotAllowedError`)return;c=!0,pl(e,`Ready to watch`,``);let i=e.querySelector(`.playback-status`);if(i.querySelector(`button`))return;let a=document.createElement(`button`);a.className=`button`,a.textContent=`Play video`,a.addEventListener(`click`,()=>t.play().catch(p)),i.firstElementChild.append(a)})},f=()=>{i??=performance.now()},p=()=>{e.contains(t)&&pl(e,n.recording?`Recording unavailable`:`Video interrupted`,n.recording?`This recording may have expired or could not be loaded.`:`Waiting for the video connection to recover.`)};t.addEventListener(`playing`,l),t.addEventListener(`loadeddata`,d),t.addEventListener(`waiting`,f),t.addEventListener(`stalled`,f),t.addEventListener(`error`,p),t.addEventListener(`timeupdate`,u);let m=setInterval(()=>{if(!e.contains(t))return;let r=performance.now();if(document.hidden||c||t.ended||t.paused&&(s||!n.autoplay)){a=r,i=null;return}u()||(i!==null&&r-i>=4e3&&p(),r-a>=12e3&&(a=r,i=null,n.onStall&&n.retry!==!1?n.onStall():p()))},1e3);e.steepleMediaCleanup=()=>{r=!0,clearInterval(m),t.removeEventListener(`playing`,l),t.removeEventListener(`loadeddata`,d),t.removeEventListener(`waiting`,f),t.removeEventListener(`stalled`,f),t.removeEventListener(`error`,p),t.removeEventListener(`timeupdate`,u)}}