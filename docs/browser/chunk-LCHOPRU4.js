import{b as j}from"./chunk-OPM46IWT.js";import{a as O,b as R}from"./chunk-5A4W6GGS.js";import{D as v,F as m,I as o,J as r,L as d,M as f,P as p,U as l,V as h,ea as y,k as c,la as S,n as x,na as w,o as s,ta as I,va as M,wa as F,x as a,y as n}from"./chunk-JENCYQEX.js";function D(e,t){if(e&1&&(d(0),o(1,"div",2)(2,"button",3),l(3,"Original"),r(),o(4,"div",4)(5,"label",5)(6,"textarea",6),l(7),r()()()(),f()),e&2){let i=p(2);a(7),h(i.originalFile.content)}}function E(e,t){if(e&1&&(d(0),o(1,"div",7)(2,"button",8),l(3,"Modified"),r(),o(4,"div",9)(5,"label",10)(6,"textarea",11),l(7),r()()()(),f()),e&2){let i=p(2);a(7),h(i.modifiedFile.content)}}function V(e,t){if(e&1&&(d(0),o(1,"div",1),v(2,D,8,1,"ng-container",0)(3,E,8,1,"ng-container",0),r(),f()),e&2){let i=p();a(2),m("ngIf",i.originalFile),a(),m("ngIf",i.modifiedFile)}}var g=class e{constructor(t,i,_,k,B){this._tabsService=t;this._router=i;this._route=_;this._converterService=k;this._cdr=B;let b=this._router.url.split("?")[0],P=this._router.url.split("?")[0].split("/").filter(C=>C).slice(-2).join(".");this._tabsService.addTab(new O(b,this._route.snapshot.queryParams,P)),this._tab=this._tabsService.getTabByPath(b),this._originalFile=null,this._modifiedFile=null,this.originalFile=null,this.modifiedFile=null,this._updateAllFiles(),this._subscriptions=new Array,this._subscriptions.push(this._converterService.modifiedFiles$.subscribe(C=>{this._updateAllFiles(),this._cdr.detectChanges()}))}_tab;_originalFile;_modifiedFile;originalFile;modifiedFile;_subscriptions;ngOnInit(){!this._originalFile&&!this._modifiedFile&&this._tabsService.removeTab(this._tab)}ngOnDestroy(){this._subscriptions.forEach(t=>t.unsubscribe())}_updateAllFiles(){if(this._originalFile=this._converterService.getFileByName(this._tab.name),this._modifiedFile=this._converterService.getFileByName(this._tab.name,"modified"),this.originalFile=null,this.modifiedFile=null,this._originalFile){let t=Object.keys(this._originalFile)[0];this.originalFile={name:t,content:this._originalFile[t].content}}if(this._modifiedFile){let t=Object.keys(this._modifiedFile)[0];this.modifiedFile={name:t,content:this._modifiedFile[t].content}}}static \u0275fac=function(i){return new(i||e)(n(R),n(M),n(I),n(j),n(y))};static \u0275cmp=x({type:e,selectors:[["app-file-viewer"]],decls:1,vars:1,consts:[[4,"ngIf"],[1,"changes-container","h-100"],["id","original-file-container"],["type","menu","data-bs-toggle","collapse","data-bs-target","#original-file-collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start","p-0"],["id","original-file-collapse",1,"col-12","mt-3","collapse","show"],["for","original-file",1,"w-100"],["id","original-file",1,"form-control","w-100"],["id","modified-file-container",1,"mt-3"],["type","menu","data-bs-toggle","collapse","data-bs-target","#modified-file-collapse","aria-expanded","true",1,"btn","text-white","col-12","text-start","p-0"],["id","modified-file-collapse",1,"col-12","mt-3","collapse","show"],["for","modified-file",1,"w-100"],["id","modified-file",1,"form-control","w-100"]],template:function(i,_){i&1&&v(0,V,4,2,"ng-container",0),i&2&&m("ngIf",_.originalFile||_.modifiedFile)},dependencies:[S],styles:["div#original-file-container[_ngcontent-%COMP%], div#modified-file-container[_ngcontent-%COMP%]{background-color:#222529;border-radius:.5rem;padding:1rem}div#original-file-container[_ngcontent-%COMP%]   textarea.form-control[_ngcontent-%COMP%], div#modified-file-container[_ngcontent-%COMP%]   textarea.form-control[_ngcontent-%COMP%]{height:calc(50vh - 8rem)}textarea.form-control[_ngcontent-%COMP%]{color:#fff;background-color:gray;border-radius:.5rem}"]})};var A=[{path:"",children:[{path:"**",component:g}]}],u=class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=s({type:e});static \u0275inj=c({imports:[F.forChild(A),F]})};var N=class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=s({type:e});static \u0275inj=c({imports:[w,u]})};export{N as FileViewerModule};
