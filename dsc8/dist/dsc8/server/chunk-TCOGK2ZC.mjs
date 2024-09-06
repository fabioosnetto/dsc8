import './polyfills.server.mjs';
import{B as v,I as w,Ma as H,Oa as _,T as S,U as I,V as h,Z as y,da as m,db as O,i as f,n as $,o as x}from"./chunk-PC6AFUGU.mjs";import{h as M}from"./chunk-5XUXGTUW.mjs";var L=class g{constructor(e){this._platformId=e}pasInput;pasOutput;dfmInput;dfmOutput;fastConversion;dfmForm;ngOnInit(){}ngAfterViewInit(){_(this._platformId)&&setTimeout(()=>{this.defSettings()},1e3)}convert(){return M(this,null,function*(){this.loading(!0),setTimeout(()=>M(this,null,function*(){this.pasInput="",this.pasOutput="",this.dfmInput="",this.dfmOutput="";let e=document.querySelector("#pas-input"),d=document.querySelector("#dfm-input"),t=document.querySelector("#fast-conversion");if(!e||!d||!t)return;this.pasInput=e.value,this.dfmInput=d.value,this.fastConversion=t.checked,console.log("Formating DFM and PAS to Javascript..."),console.log("Result:");let i=this.dfmToJs(this.dfmInput),n=this.pasToJs(this.pasInput);this.dfmForm=i[Object.keys(i)[0]]._objectClass,console.log(i),console.log(n),console.log(`
`),this.applyStyles(i,n),this.addHeader(i,n),this.addButtons(i,n),this.addTabsButtons(i,n),this.loading(!1),this.fastConversion||(yield this.semiAutoConversion(i)),this.dfmOutput=this.jsToDfm(i),this.pasOutput=this.jsToPAS(n);let E=document.querySelector("#pas-output"),l=document.querySelector("#dfm-output");!E||!l||(E.value=`${this.pasOutput}`,l.value=`${this.dfmOutput}`)}),0)})}dfmToJs(e){let d=e.trim().split(`
`).map((l,r)=>" ".repeat((2-String(l).search(/\S/)%2)%2)+String(l));d[d.length-1]=d[d.length-1].trim();let t=[],i={},n={active:!1,type:"",level:null,key:"",key1:""},E=[];d.map(l=>{let r=l.search(/\S/);E.filter(F=>F.i1===r).length||E.push({i1:r,i2:E.reverse().map((F,o)=>r<F.i1?o+1:null).filter(F=>F)[0]||E.length}),E.sort()});for(let[l,r]of d.entries()){let F=E.filter(a=>a.i1===r.search(/\S/))[0].i2,o=String(r.trim());if(n.active){n.level&&(n.type==="object"?t[n.level][n.key][n.key1]=String(t[n.level][n.key][n.key1]).concat(`
`," ".repeat(Math.abs((F-1)*2)),o):(n.type==="string"||n.type==="items")&&(t[n.level][n.key]=String(t[n.level][n.key]).concat(`
`," ".repeat(Math.abs((F-1)*2)),o))),(n.type==="object"&&(String(o).endsWith("}")||String(o).endsWith(")"))||n.type==="string"&&!String(o).endsWith("+")||n.type==="items"&&String(o).endsWith("end>"))&&(n.active=!1,n.level=null,n.key="",n.key1="");continue}else if(new RegExp("^object\\s\\w+:\\s\\w+").test(o)){let a=String(o).match(new RegExp("object\\s(\\w+)"))?.[1];if(!a)continue;let s={};F>0?t[F-1][a]=s:i[a]=s,t[F]=s,t[F]._objectClass=String(o).match(new RegExp(`(?<=${a}: ).*`))?.[0]}else if(new RegExp("^\\w+\\s=\\s").test(o)){let a=String(o).match(new RegExp("(\\w+)"))?.[1];if(!a)continue;t[F-1][a]=String(o).match(new RegExp(`(?<=${a} = ).*`))?.[0],t[F-1][a]==="<"&&(n.active=!0,n.type="items",n.level=F-1,n.key=a,n.key1="")}else if(new RegExp("^\\w+\\.\\w+\\s=\\s").test(o)){let a={},s=String(o).match(new RegExp("(\\w+)"))?.[1];if(!s)continue;t[F-1][s]||(t[F-1][s]=a);let T=String(o).match(new RegExp(`${s}\\.(\\w+)`))?.[1];if(!T)continue;t[F-1][s][T]=String(o).match(new RegExp(`(?<=${s}\\.${T} = ).*`))?.[0],(String(o).match(new RegExp(`(?<=${s}\\.${T} = )\\{`))||String(o).match(new RegExp(`(?<=${s}\\.${T} = )\\(`)))&&(n.active=!0,n.type="object",n.level=F-1,n.key=s,n.key1=T)}else if(!new RegExp("end").test(o)&&new RegExp("^\\w+\\s=").test(o)){let a=String(o).match(new RegExp("\\w+"))?.[0];if(!a)continue;t[F-1][a]="",n.active=!0,n.type="string",n.level=F-1,n.key=a,n.key1=""}}return i}jsToDfm(e){let d=n=>{let E=Object.entries(n).sort((r,F)=>{let o=r[1]?._order!==void 0?Number(r[1]?._order):Number.MAX_SAFE_INTEGER,a=F[1]?._order!==void 0?Number(F[1]?._order):Number.MAX_SAFE_INTEGER;return o-a}),l={};for(let[r,F]of E)l[r]=typeof F=="object"&&F!==null?d(F):F;return l},t=(n,E)=>{E||(E=0);let l=[],r=Object.keys(n),F=r.length-1;for(let o in n)if(n[o]!==null){if(typeof n[o]=="object"){if(n[o]._objectClass)l.push(`${" ".repeat(E*2)}object ${o}: ${n[o]._objectClass}`),l.push(...t(n[o],E+1));else for(let a in n[o]){if(!n[o][a])continue;let s=E*2-(String(n[o][a]).split(`
`)?.[1]?.search(/\S/)||E*2)+2,T=String(n[o][a]).split(`
`).map((A,C)=>C>0&&s>0?" ".repeat(s)+A:A).join(`
`);l.push(`${" ".repeat(E*2)}${o}.${a} = ${T}`)}r.indexOf(o)===F&&(E--,E>=0&&l.push(`${" ".repeat(E*2)}end`))}else if(o!=="_objectClass"&&o!=="_order"&&n[o]){let a=E*2-(String(n[o]).split(`
`)?.[1]?.search(/\S/)||E*2)+2,s=String(n[o]).split(`
`).map((T,A)=>A>0&&a>0?" ".repeat(a)+T:T).join(`
`);l.push(`${" ".repeat(E*2)}${o} = ${s}`),r.indexOf(o)===F&&(E>0&&E--,l.push(`${" ".repeat(E*2)}end`))}}return l};return(n=>{let E=[],l=[];n.map(o=>{let a=o.search(/\S/);l.filter(s=>s.i1===a).length||l.push({i1:a,i2:l.reverse().map((s,T)=>a<s.i1?T+1:null).filter(s=>s)[0]||l.length}),l.sort()});let r=(o,a=0)=>{for(let[s,T]of o.entries()){let A=l.filter(c=>c.i1===T.search(/\S/))[0].i2,C=!String(T).trim().match(new RegExp("\\bobject \\w+: \\w+"))&&String(T).trim()!=="end",D=A===a;if(A===a-1)break;C&&D&&E.push(T)}},F=(o,a=0)=>{r(o,a);for(let[s,T]of o.entries()){let A=l.filter(c=>c.i1===T.search(/\S/))[0].i2,C=!!String(T).trim().match(new RegExp("\\bobject \\w+: \\w+")),D=A===a;if(A===a-1)break;C&&D&&(E.push(T),F(o.slice(s+1),a+1),E.push(`${" ".repeat(a*2)}end`))}};return F(n),E})(t(d(e),0)).join(`
`)}pasToJs(e){let d={};return d[String(e).match(new RegExp("unit\\s(\\w+)"))?.[1]||""]=`${e}`,d}jsToPAS(e){let d=Object.keys(e)?.[0];return e[d]}pasAddObject(e,d,t){let i=o=>{let a=[];o.forEach(A=>{let C=A.search(/\S/);a.filter(D=>D.i1===C).length||a.push({i1:C,i2:a.reverse().map((D,c)=>C<D.i1?c+1:null).filter(D=>D)[0]||a.length}),a.sort()});let s=!1,T=null;for(let[A,C]of o.entries()){let D=C.trim(),c=a.filter(u=>u.i1===C.search(/\S/))[0].i2;if(s&&c!==T+1)return s=!1,A-1;if(D.match("\\b\\w+\\s=\\s\\w+(\\w+)")&&(s=!0,T=c),s&&D.match(new RegExp("procedure\\s")))return A-1}return-1},n=Object.keys(e)[0],E=String(e[n]).trim().split(`
`),l=i(E),r=String(E[l]).match(new RegExp("\\s*"))?.[0],F=new Array;F=F.concat(E.slice(0,l+1)),F.push(`${r}${t}: ${d};`),F=F.concat(E.slice(l+1,E.length)),E=F,e[n]=F.join(`
`)}pasRemoveObject(e,d,t){let i=Object.keys(e)[0],n=String(e[i]).trim().split(`
`),E=new Array;d?E=E.concat(n.filter(l=>!l.trim().match(`\\b${t}: ${d};`))):E=E.concat(n.filter(l=>!l.trim().match(`\\b${t}: \\w+;`))),n=E,e[i]=E.join(`
`)}pasAddMethod(e,d,t,i,n){let E=C=>{for(let D of C){let c=D.trim();if(c.match("\\b\\w+\\s=\\s\\w+(\\w+)"))return c.match("\\b\\w+")?.[0]||""}return""},l=C=>{let D=!1,c=null;for(let[u,R]of C.entries()){let P=R.trim(),p=s.filter(B=>B.i1===R.search(/\S/))[0].i2;if(D&&p!==c+1)return D=!1,u-1;if(P.match("\\b\\w+\\s=\\s\\w+(\\w+)")&&(D=!0,c=p),D&&P.match(new RegExp("procedure\\s")))return u-1}return-1},r=C=>{let D=0;for(let[c,u]of C.entries()){let R=u.trim(),P=s.filter(p=>p.i1===u.search(/\S/))[0].i2;if(R.match(new RegExp(`${d} ${t}`))&&D++,D>=2){let p=R.match(new RegExp("end;")),B=String(C[c+1]).trim()==="",N=String(C[c+2]).trim().includes("end."),b=String(C[c+2]).trim().includes("procedure")||String(C[c+2]).trim().includes("function");if(p&&B&&(N||b))return c}}return-1},F=Object.keys(e)[0],o=String(e[F]).trim().split(`
`),a=E(o),s=[];o.forEach(C=>{let D=C.search(/\S/);s.filter(c=>c.i1===D).length||s.push({i1:D,i2:s.reverse().map((c,u)=>D<c.i1?u+1:null).filter(c=>c)[0]||s.length}),s.sort()});let T=new Array,A=String(e[F]).includes(`${d} ${t}`);if(!A){let C=l(o),D=String(o[C]).match(new RegExp("\\s*"))?.[0]||"";T=new Array,T=T.concat(o.slice(0,C+1)),T.push(`${D}${d} ${t}(${i});`),T=T.concat(o.slice(C+1,o.length)),o=T}if(A){let C=r(o),D=String(o[o.length-1]).match(new RegExp("\\s*"))?.[0]||"";T=new Array,T=T.concat(o.slice(0,C)),T.push(`
${D}${" ".repeat(3)}${n.trim()}`),T=T.concat(o.slice(C,o.length)),o=T}else{let C=String(o[o.length-1]).match(new RegExp("\\s*"))?.[0]||"";T=new Array,T=T.concat(o.slice(0,o.length-1)),T.push(`${C}${a}.${d} ${t}(${i});`),T.push(`${C}begin`),T.push(`${C}${" ".repeat(3)}${n.trim()}`),T.push(`${C}end;
`),T=T.concat(o.slice(o.length-1,o.length)),o=T}e[F]=T.join(`
`)||e[F]}pasRemoveMethod(e,d,t){}extractObjectByClass(e,d){let t=[];e._objectClass===d&&t.push(e);for(let i in e)typeof e[i]=="object"&&e[i]!==null&&(t=t.concat(this.extractObjectByClass(e[i],d)));return t}applyStyles(e,d){for(let t in e)if(typeof e[t]=="object"&&e[t]!==null){if(!e[t]._objectClass)continue;switch(this.applyStyles(e[t],d),e[t]._objectClass){case e[Object.keys(e)[0]]._objectClass:e[t].Align="alNone",e[t].AutoSize="False",e[t].BorderStyle="bsNone",e[t].BorderWidth="0",e[t].Ctl3D="False",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Left="400",e[t].Position="poMainFormCenter",e[t].Top="200",e[t].Width="910",e[t].Height="600",e[t].ParentFont="False",e[t].WindowState="wsMaximized",e[t].TextHeight="15";break;case"TLabel":e[t].Alignment="taLeftJustify",e[t].AutoSize="False",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].ParentFont="False";break;case"TRadioButton":e[t].Alignment="taRightJustify",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].ParentFont="False";break;case"TCheckBox":e[t].Alignment="taRightJustify",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].ParentFont="False";break;case"TEdit":e[t].AutoSize="False",e[t].BevelEdges="[beLeft,beTop,beRight,beBottom]",e[t].BevelInner="bvSpace",e[t].BevelKind="bkFlat",e[t].BevelOuter="bvRaised",e[t].BorderStyle="bsNone",e[t].Ctl3D="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Height="23",e[t].ParentFont="False";break;case"TMSEditSel":e[t].AutoSize="False",e[t].BevelEdges="[beLeft,beTop,beRight,beBottom]",e[t].BevelInner="bvSpace",e[t].BevelKind="bkFlat",e[t].BevelOuter="bvRaised",e[t].BorderStyle="bsNone",e[t].Ctl3D="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Height="23",e[t].ParentFont="False";break;case"TComboBox":e[t].BevelEdges="[beLeft,beTop,beRight,beBottom]",e[t].BevelInner="bvSpace",e[t].BevelKind="bkFlat",e[t].BevelOuter="bvRaised",e[t].Ctl3D="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Height="23",e[t].ParentFont="False";break;case"TMaskEdit":e[t].AutoSize="False",e[t].BevelEdges="[beLeft,beTop,beRight,beBottom]",e[t].BevelInner="bvSpace",e[t].BevelKind="bkFlat",e[t].BevelOuter="bvRaised",e[t].BorderStyle="bsNone",e[t].Ctl3D="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Height="23",e[t].ParentFont="False";break;case"TMSDateEdit":e[t].AutoSize="False",e[t].BevelEdges="[beLeft,beTop,beRight,beBottom]",e[t].BevelInner="bvSpace",e[t].BevelKind="bkFlat",e[t].BevelOuter="bvRaised",e[t].BorderStyle="bsNone",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].Height="23",e[t].ParentFont="False";break;case"TDBGrid":e[t].BorderStyle="bsNone",e[t].Color="clWindow",e[t].Ctl3D="False",e[t].FixedColor="clBtnFace",e[t].ParentColor="False",e[t].ParentCtl3D="False",e[t].ParentFont="False",e[t].ParentShowHint="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="8404992",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].TitleFont={},e[t].TitleFont.Charset="ANSI_CHARSET",e[t].TitleFont.Color="8404992",e[t].TitleFont.Height="-11",e[t].TitleFont.Size="9",e[t].TitleFont.Name="'Segoe UI'",e[t].TitleFont.Style="[fsBold]",e[t].Options="[dgEditing, dgTitles, dgIndicator, dgColumnResize, dgTabs, dgAlwaysShowSelection, dgConfirmDelete, dgCancelOnExit]",e[t].OnDrawColumnCell=`${t}DrawColumnCell`,e[t].OnMouseUp=`${t}MouseUp`,e[t].OnTitleClick=`${t}TitleClick`,this.pasAddMethod(d,"procedure",`${t}DrawColumnCell`,"Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState",`if Odd(${t}.datasource.dataset.recno) then
                      ${t}.canvas.brush.color := $00DADADA
                    else
                      ${t}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${t}.canvas.brush.color := $0084632B;
                      ${t}.canvas.font.color := clwhite;
                      ${t}.canvas.font.style := [fsBold];
                    end;
              
                    ${t}.canvas.FillRect(Rect);
                    ${t}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${t}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`),this.pasAddMethod(d,"procedure",`${t}MouseUp`,"Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`),this.pasAddMethod(d,"procedure",`${t}TitleClick`,"Column: TColumn",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`);break;case"TMSDBGrid":e[t].BorderStyle="bsNone",e[t].Color="clWindow",e[t].Ctl3D="False",e[t].FixedColor="clBtnFace",e[t].ParentColor="False",e[t].ParentCtl3D="False",e[t].ParentFont="False",e[t].ParentShowHint="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="8404992",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].TitleFont={},e[t].TitleFont.Charset="ANSI_CHARSET",e[t].TitleFont.Color="8404992",e[t].TitleFont.Height="-11",e[t].TitleFont.Size="9",e[t].TitleFont.Name="'Segoe UI'",e[t].TitleFont.Style="[fsBold]",e[t].Options="[dgEditing, dgTitles, dgIndicator, dgColumnResize, dgTabs, dgAlwaysShowSelection, dgConfirmDelete, dgCancelOnExit]",e[t].OnDrawColumnCell=`${t}DrawColumnCell`,e[t].OnMouseUp=`${t}MouseUp`,e[t].OnTitleClick=`${t}TitleClick`,this.pasAddMethod(d,"procedure",`${t}DrawColumnCell`,"Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState",`if Odd(${t}.datasource.dataset.recno) then
                      ${t}.canvas.brush.color := $00DADADA
                    else
                      ${t}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${t}.canvas.brush.color := $0084632B;
                      ${t}.canvas.font.color := clwhite;
                      ${t}.canvas.font.style := [fsBold];
                    end;
              
                    ${t}.canvas.FillRect(Rect);
                    ${t}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${t}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`),this.pasAddMethod(d,"procedure",`${t}MouseUp`,"Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`),this.pasAddMethod(d,"procedure",`${t}TitleClick`,"Column: TColumn",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`);break;case"TStringGrid":e[t].BorderStyle="bsNone",e[t].Color="clWindow",e[t].Ctl3D="False",e[t].FixedColor="clBtnFace",e[t].ParentColor="False",e[t].ParentCtl3D="False",e[t].ParentFont="False",e[t].ParentShowHint="True",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="8404992",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[fsBold]",e[t].TitleFont={},e[t].TitleFont.Charset="ANSI_CHARSET",e[t].TitleFont.Color="8404992",e[t].TitleFont.Height="-11",e[t].TitleFont.Size="9",e[t].TitleFont.Name="'Segoe UI'",e[t].TitleFont.Style="[fsBold]",e[t].OnDrawColumnCell=`${t}DrawColumnCell`,e[t].OnMouseUp=`${t}MouseUp`,e[t].OnTitleClick=`${t}TitleClick`,this.pasAddMethod(d,"procedure",`${t}DrawColumnCell`,"Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState",`if Odd(${t}.datasource.dataset.recno) then
                      ${t}.canvas.brush.color := $00DADADA
                    else
                      ${t}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${t}.canvas.brush.color := $0084632B;
                      ${t}.canvas.font.color := clwhite;
                      ${t}.canvas.font.style := [fsBold];
                    end;
              
                    ${t}.canvas.FillRect(Rect);
                    ${t}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${t}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`),this.pasAddMethod(d,"procedure",`${t}MouseUp`,"Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`),this.pasAddMethod(d,"procedure",`${t}TitleClick`,"Column: TColumn",`TDBGridPad(${t}).defaultRowHeight := 30;
                    TDBGridPad(${t}).clientHeight     := (30 * TDBGridPad(${t}).rowcount) + 30;`);break;case"TPanel":e[t].AutoSize="False",e[t].BevelInner="bvNone",e[t].BevelOuter="bvNone",e[t].BorderStyle="bsNone",e[t].Color="clWhite",e[t].Ctl3D="False",e[t].Font={},e[t].Font.Charset="ANSI_CHARSET",e[t].Font.Color="clBlack",e[t].Font.Height=null,e[t].Font.Size="9",e[t].Font.Name="'Segoe UI'",e[t].Font.Style="[]",e[t].ParentFont="False";break;default:break}}}addHeader(e,d){let t=Object.keys(e)[0],i="PanelTitle",n="LabelTitle";this.pasAddObject(d,"TPanel",i),this.pasAddObject(d,"TLabel",n),e[t][i]={},e[t][i]._objectClass="TPanel",e[t][i]._order="0",e[t][i].Left="0",e[t][i].Top="0",e[t][i].Width="894",e[t][i].Height="32",e[t][i].Align="alTop",e[t][i].Alignment="taLeftJustify",e[t][i].AutoSize="False",e[t][i].BevelOuter="bvNone",e[t][i].Color="6766380",e[t][i].Font={},e[t][i].Font.Charset="ANSI_CHARSET",e[t][i].Font.Color="clWhite",e[t][i].Font.Height=null,e[t][i].Font.Size="10",e[t][i].Font.Name="'Segoe UI'",e[t][i].Font.Style="[fsBold]",e[t][i].ParentFont="False",e[t][i].TabOrder="2",e[t][i][n]={},e[t][i][n]._objectClass="TLabel",e[t][i][n].Left="40",e[t][i][n].Top="7",e[t][i][n].Width=`${((e[t].Caption.length-2)*10).toFixed()}`,e[t][i][n].Height="17",e[t][i][n].Align="alCustom",e[t][i][n].AutoSize="False",e[t][i][n].Caption=`${e[t].Caption}`,e[t][i][n].Font={},e[t][i][n].Font.Charset="ANSI_CHARSET",e[t][i][n].Font.Color="clWhite",e[t][i][n].Font.Height=null,e[t][i][n].Font.Size="10",e[t][i][n].Font.Name="'Segoe UI'",e[t][i][n].Font.Style="[fsBold]",e[t][i][n].ParentFont="False"}addButtons(e,d,t=""){for(let i in e)if(typeof e[i]=="object"&&e[i]!==null){if(!e[i]._objectClass)continue;this.addButtons(e[i],d,e._objectClass),String(e[i]._objectClass).includes("TSpeedButton")&&e._objectClass==="TPanel"&&(t===this.dfmForm?(e._order="Infinity",e.Align="alBottom"):e.Align="alTop",e.Height="39",e.BevelOuter="bvNone",e.Color="15132390",this.pasAddObject(d,"TPanel",`Panel${i}`),e[`Panel${i}`]={},e[`Panel${i}`]._objectClass="TPanel",e[`Panel${i}`].AutoSize="False",e[`Panel${i}`].Left="40",e[`Panel${i}`].Top="6",e[`Panel${i}`].Width=`${((String(e[i].Caption).length-2)*10+20).toFixed()}`,e[`Panel${i}`].Height="28",e[`Panel${i}`].BevelOuter="bvNone",e[`Panel${i}`].Color="clWhite",e[`Panel${i}`].Font={},e[`Panel${i}`].Font.Charset="ANSI_CHARSET",e[`Panel${i}`].Font.Color="clGray",e[`Panel${i}`].Font.Height=null,e[`Panel${i}`].Font.Size="10",e[`Panel${i}`].Font.Name="'Segoe UI'",e[`Panel${i}`].Font.Style="[fsBold]",e[`Panel${i}`].ParentFont="False",e[`Panel${i}`].TabStop="True",this.pasRemoveObject(d,e[i]._objectClass,i),this.pasAddObject(d,"TSpeedButton",i),e[`Panel${i}`][i]={},e[`Panel${i}`][i]=e[i],e[`Panel${i}`][i]._objectClass="TSpeedButton",e[`Panel${i}`][i].Left="-3",e[`Panel${i}`][i].Top="-3",e[`Panel${i}`][i].Width=`${((String(e[i].Caption).length-2)*10+25).toFixed()}`,e[`Panel${i}`][i].Height="32",e[`Panel${i}`][i].Caption=`${e[i].Caption}`,e[`Panel${i}`][i].Flat="True",e[`Panel${i}`][i].Font={},e[`Panel${i}`][i].Font.Charset="ANSI_CHARSET",e[`Panel${i}`][i].Font.Color=null,e[`Panel${i}`][i].Font.Height=null,e[`Panel${i}`][i].Font.Size="10",e[`Panel${i}`][i].Font.Name="'Segoe UI'",e[`Panel${i}`][i].Font.Style="[fsBold]",e[`Panel${i}`][i].ParentFont="False",e[`Panel${i}`][i].Glyph&&delete e[`Panel${i}`][i].Glyph,delete e[i])}}addTabsButtons(e,d){for(let t in e)if(typeof e[t]=="object"&&e[t]!==null){if(!e[t]._objectClass||(this.addTabsButtons(e[t],d),String(e[t]._objectClass)!=="TPageControl"))continue;let i=Object.keys(e[t]).filter(n=>e[t][n]._objectClass&&e[t][n]._objectClass==="TTabSheet").sort((n,E)=>(e[t][n].ImageIndex||0)-(e[t][E].ImageIndex||0));if(!i.length)continue;this.pasAddObject(d,"TPanel",`PnlTabs${t}`),e[`PnlTabs${t}`]={},e[`PnlTabs${t}`]._objectClass="TPanel",e[`PnlTabs${t}`].AutoSize="False",e[`PnlTabs${t}`].Align="alCustom",e[`PnlTabs${t}`].Top="0",e[`PnlTabs${t}`].Left="0",e[`PnlTabs${t}`].Height="30",e[`PnlTabs${t}`].Width="894",e[`PnlTabs${t}`].BevelOuter="bvNone",e[`PnlTabs${t}`].Color="clWhite",e[`PnlTabs${t}`].Font={},e[`PnlTabs${t}`].Font.Charset="ANSI_CHARSET",e[`PnlTabs${t}`].Font.Color="clWhite",e[`PnlTabs${t}`].Font.Height=null,e[`PnlTabs${t}`].Font.Size="10",e[`PnlTabs${t}`].Font.Name="'Segoe UI'",e[`PnlTabs${t}`].Font.Style="[fsBold]",e[`PnlTabs${t}`].ParentFont="False",e[`PnlTabs${t}`].TabStop="True",i.forEach((n,E)=>{this.pasAddObject(d,"TPanel",`Pnl${n}`),e[`PnlTabs${t}`][`Pnl${n}`]={},e[`PnlTabs${t}`][`Pnl${n}`]._objectClass="TPanel",e[`PnlTabs${t}`][`Pnl${n}`].AutoSize="False",e[`PnlTabs${t}`][`Pnl${n}`].Align="alLeft",e[`PnlTabs${t}`][`Pnl${n}`].Top="0",e[`PnlTabs${t}`][`Pnl${n}`].Left="0",e[`PnlTabs${t}`][`Pnl${n}`].Height="30",e[`PnlTabs${t}`][`Pnl${n}`].Width=`${((String(e[t][n].Caption).length-2)*7+5).toFixed()}`,e[`PnlTabs${t}`][`Pnl${n}`].BevelOuter="bvNone",e[`PnlTabs${t}`][`Pnl${n}`].BorderStyle="bsSingle",e[`PnlTabs${t}`][`Pnl${n}`].Color="clWhite",e[`PnlTabs${t}`][`Pnl${n}`].Font={},e[`PnlTabs${t}`][`Pnl${n}`].Font.Charset="ANSI_CHARSET",e[`PnlTabs${t}`][`Pnl${n}`].Font.Color="clWhite",e[`PnlTabs${t}`][`Pnl${n}`].Font.Height=null,e[`PnlTabs${t}`][`Pnl${n}`].Font.Size="10",e[`PnlTabs${t}`][`Pnl${n}`].Font.Name="'Segoe UI'",e[`PnlTabs${t}`][`Pnl${n}`].Font.Style="[fsBold]",e[`PnlTabs${t}`][`Pnl${n}`].ParentFont="False",e[`PnlTabs${t}`][`Pnl${n}`].TabStop="True",e[`PnlTabs${t}`][`Pnl${n}`].TabOrder=`${e[t][n].ImageIndex||0}`,this.pasAddObject(d,"TPanel",`PnlMarker${n}`),e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`]={},e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`]._objectClass="TPanel",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].AutoSize="False",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Align="alTop",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Top="0",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Left="0",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Height="3",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Width=null,e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].BevelOuter="bvNone",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Color="clWhite",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font={},e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Charset="ANSI_CHARSET",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Color="clWhite",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Height=null,e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Size="10",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Name="'Segoe UI'",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].Font.Style="[fsBold]",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].ParentFont="False",e[`PnlTabs${t}`][`Pnl${n}`][`PnlMarker${n}`].TabStop="False",this.pasAddObject(d,"TSpeedButton",`Btn${n}`),e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`]={},e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`]._objectClass="TSpeedButton",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Top="-3",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Left="-3",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Height="32",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Width=`${((String(e[t][n].Caption).length-2)*7+10).toFixed()}`,e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Caption=e[t][n].Caption,e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Flat="True",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font={},e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Charset="ANSI_CHARSET",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Color="6766380",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Height=null,e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Size="10",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Name="'Segoe UI'",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].Font.Style="[fsBold]",e[`PnlTabs${t}`][`Pnl${n}`][`Btn${n}`].ParentFont="False",this.pasAddMethod(d,"procedure",`Btn${n}Click`,"Sender: TObject",`${t}.ActivePageIndex := ${e[t][n].ImageIndex||0};

                PnlMarker${n}.color := $00673F2C; // azul
                ${i.filter(F=>F!==n).map(F=>`PnlMarker${F}.color := $00E6E6E6; //cinza`).join(`
`)}`);let l=F=>{let o=[];for(let a in F)F[a]._objectClass&&(F[a]._objectClass!=="TPageControl"&&(o=o.concat(l(F[a]))),F[a]._objectClass.includes("Grid")&&o.push(a));return o};l(e[t][n]).forEach(F=>{this.pasAddMethod(d,"procedure",`Btn${n}Click`,"Sender: TObject",`TDBGridPad(${F}).defaultRowHeight := 30;
                    TDBGridPad(${F}).clientHeight     := (30 * TDBGridPad(${F}).rowcount) + 30;`)})}),this.pasAddMethod(d,"procedure","FormShow","Sender: TObject",`
              ${t}.ActivePageIndex := 0;
              ${i.map((n,E)=>`${t}.pages[${E}].TabVisible := false;`).join(`
`)}
              Btn${i[0]}Click(Sender);
              `)}}semiAutoConversion(e){return M(this,null,function*(){yield this.semiAutoFieldsAndLabels(e),yield this.semiAutoButtons(e)})}semiAutoFieldsAndLabels(e){return M(this,null,function*(){let d=(r,F)=>Object.keys(r)?.filter(a=>r[a]._objectClass&&(i(r[a]._objectClass)&&i(F)||n(r[a]._objectClass)&&n(F)))?.map((a,s)=>s)||[0],t=()=>[{name:"col-12",value:810},{name:"col-6",value:400},{name:"col-4",value:263},{name:"col-3",value:195},{name:"col-2",value:126}],i=r=>["TLabel"].includes(r),n=r=>["TEdit","TMSEdit"].includes(r),E=r=>{let F=0,o=1;return F=0,o=1,Object.keys(r).filter(a=>r[a]._objectClass&&r[a]._order&&i(r[a]._objectClass)).sort((a,s)=>r[a]._order-r[s]._order).forEach((a,s)=>{F+Number(r[a].Width)+30>=910&&(o++,F=0),r[a].Top=((o-1)*50+10).toFixed(),r[a].Left=40+F,F+=Number(r[a].Width)+10}),F=0,o=1,Object.keys(r).filter(a=>r[a]._objectClass&&r[a]._order&&n(r[a]._objectClass)).sort((a,s)=>r[a]._order-r[s]._order).forEach((a,s)=>{F+Number(r[a].Width)+30>=910&&(o++,F=0),r[a].Top=((o-1)*50+27).toFixed(),r[a].Left=40+F,F+=Number(r[a].Width)+10}),r},l=(r,F=null,o=null)=>M(this,null,function*(){let a=Object.keys(r).filter(s=>r[s]._objectClass&&i(r[s]._objectClass)&&n(r[s]._objectClass));for(let s in r){if(!r[s]._objectClass||(yield l(r[s],s),!i(r[s]._objectClass)&&!n(r[s]._objectClass)||F==="PanelTitle"))continue;let T=document.querySelector("#parent-output"),A=document.querySelector("#class-output"),C=document.querySelector("#name-output"),D=document.querySelector("#caption-output"),c=document.querySelector("#order-input"),u=document.querySelector("#width-input"),R=document.querySelector("#ui-prev"),P=document.querySelector("#ui-next");if(!T||!A||!C||!D||!c||!u||!R||!P)break;T.innerHTML=F||"",A.innerHTML=r[s]._objectClass,C.innerHTML=s,D.innerHTML=r[s].Caption||"",c.innerHTML=d(r,r[s]._objectClass).map(B=>`<option value="${B}">${B}</option>`).join(`
`),u.innerHTML=t().map(B=>`<option value="${B.value}">${B.name}</option>`).join(`
`),u.value="400",c.focus();let p=yield new Promise((B,N)=>{P.addEventListener("click",function b(){P.removeEventListener("click",b),B("")})});r[s].Width=Number(u.value),r[s]._order=c.value,i(r[s]._objectClass)||(r[s].TabOrder=c.value),a.indexOf(s)===a.length-1&&E(r),T.innerHTML="",A.innerHTML="",C.innerHTML="",D.innerHTML="",c.value="-1",c.innerHTML='<option value="-1">-1</option>',u.value="-1",u.innerHTML='<option value="0">col-0</option>'}});yield l(e)})}semiAutoButtons(e){return M(this,null,function*(){let d=(l,r)=>Object.keys(l)?.filter(o=>l[o]._objectClass&&i(l[o])&&i(l[o]))?.map((o,a)=>a)||[0],t=l=>["TSpeedButton"].includes(l),i=l=>t(l[Object.keys(l).filter(r=>l[r]._objectClass)[0]]?._objectClass),n=l=>{let r=0,F=1;return r=0,F=1,Object.keys(l).filter(o=>l[o]._objectClass&&l[o]._order&&i(l[o])).sort((o,a)=>l[o]._order-l[a]._order).forEach((o,a)=>{r+Number(l[o].Width)+30>=910&&(F++,r=0),l[o].Top=((F-1)*28+6).toFixed(),l[o].Left=40+r,l[o]._order==="0"&&(l[o].Color="6766380",l[o].Font.Color="clWhite"),r+=Number(l[o].Width)+10}),l},E=(l,r,F)=>M(this,null,function*(){let o=Object.keys(l).filter(a=>l[a]._objectClass&&i(l[a]));for(let a in l){if(!l[a]._objectClass||(yield E(l[a],a),!i(l[a])))continue;let s=document.querySelector("#parent-output"),T=document.querySelector("#class-output"),A=document.querySelector("#name-output"),C=document.querySelector("#caption-output"),D=document.querySelector("#order-input"),c=document.querySelector("#width-input"),u=document.querySelector("#ui-prev"),R=document.querySelector("#ui-next");if(!s||!T||!A||!C||!D||!c||!u||!R)break;s.innerHTML=r||"",T.innerHTML=l[a]._objectClass,A.innerHTML=a,C.innerHTML=l[a].Caption||"",D.innerHTML=d(l,l[a]._objectClass).map(p=>`<option value="${p}">${p}</option>`).join(`
`),c.value="-1",c.innerHTML='<option value="0">col-0</option>',c.value="400",D.focus();let P=yield new Promise((p,B)=>{R.addEventListener("click",function N(){R.removeEventListener("click",N),p("")})});l[a]._order=D.value,l[a].TabOrder=D.value,o.indexOf(a)===o.length-1&&n(l),s.innerHTML="",T.innerHTML="",A.innerHTML="",C.innerHTML="",D.value="-1",D.innerHTML='<option value="-1">-1</option>',c.value="-1",c.innerHTML='<option value="0">col-0</option>'}});yield E(e)})}copyPasOutputToClipboard(){let e=document.querySelector("#pas-output");e&&this.copyToClipboard(e.value)}copyDfmOutputToClipboard(){let e=document.querySelector("#dfm-output");e&&this.copyToClipboard(e.value)}copyToClipboard(e){navigator.clipboard.writeText(e).then(d=>{}).catch(d=>{})}loading(e){let d=document.querySelector("#loading-container");d||(d=document.createElement("div"),d.id="loading-container",d.innerHTML='<span id="loader"></span>',document.body.appendChild(d)),e?d.style.display="":d.style.display="none"}defSettings(){if(!document)return;this.fastConversion=!1;let e=`
    unit UnitRomExped;

    interface

    uses
    Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
    Dialogs, DB, DBTables, Grids, DBGrids, StdCtrls, DBCtrls, MSDBDateEdit,
    MSButton, MSDBBtn, Buttons, Mask, MSFindInc, ExtCtrls, MSEditNum,
    MSFindIncZ, MSMemDataSet, MSDBGrid, MSDBFind, ComCtrls, DBSBtn;

    type
    TFRomExped = class(TForm)
        Panel1: TPanel;
        Label3: TLabel;
        Panel10: TPanel;
        Panel3: TPanel;
        BSair: TSpeedButton;
        BImprimir: TDBSpeedButton;
        BExcluir: TDBSpeedButton;
        BCancelar: TDBSpeedButton;
        BIncluir: TMSButton;
        Panel2: TPanel;
        Panel4: TPanel;
        Label5: TLabel;
        MSDBDateEdit4: TMSDBDateEdit;
        Label16: TLabel;
        MSDBDateEdit3: TMSDBDateEdit;
        Label9: TLabel;
        DBMemo1: TDBMemo;
        dsItensPed: TDataSource;
        dsRomaneio: TDataSource;
        TItensPedC: TTable;
        Edit1: TMSFindIncZ;
        QRomaneio: TQuery;
        QRomaneioEMPROM: TStringField;
        QRomaneioCODROM: TIntegerField;
        QRomaneioDATAROM: TDateTimeField;
        QRomaneioDATAEMBROM: TDateTimeField;
        QRomaneioOBSERVROM: TStringField;
        QRomaneioSTATUSROM: TIntegerField;
        QRomaneioDTSTATROM: TDateTimeField;
        Label1: TLabel;
        MSDBDateEdit1: TMSDBDateEdit;
        Label2: TLabel;
        ComboBox1: TComboBox;
        MItRomaneio: TMSMemDataSet;
        dsItRomaneio: TDataSource;
        MItRomaneioPEDIDOIROM: TIntegerField;
        MItRomaneioOBSERVIROM: TStringField;
        MItRomaneioNOMECLI: TStringField;
        MItRomaneioCIDADECLI: TStringField;
        MItRomaneioUFCLI: TStringField;
        MItRomaneioDTPED: TDateTimeField;
        MItRomaneioDTENTPED: TDateTimeField;
        MItRomaneioSEL: TBooleanField;
        MItRomaneioEMP: TStringField;
        TItensPedCCODPROITP: TStringField;
        TItensPedCNIVEL1ITP: TStringField;
        TItensPedCNIVEL2ITP: TStringField;
        TItensPedCNIVEL3ITP: TStringField;
        TItensPedCQTDADEITP: TFloatField;
        TItensPedCQTFATITP: TFloatField;
        TItensPedCPREUNIITP: TFloatField;
        TItensPedCDESCTOITP: TFloatField;
        TItensPedCICMSITP: TFloatField;
        TItensPedCIPIITP: TFloatField;
        TItensPedCPREMINITP: TFloatField;
        TItensPedCTOTITEMITP: TFloatField;
        TItensPedCEMPRESAITP: TStringField;
        TItensPedCPEDIDOITP: TIntegerField;
        TItensPedCemppad: TStringField;
        TItensPedCSTATUSITP: TIntegerField;
        TItensPedCdescripro: TStringField;
        TItensPedCdescnivel1: TStringField;
        TItensPedCdescnivel2: TStringField;
        TItensPedCdescnivel3: TStringField;
        DBText1: TDBText;
        MItRomaneioCODREPPED: TIntegerField;
        MItRomaneioCODPEDREP: TStringField;
        Label4: TLabel;
        DBEdit2: TDBEdit;
        QRomaneioMOTORISTAROM: TIntegerField;
        QRomaneioNOMEMOTORISROM: TStringField;
        QRomaneioVEICULOROM: TIntegerField;
        Label6: TLabel;
        DBEdit1: TDBEdit;
        QRomaneioDESCVEICROM: TStringField;
        DBEdit28: TMSDBFind;
        MSDBFind1: TMSDBFind;
        TItensPedCQTDEMBEXPITP: TFloatField;
        TItensPedCCODITEOPITP: TIntegerField;
        TItensPedCITENITP: TIntegerField;
        MSButton1: TMSButton;
        MItRomaneioITENITPIROM: TIntegerField;
        QryAux: TQuery;
        StringField1: TStringField;
        IntegerField1: TIntegerField;
        DateTimeField1: TDateTimeField;
        DateTimeField2: TDateTimeField;
        StringField2: TStringField;
        IntegerField2: TIntegerField;
        DateTimeField3: TDateTimeField;
        IntegerField3: TIntegerField;
        StringField3: TStringField;
        IntegerField4: TIntegerField;
        StringField4: TStringField;
        PageControl1: TPageControl;
        TabSheet1: TTabSheet;
        Panel5: TPanel;
        MSButton2: TMSButton;
        MSButton4: TMSButton;
        MSButton3: TMSButton;
        MSDBGrid1: TMSDBGrid;
        DBGrid1: TDBGrid;
        Splitter2: TSplitter;
        TabSheet2: TTabSheet;
        DBGrid2: TDBGrid;
        TIRomCarga: TTable;
        dsIRomCar: TDataSource;
        TIRomCargaEMPIRC: TStringField;
        TIRomCargaCODIRC: TIntegerField;
        TIRomCargaITEMIRC: TIntegerField;
        TIRomCargaDESCRICAOIRC: TStringField;
        TIRomCargaQTDADEIRC: TFloatField;
        TIRomCargaUNIDIRC: TIntegerField;
        TIRomCargaCLIENTEIRC: TIntegerField;
        TIRomCargaOBSERVACAOIRC: TStringField;
        TIRomCargadescunidade: TStringField;
        TIRomCargadesccliente: TStringField;
        TIRomCargaCODPROIRC: TStringField;
        Label7: TLabel;
        MSDBFind2: TMSDBFind;
        dsMonitor: TDataSource;
        QRomaneioMONITORROM: TIntegerField;
        TIRomCargaMONITORIRC: TIntegerField;
        TIRomCargaDATAEMBIRC: TDateTimeField;
        TIRomCargaMOTORISTAIRC: TIntegerField;
        TIRomCargadescmotora: TStringField;
        TIRomCargaSITUACAOIRC: TStringField;
        DBSpeedButton1: TDBSpeedButton;
        QryCons: TQuery;
        procedure Edit1Enter(Sender: TObject);
        procedure Edit1Exit(Sender: TObject);
        procedure dsRomaneioStateChange(Sender: TObject);
        procedure BIncluirClick(Sender: TObject);
        procedure QRomaneioNewRecord(DataSet: TDataSet);
        procedure QRomaneioAfterEdit(DataSet: TDataSet);
        procedure QRomaneioBeforePost(DataSet: TDataSet);
        procedure QRomaneioBeforeDelete(DataSet: TDataSet);
        procedure BSairClick(Sender: TObject);
        procedure BCancelarClick(Sender: TObject);
        procedure TIRomaneioPEDIDOIROMValidate(Sender: TField);
        procedure FormShow(Sender: TObject);
        procedure BImprimirClick(Sender: TObject);
        procedure TItensPedCCalcFields(DataSet: TDataSet);
        procedure BExcluirClick(Sender: TObject);
        procedure DBMemo1Exit(Sender: TObject);
        procedure MSDBFind1Exit(Sender: TObject);
        procedure DBEdit28Exit(Sender: TObject);
        procedure MItRomaneioAfterPost(DataSet: TDataSet);
        procedure TItensPedCQTDEMBEXPITPValidate(Sender: TField);
        procedure DBGrid1KeyDown(Sender: TObject; var Key: Word;
          Shift: TShiftState);
        procedure MSButton1Click(Sender: TObject);
        procedure MSButton2Click(Sender: TObject);
        procedure TItensPedCBeforeInsert(DataSet: TDataSet);
        procedure MSButton4Click(Sender: TObject);
        procedure MSButton3Click(Sender: TObject);
        procedure TIRomCargaBeforePost(DataSet: TDataSet);
        procedure DBGrid2KeyDown(Sender: TObject; var Key: Word;
          Shift: TShiftState);
        procedure TIRomCargaCalcFields(DataSet: TDataSet);
        procedure DBGrid2Enter(Sender: TObject);
        procedure MSDBDateEdit1Exit(Sender: TObject);
        procedure TIRomCargaCODPROIRCValidate(Sender: TField);
        procedure TIRomCargaNewRecord(DataSet: TDataSet);
        procedure TIRomCargaSITUACAOIRCGetText(Sender: TField;
          var Text: String; DisplayText: Boolean);
        procedure DBSpeedButton1Click(Sender: TObject);
    private
        { Private declarations }
    public
        { Public declarations }
    end;

    var
    FRomExped: TFRomExped;
    Statusant : Integer;
    bVolta : boolean;

    implementation

    uses UnitDMCom, UnitDMFat, UnitDataModulo, UnitDMRec, UnitMenu,
    UnitProcFunc, UnitRelRomaneio, UnitPlanoMestreProducao,
    UnitRomAdicPed, UnitPedProduz, Math, UnitDMPcp, UnitRelExpEtiq;

    {$R *.dfm}

    procedure TFRomExped.Edit1Enter(Sender: TObject);
    begin
    BIncluir.Enabled := False;
    TIRomCarga.Close;
    end;

    procedure TFRomExped.Edit1Exit(Sender: TObject);
    var
    QryPesq : TQuery;
    begin
    QryPesq := TQuery.Create(Self);
    QryPesq.DatabaseName := FMenu.BDPD.DatabaseName;
    if Trim(Edit1.Text) = '' then
    begin
        MessageDlg('Campo com preenchimento obrigat\xF3rio.', mtWarning, [mbOk], 0);
        Edit1.SetFocus;
        Abort;
    end;
    if (Edit1.AsInteger = 0) then
    begin
        QRomaneio.Append;
        QRomaneioSTATUSROM.Value := 0;
        QRomaneioDTSTATROM.Value := Date;
        combobox1.ItemIndex := 0;
    end
    else
    begin
        QRomaneio.Close;
        QRomaneio.Params[0].Value := vempativa;
        QRomaneio.Params[1].Value := Edit1.AsInteger;
        QRomaneio.Open;
        if not(QRomaneio.Eof) then
        begin
          if MessageDlg('Confirma altera\xE7\xE3o deste registro?', mtConfirmation, [mbYes,mbNo], 0)= mrYes then
              QRomaneio.Edit
          else
          begin
          Edit1.SetFocus;
          MItRomaneio.EmptyTable;
          Exit;
          end;
        end
        else
          begin
          Edit1.SetFocus;
          MItRomaneio.EmptyTable;
          Exit;
        end;
    end;

    if QRomaneio.State = dsEdit then
    begin
        // Seleciona os Itens do Romaneio j\xE1 cadastrados ...
        QryPesq.Close;
        QryPesq.SQL.Clear;
        QryPesq.SQL.Add('Select pedidoped, itenitp, codrepped, codpedrepped, razsoccli, cidadecli, ufcli, ');
        QryPesq.SQL.Add('dataped, dtentped, observirom from iromaneio');
        QryPesq.SQL.Add('left join pedido on');
        QryPesq.SQL.Add('empresaped = empirom and pedidoped = pedidoirom');
        QryPesq.SQL.Add('left join itensped on');
        QryPesq.SQL.Add('empresaitp = empresaped and pedidoitp = pedidoped and (itenitp = itenitpirom or itenitpirom is null)');
        QryPesq.SQL.Add('left join clientes on');
        QryPesq.SQL.Add('empcli =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codcli = codcliped');
        QryPesq.SQL.Add('left join repres on');
        QryPesq.SQL.Add('emprep =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codrep = codrepped');
        QryPesq.SQL.Add('where empirom =' + QuotedStr(vEmpAtiva));
        QryPesq.SQL.Add('and codirom =' + QuotedStr(Edit1.Text));
        QryPesq.SQL.Add('Order by pedidoirom, ufcli, cidadecli, dtentped');
        QryPesq.Open;
        MItRomaneio.EmptyTable;
        while not(QryPesq.Eof) do
        begin
          MItRomaneio.Append;
          MItRomaneioSEL.AsBoolean         := True;
          MItRomaneioPEDIDOIROM.AsInteger  := QryPesq.FieldByName('pedidoped').AsInteger;
          MItRomaneioITENITPIROM.AsInteger := QryPesq.FieldByName('itenitp').AsInteger;
          MItRomaneioNOMECLI.AsString      := QryPesq.FieldByName('razsoccli').AsString;
          MItRomaneioCODREPPED.AsInteger   := QryPesq.FieldByName('codrepped').AsInteger;
          MItRomaneioCODPEDREP.AsString    := QryPesq.FieldByName('codpedrepped').AsString;
          MItRomaneioCIDADECLI.AsString    := QryPesq.FieldByName('cidadecli').AsString;
          MItRomaneioUFCLI.AsString        := QryPesq.FieldByName('ufcli').AsString;
          MItRomaneioDTPED.AsDateTime      := QryPesq.FieldByName('dataped').AsDateTime;
          MItRomaneioDTENTPED.AsDateTime   := QryPesq.FieldByName('dtentped').AsDateTime;
          MItRomaneioOBSERVIROM.AsString   := QryPesq.FieldByName('observirom').AsString;
          MItRomaneioEMP.AsString          := vEmpAtiva;
          MItRomaneio.Post;
          QryPesq.Next;
        end;

        // Seleciona os Itens do Romaneio n\xE3o cadastrados ...
    {    QryPesq.Close;
        QryPesq.SQL.Clear;
        QryPesq.SQL.Add('Select distinct pedidoped, codrepped, codpedrepped, razsoccli, cidadecli, ufcli, ');
        QryPesq.SQL.Add('dataped, dtentped from pedido ped');
        QryPesq.SQL.Add('left join itensped on');
        QryPesq.SQL.Add('(empresaitp=empresaped and pedidoitp = pedidoped)');
        QryPesq.SQL.Add('left join clientes on');
        QryPesq.SQL.Add('(empcli =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codcli = codcliped)');
        QryPesq.SQL.Add('left join repres on');
        QryPesq.SQL.Add('(emprep =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codrep = codrepped)');
        QryPesq.SQL.Add('where empresaped =' + QuotedStr(vEmpAtiva));
        QryPesq.SQL.Add('and (not exists (select * from iromaneio');
        QryPesq.SQL.Add('where empirom = ped.empresaped');
        QryPesq.SQL.Add('and   pedidoirom = ped.pedidoped))');
        QryPesq.SQL.Add('and statusitp in (1,2,10)');
        QryPesq.SQL.Add('Order by pedidoped, ufcli, cidadecli, dtentped');
        QryPesq.Open;
        while not(QryPesq.Eof) do
        begin
          MItRomaneio.Append;
          MItRomaneioSEL.AsBoolean        := False;
          MItRomaneioPEDIDOIROM.AsInteger := QryPesq.FieldByName('pedidoped').AsInteger;
          MItRomaneioNOMECLI.AsString     := QryPesq.FieldByName('razsoccli').AsString;
          MItRomaneioCODREPPED.AsInteger  := QryPesq.FieldByName('codrepped').AsInteger;
          MItRomaneioCODPEDREP.AsString   := QryPesq.FieldByName('codpedrepped').AsString;
          MItRomaneioCIDADECLI.AsString   := QryPesq.FieldByName('cidadecli').AsString;
          MItRomaneioUFCLI.AsString       := QryPesq.FieldByName('ufcli').AsString;
          MItRomaneioDTPED.AsDateTime     := QryPesq.FieldByName('dataped').AsDateTime;
          MItRomaneioDTENTPED.AsDateTime  := QryPesq.FieldByName('dtentped').AsDateTime;
          MItRomaneioOBSERVIROM.AsString  := '';
          MItRomaneioEMP.AsString         := vEmpAtiva;
          MItRomaneio.Post;
          QryPesq.Next;
        end;
        MItRomaneio.First;
        MSDBDateEdit4.SetFocus;  }
    end;
    {  else
    begin
        // Seleciona os Itens do Romaneio n\xE3o cadastrados ...
        QryPesq.Close;
        QryPesq.SQL.Clear;
        QryPesq.SQL.Add('Select distinct pedidoped, codrepped, codpedrepped, razsoccli, cidadecli, ufcli, ');
        QryPesq.SQL.Add('dataped, dtentped from pedido ped');
        QryPesq.SQL.Add('left join itensped on');
        QryPesq.SQL.Add('(empresaitp=empresaped and pedidoitp = pedidoped)');
        QryPesq.SQL.Add('left join clientes on');
        QryPesq.SQL.Add('(empcli =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codcli = codcliped)');
        QryPesq.SQL.Add('left join repres on');
        QryPesq.SQL.Add('(emprep =' + QuotedStr(vEmpresa));
        QryPesq.SQL.Add('and codrep = codrepped)');
        QryPesq.SQL.Add('where empresaped =' + QuotedStr(vEmpAtiva));
        QryPesq.SQL.Add('and (not exists (select * from iromaneio');
        QryPesq.SQL.Add('where empirom = ped.empresaped');
        QryPesq.SQL.Add('and   pedidoirom = ped.pedidoped))');
        QryPesq.SQL.Add('and statusitp in (1,2,10)');
        QryPesq.SQL.Add('Order by pedidoped, ufcli, cidadecli, dtentped');
        QryPesq.Open;
        MItRomaneio.EmptyTable;
        while not(QryPesq.Eof) do
        begin
          MItRomaneio.Append;
          MItRomaneioSEL.AsBoolean        := False;
          MItRomaneioPEDIDOIROM.AsInteger := QryPesq.FieldByName('pedidoped').AsInteger;
          MItRomaneioNOMECLI.AsString     := QryPesq.FieldByName('razsoccli').AsString;
          MItRomaneioCODREPPED.AsInteger  := QryPesq.FieldByName('codrepped').AsInteger;
          MItRomaneioCODPEDREP.AsString   := QryPesq.FieldByName('codpedrepped').AsString;
          MItRomaneioCIDADECLI.AsString   := QryPesq.FieldByName('cidadecli').AsString;
          MItRomaneioUFCLI.AsString       := QryPesq.FieldByName('ufcli').AsString;
          MItRomaneioDTPED.AsDateTime     := QryPesq.FieldByName('dataped').AsDateTime;
          MItRomaneioDTENTPED.AsDateTime  := QryPesq.FieldByName('dtentped').AsDateTime;
          MItRomaneioOBSERVIROM.AsString  := '';
          MItRomaneioEMP.AsString         := vEmpAtiva;
          MItRomaneio.Post;
          QryPesq.Next;
        end;
        MItRomaneio.First;
    end;}
    MSDBDateEdit4.SetFocus;
    QryPesq.Free;
    TIRomCarga.Open;
    end;

    procedure TFRomExped.dsRomaneioStateChange(Sender: TObject);
    begin
    BCancelar.Enabled := dsRomaneio.state in [dsEdit, dsInsert];
    if DSRomaneio.state = dsEdit then
    begin
        BIncluir.Caption    := '&Alterar';
        BIncluir.Enabled    := True;
        statusant           := QRomaneioSTATUSROM.AsInteger;
        ComboBox1.ItemIndex := QRomaneioSTATUSROM.AsInteger;
        combobox1.Refresh;
    end;
    if DSRomaneio.state = dsInsert then
    begin
        BIncluir.Caption := '&Incluir';
        BIncluir.Enabled := True;
    end;

    end;

    procedure TFRomExped.BIncluirClick(Sender: TObject);
    var
    QryExclui, QryInc : TQuery;
    bExped : Boolean;
    begin
    bExped := False;

    QryExclui := TQuery.Create(Self);
    QryExclui.DatabaseName := FMenu.BDPD.DatabaseName;

    QryInc := TQuery.Create(Self);
    QryInc.DatabaseName := FMenu.BDPD.DatabaseName;

    if DM.TEmpresaTPTELAROMANEMP.AsString = '1' then
    begin
          MItRomaneio.First;
          while not(MItRomaneio.Eof) do
          begin
          if (MItRomaneioSEL.AsBoolean) then
          begin
              bExped := True;
          end;
          MItRomaneio.Next;
          end;

          if not bExped then
          begin
              Showmessage('N\xE0o h\xE1 pedidos selecionados.');
              Edit1.SetFocus;
              Exit;
          end;

          QryExclui.Close;
          QryExclui.SQL.Clear;
          QryExclui.SQL.Add('Delete from iromaneio');
          QryExclui.SQL.Add('where empirom =' + QuotedStr(vEmpAtiva));
          QryExclui.SQL.Add('and codirom   =' + QuotedStr(Edit1.Text));
          QryExclui.ExecSQL;
    end;

    {
    QryInc.Close;
    QryInc.SQL.Clear;
    QryInc.SQL.Add('select max(codrom) codigo from romaneio');
    QryInc.SQL.Add('where emprom =' + QuotedStr(vEmpAtiva));
    QryInc.Open;

    Edit1.Text := QryInc.fieldbyname('codigo').asstring;
    }

    if QRomaneio.State = dsBrowse then
    begin
        QRomaneio.Edit;
    end;

    QRomaneioSTATUSROM.Value    := ComboBox1.ItemIndex;
    QRomaneioOBSERVROM.AsString := DBMemo1.Text;
    QRomaneio.Post;

    QRomaneio.Close;
    QRomaneio.Params[0].Value := vempativa;
    QRomaneio.Params[1].Value := Edit1.AsInteger;
    QRomaneio.Open;

    MItRomaneio.First;
    while not(MItRomaneio.Eof) do
    begin
        if (MItRomaneioSEL.AsBoolean) then
        begin
          try
          DmCom.TIRomaneio.Append;
          DmCom.TIRomaneioEMPIROM.AsString      := vEmpAtiva;
          DmCom.TIRomaneioCODIROM.AsInteger     := Edit1.AsInteger;
          DmCom.TIRomaneioPEDIDOIROM.AsInteger  := MItRomaneioPEDIDOIROM.AsInteger;
          DmCom.TIRomaneioITENITPIROM.AsInteger := MItRomaneioITENITPIROM.AsInteger;
          DmCom.TIRomaneioOBSERVIROM.AsString   := MItRomaneioOBSERVIROM.AsString;
          DmCom.TIRomaneio.Post;
        except
        end; 
        end;
        MItRomaneio.Next;
    end;

    Try
        FMenu.BDPD.StartTransaction;
        FMenu.BDPD.Commit;
    except
        FMenu.BDPD.rollback;
    end;

    if bVolta then
        Edit1.SetFocus;
        
    QryExclui.Free;
    end;

    procedure TFRomExped.QRomaneioNewRecord(DataSet: TDataSet);
    begin
    QRomaneioEMPROM.AsString := VEmpativa;
    QRomaneioDTSTATROM.Value := date;
    QRomaneioSTATUSROM.Value := 1;
    end;

    procedure TFRomExped.QRomaneioAfterEdit(DataSet: TDataSet);
    begin
    GravaAcesso('Romaneio ', QRomaneio, 1);
    end;

    procedure TFRomExped.QRomaneioBeforePost(DataSet: TDataSet);
    begin
    GeraCodigoChave(['CODROM','EMPROM'],[],'Romaneio',QRomaneio);
    GravaAcesso('Romaneio ', QRomaneio, 0);
    edit1.Text := QRomaneioCODROM.AsString;
    end;

    procedure TFRomExped.QRomaneioBeforeDelete(DataSet: TDataSet);
    var
    QryExclui : TQuery;
    begin
    QryExclui := TQuery.Create(Self);
    QryExclui.DatabaseName := FMenu.BDPD.DatabaseName;
    QryExclui.Close;
    QryExclui.SQL.Clear;
    QryExclui.SQL.Add('Delete from iromaneio');
    QryExclui.SQL.Add('where empirom =' + QuotedStr(vEmpAtiva));
    QryExclui.SQL.Add('and codirom   =' + QuotedStr(Edit1.Text));
    QryExclui.ExecSQL;
    try
        FMenu.BDPD.StartTransaction;
        FMenu.BDPD.Commit;
    except
        FMenu.BDPD.rollback;
    end;
    QryExclui.Free;
    GravaAcesso('Romaneio ', QRomaneio, 2);
    end;

    procedure TFRomExped.BSairClick(Sender: TObject);
    begin
    self.close;
    end;

    procedure TFRomExped.BCancelarClick(Sender: TObject);
    begin
    edit1.SetFocus;
    MItRomaneio.EmptyTable;
    end;

    procedure TFRomExped.TIRomaneioPEDIDOIROMValidate(Sender: TField);
    begin
    if not DMFat.TPedido.FindKey([VEMPATIVA,Sender.AsInteger]) then
    begin
        MessageDlg('Pedido N\xE3o Cadastrado',mterror,[mbok],0);
        Abort;
    end;
    end;

    procedure TFRomExped.FormShow(Sender: TObject);
    begin
        TItensPedC.Active := true;

        If DM.TEmpresaTPTELAROMANEMP.AsString = '2' then
        begin
          TabSheet1.TabVisible := false;
          TabSheet2.TabVisible := true;
        end
        else
        begin
          TabSheet1.TabVisible := true;
          TabSheet2.TabVisible := false;
        end;

        TIRomCarga.Open;
        bVolta := True;
        
        edit1.SetFocus;
    end;

    procedure TFRomExped.BImprimirClick(Sender: TObject);
    begin
    try
        FRelRomaneio := TFRelRomaneio.Create(Self);
        FRelRomaneio.MSEditSel2.Text := BuscaTroca(Edit1.Text, ['.'], '');
        FRelRomaneio.ShowMODAL;
    finally
        FRelRomaneio.Free;
    end;
    end;

    procedure TFRomExped.TItensPedCCalcFields(DataSet: TDataSet);
    begin
    if DMCOm.TProduto.FindKey([vempresa,TItensPedCCODPROITP.Value]) then
        TItensPedCdescripro.Value := DMCOm.TProdutoDESCRIPRO.Value;

    QryCons.Close;
    QryCons.SQL.Clear;
    QryCons.SQL.Add('select * from itnivpro');
    QryCons.SQL.Add('where empinp = :emp and');
    QryCons.SQL.Add('codnivinp = :codniv and');
    QryCons.SQL.Add('codinp = :cod');
    QryCons.ParamByName('emp').AsString     := vEmpresa;
    QryCons.ParamByName('codniv').AsInteger := DMCom.TProdutoNIVEL1PRO.AsInteger;
    QryCons.ParamByName('cod').AsString     := TItensPedCNIVEL1ITP.AsString;
    QryCons.Open;
    TItensPedCdescnivel1.AsString := QryCons.FieldByName('descinp').AsString;

    QryCons.Close;
    QryCons.SQL.Clear;
    QryCons.SQL.Add('select * from itnivpro');
    QryCons.SQL.Add('where empinp = :emp and');
    QryCons.SQL.Add('codnivinp = :codniv and');
    QryCons.SQL.Add('codinp = :cod');
    QryCons.ParamByName('emp').AsString     := vEmpresa;
    QryCons.ParamByName('codniv').AsInteger := DMCom.TProdutoNIVEL2PRO.AsInteger;
    QryCons.ParamByName('cod').AsString     := TItensPedCNIVEL2ITP.AsString;
    QryCons.Open;
    TItensPedCdescnivel2.AsString := QryCons.FieldByName('descinp').AsString;

    QryCons.Close;
    QryCons.SQL.Clear;
    QryCons.SQL.Add('select * from itnivpro');
    QryCons.SQL.Add('where empinp = :emp and');
    QryCons.SQL.Add('codnivinp = :codniv and');
    QryCons.SQL.Add('codinp = :cod');
    QryCons.ParamByName('emp').AsString     := vEmpresa;
    QryCons.ParamByName('codniv').AsInteger := DMCom.TProdutoNIVEL3PRO.AsInteger;
    QryCons.ParamByName('cod').AsString     := TItensPedCNIVEL3ITP.AsString;
    QryCons.Open;
    TItensPedCdescnivel3.AsString := QryCons.FieldByName('descinp').AsString;
    end;

    procedure TFRomExped.BExcluirClick(Sender: TObject);
    begin
    MItRomaneio.EmptyTable;
    end;

    procedure TFRomExped.DBMemo1Exit(Sender: TObject);
    begin
    DBMemo1.Text := Trim(DBMemo1.Text);
    end;

    procedure TFRomExped.MSDBFind1Exit(Sender: TObject);
    begin
        if QRomaneioVEICULOROM.AsString <> '' then
        begin
          if DMCom.TVeiculos.FindKey([VEmpAtiva, QRomaneioVEICULOROM.AsInteger]) then
              QRomaneioDESCVEICROM.AsString := DMCom.TVeiculosDESCRICAOVEI.AsString;
        end;
    end;

    procedure TFRomExped.DBEdit28Exit(Sender: TObject);
    begin
        if QRomaneioMOTORISTAROM.AsString <> '' then
        begin
          if DM.TFuncion.FindKey([VEmpAtiva, QRomaneioMOTORISTAROM.AsInteger]) then
              QRomaneioNOMEMOTORISROM.AsString := DM.TFuncionNOMEFUN.AsString;
        end;
    end;

    procedure TFRomExped.MItRomaneioAfterPost(DataSet: TDataSet);
    begin
    {   if MItRomaneioSEL.Value then
        begin
          TItensPedC.First;

          While not TItensPedC.Eof do
          begin
              if TItensPedCQTDEMBEXPITP.Value = 0 then
              begin
                    TItensPedC.Edit;
                    TItensPedCQTDEMBEXPITP.Value := TItensPedCQTDADEITP.Value;
                    if TItensPedCCODITEOPITP.value = 0 then
                      TItensPedCCODITEOPITP.value := TItensPedCITENITP.value;
                    TItensPedC.Post;
              end;

              TItensPedC.Next;
          end;

          TItensPedC.First;
        end;  }
    end;

    procedure TFRomExped.TItensPedCQTDEMBEXPITPValidate(Sender: TField);
    begin
    { if TItensPedCQTDEMBEXPITP.Value > TItensPedCQTDADEITP.value then
        begin
          Showmessage('Quantidade a ser expedida deve ser menor ou igual a quantidade do pedido.');
          Abort;
        end; }
    end;

    procedure TFRomExped.DBGrid1KeyDown(Sender: TObject; var Key: Word;
    Shift: TShiftState);
    begin
    {   if key = 13 then
        begin
          if DBGrid1.SelectedField.FieldName = 'QTDEMBEXPITP' then
          begin
              if TItensPedC.State = dsEdit then
                TItensPedC.Post;
          end;
        end;

        if key > 0 then
        begin
          if DBGrid1.SelectedField.FieldName = 'QTDEMBEXPITP' then
          begin
              TItensPedC.ReadOnly := False;
              if TItensPedC.State = dsBrowse then
                TItensPedC.Edit;
          end;
        end;    }
    end;

    procedure TFRomExped.MSButton1Click(Sender: TObject);
    begin
        FItemPedProduz := TFItemPedProduz.Create(self);
        iPed := TItensPedCPEDIDOITP.Value;
        iITp := TItensPedCITENITP.Value;
        FItemPedProduz.ShowModal;
        FItemPedProduz.Free;
    end;

    procedure TFRomExped.MSButton2Click(Sender: TObject);
    begin
        FAdicPedRom := TFAdicPedrom.create(self);
        FAdicPedrom.showmodal;

        if bSaiAdic then
        begin
          FAdicPedrom.MItRomaneio.First;

          if not FAdicPedrom.MItRomaneio.eof then
          begin
              While not FAdicPedrom.MItRomaneio.eof do
              begin
                if not FAdicPedrom.MItRomaneioSEL.AsBoolean then
                begin
                    FAdicPedrom.MItRomaneio.Next;
                    Continue;
                end;
                
                MItRomaneio.Append;
                MItRomaneioSEL.AsBoolean        := True;
                MItRomaneioPEDIDOIROM.AsInteger := FAdicPedrom.MItRomaneioPEDIDOIROM.AsInteger;
                MItRomaneioITENITPIROM.AsInteger:= FAdicPedrom.MItRomaneioITENITPIROM.AsInteger;
                MItRomaneioNOMECLI.AsString     := FAdicPedrom.MItRomaneioNOMECLI.AsString ;
                MItRomaneioCODREPPED.AsInteger  := FAdicPedrom.MItRomaneioCODREPPED.AsInteger ;
                MItRomaneioCODPEDREP.AsString   := FAdicPedrom.MItRomaneioCODPEDREP.AsString;
                MItRomaneioCIDADECLI.AsString   := FAdicPedrom.MItRomaneioCIDADECLI.AsString;
                MItRomaneioUFCLI.AsString       := FAdicPedrom.MItRomaneioUFCLI.AsString;
                MItRomaneioDTPED.AsDateTime     := FAdicPedrom.MItRomaneioDTPED.AsDateTime;
                MItRomaneioDTENTPED.AsDateTime  := FAdicPedrom.MItRomaneioDTENTPED.AsDateTime;
                MItRomaneioOBSERVIROM.AsString  := FAdicPedrom.MItRomaneioOBSERVIROM.AsString;
                MItRomaneioEMP.AsString         := FAdicPedrom.MItRomaneioEMP.AsString;
                MItRomaneio.Post;

                FAdicPedrom.MItRomaneio.Next;
              end;
          end;
        end;
        FAdicPedrom.free;
    end;

    procedure TFRomExped.TItensPedCBeforeInsert(DataSet: TDataSet);
    begin
        Abort;
    end;

    procedure TFRomExped.MSButton4Click(Sender: TObject);
    begin
        Showmessage('Aten\xE7\xE3o !!! - Todos os pedidos selecionados ser\xE3o retirados deste romaneio.');

        if MessageDlg('Deseja retirar pedidos selecionados.', mtConfirmation, [mbYes,mbNo],0)=mrNo then
        begin
          MSDBGrid1.SetFocus;
          Exit;
        end;

        MItRomaneio.DisableControls;
        MItRomaneio.First;

        While not MItRomaneio.eof do
        begin
          if not MItRomaneioSEL.Value then
          begin
              MItRomaneio.next;
              Continue;
          end;

          QryAux.Close;
          QryAux.SQL.Clear;
          QryAux.SQL.Add('Delete from iromaneio');
          QryAux.SQL.Add('where empirom =' + QuotedStr(MItRomaneioEMP.Value));
          QryAux.SQL.Add('and codirom   =' + QuotedStr(Edit1.Text));
          QryAux.SQL.Add('and pedidoirom   =' + QuotedStr(MItRomaneioPEDIDOIROM.asstring));
          QryAux.ExecSQL;

          MItRomaneio.Delete;
        end;

        MItRomaneio.First;

        While not MItRomaneio.eof do
        begin
          MItRomaneio.Edit;
          MItRomaneioSEL.Value := True;
          MItRomaneio.Post;

          MItRomaneio.next;
        end;

        MItRomaneio.First;
        MItRomaneio.EnableControls;
    end;

    procedure TFRomExped.MSButton3Click(Sender: TObject);
    begin
        FMenu.ConsIRom.Executa;
    end;

    procedure TFRomExped.TIRomCargaBeforePost(DataSet: TDataSet);
    begin
        GeraCodigoChave(['ITEMIRC','CODIRC','EMPIRC'], [], 'IROMANCARGA',TIRomCarga);

        TIRomCargaEMPIRC.AsString    := vempativa;
        TIRomCargaCODIRC.AsString    := BuscaTroca(Edit1.Text,['.'],'');
    end;

    procedure TFRomExped.DBGrid2KeyDown(Sender: TObject; var Key: Word;
    Shift: TShiftState);
    begin
    if DBGrid2.SelectedField.FieldName = 'UNIDIRC' then
    begin
        if (Key = vk_F4) and (Shift = []) then
        begin
          FMenu.ConsUnidade.Executa;
          if TIRomCarga.State = dsBrowse then
          begin
              if TIRomCarga.RecNo = 0 then
                TIRomCarga.Append;
              if TIRomCarga.RecNo > 0 then
                TIRomCarga.Edit;
          end;
          if FMenu.ConsUnidade.ResultCons.Text <> '' then
              TIRomCargaUNIDIRC.AsString := FMenu.ConsUnidade.ResultCons[0];
        end;
    end;

    if DBGrid2.SelectedField.FieldName = 'MOTORISTAIRC' then
    begin
        if (Key = vk_F4) and (Shift = []) then
        begin
          FMenu.ConsFuncion.Executa;
          if TIRomCarga.State = dsBrowse then
          begin
              if TIRomCarga.RecNo = 0 then
                TIRomCarga.Append;
              if TIRomCarga.RecNo > 0 then
                TIRomCarga.Edit;
          end;
          if FMenu.ConsFuncion.ResultCons.Text <> '' then
              TIRomCargaMOTORISTAIRC.AsString := FMenu.ConsUnidade.ResultCons[0];
        end;
    end;

    if DBGrid2.SelectedField.FieldName = 'MONITORIRC' then
    begin
        if (Key = vk_F4) and (Shift = []) then
        begin
          FMenu.ConsParMonitor.Executa;
          if TIRomCarga.State = dsBrowse then
          begin
              if TIRomCarga.RecNo = 0 then
                TIRomCarga.Append;
              if TIRomCarga.RecNo > 0 then
                TIRomCarga.Edit;
          end;
          if FMenu.ConsParMonitor.ResultCons.Text <> '' then
              TIRomCargaMONITORIRC.AsString := FMenu.ConsUnidade.ResultCons[0];
        end;
    end;

    if DBGrid2.SelectedField.FieldName = 'CODPROIRC' then
    begin
        if (Key = vk_F4) and (Shift = []) then
        begin
          FMenu.ConsProduto.Executa;
          if TIRomCarga.State = dsBrowse then
          begin
              if TIRomCarga.RecNo = 0 then
                TIRomCarga.Append;
              if TIRomCarga.RecNo > 0 then
                TIRomCarga.Edit;
          end;
          if FMenu.ConsProduto.ResultCons.Text <> '' then
          begin
              TIRomCargaCODPROIRC.AsString := FMenu.ConsProduto.ResultCons[0];
          end;
        end;
    end;

    if DBGrid2.SelectedField.FieldName = 'CLIENTEIRC' then
    begin
        if (Key = vk_F4) and (Shift = []) then
        begin
          FMenu.ConsCli.Executa;
          if TIRomCarga.State = dsBrowse then
          begin
              if TIRomCarga.RecNo = 0 then
                TIRomCarga.Append;
              if TIRomCarga.RecNo > 0 then
                TIRomCarga.Edit;
          end;
          if FMenu.ConsCli.ResultCons.Text <> '' then
              TIRomCargaCLIENTEIRC.AsString := FMenu.ConsCli.ResultCons[0];
        end;
    end;
    end;

    procedure TFRomExped.TIRomCargaCalcFields(DataSet: TDataSet);
    begin
        if TIRomCargaCLIENTEIRC.AsString <> '' then
        begin
          if DMRec.TClientes.FindKey([TIRomCargaEMPIRC.AsString, TIRomCargaCLIENTEIRC.AsString]) then
              TIRomCargadesccliente.AsString := DMRec.TClientesFANTASCLI.AsString;
        end;

        if TIRomCargaUNIDIRC.asstring <> '' then
        begin
          if DMCom.TUnidade.FindKey([TIRomCargaEMPIRC.AsString, TIRomCargaUNIDIRC.asstring]) then
              TIRomCargadescunidade.AsString := DMCom.TUnidadeABREVUNI.AsString;
        end;

        if TIRomCargaMOTORISTAIRC.asstring <> '' then
        begin
          if DM.TFuncion.FindKey([TIRomCargaEMPIRC.AsString, TIRomCargaMOTORISTAIRC.asstring]) then
              TIRomCargadescmotora.AsString := DM.TFuncionNOMEFUN.AsString;
        end;
    end;

    procedure TFRomExped.DBGrid2Enter(Sender: TObject);
    begin
        bVolta := False;

        BIncluirClick(sender);

        bVolta := True;

        QRomaneio.EnableControls;

        QRomaneio.Close;
        QRomaneio.ParamByName('Codigo').Value:=Edit1.Text;
        QRomaneio.Open;
        QRomaneio.Edit;
    end;

    procedure TFRomExped.MSDBDateEdit1Exit(Sender: TObject);
    begin
        if DM.TEmpresaTPTELAROMANEMP.AsString = '2' then
          DBGrid2.SetFocus
        else
          DBGrid1.SetFocus;
    end;

    procedure TFRomExped.TIRomCargaCODPROIRCValidate(Sender: TField);
    begin
    if not ValidaProduto(Sender.AsString) then
        Abort
    else
    begin
        if trim(TIRomCargaCODPROIRC.AsString) <> '' then
        begin
          DMCom.TProduto.FindKey([VEmpresa,TIRomCargaCODPROIRC.AsString]);
          if TIRomCargaDESCRICAOIRC.AsString = '' then
              TIRomCargaDESCRICAOIRC.AsString := DMCom.TProdutoDESCRIPRO.AsString;
        end;
    end;
    end;

    procedure TFRomExped.TIRomCargaNewRecord(DataSet: TDataSet);
    begin
        TIRomCargaMONITORIRC.value     := QRomaneioMONITORROM.value;
        TIRomCargaDATAEMBIRC.Value     := QRomaneioDATAEMBROM.Value;
        TIRomCargaMOTORISTAIRC.Value   := QRomaneioMOTORISTAROM.Value;
        TIRomCargaSITUACAOIRC.Value    := '1';
    end;

    procedure TFRomExped.TIRomCargaSITUACAOIRCGetText(Sender: TField;
    var Text: String; DisplayText: Boolean);
    begin
        if sender.Value = '1' then
          text := '1-A Embarcar'
        else if sender.Value = '2' then
          text := '2-Carregando'
        else if sender.Value = '3' then
          text := '3-Finalizando'
        else if sender.Value = '4' then
        text := '4-Cancelado';
    end;

    procedure TFRomExped.DBSpeedButton1Click(Sender: TObject);
    begin
    FRelExpEtiq := TFRelExpEtiq.create(self);
    FRelExpEtiq.Edit1.Text := Edit1.Text;
    FRelExpEtiq.showmodal;
    FRelExpEtiq.free;  
    end;

    end.
    `,d=`
  object FRomExped: TFRomExped
    Left = 345
    Top = 69
    Width = 798
    Height = 564
    Caption = 'Cadastro de Romaneios para Expedi'#231#227'o'
    Color = clBtnFace
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -11
    Font.Name = 'MS Sans Serif'
    Font.Style = []
    OldCreateOrder = False
    Position = poMainFormCenter
    WindowState = wsMaximized
    OnShow = FormShow
    PixelsPerInch = 96
    TextHeight = 13
    object Panel1: TPanel
      Left = 0
      Top = 0
      Width = 782
      Height = 39
      Align = alTop
      BorderStyle = bsSingle
      TabOrder = 0
      object Label3: TLabel
        Left = 26
        Top = 10
        Width = 61
        Height = 13
        Caption = 'Romaneio:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = [fsBold]
        ParentFont = False
      end
      object DBText1: TDBText
        Left = 191
        Top = 11
        Width = 313
        Height = 17
        DataField = 'OBSERVROM'
        DataSource = dsRomaneio
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = [fsBold]
        ParentFont = False
      end
      object Panel10: TPanel
        Left = 411
        Top = 1
        Width = 366
        Height = 33
        Align = alRight
        BevelOuter = bvNone
        Ctl3D = True
        ParentCtl3D = False
        TabOrder = 0
      end
    end
    object Panel3: TPanel
      Left = 0
      Top = 495
      Width = 782
      Height = 30
      Align = alBottom
      BorderStyle = bsSingle
      TabOrder = 3
      object BSair: TSpeedButton
        Left = 470
        Top = 0
        Width = 75
        Height = 25
        Caption = '&Sair'
        Glyph.Data = {
          76010000424D7601000000000000760000002800000020000000100000000100
          04000000000000010000120B0000120B00001000000000000000000000000000
          800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00330000000000
          03333377777777777F333301BBBBBBBB033333773F3333337F3333011BBBBBBB
          0333337F73F333337F33330111BBBBBB0333337F373F33337F333301110BBBBB
          0333337F337F33337F333301110BBBBB0333337F337F33337F333301110BBBBB
          0333337F337F33337F333301110BBBBB0333337F337F33337F333301110BBBBB
          0333337F337F33337F333301110BBBBB0333337F337FF3337F33330111B0BBBB
          0333337F337733337F333301110BBBBB0333337F337F33337F333301110BBBBB
          0333337F3F7F33337F333301E10BBBBB0333337F7F7F33337F333301EE0BBBBB
          0333337F777FFFFF7F3333000000000003333377777777777333}
        NumGlyphs = 2
        OnClick = BSairClick
      end
      object BImprimir: TDBSpeedButton
        Left = 224
        Top = 0
        Width = 75
        Height = 25
        Caption = 'Im&primir'
        Glyph.Data = {
          76010000424D7601000000000000760000002800000020000000100000000100
          04000000000000010000120B0000120B00001000000000000000000000000000
          800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00300000000000
          0003377777777777777308888888888888807F33333333333337088888888888
          88807FFFFFFFFFFFFFF7000000000000000077777777777777770F8F8F8F8F8F
          8F807F333333333333F708F8F8F8F8F8F9F07F333333333337370F8F8F8F8F8F
          8F807FFFFFFFFFFFFFF7000000000000000077777777777777773330FFFFFFFF
          03333337F3FFFF3F7F333330F0000F0F03333337F77773737F333330FFFFFFFF
          03333337F3FF3FFF7F333330F00F000003333337F773777773333330FFFF0FF0
          33333337F3F37F3733333330F08F0F0333333337F7337F7333333330FFFF0033
          33333337FFFF7733333333300000033333333337777773333333}
        NumGlyphs = 2
        OnClick = BImprimirClick
        DataButtonType = nbCustom
        DataSource = dsRomaneio
        DisableReasons = [drEditing, drEmpty]
        RuntimeEnabled = True
      end
      object BExcluir: TDBSpeedButton
        Left = 149
        Top = 0
        Width = 75
        Height = 25
        Caption = '&Excluir'
        Glyph.Data = {
          76010000424D7601000000000000760000002800000020000000100000000100
          04000000000000010000120B0000120B00001000000000000000000000000000
          800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333000000000
          3333333777777777F3333330F777777033333337F3F3F3F7F3333330F0808070
          33333337F7F7F7F7F3333330F080707033333337F7F7F7F7F3333330F0808070
          33333337F7F7F7F7F3333330F080707033333337F7F7F7F7F3333330F0808070
          333333F7F7F7F7F7F3F33030F080707030333737F7F7F7F7F7333300F0808070
          03333377F7F7F7F773333330F080707033333337F7F7F7F7F333333070707070
          33333337F7F7F7F7FF3333000000000003333377777777777F33330F88877777
          0333337FFFFFFFFF7F3333000000000003333377777777777333333330777033
          3333333337FFF7F3333333333000003333333333377777333333}
        NumGlyphs = 2
        OnClick = BExcluirClick
        DataButtonType = nbDelete
        DataSource = dsRomaneio
        DisableReasons = [drReadonly, drEditing, drEmpty]
        RuntimeEnabled = True
      end
      object BCancelar: TDBSpeedButton
        Left = 74
        Top = 0
        Width = 75
        Height = 25
        Caption = '&Cancelar'
        Glyph.Data = {
          DE010000424DDE01000000000000760000002800000024000000120000000100
          0400000000006801000000000000000000001000000000000000000000000000
          80000080000000808000800000008000800080800000C0C0C000808080000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333333333333
          333333333333333333333333000033338833333333333333333F333333333333
          0000333911833333983333333388F333333F3333000033391118333911833333
          38F38F333F88F33300003339111183911118333338F338F3F8338F3300003333
          911118111118333338F3338F833338F3000033333911111111833333338F3338
          3333F8330000333333911111183333333338F333333F83330000333333311111
          8333333333338F3333383333000033333339111183333333333338F333833333
          00003333339111118333333333333833338F3333000033333911181118333333
          33338333338F333300003333911183911183333333383338F338F33300003333
          9118333911183333338F33838F338F33000033333913333391113333338FF833
          38F338F300003333333333333919333333388333338FFF830000333333333333
          3333333333333333333888330000333333333333333333333333333333333333
          0000}
        NumGlyphs = 2
        OnClick = BCancelarClick
        DataButtonType = nbCancel
        DataSource = dsRomaneio
        DisableReasons = [drNotEditing]
        RuntimeEnabled = True
      end
      object DBSpeedButton1: TDBSpeedButton
        Left = 384
        Top = 0
        Width = 85
        Height = 25
        Caption = '&Rel Exped'
        Glyph.Data = {
          76010000424D7601000000000000760000002800000020000000100000000100
          04000000000000010000120B0000120B00001000000000000000000000000000
          800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00300000000000
          0003377777777777777308888888888888807F33333333333337088888888888
          88807FFFFFFFFFFFFFF7000000000000000077777777777777770F8F8F8F8F8F
          8F807F333333333333F708F8F8F8F8F8F9F07F333333333337370F8F8F8F8F8F
          8F807FFFFFFFFFFFFFF7000000000000000077777777777777773330FFFFFFFF
          03333337F3FFFF3F7F333330F0000F0F03333337F77773737F333330FFFFFFFF
          03333337F3FF3FFF7F333330F00F000003333337F773777773333330FFFF0FF0
          33333337F3F37F3733333330F08F0F0333333337F7337F7333333330FFFF0033
          33333337FFFF7733333333300000033333333337777773333333}
        NumGlyphs = 2
        OnClick = DBSpeedButton1Click
        DataButtonType = nbCustom
        DataSource = dsRomaneio
        DisableReasons = [drEditing, drEmpty]
        RuntimeEnabled = True
      end
      object BIncluir: TMSButton
        Left = 0
        Top = 0
        Width = 75
        Height = 25
        Caption = '&Incluir'
        Glyph.Data = {
          DE010000424DDE01000000000000760000002800000024000000120000000100
          0400000000006801000000000000000000001000000000000000000000000000
          80000080000000808000800000008000800080800000C0C0C000808080000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333333333333
          3333333333333333333333330000333333333333333333333333F33333333333
          00003333344333333333333333388F3333333333000033334224333333333333
          338338F3333333330000333422224333333333333833338F3333333300003342
          222224333333333383333338F3333333000034222A22224333333338F338F333
          8F33333300003222A3A2224333333338F3838F338F33333300003A2A333A2224
          33333338F83338F338F33333000033A33333A222433333338333338F338F3333
          0000333333333A222433333333333338F338F33300003333333333A222433333
          333333338F338F33000033333333333A222433333333333338F338F300003333
          33333333A222433333333333338F338F00003333333333333A22433333333333
          3338F38F000033333333333333A223333333333333338F830000333333333333
          333A333333333333333338330000333333333333333333333333333333333333
          0000}
        NumGlyphs = 2
        TabOrder = 0
        TabStop = True
        OnClick = BIncluirClick
      end
      object MSButton1: TMSButton
        Left = 299
        Top = 0
        Width = 84
        Height = 25
        Caption = 'Produ'#231#227'o'
        Glyph.Data = {
          76010000424D7601000000000000760000002800000020000000100000000100
          04000000000000010000120B0000120B00001000000000000000000000000000
          800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
          FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333333333333
          33333FFFFFFFFFFFFFFF000000000000000077777777777777770FFFFFFFFFFF
          FFF07F3FF3FF3FF3FFF70F00F00F00F000F07F773773773777370FFFFFFFFFFF
          FFF07F3FF3FF3FF3FFF70F00F00F00F000F07F773773773777370FFFFFFFFFFF
          FFF07F3FF3FF3FF3FFF70F00F00F00F000F07F773773773777370FFFFFFFFFFF
          FFF07F3FF3FF3FF3FFF70F00F00F00F000F07F773773773777370FFFFFFFFFFF
          FFF07FFFFFFFFFFFFFF70CCCCCCCCCCCCCC07777777777777777088CCCCCCCCC
          C8807FF7777777777FF700000000000000007777777777777777333333333333
          3333333333333333333333333333333333333333333333333333}
        NumGlyphs = 2
        TabOrder = 1
        TabStop = True
        OnClick = MSButton1Click
      end
    end
    object Panel2: TPanel
      Left = 0
      Top = 39
      Width = 782
      Height = 166
      Align = alTop
      BevelOuter = bvSpace
      BorderStyle = bsSingle
      TabOrder = 1
      object Label5: TLabel
        Left = 15
        Top = 7
        Width = 68
        Height = 13
        Caption = 'Data Emiss'#227'o:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label16: TLabel
        Left = 250
        Top = 7
        Width = 77
        Height = 13
        Caption = 'Data Embarque:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label9: TLabel
        Left = 21
        Top = 29
        Width = 61
        Height = 13
        Caption = 'Observa'#231#227'o:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label1: TLabel
        Left = 288
        Top = 142
        Width = 59
        Height = 13
        Caption = 'Data Status:'
      end
      object Label2: TLabel
        Left = 50
        Top = 141
        Width = 33
        Height = 13
        Caption = 'Status:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label4: TLabel
        Left = 0
        Top = 71
        Width = 87
        Height = 13
        Caption = 'Funcion Motorista:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label6: TLabel
        Left = 44
        Top = 95
        Width = 38
        Height = 13
        Caption = 'Veiculo:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object Label7: TLabel
        Left = 11
        Top = 117
        Width = 71
        Height = 13
        Caption = 'Monitor Exped:'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
      end
      object MSDBDateEdit4: TMSDBDateEdit
        Left = 87
        Top = 3
        Width = 83
        Height = 21
        DataField = 'DATAROM'
        DataSource = dsRomaneio
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
        TabOrder = 0
        Required = True
        DefaultDate = True
        Alignment = taLeftJustify
      end
      object MSDBDateEdit3: TMSDBDateEdit
        Left = 331
        Top = 4
        Width = 83
        Height = 21
        DataField = 'DATAEMBROM'
        DataSource = dsRomaneio
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
        TabOrder = 1
        Required = True
        DefaultDate = True
        Alignment = taLeftJustify
      end
      object DBMemo1: TDBMemo
        Left = 87
        Top = 27
        Width = 580
        Height = 38
        DataField = 'OBSERVROM'
        DataSource = dsRomaneio
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
        TabOrder = 2
        OnExit = DBMemo1Exit
      end
      object MSDBDateEdit1: TMSDBDateEdit
        Left = 351
        Top = 137
        Width = 83
        Height = 21
        DataField = 'DTSTATROM'
        DataSource = dsRomaneio
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        ParentFont = False
        ReadOnly = True
        TabOrder = 9
        OnExit = MSDBDateEdit1Exit
        Required = True
        DefaultDate = True
        Alignment = taLeftJustify
      end
      object ComboBox1: TComboBox
        Left = 87
        Top = 137
        Width = 121
        Height = 21
        ItemHeight = 13
        TabOrder = 8
        Text = '0 - Cadastrado'
        Items.Strings = (
          '0 - Cadastrado'
          '1 - Embarcado'
          '2 - Cancelado'
          '3 - Expedi'#231#227'o')
      end
      object DBEdit2: TDBEdit
        Left = 168
        Top = 68
        Width = 499
        Height = 21
        HelpType = htKeyword
        HelpKeyword = 'Descricao do Ve'#237'culo'
        DataField = 'NOMEMOTORISROM'
        DataSource = dsRomaneio
        TabOrder = 4
      end
      object DBEdit1: TDBEdit
        Left = 168
        Top = 91
        Width = 499
        Height = 21
        HelpType = htKeyword
        HelpKeyword = 'Descricao do Ve'#237'culo'
        DataField = 'DESCVEICROM'
        DataSource = dsRomaneio
        TabOrder = 6
      end
      object DBEdit28: TMSDBFind
        Left = 87
        Top = 68
        Width = 79
        Height = 21
        Hint = 'Pesquizar...'
        DataField = 'MOTORISTAROM'
        DataSource = dsRomaneio
        ParentShowHint = False
        ShowHint = True
        TabOrder = 3
        OnExit = DBEdit28Exit
        LabelWidth = 0
        LabelPosition = lpRight
        LabelSpacing = 5
        Consulta = FMenu.ConsFuncion
        Alignment = taCenter
        Required = False
        ValidChars = '[0..9]'
        Glyph.Data = {
          E6040000424DE604000000000000360000002800000014000000140000000100
          180000000000B004000000000000000000000000000000000000848A8C736D73
          736D73736D73736D73736D73736D73736D73736D73736D73736D73736D73736D
          73736D73736D73736D73736D73736D73848A8CCED3D6737173F7EFD6EFE3ADEF
          E3ADF7E3ADF7E7ADF7E7ADF7E7ADF7E7ADF7EBADF7EBADF7E7ADF7E7ADF7E7AD
          EFE3ADEFE3ADEFE3ADF7EFD6737173848684FFF3D6E7CF63E7CB4AEFCF4AEFD3
          4AF7D352F7D752FFD752FFDB52FFDB52FFDB52F7D752F7D752F7D352EFCF52EF
          CB4AE7CB4AE7CF63FFF3D6737173EFDBA5DEBA42DEB639E7BE39CEAE39EFC742
          EFC742F7CB42F7CF4AF7CF4AF7CF4AF7CF4AF7CF4AF7CB4AF7CB4AF7CB4AF7CB
          4ADEBA42EFD7A5737573EFD7A5DEAE42D6AA39B59231AD9E6B9C7D31D6AE39EF
          C342EFC342EFC342EFC342EFC342EFC342EFBE42EFBE42EFBE42EFBE42DEAE42
          E7D7A57B797BEFD39CD6A639B58A31B5A27BDEDBDEC6BAA59C7931CEA239E7B2
          39E7B239E7B239E7B239E7B239E7AE39E7AE39E7AE39E7AE39D6A639E7D3A57B
          797BE7CB9CD69231C68A319C7D4ADED7D6DEDFDEC6B6A5946D29CE9631D69E31
          D69E31D69E31D69E31D69A31D69A31D69A31D69A31D69231E7CBA5847D7BE7C3
          94CE8229CE8229AD6D219C754ADED7D6E7DFDEC6B6A58C6529946D39A5865AA5
          8652B58E63AD6921CE8221CE8221CE8221CE8229E7C39C848284E7BA94C67529
          C67121C67121A561219C6D42DED7D6E7E3E7D6C7BDE7E3E7E7E3E7E7E3E7DEDB
          DEB59673A56521C67121CE7121C67529E7BE9C848684DEB694BD5D18BD5918BD
          5110BD5510A54D10946142E7DFDEE7E3E7DEDBD6C6A694C6AA9CE7DFDEE7E3E7
          AD8A739C4918BD5510BD5D18DEB69C8C8A8CDEB294C65518BD4910BD4110BD41
          08AD41109C614AE7E7E7DED3CE8C49299C45109C4510945531E7DFDEE7E3E78C
          4929B54110C65518DEB29C8C8A8CE7B294C65118C64510C63C08C63808A53008
          BD9284EFE7E7B5826BA53808C64108C64108A53410BD968CEFE7E7AD7163AD38
          10C65118E7B29C948E8CE7BA9CCE5518CE4110CE3808C63408A52C08BD968CEF
          EBEFAD7563AD3008C63008C63008A53008BD8E84EFEBEFAD7563AD3410CE5518
          E7BA9C949294EFC3A5D65D29D64921D64921CE4118B53410AD6D5AEFEFEFDEC3
          BD8C2C10B52C08B52C088C3418E7D7D6EFEFEF9C5139C64521D65D29EFC3A59C
          9694EFC3B5E78673E7826BE7826BE77D6BDE755A945142E7CFCEF7F7F7DECBC6
          B58273BD8A84E7D7D6F7F7F7DEC3BDAD6152E7826BE78673EFC7BD9C9A9CF7CF
          C6EF9E94EF9A8CEF9E8CEF9E94EFA694D69284AD867BEFDFDEFFFBFFFFFBFFFF
          FBFFFFFBFFE7D7D6A57D73D69684EF9E8CEF9E94F7CFCE9C9A9CF7D3CEF7A69C
          EFA294EFA69CF7A69CF7AA9CF7AA9CD6968CA57973C6A6A5D6C3C6D6BEBDBDA2
          9CB5867BDE9A8CF7AA9CF7A69CF7A69CF7D3CEA59E9CF7D7D6F7AEA5F7AAA5F7
          AEA5F7AEA5F7B2A5F7B2ADF7B2ADF7B2ADD6A294C6968CCE968CDE9E94F7B2AD
          F7B2A5F7B2A5F7AEA5F7AEA5F7D7D6A5A2A5FFEBEFF7BEB5F7B2ADF7B6ADF7BA
          B5F7BAB5F7BEB5F7BEB5F7BAB5F7BAB5F7BAB5F7BEB5F7BAB5F7BAB5F7B6ADF7
          B6ADF7B2ADF7BEB5FFEBEFA5A2A5ADA6A5FFF3EFFFEBDEFFE7DEFFE7DEFFE7DE
          FFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE7DEFFE7DEFFE7DEFFE7
          DEFFF3EFADA6A5B5B6B5}
        NumGlyphs = 1
      end
      object MSDBFind1: TMSDBFind
        Left = 87
        Top = 91
        Width = 79
        Height = 21
        Hint = 'Pesquizar...'
        DataField = 'VEICULOROM'
        DataSource = dsRomaneio
        ParentShowHint = False
        ShowHint = True
        TabOrder = 5
        OnExit = MSDBFind1Exit
        LabelWidth = 0
        LabelPosition = lpRight
        LabelSpacing = 5
        Consulta = FMenu.ConsVeiculos
        Alignment = taCenter
        Required = False
        ValidChars = '[0..9]'
        Glyph.Data = {
          E6040000424DE604000000000000360000002800000014000000140000000100
          180000000000B004000000000000000000000000000000000000848A8C736D73
          736D73736D73736D73736D73736D73736D73736D73736D73736D73736D73736D
          73736D73736D73736D73736D73736D73848A8CCED3D6737173F7EFD6EFE3ADEF
          E3ADF7E3ADF7E7ADF7E7ADF7E7ADF7E7ADF7EBADF7EBADF7E7ADF7E7ADF7E7AD
          EFE3ADEFE3ADEFE3ADF7EFD6737173848684FFF3D6E7CF63E7CB4AEFCF4AEFD3
          4AF7D352F7D752FFD752FFDB52FFDB52FFDB52F7D752F7D752F7D352EFCF52EF
          CB4AE7CB4AE7CF63FFF3D6737173EFDBA5DEBA42DEB639E7BE39CEAE39EFC742
          EFC742F7CB42F7CF4AF7CF4AF7CF4AF7CF4AF7CF4AF7CB4AF7CB4AF7CB4AF7CB
          4ADEBA42EFD7A5737573EFD7A5DEAE42D6AA39B59231AD9E6B9C7D31D6AE39EF
          C342EFC342EFC342EFC342EFC342EFC342EFBE42EFBE42EFBE42EFBE42DEAE42
          E7D7A57B797BEFD39CD6A639B58A31B5A27BDEDBDEC6BAA59C7931CEA239E7B2
          39E7B239E7B239E7B239E7B239E7AE39E7AE39E7AE39E7AE39D6A639E7D3A57B
          797BE7CB9CD69231C68A319C7D4ADED7D6DEDFDEC6B6A5946D29CE9631D69E31
          D69E31D69E31D69E31D69A31D69A31D69A31D69A31D69231E7CBA5847D7BE7C3
          94CE8229CE8229AD6D219C754ADED7D6E7DFDEC6B6A58C6529946D39A5865AA5
          8652B58E63AD6921CE8221CE8221CE8221CE8229E7C39C848284E7BA94C67529
          C67121C67121A561219C6D42DED7D6E7E3E7D6C7BDE7E3E7E7E3E7E7E3E7DEDB
          DEB59673A56521C67121CE7121C67529E7BE9C848684DEB694BD5D18BD5918BD
          5110BD5510A54D10946142E7DFDEE7E3E7DEDBD6C6A694C6AA9CE7DFDEE7E3E7
          AD8A739C4918BD5510BD5D18DEB69C8C8A8CDEB294C65518BD4910BD4110BD41
          08AD41109C614AE7E7E7DED3CE8C49299C45109C4510945531E7DFDEE7E3E78C
          4929B54110C65518DEB29C8C8A8CE7B294C65118C64510C63C08C63808A53008
          BD9284EFE7E7B5826BA53808C64108C64108A53410BD968CEFE7E7AD7163AD38
          10C65118E7B29C948E8CE7BA9CCE5518CE4110CE3808C63408A52C08BD968CEF
          EBEFAD7563AD3008C63008C63008A53008BD8E84EFEBEFAD7563AD3410CE5518
          E7BA9C949294EFC3A5D65D29D64921D64921CE4118B53410AD6D5AEFEFEFDEC3
          BD8C2C10B52C08B52C088C3418E7D7D6EFEFEF9C5139C64521D65D29EFC3A59C
          9694EFC3B5E78673E7826BE7826BE77D6BDE755A945142E7CFCEF7F7F7DECBC6
          B58273BD8A84E7D7D6F7F7F7DEC3BDAD6152E7826BE78673EFC7BD9C9A9CF7CF
          C6EF9E94EF9A8CEF9E8CEF9E94EFA694D69284AD867BEFDFDEFFFBFFFFFBFFFF
          FBFFFFFBFFE7D7D6A57D73D69684EF9E8CEF9E94F7CFCE9C9A9CF7D3CEF7A69C
          EFA294EFA69CF7A69CF7AA9CF7AA9CD6968CA57973C6A6A5D6C3C6D6BEBDBDA2
          9CB5867BDE9A8CF7AA9CF7A69CF7A69CF7D3CEA59E9CF7D7D6F7AEA5F7AAA5F7
          AEA5F7AEA5F7B2A5F7B2ADF7B2ADF7B2ADD6A294C6968CCE968CDE9E94F7B2AD
          F7B2A5F7B2A5F7AEA5F7AEA5F7D7D6A5A2A5FFEBEFF7BEB5F7B2ADF7B6ADF7BA
          B5F7BAB5F7BEB5F7BEB5F7BAB5F7BAB5F7BAB5F7BEB5F7BAB5F7BAB5F7B6ADF7
          B6ADF7B2ADF7BEB5FFEBEFA5A2A5ADA6A5FFF3EFFFEBDEFFE7DEFFE7DEFFE7DE
          FFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE7DEFFE7DEFFE7DEFFE7
          DEFFF3EFADA6A5B5B6B5}
        NumGlyphs = 1
      end
      object MSDBFind2: TMSDBFind
        Left = 87
        Top = 114
        Width = 79
        Height = 21
        Hint = 'Pesquizar...'
        DataField = 'MONITORROM'
        DataSource = dsRomaneio
        ParentShowHint = False
        ShowHint = True
        TabOrder = 7
        OnExit = MSDBFind1Exit
        LabelWidth = 0
        LabelPosition = lpRight
        LabelSpacing = 5
        Consulta = FMenu.ConsParMonitor
        Alignment = taCenter
        Required = False
        ValidChars = '[0..9]'
        Glyph.Data = {
          E6040000424DE604000000000000360000002800000014000000140000000100
          180000000000B004000000000000000000000000000000000000848A8C736D73
          736D73736D73736D73736D73736D73736D73736D73736D73736D73736D73736D
          73736D73736D73736D73736D73736D73848A8CCED3D6737173F7EFD6EFE3ADEF
          E3ADF7E3ADF7E7ADF7E7ADF7E7ADF7E7ADF7EBADF7EBADF7E7ADF7E7ADF7E7AD
          EFE3ADEFE3ADEFE3ADF7EFD6737173848684FFF3D6E7CF63E7CB4AEFCF4AEFD3
          4AF7D352F7D752FFD752FFDB52FFDB52FFDB52F7D752F7D752F7D352EFCF52EF
          CB4AE7CB4AE7CF63FFF3D6737173EFDBA5DEBA42DEB639E7BE39CEAE39EFC742
          EFC742F7CB42F7CF4AF7CF4AF7CF4AF7CF4AF7CF4AF7CB4AF7CB4AF7CB4AF7CB
          4ADEBA42EFD7A5737573EFD7A5DEAE42D6AA39B59231AD9E6B9C7D31D6AE39EF
          C342EFC342EFC342EFC342EFC342EFC342EFBE42EFBE42EFBE42EFBE42DEAE42
          E7D7A57B797BEFD39CD6A639B58A31B5A27BDEDBDEC6BAA59C7931CEA239E7B2
          39E7B239E7B239E7B239E7B239E7AE39E7AE39E7AE39E7AE39D6A639E7D3A57B
          797BE7CB9CD69231C68A319C7D4ADED7D6DEDFDEC6B6A5946D29CE9631D69E31
          D69E31D69E31D69E31D69A31D69A31D69A31D69A31D69231E7CBA5847D7BE7C3
          94CE8229CE8229AD6D219C754ADED7D6E7DFDEC6B6A58C6529946D39A5865AA5
          8652B58E63AD6921CE8221CE8221CE8221CE8229E7C39C848284E7BA94C67529
          C67121C67121A561219C6D42DED7D6E7E3E7D6C7BDE7E3E7E7E3E7E7E3E7DEDB
          DEB59673A56521C67121CE7121C67529E7BE9C848684DEB694BD5D18BD5918BD
          5110BD5510A54D10946142E7DFDEE7E3E7DEDBD6C6A694C6AA9CE7DFDEE7E3E7
          AD8A739C4918BD5510BD5D18DEB69C8C8A8CDEB294C65518BD4910BD4110BD41
          08AD41109C614AE7E7E7DED3CE8C49299C45109C4510945531E7DFDEE7E3E78C
          4929B54110C65518DEB29C8C8A8CE7B294C65118C64510C63C08C63808A53008
          BD9284EFE7E7B5826BA53808C64108C64108A53410BD968CEFE7E7AD7163AD38
          10C65118E7B29C948E8CE7BA9CCE5518CE4110CE3808C63408A52C08BD968CEF
          EBEFAD7563AD3008C63008C63008A53008BD8E84EFEBEFAD7563AD3410CE5518
          E7BA9C949294EFC3A5D65D29D64921D64921CE4118B53410AD6D5AEFEFEFDEC3
          BD8C2C10B52C08B52C088C3418E7D7D6EFEFEF9C5139C64521D65D29EFC3A59C
          9694EFC3B5E78673E7826BE7826BE77D6BDE755A945142E7CFCEF7F7F7DECBC6
          B58273BD8A84E7D7D6F7F7F7DEC3BDAD6152E7826BE78673EFC7BD9C9A9CF7CF
          C6EF9E94EF9A8CEF9E8CEF9E94EFA694D69284AD867BEFDFDEFFFBFFFFFBFFFF
          FBFFFFFBFFE7D7D6A57D73D69684EF9E8CEF9E94F7CFCE9C9A9CF7D3CEF7A69C
          EFA294EFA69CF7A69CF7AA9CF7AA9CD6968CA57973C6A6A5D6C3C6D6BEBDBDA2
          9CB5867BDE9A8CF7AA9CF7A69CF7A69CF7D3CEA59E9CF7D7D6F7AEA5F7AAA5F7
          AEA5F7AEA5F7B2A5F7B2ADF7B2ADF7B2ADD6A294C6968CCE968CDE9E94F7B2AD
          F7B2A5F7B2A5F7AEA5F7AEA5F7D7D6A5A2A5FFEBEFF7BEB5F7B2ADF7B6ADF7BA
          B5F7BAB5F7BEB5F7BEB5F7BAB5F7BAB5F7BAB5F7BEB5F7BAB5F7BAB5F7B6ADF7
          B6ADF7B2ADF7BEB5FFEBEFA5A2A5ADA6A5FFF3EFFFEBDEFFE7DEFFE7DEFFE7DE
          FFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE7DEFFE7DEFFE7DEFFE7
          DEFFF3EFADA6A5B5B6B5}
        NumGlyphs = 1
      end
    end
    object Panel4: TPanel
      Left = 0
      Top = 205
      Width = 782
      Height = 290
      Align = alClient
      BevelOuter = bvNone
      BorderStyle = bsSingle
      TabOrder = 2
      object PageControl1: TPageControl
        Left = 0
        Top = 0
        Width = 778
        Height = 286
        ActivePage = TabSheet1
        Align = alClient
        TabOrder = 0
        object TabSheet1: TTabSheet
          Caption = 'Pedidos a Carregar'
          object Splitter2: TSplitter
            Left = 0
            Top = 165
            Width = 770
            Height = 3
            Cursor = crVSplit
            Align = alTop
          end
          object Panel5: TPanel
            Left = 0
            Top = 0
            Width = 770
            Height = 27
            Align = alTop
            BorderStyle = bsSingle
            TabOrder = 0
            object MSButton2: TMSButton
              Left = -1
              Top = 0
              Width = 94
              Height = 22
              Caption = '&Adic Pedidos'
              Glyph.Data = {
                DE010000424DDE01000000000000760000002800000024000000120000000100
                0400000000006801000000000000000000001000000000000000000000000000
                80000080000000808000800000008000800080800000C0C0C000808080000000
                FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333333333333
                3333333333333333333333330000333333333333333333333333F33333333333
                00003333344333333333333333388F3333333333000033334224333333333333
                338338F3333333330000333422224333333333333833338F3333333300003342
                222224333333333383333338F3333333000034222A22224333333338F338F333
                8F33333300003222A3A2224333333338F3838F338F33333300003A2A333A2224
                33333338F83338F338F33333000033A33333A222433333338333338F338F3333
                0000333333333A222433333333333338F338F33300003333333333A222433333
                333333338F338F33000033333333333A222433333333333338F338F300003333
                33333333A222433333333333338F338F00003333333333333A22433333333333
                3338F38F000033333333333333A223333333333333338F830000333333333333
                333A333333333333333338330000333333333333333333333333333333333333
                0000}
              NumGlyphs = 2
              TabOrder = 0
              TabStop = True
              OnClick = MSButton2Click
            end
            object MSButton4: TMSButton
              Left = 93
              Top = 0
              Width = 107
              Height = 22
              Caption = '&Retirar Pedido'
              Glyph.Data = {
                DE010000424DDE01000000000000760000002800000024000000120000000100
                0400000000006801000000000000000000001000000000000000000000000000
                80000080000000808000800000008000800080800000C0C0C000808080000000
                FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00333333333333
                333333333333333333333333000033338833333333333333333F333333333333
                0000333911833333983333333388F333333F3333000033391118333911833333
                38F38F333F88F33300003339111183911118333338F338F3F8338F3300003333
                911118111118333338F3338F833338F3000033333911111111833333338F3338
                3333F8330000333333911111183333333338F333333F83330000333333311111
                8333333333338F3333383333000033333339111183333333333338F333833333
                00003333339111118333333333333833338F3333000033333911181118333333
                33338333338F333300003333911183911183333333383338F338F33300003333
                9118333911183333338F33838F338F33000033333913333391113333338FF833
                38F338F300003333333333333919333333388333338FFF830000333333333333
                3333333333333333333888330000333333333333333333333333333333333333
                0000}
              NumGlyphs = 2
              TabOrder = 1
              TabStop = True
              OnClick = MSButton4Click
            end
            object MSButton3: TMSButton
              Left = 200
              Top = 0
              Width = 184
              Height = 22
              Caption = 'Con&sultar Pedidos X Romaneio'
              Glyph.Data = {
                76010000424D7601000000000000760000002800000020000000100000000100
                04000000000000010000120B0000120B00001000000000000000000000000000
                800000800000008080008000000080008000808000007F7F7F00BFBFBF000000
                FF0000FF000000FFFF00FF000000FF00FF00FFFF0000FFFFFF00555555555555
                5555555555555555555555555555555555555555555555555555555555555555
                555555555555555555555555555555555555555FFFFFFFFFF555550000000000
                55555577777777775F55500B8B8B8B8B05555775F555555575F550F0B8B8B8B8
                B05557F75F555555575F50BF0B8B8B8B8B0557F575FFFFFFFF7F50FBF0000000
                000557F557777777777550BFBFBFBFB0555557F555555557F55550FBFBFBFBF0
                555557F555555FF7555550BFBFBF00055555575F555577755555550BFBF05555
                55555575FFF75555555555700007555555555557777555555555555555555555
                5555555555555555555555555555555555555555555555555555}
              NumGlyphs = 2
              TabOrder = 2
              TabStop = True
              OnClick = MSButton3Click
            end
          end
          object MSDBGrid1: TMSDBGrid
            Left = 0
            Top = 27
            Width = 770
            Height = 138
            Align = alTop
            DataSource = dsItRomaneio
            Options = [dgTitles, dgIndicator, dgColumnResize, dgColLines, dgRowLines, dgTabs, dgCancelOnExit]
            TabOrder = 1
            TitleFont.Charset = DEFAULT_CHARSET
            TitleFont.Color = clWindowText
            TitleFont.Height = -11
            TitleFont.Name = 'MS Sans Serif'
            TitleFont.Style = []
            Columns = <
              item
                Expanded = False
                FieldName = 'SEL'
                Title.Caption = 'Sel'
                Width = 19
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'PEDIDOIROM'
                Title.Caption = 'Pedido'
                Width = 47
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'CODPEDREP'
                Title.Caption = 'Pedido Rep'
                Width = 61
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'CODREPPED'
                Title.Caption = 'C'#243'd Rep'
                Width = 46
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'NOMECLI'
                Title.Caption = 'Cliente'
                Width = 207
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'CIDADECLI'
                Title.Caption = 'Cidade'
                Width = 133
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'UFCLI'
                Title.Caption = 'UF'
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'DTENTPED'
                Title.Caption = 'Dt Entrega'
                Width = 73
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'DTPED'
                Title.Caption = 'Dt Pedido'
                Width = 75
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'OBSERVIROM'
                Title.Caption = 'Observa'#231#227'o'
                Width = 327
                Visible = True
              end>
          end
          object DBGrid1: TDBGrid
            Left = 0
            Top = 168
            Width = 770
            Height = 90
            Align = alClient
            DataSource = dsItensPed
            Options = [dgEditing, dgTitles, dgIndicator, dgColumnResize, dgColLines, dgRowLines, dgTabs, dgCancelOnExit]
            TabOrder = 2
            TitleFont.Charset = DEFAULT_CHARSET
            TitleFont.Color = clWindowText
            TitleFont.Height = -11
            TitleFont.Name = 'MS Sans Serif'
            TitleFont.Style = []
            OnKeyDown = DBGrid1KeyDown
            Columns = <
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'QTDADEITP'
                Title.Caption = 'Qtde'
                Width = 80
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'QTDEMBEXPITP'
                Font.Charset = DEFAULT_CHARSET
                Font.Color = clWindowText
                Font.Height = -11
                Font.Name = 'MS Sans Serif'
                Font.Style = [fsBold]
                Title.Caption = 'Qtd.Emb.Exp'
                Title.Color = clAppWorkSpace
                Title.Font.Charset = DEFAULT_CHARSET
                Title.Font.Color = clWindowText
                Title.Font.Height = -11
                Title.Font.Name = 'MS Sans Serif'
                Title.Font.Style = [fsBold]
                Width = 80
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'CODPROITP'
                Title.Caption = 'Produto'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'descripro'
                Title.Caption = 'Descri'#231#227'o do Produto'
                Width = 229
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'NIVEL1ITP'
                Title.Caption = 'Nivel 1'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'descnivel1'
                Title.Caption = 'Desc Nivel 1'
                Width = 144
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'NIVEL2ITP'
                Title.Caption = 'Nivel 2'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'descnivel2'
                Title.Caption = 'Desc Nivel 2'
                Width = 144
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'NIVEL3ITP'
                Title.Caption = 'Nivel 3'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'descnivel3'
                Title.Caption = 'Desc Nivel 3'
                Width = 144
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'QTFATITP'
                Title.Caption = 'Qtde Fat.'
                Width = 80
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'PREUNIITP'
                Title.Caption = 'Pre'#231'o Unit.'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'DESCTOITP'
                Title.Caption = 'Desc.'
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'ICMSITP'
                Title.Caption = '% ICMS'
                Visible = True
              end
              item
                Alignment = taRightJustify
                Expanded = False
                FieldName = 'IPIITP'
                Title.Caption = '% IPI'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'PREMINITP'
                Title.Caption = 'Pre'#231'o c/IPI'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'TOTITEMITP'
                Title.Caption = 'Total Item'
                Visible = True
              end>
          end
        end
        object TabSheet2: TTabSheet
          Caption = 'Itens para Carregar'
          ImageIndex = 1
          object DBGrid2: TDBGrid
            Left = 0
            Top = 0
            Width = 778
            Height = 270
            Align = alClient
            DataSource = dsIRomCar
            Options = [dgEditing, dgTitles, dgIndicator, dgColumnResize, dgColLines, dgRowLines, dgTabs, dgCancelOnExit]
            TabOrder = 0
            TitleFont.Charset = DEFAULT_CHARSET
            TitleFont.Color = clWindowText
            TitleFont.Height = -11
            TitleFont.Name = 'MS Sans Serif'
            TitleFont.Style = []
            OnEnter = DBGrid2Enter
            OnKeyDown = DBGrid2KeyDown
            Columns = <
              item
                Expanded = False
                FieldName = 'SITUACAOIRC'
                PickList.Strings = (
                  '1-A Embarcar'
                  '2-Carregando'
                  '3-Finalizado'
                  '4-Cancelado')
                Title.Caption = 'Situa'#231#227'o'
                Width = 72
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'DATAEMBIRC'
                Title.Caption = 'Dt Embarque'
                Width = 80
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'MOTORISTAIRC'
                Title.Caption = 'Cod.Motorista'
                Width = 80
                Visible = True
              end
              item
                Color = clBtnFace
                Expanded = False
                FieldName = 'descmotora'
                Title.Caption = 'Desc. Motorista'
                Width = 80
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'CODPROIRC'
                Title.Caption = 'Cod.Produto'
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'DESCRICAOIRC'
                Title.Caption = 'Produto p/Carregar'
                Width = 200
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'QTDADEIRC'
                Title.Caption = 'Qtdade p/Carregar'
                Width = 100
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'UNIDIRC'
                Title.Caption = 'Unidade'
                Width = 50
                Visible = True
              end
              item
                Color = clBtnFace
                Expanded = False
                FieldName = 'descunidade'
                Title.Caption = 'Desc Unidade'
                Width = 75
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'CLIENTEIRC'
                Title.Caption = 'Cod. Cliente'
                Width = 65
                Visible = True
              end
              item
                Color = clBtnFace
                Expanded = False
                FieldName = 'desccliente'
                Title.Caption = 'Nome  Fantasia do Cliente'
                Width = 140
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'OBSERVACAOIRC'
                Title.Caption = 'Observa'#231#227'o'
                Width = 600
                Visible = True
              end
              item
                Expanded = False
                FieldName = 'MONITORIRC'
                Title.Caption = 'Monitor'
                Visible = True
              end>
          end
        end
      end
    end
    object Edit1: TMSFindIncZ
      Left = 91
      Top = 9
      Width = 98
      Height = 21
      MaxLength = 7
      TabOrder = 4
      Text = '0'
      OnEnter = Edit1Enter
      OnExit = Edit1Exit
      Alignment = taCenter
      Decimals = 0
      Consulta = FMenu.ConsRomaneio
      Variaveis = FMenu.MSVarEmpAtiva
      Required = True
      IncluirZero = True
      AceitaZero = False
      ValidChars = '[0..9]'
      Campos.NomeCampo1 = 'EMPRESAPED'
      Campos.NomeCampo2 = 'PEDIDOPED'
      Glyph.Data = {
        E6040000424DE604000000000000360000002800000014000000140000000100
        180000000000B004000000000000000000000000000000000000848A8C736D73
        736D73736D73736D73736D73736D73736D73736D73736D73736D73736D73736D
        73736D73736D73736D73736D73736D73848A8CCED3D6737173F7EFD6EFE3ADEF
        E3ADF7E3ADF7E7ADF7E7ADF7E7ADF7E7ADF7EBADF7EBADF7E7ADF7E7ADF7E7AD
        EFE3ADEFE3ADEFE3ADF7EFD6737173848684FFF3D6E7CF63E7CB4AEFCF4AEFD3
        4AF7D352F7D752FFD752FFDB52FFDB52FFDB52F7D752F7D752F7D352EFCF52EF
        CB4AE7CB4AE7CF63FFF3D6737173EFDBA5DEBA42DEB639E7BE39CEAE39EFC742
        EFC742F7CB42F7CF4AF7CF4AF7CF4AF7CF4AF7CF4AF7CB4AF7CB4AF7CB4AF7CB
        4ADEBA42EFD7A5737573EFD7A5DEAE42D6AA39B59231AD9E6B9C7D31D6AE39EF
        C342EFC342EFC342EFC342EFC342EFC342EFBE42EFBE42EFBE42EFBE42DEAE42
        E7D7A57B797BEFD39CD6A639B58A31B5A27BDEDBDEC6BAA59C7931CEA239E7B2
        39E7B239E7B239E7B239E7B239E7AE39E7AE39E7AE39E7AE39D6A639E7D3A57B
        797BE7CB9CD69231C68A319C7D4ADED7D6DEDFDEC6B6A5946D29CE9631D69E31
        D69E31D69E31D69E31D69A31D69A31D69A31D69A31D69231E7CBA5847D7BE7C3
        94CE8229CE8229AD6D219C754ADED7D6E7DFDEC6B6A58C6529946D39A5865AA5
        8652B58E63AD6921CE8221CE8221CE8221CE8229E7C39C848284E7BA94C67529
        C67121C67121A561219C6D42DED7D6E7E3E7D6C7BDE7E3E7E7E3E7E7E3E7DEDB
        DEB59673A56521C67121CE7121C67529E7BE9C848684DEB694BD5D18BD5918BD
        5110BD5510A54D10946142E7DFDEE7E3E7DEDBD6C6A694C6AA9CE7DFDEE7E3E7
        AD8A739C4918BD5510BD5D18DEB69C8C8A8CDEB294C65518BD4910BD4110BD41
        08AD41109C614AE7E7E7DED3CE8C49299C45109C4510945531E7DFDEE7E3E78C
        4929B54110C65518DEB29C8C8A8CE7B294C65118C64510C63C08C63808A53008
        BD9284EFE7E7B5826BA53808C64108C64108A53410BD968CEFE7E7AD7163AD38
        10C65118E7B29C948E8CE7BA9CCE5518CE4110CE3808C63408A52C08BD968CEF
        EBEFAD7563AD3008C63008C63008A53008BD8E84EFEBEFAD7563AD3410CE5518
        E7BA9C949294EFC3A5D65D29D64921D64921CE4118B53410AD6D5AEFEFEFDEC3
        BD8C2C10B52C08B52C088C3418E7D7D6EFEFEF9C5139C64521D65D29EFC3A59C
        9694EFC3B5E78673E7826BE7826BE77D6BDE755A945142E7CFCEF7F7F7DECBC6
        B58273BD8A84E7D7D6F7F7F7DEC3BDAD6152E7826BE78673EFC7BD9C9A9CF7CF
        C6EF9E94EF9A8CEF9E8CEF9E94EFA694D69284AD867BEFDFDEFFFBFFFFFBFFFF
        FBFFFFFBFFE7D7D6A57D73D69684EF9E8CEF9E94F7CFCE9C9A9CF7D3CEF7A69C
        EFA294EFA69CF7A69CF7AA9CF7AA9CD6968CA57973C6A6A5D6C3C6D6BEBDBDA2
        9CB5867BDE9A8CF7AA9CF7A69CF7A69CF7D3CEA59E9CF7D7D6F7AEA5F7AAA5F7
        AEA5F7AEA5F7B2A5F7B2ADF7B2ADF7B2ADD6A294C6968CCE968CDE9E94F7B2AD
        F7B2A5F7B2A5F7AEA5F7AEA5F7D7D6A5A2A5FFEBEFF7BEB5F7B2ADF7B6ADF7BA
        B5F7BAB5F7BEB5F7BEB5F7BAB5F7BAB5F7BAB5F7BEB5F7BAB5F7BAB5F7B6ADF7
        B6ADF7B2ADF7BEB5FFEBEFA5A2A5ADA6A5FFF3EFFFEBDEFFE7DEFFE7DEFFE7DE
        FFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE3DEFFE7DEFFE7DEFFE7DEFFE7
        DEFFF3EFADA6A5B5B6B5}
      NumGlyphs = 1
    end
    object dsItensPed: TDataSource
      DataSet = TItensPedC
      Left = 224
      Top = 416
    end
    object dsRomaneio: TDataSource
      DataSet = QRomaneio
      OnStateChange = dsRomaneioStateChange
      Left = 202
      Top = 80
    end
    object TItensPedC: TTable
      BeforeInsert = TItensPedCBeforeInsert
      OnCalcFields = TItensPedCCalcFields
      DatabaseName = 'pdcorp'
      Filter = 'statusitp = 1 or statusitp = 2 or statusitp = 10'
      Filtered = True
      FieldDefs = <
        item
          Name = 'EMPRESAITP'
          Attributes = [faRequired]
          DataType = ftString
          Size = 3
        end
        item
          Name = 'PEDIDOITP'
          Attributes = [faRequired]
          DataType = ftInteger
        end
        item
          Name = 'ITENITP'
          Attributes = [faRequired]
          DataType = ftInteger
        end
        item
          Name = 'CODPROITP'
          DataType = ftString
          Size = 12
        end
        item
          Name = 'NIVEL1ITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'NIVEL2ITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'NIVEL3ITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'QTDADEITP'
          DataType = ftFloat
        end
        item
          Name = 'QTFATITP'
          DataType = ftFloat
        end
        item
          Name = 'PREUNIITP'
          DataType = ftFloat
        end
        item
          Name = 'DESCTOITP'
          DataType = ftFloat
        end
        item
          Name = 'ICMSITP'
          DataType = ftFloat
        end
        item
          Name = 'IPIITP'
          DataType = ftFloat
        end
        item
          Name = 'ORIGEMITP'
          DataType = ftInteger
        end
        item
          Name = 'TRIFISITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'SERIENFITP'
          DataType = ftString
          Size = 3
        end
        item
          Name = 'NTFISCITP'
          DataType = ftInteger
        end
        item
          Name = 'DTFISCITP'
          DataType = ftDateTime
        end
        item
          Name = 'STATUSITP'
          DataType = ftInteger
        end
        item
          Name = 'DTSTAITP'
          DataType = ftDateTime
        end
        item
          Name = 'VLMOEDAITP'
          DataType = ftFloat
        end
        item
          Name = 'CUSTOITP'
          DataType = ftFloat
        end
        item
          Name = 'BXALMITP'
          DataType = ftString
          Size = 1
        end
        item
          Name = 'DTBXALMITP'
          DataType = ftDateTime
        end
        item
          Name = 'ESTOQUEITP'
          DataType = ftInteger
        end
        item
          Name = 'LOTEITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'PREMINITP'
          DataType = ftFloat
        end
        item
          Name = 'NRPREFTITP'
          DataType = ftInteger
        end
        item
          Name = 'DTPREFTITP'
          DataType = ftDateTime
        end
        item
          Name = 'USUCADITP'
          DataType = ftString
          Size = 8
        end
        item
          Name = 'DTCADITP'
          DataType = ftDateTime
        end
        item
          Name = 'PLANOPROITP'
          DataType = ftInteger
        end
        item
          Name = 'UNIDPROITP'
          DataType = ftString
          Size = 4
        end
        item
          Name = 'TOTITEMITP'
          DataType = ftFloat
        end
        item
          Name = 'ETIQITP'
          DataType = ftString
          Size = 1
        end
        item
          Name = 'PREFCLIITP'
          DataType = ftString
          Size = 1
        end
        item
          Name = 'NATOPEITP'
          DataType = ftString
          Size = 5
        end
        item
          Name = 'DESCT1ITP'
          DataType = ftFloat
        end
        item
          Name = 'DESCT2ITP'
          DataType = ftFloat
        end
        item
          Name = 'PREUNILQITP'
          DataType = ftFloat
        end
        item
          Name = 'NRRELENTITP'
          DataType = ftInteger
        end
        item
          Name = 'COMPLEMITP'
          DataType = ftString
          Size = 40
        end
        item
          Name = 'TROCAITP'
          DataType = ftString
          Size = 1
        end
        item
          Name = 'DTEMBARQITP'
          DataType = ftDateTime
        end
        item
          Name = 'VLRICMSSUBITP'
          DataType = ftFloat
        end
        item
          Name = 'PEDAGLUTITP'
          DataType = ftInteger
        end
        item
          Name = 'FRETEITP'
          DataType = ftFloat
        end
        item
          Name = 'VALDESCTITP'
          DataType = ftFloat
        end
        item
          Name = 'SERIENFANTITP'
          DataType = ftString
          Size = 3
        end
        item
          Name = 'NTFISCANTITP'
          DataType = ftInteger
        end
        item
          Name = 'DTFISCANTITP'
          DataType = ftDateTime
        end
        item
          Name = 'NRORDEMPROITP'
          DataType = ftInteger
        end
        item
          Name = 'TPNOTAITP'
          DataType = ftInteger
        end
        item
          Name = 'BRINDEITP'
          DataType = ftString
          Size = 1
        end
        item
          Name = 'PROMOCAOITP'
          DataType = ftInteger
        end
        item
          Name = 'QTDEMBEXPITP'
          DataType = ftFloat
        end
        item
          Name = 'NFPRCFATITP'
          DataType = ftFloat
        end
        item
          Name = 'NFQTDFATITP'
          DataType = ftFloat
        end
        item
          Name = 'ORPRCFATITP'
          DataType = ftFloat
        end
        item
          Name = 'ORQTDFATITP'
          DataType = ftFloat
        end
        item
          Name = 'QTREDITP'
          DataType = ftFloat
        end
        item
          Name = 'CODITEOPITP'
          DataType = ftInteger
        end>
      IndexDefs = <
        item
          Name = 'ITENSPED0'
          Fields = 'EMPRESAITP;PEDIDOITP;ITENITP'
          Options = [ixUnique]
        end>
      IndexFieldNames = 'EMPRESAITP;PEDIDOITP;ITENITP'
      MasterFields = 'EMP;PEDIDOIROM;ITENITPIROM'
      MasterSource = dsItRomaneio
      StoreDefs = True
      TableName = 'ITENSPED'
      Left = 259
      Top = 416
      object TItensPedCEMPRESAITP: TStringField
        FieldName = 'EMPRESAITP'
        ReadOnly = True
        Required = True
        Size = 3
      end
      object TItensPedCCODPROITP: TStringField
        FieldName = 'CODPROITP'
        ReadOnly = True
        Size = 12
      end
      object TItensPedCNIVEL1ITP: TStringField
        FieldName = 'NIVEL1ITP'
        ReadOnly = True
        Size = 4
      end
      object TItensPedCNIVEL2ITP: TStringField
        FieldName = 'NIVEL2ITP'
        ReadOnly = True
        Size = 4
      end
      object TItensPedCNIVEL3ITP: TStringField
        FieldName = 'NIVEL3ITP'
        ReadOnly = True
        Size = 4
      end
      object TItensPedCQTDADEITP: TFloatField
        Alignment = taCenter
        FieldName = 'QTDADEITP'
        ReadOnly = True
        DisplayFormat = '#####0.00'
      end
      object TItensPedCQTFATITP: TFloatField
        Alignment = taCenter
        FieldName = 'QTFATITP'
        ReadOnly = True
        DisplayFormat = '#####0.00'
      end
      object TItensPedCPREUNIITP: TFloatField
        FieldName = 'PREUNIITP'
        ReadOnly = True
        DisplayFormat = '#,##0.00'
      end
      object TItensPedCDESCTOITP: TFloatField
        FieldName = 'DESCTOITP'
        ReadOnly = True
        DisplayFormat = '#,##0.00'
      end
      object TItensPedCICMSITP: TFloatField
        Alignment = taCenter
        FieldName = 'ICMSITP'
        ReadOnly = True
      end
      object TItensPedCIPIITP: TFloatField
        Alignment = taCenter
        FieldName = 'IPIITP'
        ReadOnly = True
      end
      object TItensPedCPREMINITP: TFloatField
        FieldName = 'PREMINITP'
        ReadOnly = True
        DisplayFormat = '#,##0.00'
      end
      object TItensPedCTOTITEMITP: TFloatField
        FieldName = 'TOTITEMITP'
        ReadOnly = True
        DisplayFormat = '#,##0.00'
      end
      object TItensPedCPEDIDOITP: TIntegerField
        Alignment = taLeftJustify
        FieldName = 'PEDIDOITP'
        ReadOnly = True
        Required = True
      end
      object TItensPedCSTATUSITP: TIntegerField
        FieldName = 'STATUSITP'
        ReadOnly = True
      end
      object TItensPedCemppad: TStringField
        FieldKind = fkLookup
        FieldName = 'emppad'
        LookupDataSet = DM.TEmpresa
        LookupKeyFields = 'CODEMP'
        LookupResultField = 'COD2EMP'
        KeyFields = 'EMPRESAITP'
        ReadOnly = True
        Size = 3
        Lookup = True
      end
      object TItensPedCdescripro: TStringField
        FieldKind = fkCalculated
        FieldName = 'descripro'
        Size = 40
        Calculated = True
      end
      object TItensPedCdescnivel1: TStringField
        FieldKind = fkCalculated
        FieldName = 'descnivel1'
        Size = 40
        Calculated = True
      end
      object TItensPedCdescnivel2: TStringField
        FieldKind = fkCalculated
        FieldName = 'descnivel2'
        Size = 40
        Calculated = True
      end
      object TItensPedCdescnivel3: TStringField
        FieldKind = fkCalculated
        FieldName = 'descnivel3'
        Size = 40
        Calculated = True
      end
      object TItensPedCQTDEMBEXPITP: TFloatField
        FieldName = 'QTDEMBEXPITP'
        OnValidate = TItensPedCQTDEMBEXPITPValidate
        DisplayFormat = '#####0.00'
      end
      object TItensPedCCODITEOPITP: TIntegerField
        FieldName = 'CODITEOPITP'
      end
      object TItensPedCITENITP: TIntegerField
        FieldName = 'ITENITP'
        Required = True
      end
    end
    object QRomaneio: TQuery
      AfterEdit = QRomaneioAfterEdit
      BeforePost = QRomaneioBeforePost
      BeforeDelete = QRomaneioBeforeDelete
      OnNewRecord = QRomaneioNewRecord
      AutoRefresh = True
      DatabaseName = 'PDCORP'
      RequestLive = True
      SQL.Strings = (
        'Select *'
        'From Romaneio'
        'Where emprom = :Empresa'
        'and codrom = :Codigo'
        'Order By emprom,codrom')
      Left = 234
      Top = 80
      ParamData = <
        item
          DataType = ftString
          Name = 'Empresa'
          ParamType = ptUnknown
        end
        item
          DataType = ftInteger
          Name = 'Codigo'
          ParamType = ptUnknown
        end>
      object QRomaneioEMPROM: TStringField
        FieldName = 'EMPROM'
        Origin = 'PDCORP.ROMANEIO.EMPROM'
        Size = 3
      end
      object QRomaneioCODROM: TIntegerField
        FieldName = 'CODROM'
        Origin = 'PDCORP.ROMANEIO.CODROM'
      end
      object QRomaneioDATAROM: TDateTimeField
        FieldName = 'DATAROM'
        Origin = 'PDCORP.ROMANEIO.DATAROM'
      end
      object QRomaneioDATAEMBROM: TDateTimeField
        FieldName = 'DATAEMBROM'
        Origin = 'PDCORP.ROMANEIO.DATAEMBROM'
      end
      object QRomaneioOBSERVROM: TStringField
        FieldName = 'OBSERVROM'
        Origin = 'PDCORP.ROMANEIO.OBSERVROM'
        Size = 200
      end
      object QRomaneioSTATUSROM: TIntegerField
        FieldName = 'STATUSROM'
        Origin = 'PDCORP.ROMANEIO.STATUSROM'
      end
      object QRomaneioDTSTATROM: TDateTimeField
        FieldName = 'DTSTATROM'
        Origin = 'PDCORP.ROMANEIO.DTSTATROM'
      end
      object QRomaneioMOTORISTAROM: TIntegerField
        FieldName = 'MOTORISTAROM'
        Origin = 'PDCORP.ROMANEIO.MOTORISTAROM'
      end
      object QRomaneioNOMEMOTORISROM: TStringField
        FieldName = 'NOMEMOTORISROM'
        Origin = 'PDCORP.ROMANEIO.NOMEMOTORISROM'
        Size = 40
      end
      object QRomaneioVEICULOROM: TIntegerField
        FieldName = 'VEICULOROM'
        Origin = 'PDCORP.ROMANEIO.VEICULOROM'
      end
      object QRomaneioDESCVEICROM: TStringField
        FieldName = 'DESCVEICROM'
        Origin = 'PDCORP.ROMANEIO.DESCVEICROM'
        Size = 60
      end
      object QRomaneioMONITORROM: TIntegerField
        FieldName = 'MONITORROM'
        Origin = 'PDCORP.ROMANEIO.MONITORROM'
      end
    end
    object MItRomaneio: TMSMemDataSet
      FieldRoster = <
        item
          Name = 'PEDIDOIROM'
          Size = 0
          FieldType = fdtInteger
        end
        item
          Name = 'OBSERVIROM'
          Size = 200
          FieldType = fdtString
        end
        item
          Name = 'NOMECLI'
          Size = 40
          FieldType = fdtString
        end
        item
          Name = 'CODPEDREP'
          Size = 40
          FieldType = fdtString
        end
        item
          Name = 'CIDADECLI'
          Size = 40
          FieldType = fdtString
        end
        item
          Name = 'UFCLI'
          Size = 2
          FieldType = fdtString
        end
        item
          Name = 'DTPED'
          Size = 0
          FieldType = fdtDateTime
        end
        item
          Name = 'DTENTPED'
          Size = 0
          FieldType = fdtDateTime
        end
        item
          Name = 'SEL'
          Size = 0
          FieldType = fdtBoolean
        end
        item
          Name = 'EMP'
          Size = 3
          FieldType = fdtString
        end
        item
          Name = 'CODREPPED'
          Size = 0
          FieldType = fdtInteger
        end
        item
          Name = 'ITENITPIROM'
          Size = 0
          FieldType = fdtInteger
        end>
      Active = True
      AfterPost = MItRomaneioAfterPost
      Left = 104
      Top = 332
      object MItRomaneioSEL: TBooleanField
        DisplayWidth = 5
        FieldName = 'SEL'
        Required = True
      end
      object MItRomaneioPEDIDOIROM: TIntegerField
        FieldName = 'PEDIDOIROM'
        Required = True
      end
      object MItRomaneioOBSERVIROM: TStringField
        DisplayWidth = 200
        FieldName = 'OBSERVIROM'
        Required = True
        Size = 200
      end
      object MItRomaneioNOMECLI: TStringField
        DisplayWidth = 40
        FieldName = 'NOMECLI'
        Required = True
        Size = 40
      end
      object MItRomaneioCIDADECLI: TStringField
        DisplayWidth = 40
        FieldName = 'CIDADECLI'
        Required = True
        Size = 40
      end
      object MItRomaneioUFCLI: TStringField
        DisplayWidth = 2
        FieldName = 'UFCLI'
        Required = True
        Size = 2
      end
      object MItRomaneioDTPED: TDateTimeField
        FieldName = 'DTPED'
        Required = True
      end
      object MItRomaneioDTENTPED: TDateTimeField
        FieldName = 'DTENTPED'
        Required = True
      end
      object MItRomaneioEMP: TStringField
        FieldName = 'EMP'
        Required = True
        Size = 3
      end
      object MItRomaneioCODREPPED: TIntegerField
        FieldName = 'CODREPPED'
        Required = True
      end
      object MItRomaneioCODPEDREP: TStringField
        FieldName = 'CODPEDREP'
        Required = True
        Size = 40
      end
      object MItRomaneioITENITPIROM: TIntegerField
        FieldName = 'ITENITPIROM'
        Required = True
      end
    end
    object dsItRomaneio: TDataSource
      DataSet = MItRomaneio
      Left = 72
      Top = 332
    end
    object QryAux: TQuery
      AfterEdit = QRomaneioAfterEdit
      BeforePost = QRomaneioBeforePost
      BeforeDelete = QRomaneioBeforeDelete
      OnNewRecord = QRomaneioNewRecord
      AutoRefresh = True
      DatabaseName = 'PDCORP'
      RequestLive = True
      Left = 266
      Top = 80
      object StringField1: TStringField
        FieldName = 'EMPROM'
        Origin = 'PDCORP.ROMANEIO.EMPROM'
        Size = 3
      end
      object IntegerField1: TIntegerField
        FieldName = 'CODROM'
        Origin = 'PDCORP.ROMANEIO.CODROM'
      end
      object DateTimeField1: TDateTimeField
        FieldName = 'DATAROM'
        Origin = 'PDCORP.ROMANEIO.DATAROM'
      end
      object DateTimeField2: TDateTimeField
        FieldName = 'DATAEMBROM'
        Origin = 'PDCORP.ROMANEIO.DATAEMBROM'
      end
      object StringField2: TStringField
        FieldName = 'OBSERVROM'
        Origin = 'PDCORP.ROMANEIO.OBSERVROM'
        Size = 200
      end
      object IntegerField2: TIntegerField
        FieldName = 'STATUSROM'
        Origin = 'PDCORP.ROMANEIO.STATUSROM'
      end
      object DateTimeField3: TDateTimeField
        FieldName = 'DTSTATROM'
        Origin = 'PDCORP.ROMANEIO.DTSTATROM'
      end
      object IntegerField3: TIntegerField
        FieldName = 'MOTORISTAROM'
        Origin = 'PDCORP.ROMANEIO.MOTORISTAROM'
      end
      object StringField3: TStringField
        FieldName = 'NOMEMOTORISROM'
        Origin = 'PDCORP.ROMANEIO.NOMEMOTORISROM'
        Size = 40
      end
      object IntegerField4: TIntegerField
        FieldName = 'VEICULOROM'
        Origin = 'PDCORP.ROMANEIO.VEICULOROM'
      end
      object StringField4: TStringField
        FieldName = 'DESCVEICROM'
        Origin = 'PDCORP.ROMANEIO.DESCVEICROM'
        Size = 60
      end
    end
    object TIRomCarga: TTable
      BeforePost = TIRomCargaBeforePost
      OnCalcFields = TIRomCargaCalcFields
      OnNewRecord = TIRomCargaNewRecord
      DatabaseName = 'pdcorp'
      Filtered = True
      FieldDefs = <
        item
          Name = 'EMPIRC'
          Attributes = [faRequired]
          DataType = ftString
          Size = 3
        end
        item
          Name = 'CODIRC'
          Attributes = [faRequired]
          DataType = ftInteger
        end
        item
          Name = 'ITEMIRC'
          Attributes = [faRequired]
          DataType = ftInteger
        end
        item
          Name = 'DESCRICAOIRC'
          DataType = ftString
          Size = 100
        end
        item
          Name = 'QTDADEIRC'
          DataType = ftFloat
        end
        item
          Name = 'UNIDIRC'
          DataType = ftInteger
        end
        item
          Name = 'CLIENTEIRC'
          DataType = ftInteger
        end
        item
          Name = 'OBSERVACAOIRC'
          DataType = ftString
          Size = 255
        end
        item
          Name = 'CODPROIRC'
          DataType = ftString
          Size = 12
        end
        item
          Name = 'MONITORIRC'
          DataType = ftInteger
        end
        item
          Name = 'DATAEMBIRC'
          DataType = ftDateTime
        end
        item
          Name = 'MOTORISTAIRC'
          DataType = ftInteger
        end
        item
          Name = 'SITUACAOIRC'
          DataType = ftString
          Size = 1
        end>
      IndexDefs = <
        item
          Name = 'IROMANCARGA0'
          Fields = 'EMPIRC;CODIRC;ITEMIRC'
          Options = [ixUnique]
        end>
      IndexFieldNames = 'EMPIRC;CODIRC'
      MasterFields = 'EMPROM;CODROM'
      MasterSource = dsRomaneio
      StoreDefs = True
      TableName = 'IROMANCARGA'
      Left = 259
      Top = 448
      object TIRomCargaEMPIRC: TStringField
        FieldName = 'EMPIRC'
        Required = True
        Size = 3
      end
      object TIRomCargaCODIRC: TIntegerField
        FieldName = 'CODIRC'
        Required = True
      end
      object TIRomCargaITEMIRC: TIntegerField
        FieldName = 'ITEMIRC'
        Required = True
      end
      object TIRomCargaDESCRICAOIRC: TStringField
        FieldName = 'DESCRICAOIRC'
        Size = 100
      end
      object TIRomCargaQTDADEIRC: TFloatField
        FieldName = 'QTDADEIRC'
        DisplayFormat = '#####0.00'
      end
      object TIRomCargaUNIDIRC: TIntegerField
        FieldName = 'UNIDIRC'
      end
      object TIRomCargaCLIENTEIRC: TIntegerField
        FieldName = 'CLIENTEIRC'
      end
      object TIRomCargaOBSERVACAOIRC: TStringField
        FieldName = 'OBSERVACAOIRC'
        Size = 255
      end
      object TIRomCargadescunidade: TStringField
        FieldKind = fkCalculated
        FieldName = 'descunidade'
        Size = 40
        Calculated = True
      end
      object TIRomCargadesccliente: TStringField
        FieldKind = fkCalculated
        FieldName = 'desccliente'
        Size = 40
        Calculated = True
      end
      object TIRomCargaCODPROIRC: TStringField
        FieldName = 'CODPROIRC'
        OnValidate = TIRomCargaCODPROIRCValidate
        Size = 12
      end
      object TIRomCargaMONITORIRC: TIntegerField
        FieldName = 'MONITORIRC'
      end
      object TIRomCargaDATAEMBIRC: TDateTimeField
        FieldName = 'DATAEMBIRC'
        EditMask = '!99/99/00;1; '
      end
      object TIRomCargaMOTORISTAIRC: TIntegerField
        FieldName = 'MOTORISTAIRC'
      end
      object TIRomCargadescmotora: TStringField
        FieldKind = fkCalculated
        FieldName = 'descmotora'
        Size = 30
        Calculated = True
      end
      object TIRomCargaSITUACAOIRC: TStringField
        FieldName = 'SITUACAOIRC'
        OnGetText = TIRomCargaSITUACAOIRCGetText
        Size = 1
      end
    end
    object dsIRomCar: TDataSource
      DataSet = TIRomCarga
      Left = 224
      Top = 448
    end
    object dsMonitor: TDataSource
      DataSet = DMPCP.TParMonitoram
      OnStateChange = dsRomaneioStateChange
      Left = 202
      Top = 112
    end
    object QryCons: TQuery
      DatabaseName = 'PDCORP'
      Left = 323
      Top = 59
    end
  end
    `,t=document.querySelector("#pas-input"),i=document.querySelector("#dfm-input"),n=document.querySelector("#fast-conversion");!t||!i||!n||(t.value=e.trim(),i.value=d.trim(),this.fastConversion&&n.checked)}static \u0275fac=function(d){return new(d||g)(w(v))};static \u0275cmp=$({type:g,selectors:[["app-old-design"]],decls:70,vars:0,consts:[[1,"m-3"],["id","pas-container",1,"col-12","flex"],[1,"col-6","p-05"],["for","pas-input",1,"label-control"],["id","pas-input","autocomplete","off",1,"form-control"],["for","pas-output",1,"label-control"],["id","pas-output","autocomplete","off","readonly","",1,"form-control",3,"click"],["id","dfm-container",1,"col-12","flex"],["id","dfm-input","autocomplete","off",1,"form-control"],["for","dfm-output",1,"label-control"],["id","dfm-output","autocomplete","off","readonly","",1,"form-control",3,"click"],[1,"col-12","flex","centralize","p-3"],[1,"col-6","p-3"],["type","button",1,"btn","col-12","p-05",3,"click"],["for","fast-conversion",1,"label-control"],["type","checkbox","id","fast-conversion"],[3,"submit"],[1,"p-3"],["id","current-control",1,"col-12","flex","flex-wrap"],[1,"col-12","p-05"],["for","parent-output",1,"label-control"],["id","parent-output","autocomplete","off",1,"form-control"],[1,"col-4","p-05"],["for","class-output",1,"label-control"],["id","class-output","autocomplete","off",1,"form-control"],["for","name-output",1,"label-control"],["id","name-output","autocomplete","off",1,"form-control"],["for","caption-output",1,"label-control"],["id","caption-output","autocomplete","off",1,"form-control"],["id","current-control",1,"col-12","flex"],["for","order-input",1,"label-control"],["id","order-input","autocomplete","off",1,"form-control"],["value","-1"],["for","width-input",1,"label-control"],["id","width-input","autocomplete","off",1,"form-control"],["value","0"],[1,"col-12","flex","centralize","p-3","gap-3"],[1,"col-3","px-1"],["type","button","id","ui-prev","disabled","true",1,"btn","col-12","p-05"],["type","submit","id","ui-next",1,"btn","col-12","p-05"]],template:function(d,t){d&1&&(S(0,"header",0)(1,"h1"),m(2,"Delphi Screen Converion Helper 2.0"),I()(),S(3,"main")(4,"div",1)(5,"div",2)(6,"label",3),m(7," .pas Input "),h(8,"textarea",4),I()(),S(9,"div",2)(10,"label",5),m(11," .pas Output "),S(12,"textarea",6),y("click",function(){return t.copyPasOutputToClipboard()}),I()()()(),S(13,"div",7)(14,"div",2)(15,"label",3),m(16," .dfm Input "),h(17,"textarea",8),I()(),S(18,"div",2)(19,"label",9),m(20," .dfm Output "),S(21,"textarea",10),y("click",function(){return t.copyDfmOutputToClipboard()}),I()()()(),S(22,"div",11)(23,"div",12)(24,"button",13),y("click",function(){return t.convert()}),m(25,"Convert"),I()(),S(26,"div",12)(27,"label",14),h(28,"input",15),m(29," Fast Conversion "),I()()(),S(30,"form",16),y("submit",function(n){return n.preventDefault()}),S(31,"h2",17),m(32,"Semi-automatic conversion"),I(),S(33,"div",18)(34,"div",19)(35,"label",20),m(36," parent "),h(37,"output",21),I()(),S(38,"div",22)(39,"label",23),m(40," class "),h(41,"output",24),I()(),S(42,"div",22)(43,"label",25),m(44," name "),h(45,"output",26),I()(),S(46,"div",22)(47,"label",27),m(48," caption "),h(49,"output",28),I()()(),S(50,"div",29)(51,"div",2)(52,"label",30),m(53," order "),S(54,"select",31)(55,"option",32),m(56,"-1"),I()()()(),S(57,"div",2)(58,"label",33),m(59," width "),S(60,"select",34)(61,"option",35),m(62,"col-0"),I()()()()(),S(63,"div",36)(64,"div",37)(65,"button",38),m(66,"< Previous"),I()(),S(67,"div",37)(68,"button",39),m(69,"Next >"),I()()()()())},styles:["*[_ngcontent-%COMP%]{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:14px;color:#fff;margin:0;padding:0}[_nghost-%COMP%]{background-color:#010115;z-index:9998}main[_ngcontent-%COMP%]{width:100vw;height:100vh}.flex[_ngcontent-%COMP%]{display:flex}.flex.centralize[_ngcontent-%COMP%]{align-items:center;justify-content:center}.flex-wrap[_ngcontent-%COMP%]{flex-wrap:wrap}.gap-3[_ngcontent-%COMP%]{gap:1rem}.m-3[_ngcontent-%COMP%]{margin:1rem}.my-3[_ngcontent-%COMP%]{margin-top:1rem;margin-bottom:1rem}.p-05[_ngcontent-%COMP%]{padding:.5rem}.p-3[_ngcontent-%COMP%]{padding:1rem}.px-1[_ngcontent-%COMP%]{padding-left:.25rem;padding-right:.25rem}.col-12[_ngcontent-%COMP%], .col-6[_ngcontent-%COMP%], .col-4[_ngcontent-%COMP%], .col-3[_ngcontent-%COMP%]{box-sizing:border-box}.col-12[_ngcontent-%COMP%]{width:100%!important}.col-6[_ngcontent-%COMP%]{width:50%!important}.col-4[_ngcontent-%COMP%]{width:calc((100% / 12) * 4)!important}.col-3[_ngcontent-%COMP%]{width:calc((100% / 12) * 3)!important}.label-control[_ngcontent-%COMP%]{font-weight:700;text-indent:1.5rem;display:unset}.form-control[_ngcontent-%COMP%]{background-color:#202022;display:inline-block;width:100%;height:2rem;line-height:2rem;border:none;border-radius:.5rem;box-shadow:none;margin-top:.3rem;overflow:auto}.btn[_ngcontent-%COMP%]{background-color:#a9a9a9;height:2rem;border:none;border-radius:.5rem;box-shadow:none;box-sizing:content-box}#pas-input[_ngcontent-%COMP%], #pas-output[_ngcontent-%COMP%], #dfm-input[_ngcontent-%COMP%], #dfm-output[_ngcontent-%COMP%]{height:4rem}#loading-container[_ngcontent-%COMP%]{position:fixed;top:0;left:0;height:100vh;width:100vw;background-color:#000000a6;display:flex;justify-content:center;align-items:center;z-index:999}#loader[_ngcontent-%COMP%]{border:2px solid #ffffffd4;border-top:2px solid transparent;border-radius:50%;width:20px;height:20px;animation:_ngcontent-%COMP%_spin 1.5s linear infinite}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"]})};var U=[{path:"",children:[{path:"**",component:L}]}],Q=class g{static \u0275fac=function(d){return new(d||g)};static \u0275mod=x({type:g});static \u0275inj=f({imports:[O.forChild(U),O]})};var q=class g{static \u0275fac=function(d){return new(d||g)};static \u0275mod=x({type:g});static \u0275inj=f({imports:[H,Q]})};export{q as Dsc8V2Module};
