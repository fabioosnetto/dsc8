import{a as fe,b as _e}from"./chunk-OPM46IWT.js";import{a as E,b as me}from"./chunk-5A4W6GGS.js";import{$ as h,A as Z,D as v,E as V,F as p,G as J,I as i,J as r,K as _,L as b,M as g,N as M,O as C,P as d,Q as ee,R as te,S as ne,T as oe,U as l,V as F,W as ie,a as K,aa as N,ba as U,c as T,ca as Y,d as W,ea as re,h as X,ja as ae,k as D,ka as P,la as j,ma as se,n as u,na as w,o as G,pa as ce,qa as le,r as m,ra as pe,s as f,sa as de,ta as ue,ua as S,va as $,wa as y,x as s,y as x}from"./chunk-JENCYQEX.js";var A=class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["app-content"]],standalone:!0,features:[h],decls:3,vars:0,consts:[["id","layout-content",1,"content-wrapper","override-template","h-100"],[1,"content","h-100"]],template:function(e,o){e&1&&(i(0,"div",0)(1,"section",1),_(2,"router-outlet"),r()())},dependencies:[w,y,S],styles:["[_nghost-%COMP%]{width:100%;margin-left:280px}app-converter ~ [_nghost-%COMP%]{margin-left:560px}#layout-content[_ngcontent-%COMP%]{background-color:#010115}.override-template[_ngcontent-%COMP%]   .content-header[_ngcontent-%COMP%]{padding:1rem .5rem}.content-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{width:fit-content;border-bottom:.2rem solid #2C3F67}.content-loading-container[_ngcontent-%COMP%]{background-color:#0000004d;-webkit-backdrop-filter:saturate(2.5) blur(3px);backdrop-filter:saturate(2.5) blur(3px);width:100vw;height:100vh;position:fixed;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;z-index:1038}.content-loading-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:1.3rem;font-weight:700}"]})};var Ce=n=>({active:n});function he(n,t){if(n&1){let e=M();b(0),i(1,"li",8)(2,"button",9),C("click",function(){let a=m(e).$implicit,c=d();return f(c.redirectToTab(a))}),l(3),r(),i(4,"button",10),C("click",function(){let a=m(e).$implicit,c=d();return f(c.removeTab(a))}),l(5," x "),r()(),g()}if(n&2){let e=t.$implicit,o=d();s(2),p("ngClass",N(3,Ce,e===o.currentTab))("id",e.path),s(),ie(" ",e.name," ")}}var L=class n{constructor(t,e,o,a){this._tabsService=t;this._route=e;this._router=o;this._cdr=a;this.tabs=[],this.currentTab=new E,this._tabsService.tabsUpdates$.subscribe(c=>{this.tabs=c.length?c:Array.of(new E),this.currentTab=this.tabs?.filter(R=>R.path===this._router.url.split("?")[0])[0]||new E,this._cdr.detectChanges()})}tabs;currentTab;ngOnInit(){this._updateTabs(this._router.url.split("?")[0],this._route.snapshot.queryParams),this._updateTabsOnRouteChange()}ngOnDestroy(){}_updateTabsOnRouteChange(){this._router.events.pipe(X(t=>t instanceof de)).subscribe(t=>{let e=t.url.split("?")[0],o=this._route.snapshot.queryParams;e.split("/").indexOf("abas")>=0&&this._updateTabs(e,o)})}_updateTabs(t,e){this._tabsService.addTab(new E(t,e,t,null),!1),this.tabs=this._tabsService.getTabs(),this.currentTab=this.tabs.filter(o=>o.path===t)[0]}removeTab(t){let e=this.tabs.indexOf(t),o=this._tabsService.removeTab(t);this.tabs=o,this.currentTab=e>=this.tabs.length?this.tabs[e-1]:this.tabs[e]}redirectToTab(t){this._tabsService.redirectToTab(t)}static \u0275fac=function(e){return new(e||n)(x(me),x(ue),x($),x(re))};static \u0275cmp=u({type:n,selectors:[["app-tabs"]],standalone:!0,features:[h],decls:9,vars:3,consts:[["id","tabs-container",1,"col-12","col-sm-12","h-100","pt-2"],[1,"card","card-primary","card-outline","card-outline-tabs","h-100"],[1,"card-header","p-0","border-bottom-0"],["id","custom-tabs-four-tab","role","tablist",1,"nav","nav-tabs"],[4,"ngFor","ngForOf"],[1,"card-body"],["id","custom-tabs-four-tabContent",1,"h-100","tab-content"],["role","tabpanel",1,"h-100","tab-pane","fade","show","active",3,"id"],[1,"nav-item"],["data-toggle","pill","ariaCurrentWhenActive","page","role","tab","aria-controls","custom-tabs-four-home","aria-selected","true",1,"nav-link",3,"click","ngClass","id"],["type","button",1,"btn","btn-tool","close-tab-btn",3,"click"]],template:function(e,o){e&1&&(i(0,"div",0)(1,"div",1)(2,"div",2)(3,"ul",3),v(4,he,6,5,"ng-container",4),r()(),i(5,"div",5)(6,"div",6)(7,"div",7),_(8,"router-outlet"),r()()()()()),e&2&&(s(4),p("ngForOf",o.tabs),s(3),p("id",o.currentTab.path+"-tab"),V("aria-labelledby",o.currentTab.path))},dependencies:[w,ae,P,y,S],styles:["#tabs-container[_ngcontent-%COMP%] > .card[_ngcontent-%COMP%]{background-color:#010115}.card-primary.card-outline[_ngcontent-%COMP%] > .card-header[_ngcontent-%COMP%]   button.nav-link[_ngcontent-%COMP%]{background-color:transparent;padding-right:2rem;border:1px solid #767f87;border-top:3px solid #767f8799}.card-primary.card-outline[_ngcontent-%COMP%] > .card-header[_ngcontent-%COMP%]   li.nav-item[_ngcontent-%COMP%]:hover   button.nav-link[_ngcontent-%COMP%]:not(.active){transition-delay:1ms;transition-timing-function:ease;border-top:3px solid #dee2e6}.card-primary.card-outline[_ngcontent-%COMP%] > .card-header[_ngcontent-%COMP%]   button.nav-link.active[_ngcontent-%COMP%]{background-color:#010115;color:#fff;border-top:3px solid white}.card-outline-tabs[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]{position:relative}.card-outline-tabs[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   button.close-tab-btn[_ngcontent-%COMP%]{background-color:transparent;color:#d3d3d3;font-size:.9rem;height:1rem;width:1rem;display:flex;justify-content:center;align-items:center;position:absolute;top:50%;right:.5rem;transform:translateY(-50%);border-radius:50%;padding:.5rem}.card-outline-tabs[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   button.close-tab-btn[_ngcontent-%COMP%]:hover{background-color:#525252}.card-header[_ngcontent-%COMP%]   ul#custom-tabs-four-tab[_ngcontent-%COMP%]{border-color:#767f87}"]})};var xe=[{path:"",redirectTo:"/tab",pathMatch:"full"},{path:"dsc8v2",loadChildren:()=>import("./chunk-YES47AXT.js").then(n=>n.Dsc8V2Module)},{path:"",component:A,children:[{path:"tab",component:L,children:[{path:"",redirectTo:"home",pathMatch:"full"},{path:"home",loadChildren:()=>import("./chunk-VP2DEW3V.js").then(n=>n.HomeModule)},{path:":file/:extension",loadChildren:()=>import("./chunk-LCHOPRU4.js").then(n=>n.FileViewerModule)}]}]},{path:"**",redirectTo:"/tab"}],B=class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=G({type:n});static \u0275inj=D({imports:[y.forRoot(xe),y]})};function ve(n,t){if(n&1){let e=M();b(0),i(1,"li",4)(2,"button",5),C("click",function(){let a=m(e).$implicit,c=d(2);return f(c.onClickOption(a))}),l(3),r()(),g()}if(n&2){let e=t.$implicit;s(3),F(e)}}function ye(n,t){if(n&1&&(b(0),i(1,"div",1)(2,"ul",2),v(3,ve,4,1,"ng-container",3),r()(),g()),n&2){let e=d();s(),J("left",e.xPos,"px")("top",e.yPos,"px"),s(2),p("ngForOf",e.options)}}var z=class n{xPos;yPos;options;optionClicked$;constructor(){this.xPos=0,this.yPos=0,this.options=new Array,this.optionClicked$=new W}onClickOption(t){this.optionClicked$.next(t)}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["app-context-menu"]],inputs:{xPos:"xPos",yPos:"yPos",options:"options"},standalone:!0,features:[h],decls:1,vars:1,consts:[[4,"ngIf"],[1,"context-menu-container"],[1,"context-menu-options","list-unstyled","p-0","m-0"],[4,"ngFor","ngForOf"],[1,"context-menu-item","px-1","py-1"],["type","button",1,"btn","text-white","col-12","text-start","p-1",3,"click"]],template:function(e,o){e&1&&v(0,ye,4,5,"ng-container",0),e&2&&p("ngIf",o.options.length)},dependencies:[w,P,j],styles:[".context-menu-container[_ngcontent-%COMP%]{background-color:#4c4a4ac2;-webkit-backdrop-filter:blur(3px) saturate(300%);backdrop-filter:blur(3px) saturate(300%);color:#fff;position:fixed;width:200px;box-shadow:1px 1px 3px 4px #00000029;border-radius:.5rem;z-index:9999}.context-menu-container[_ngcontent-%COMP%]   .context-menu-item[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:.9rem;color:#f6f6f6}.context-menu-container[_ngcontent-%COMP%]   .context-menu-item[_ngcontent-%COMP%]:hover   button[_ngcontent-%COMP%]{background-color:#2968c9;color:#fff}"]})};var Me=["choose_files"],we=n=>[n];function Oe(n,t){if(n&1){let e=M();b(0),i(1,"li")(2,"button",21),C("click",function(){let a=m(e).$implicit,c=d(3);return f(c.seeFile(a.key))}),l(3),r()(),g()}if(n&2){let e=t.$implicit;s(3),F(e.key)}}function Pe(n,t){if(n&1){let e=M();b(0),i(1,"li",18),C("click",function(){let a=m(e).$implicit,c=d(2);return f(c.selectFileGroup(a.key))})("contextmenu",function(a){let c=m(e).$implicit,R=d(2);return R.selectFileGroup(c.key),f(R.onFilesContextMenu(a))}),i(2,"button",19),l(3),r(),i(4,"div",20)(5,"ul",10),v(6,Oe,4,1,"ng-container",11),U(7,"keyvalue"),r()()(),g()}if(n&2){let e=t.$implicit;s(2),V("data-bs-target",N(7,we,"#"+e.key+"-files-collapse")),s(),F(e.key),s(),ee("id","",e.key,"-files-collapse"),s(2),p("ngForOf",Y(7,5,e.value))}}function Se(n,t){if(n&1&&(b(0),i(1,"ul",6)(2,"li",7)(3,"button",8),l(4,"Files"),r(),i(5,"div",9)(6,"ul",10),v(7,Pe,8,9,"ng-container",11),U(8,"keyvalue"),r()()(),i(9,"li",7)(10,"button",12),l(11,".dfm Structure"),r(),i(12,"div",13)(13,"ul",10)(14,"li",14)(15,"button",15),l(16,"Nothing here yet..."),r()()()()(),i(17,"li",7)(18,"button",16),l(19,".pas Structure"),r(),i(20,"div",17)(21,"ul",10)(22,"li",14)(23,"button",15),l(24,"Nothing here yet..."),r()()()()()(),g()),n&2){let e=d();s(7),p("ngForOf",Y(8,3,e.fileGroups)),s(8),p("disabled",!0),s(8),p("disabled",!0)}}function ke(n,t){if(n&1){let e=M();b(0),i(1,"button",22),C("click",function(){m(e);let a=d();return f(a.addFiles())}),l(2,"Add Files"),r(),i(3,"input",23,0),C("input",function(){m(e);let a=d();return f(a.onChooseFilesInput())}),r(),g()}}var q=class n{constructor(t,e,o){this._router=t;this._converterService=e;this._viewContainerRef=o;this.fileGroups=null,this._selectedFileGroup=null}chooseFiles;_contextMenu;fileGroups;_selectedFileGroup;addFiles(){this.chooseFiles.nativeElement.click()}onChooseFilesInput(){return T(this,null,function*(){let t=this.chooseFiles.nativeElement.files;t&&(this.fileGroups=yield fe.fileListToFileGroup(t),this._converterService.files=this.fileGroups)})}seeFile(t){return T(this,null,function*(){let e=t.split(".").slice(0,-1).join(""),o=t.split(".").pop();yield this._router.navigateByUrl("/",{skipLocationChange:!0}).then(()=>T(this,null,function*(){yield this._router.navigateByUrl(`/tab/${e}/${o}`)}))})}selectFileGroup(t){if(!this.fileGroups)return;let e=K({},this.fileGroups);Object.keys(e).forEach(o=>{o!==t&&delete e[o]}),this._selectedFileGroup=e}onFilesContextMenu(t){t.preventDefault(),this.toggleContextMenu(t.clientX,t.clientY)}toggleContextMenu(t,e){this._contextMenu&&(this._contextMenu.instance.optionClicked$.unsubscribe(),this._contextMenu.destroy()),this._contextMenu=this._viewContainerRef.createComponent(z),this._contextMenu.instance.xPos=t,this._contextMenu.instance.yPos=e,this._contextMenu.instance.options=["Convert","Download"],this._contextMenu.instance.optionClicked$.subscribe(a=>{let c=a.toLowerCase();c!=="convert"&&c!=="download"||this._handleContextMenuClick(c)});let o=()=>{this._contextMenu.instance.optionClicked$.unsubscribe(),this._contextMenu&&this._contextMenu.destroy(),document.removeEventListener("click",o)};document.addEventListener("click",o)}_handleContextMenuClick(t){return T(this,null,function*(){if(this._selectedFileGroup){yield this._converterService.executeFileAction(this._selectedFileGroup,t),t==="convert"&&this._converterService.toggleConverter(this._viewContainerRef,this._selectedFileGroup);for(let e in this._selectedFileGroup)if(Object.prototype.hasOwnProperty.call(this._selectedFileGroup,e))for(let o in this._selectedFileGroup[e])Object.prototype.hasOwnProperty.call(this._selectedFileGroup[e],o)&&(yield this.seeFile(o))}})}static \u0275fac=function(e){return new(e||n)(x($),x(_e),x(Z))};static \u0275cmp=u({type:n,selectors:[["app-sidebar"]],viewQuery:function(e,o){if(e&1&&te(Me,5),e&2){let a;ne(a=oe())&&(o.chooseFiles=a.first)}},standalone:!0,features:[h],decls:8,vars:2,consts:[["choose_files",""],["id","sidebar",1,"flex-shrink-0","p-2","bg-dark",2,"width","280px"],["type","button","disabled","",1,"btn"],[1,"fs-5","fw-semibold"],["id","mid-options"],[4,"ngIf"],["id","main-options",1,"list-unstyled"],[1,"main-opt","py-1"],["type","menu","data-bs-toggle","collapse","data-bs-target","#files-container-collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start"],["id","files-container-collapse",1,"opt-collapse","collapse","show"],[1,"list-unstyled","px-2","mx-2"],[4,"ngFor","ngForOf"],["type","menu","data-bs-toggle","collapse","data-bs-target","#dfm-collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start"],["id","dfm-collapse",1,"opt-collapse","collapse"],[1,"mb-1"],["type","menu",1,"btn","text-white","col-12","text-start","ps-0",3,"disabled"],["type","menu","data-bs-toggle","collapse","data-bs-target","#pas-collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start"],["id","pas-collapse",1,"opt-collapse","collapse"],[1,"mb-1",3,"click","contextmenu"],["type","menu","data-bs-toggle","collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start","ps-0"],[1,"opt-collapse","collapse","show",3,"id"],["type","menu",1,"btn","text-white","col-12","text-start","ps-0",3,"click"],["type","button",1,"btn","btn-primary","text-white","col-12",3,"click"],["id","choose-files","type","file","multiple","","accept",".dfm, .pas, .html, .css, .js",2,"display","none",3,"input"]],template:function(e,o){e&1&&(i(0,"aside",1)(1,"button",2)(2,"span",3),l(3,"DSC8 3"),r()(),_(4,"hr"),i(5,"div",4),v(6,Se,25,5,"ng-container",5)(7,ke,5,0,"ng-container",5),r()()),e&2&&(s(6),p("ngIf",o.fileGroups),s(),p("ngIf",!o.fileGroups))},dependencies:[w,P,j,se,y],styles:["#sidebar[_ngcontent-%COMP%]{height:100vh;position:fixed;left:0;top:0}#sidebar[_ngcontent-%COMP%]   ul#main-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background-color:transparent;border:none}#sidebar[_ngcontent-%COMP%]   ul#main-options[_ngcontent-%COMP%]   .main-opt[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{background-color:#010115}#sidebar[_ngcontent-%COMP%]   ul#main-options[_ngcontent-%COMP%]   .main-opt[_ngcontent-%COMP%]   .opt-collapse[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{border-left:1px solid gray}"]})};var k=class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["app-layout"]],standalone:!0,features:[h],decls:3,vars:0,consts:[["id","layout-container"]],template:function(e,o){e&1&&(i(0,"div",0),_(1,"app-sidebar")(2,"router-outlet"),r())},dependencies:[S,q],styles:["#layout-container[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap}"]})};var Q=class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=u({type:n,selectors:[["app-root"]],decls:1,vars:0,template:function(e,o){e&1&&_(0,"app-layout")},dependencies:[k]})};var H=class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=G({type:n,bootstrap:[Q]});static \u0275inj=D({providers:[pe()],imports:[le,B,k]})};ce().bootstrapModule(H,{ngZoneEventCoalescing:!0}).catch(n=>console.error(n));
