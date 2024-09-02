import { AfterViewInit, Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

   pasInput!: string;
   pasOutput!: string;
   dfmInput!: string;
   dfmOutput!: string;
   fastConversion!: boolean;
   dfmForm!: string;

   constructor(@Inject(PLATFORM_ID) private _platformId: Object) {}

   ngOnInit(): void {

   }

   ngAfterViewInit(): void {
      if (isPlatformBrowser(this._platformId)) setTimeout(() => { this.defSettings(); }, 1000);
   }

   //--- Apply the Screen Conversion
   async convert() {
      this.loading(true);

      setTimeout(async () => {
         // init values
         this.pasInput = '';
         this.pasOutput = '';
         this.dfmInput = '';
         this.dfmOutput = '';

         // receive input screen code
         const el_1 = document.querySelector('#pas-input');
         const el_2 = document.querySelector('#dfm-input');
         const el_5 = document.querySelector('#fast-conversion');

         if (!el_1 || !el_2 || !el_5) return;
         this.pasInput = (el_1 as HTMLTextAreaElement).value;
         this.dfmInput = (el_2 as HTMLTextAreaElement).value;
         this.fastConversion = (el_5 as HTMLInputElement).checked;


         // format .dfm and .ps to javascript object
         console.log('Formating DFM and PAS to Javascript...');
         console.log('Result:')
         const dfm_js: any = this.dfmToJs(this.dfmInput);
         const pas_js: any = this.pasToJs(this.pasInput);
         this.dfmForm = dfm_js[Object.keys(dfm_js)[0]]['_objectClass'];
         console.log(dfm_js);
         console.log(pas_js);
         // console.log({pas_js: pas_js[Object.keys(pas_js)[0]].split('\n')});
         // console.log(pas_js[Object.keys(pas_js)[0]].split('\n').length);
         console.log('\n');

         // apply styles
         this.applyStyles(dfm_js, pas_js);
         this.addHeader(dfm_js, pas_js);
         this.addButtons(dfm_js, pas_js);
         this.addTabsButtons(dfm_js, pas_js);
         this.loading(false);
         if (!this.fastConversion) await this.semiAutoConversion(dfm_js)

         // provide result
         this.dfmOutput = this.jsToDfm(dfm_js);
         this.pasOutput = this.jsToPAS(pas_js);

         const el_3 = document.querySelector('#pas-output');
         const el_4 = document.querySelector('#dfm-output');

         if (!el_3 || !el_4) return;
         (el_3 as HTMLTextAreaElement).value = `${this.pasOutput}`;
         (el_4 as HTMLTextAreaElement).value = `${this.dfmOutput}`;
      }, 0);
   }

   //--- DFM to Javascript
   dfmToJs(dfmText: string) {
      const lines = dfmText
         .trim().split('\n')
         .map((l, i) => ' '.repeat((2 - (String(l).search(/\S/) % 2)) % 2) + String(l));
      lines[lines.length - 1] = lines[lines.length - 1].trim();

      const stack: any = [];
      let root: any = {};
      let multilineStyle: { active: boolean, type: string, level: number | null, key: string, key1: string } = { active: false, type: '', level: null, key: '', key1: '' };

      let levels: any = [];
      lines.map(l => {
         const i1 = l.search(/\S/);
         if (!levels.filter((v: any) => v.i1 === i1).length) {
            levels.push({
               i1: i1,
               i2: levels.reverse().map((v: any, i: number) => (i1 < v.i1) ? i + 1 : null).filter((v: any) => v)[0] || levels.length
            });
         }

         levels.sort();
      });

      for (let [index, line] of lines.entries()) {

         // Determine the level of indentation
         const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index
         const trimmedLine = String(line.trim());

         // adds a multiline style started in a previous line
         if (multilineStyle.active) {

            if (multilineStyle.level) {
               if (multilineStyle.type === 'object') {
                  stack[multilineStyle.level][multilineStyle.key][multilineStyle.key1] = String(stack[multilineStyle.level][multilineStyle.key][multilineStyle.key1])
                     .concat('\n', ' '.repeat(Math.abs((level - 1) * 2)), trimmedLine);
               } else if (multilineStyle.type === 'string') {
                  stack[multilineStyle.level][multilineStyle.key] = String(stack[multilineStyle.level][multilineStyle.key])
                     .concat('\n', ' '.repeat(Math.abs((level - 1) * 2)), trimmedLine);
               } else if (multilineStyle.type === 'items') {
                  stack[multilineStyle.level][multilineStyle.key] = String(stack[multilineStyle.level][multilineStyle.key])
                     .concat('\n', ' '.repeat(Math.abs((level - 1) * 2)), trimmedLine);
               }
            }

            // current line closes the object or is not adding a new string line style
            if ((multilineStyle.type === 'object' && (String(trimmedLine).endsWith('}') || String(trimmedLine).endsWith(')'))) ||
               (multilineStyle.type === 'string' && !String(trimmedLine).endsWith('+')) ||
               (multilineStyle.type === 'items' && String(trimmedLine).endsWith('end>'))
            ) {
               multilineStyle.active = false;
               multilineStyle.level = null;
               multilineStyle.key = '';
               multilineStyle.key1 = '';
            }

            continue;
         }
         // create a new object for the current line
         else if (new RegExp('^object\\s\\w+:\\s\\w+').test(trimmedLine)) {
            const key = String(trimmedLine).match(new RegExp('object\\s(\\w+)'))?.[1];
            if (!key) continue;

            const newObject = {};

            if (level > 0) {
               // Add the new object to the parent object
               stack[level - 1][key] = newObject;
            } else {
               // Root level object
               root[key] = newObject;
            }
            // console.log({v: JSON.parse(JSON.stringify(root))})
            stack[level] = newObject; // init the object content
            stack[level]['_objectClass'] = String(trimmedLine).match(new RegExp(`(?<=${key}: ).*`))?.[0]; // set object class

         }
         // create a new style for the current line
         else if (new RegExp('^\\w+\\s=\\s').test(trimmedLine)) {
            const key = String(trimmedLine).match(new RegExp('(\\w+)'))?.[1];
            if (!key) continue;

            stack[level - 1][key] = String(trimmedLine).match(new RegExp(`(?<=${key} = ).*`))?.[0];

            if (stack[level - 1][key] === '<') {
               multilineStyle.active = true;
               multilineStyle.type = 'items';
               multilineStyle.level = level - 1;
               multilineStyle.key = key;
               multilineStyle.key1 = '';
            }
         }
         // create a nested style for the current line
         else if (new RegExp('^\\w+\\.\\w+\\s=\\s').test(trimmedLine)) {
            const newObject = {};
            const key = String(trimmedLine).match(new RegExp('(\\w+)'))?.[1];
            if (!key) continue;

            if (!stack[level - 1][key]) stack[level - 1][key] = newObject;

            const key1 = String(trimmedLine).match(new RegExp(`${key}\\.(\\w+)`))?.[1];
            if (!key1) continue;
            stack[level - 1][key][key1] = String(trimmedLine).match(new RegExp(`(?<=${key}\\.${key1} = ).*`))?.[0];

            // check for multine style
            if (String(trimmedLine).match(new RegExp(`(?<=${key}\\.${key1} = )\\{`)) ||
               String(trimmedLine).match(new RegExp(`(?<=${key}\\.${key1} = )\\(`))
            ) {
               multilineStyle.active = true;
               multilineStyle.type = 'object';
               multilineStyle.level = level - 1;
               multilineStyle.key = key;
               multilineStyle.key1 = key1;
            }
         }
         // create a null value to the current line
         else if (!(new RegExp('end').test(trimmedLine))) {

            if (new RegExp('^\\w+\\s=').test(trimmedLine)) {
               const key = String(trimmedLine).match(new RegExp('\\w+'))?.[0];
               if (!key) continue;
               stack[level - 1][key] = '';

               multilineStyle.active = true;
               multilineStyle.type = 'string';
               multilineStyle.level = level - 1;
               multilineStyle.key = key;
               multilineStyle.key1 = '';

            }
         }
      };

      return root;
   }

   //--- Javascript to DFM
   jsToDfm(jsObj: string) {

      const sortJs = (jsObj: string): any => {
         // Convert object properties to an array of key-value pairs
         const sortedEntries = Object.entries(jsObj).sort((a, b) => {
            const orderA = (a[1] as any)?.['_order'] !== undefined ? Number((a[1] as any)?.['_order']) : Number.MAX_SAFE_INTEGER;
            const orderB = (b[1] as any)?.['_order'] !== undefined ? Number((b[1] as any)?.['_order']) : Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
         });

         // Create a new object with sorted entries
         const sortedObj: any = {};
         for (const [key, value] of sortedEntries) {
            // If the value is an object and not null, recursively sort it
            sortedObj[key] = (typeof value === 'object' && value !== null) ? sortJs(value) : value;
         }

         return sortedObj;
      };

      const getDfmAsLines = (jsObj: any, indentLevel: number): any => {
         if (!indentLevel) indentLevel = 0;

         const result = [];
         const keys = Object.keys(jsObj);
         const lastKeyIndex = keys.length - 1;
         for (const key in jsObj) {

            if (jsObj[key] !== null) {
               // new object case/nested style
               if (typeof jsObj[key] === 'object') {
                  // new object
                  if (jsObj[key]['_objectClass']) {
                     result.push(`${' '.repeat(indentLevel * 2)}object ${key}: ${jsObj[key]['_objectClass']}`); // push object

                     result.push(...getDfmAsLines(jsObj[key], indentLevel + 1)); // recursively access object and push its content
                  }
                  // nested style
                  else {
                     for (const nestedKey in jsObj[key]) {
                        if (!jsObj[key][nestedKey]) continue;

                        // calculate the content indentation for multiline values
                        const contentIndentLevel = (indentLevel * 2) - (String(jsObj[key][nestedKey]).split('\n')?.[1]?.search(/\S/) || indentLevel * 2) + 2;
                        // set the content indentation for multiline values
                        const keyValue = String(jsObj[key][nestedKey]).split('\n')
                           .map((l, i) => i > 0 && contentIndentLevel > 0 ? ' '.repeat(contentIndentLevel) + l : l)
                           .join('\n');
                        // push nested style (key1.key2 = value)
                        result.push(`${' '.repeat(indentLevel * 2)}${key}.${nestedKey} = ${keyValue}`);
                     }
                  }

                  // close object after last object
                  if (keys.indexOf(key) === lastKeyIndex) {
                     indentLevel--;
                     if (indentLevel >= 0) result.push(`${' '.repeat(indentLevel * 2)}end`);
                  }
               }
               // object style case
               else if (key !== '_objectClass' && key !== '_order' && jsObj[key]) {

                  // calculate the content indentation for multiline values
                  const contentIndentLevel = (indentLevel * 2) - (String(jsObj[key]).split('\n')?.[1]?.search(/\S/) || indentLevel * 2) + 2;
                  // set the content indentation for multiline values
                  const keyValue = String(jsObj[key]).split('\n')
                     .map((l, i) => i > 0 && contentIndentLevel > 0 ? ' '.repeat(contentIndentLevel) + l : l)
                     .join('\n');
                  // push style (key = value)
                  result.push(`${' '.repeat(indentLevel * 2)}${key} = ${keyValue}`); // push style

                  // close object after last style
                  if (keys.indexOf(key) === lastKeyIndex) {
                     if (indentLevel > 0) indentLevel--;
                     result.push(`${' '.repeat(indentLevel * 2)}end`);
                  }
               }
            }

         }

         return result;
      };

      const reorderDfm = (lines: Array<string>): any => {

         const result: any = [];

         // get level accordingly to the line indentation level
         let levels: any = [];
         lines.map(l => {
            const i1 = l.search(/\S/);
            if (!levels.filter((v: any) => v.i1 === i1).length) {
               levels.push({
                  i1: i1,
                  i2: levels.reverse().map((v: any, i: number) => (i1 < v.i1) ? i + 1 : null).filter((v: any) => v)[0] || levels.length
               });
            }

            levels.sort();
         });

         // push properties
         const pushProperties = (linesStack: any, indentLevel = 0) => {
            for (const [index, line] of linesStack.entries()) {
               // Determine the level of indentation
               const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index
               const propLine = !Boolean(String(line).trim().match(new RegExp('\\bobject \\w+: \\w+'))) && String(line).trim() !== 'end';
               const sameLevel = level === indentLevel;

               if (level === indentLevel - 1) break;

               if (propLine && sameLevel) {
                  result.push(line);
               }
            }
         };

         // push objects
         const pushObjects = (linesStack: any, indentLevel = 0) => {
            pushProperties(linesStack, indentLevel);

            for (const [index, line] of linesStack.entries()) {
               // Determine the level of indentation
               const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index
               const objLine = Boolean(String(line).trim().match(new RegExp('\\bobject \\w+: \\w+')));
               const sameLevel = level === indentLevel;

               if (level === indentLevel - 1) break;

               if (objLine && sameLevel) {
                  result.push(line);
                  pushObjects(linesStack.slice(index + 1), indentLevel + 1);
                  result.push(`${' '.repeat(indentLevel * 2)}end`);
               }
            }
         };

         pushObjects(lines);
         return result;
      };

      return reorderDfm(getDfmAsLines(sortJs(jsObj), 0)).join('\n');
   }
   //--- PAS to Javascript
   pasToJs(pasText: string) {
      const obj: any = {};
      obj[String(pasText).match(new RegExp('unit\\s(\\w+)'))?.[1] || ''] = `${pasText}`;

      return obj;
   }
   //--- Javascript to PAS
   jsToPAS(jsText: string) {
      const unitKey: any = Object.keys(jsText)?.[0];
      return jsText[unitKey];
   }

   //--- PAS Add Object
   pasAddObject(pasObj: any, objClass: string, objName: string) {

      const getObjectsLastLineIndex = (lines: Array<string>): number => {
         // get level accordingly to the line indentation level
         let levels: any = [];
         lines.forEach(l => {
            const i1 = l.search(/\S/);
            if (!levels.filter((v: any) => v.i1 === i1).length) {
               levels.push({
                  i1: i1,
                  i2: levels.reverse().map((v: any, i: number) => (i1 < v.i1) ? i + 1 : null).filter((v: any) => v)[0] || levels.length
               });
            }

            levels.sort();
         });

         let formDeclaration = false;
         let formDeclarationLevel = null;
         for (const [index, line] of lines.entries()) {
            const trimmedLine = line.trim();
            const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index

            // when form declaration ends
            if (formDeclaration && level !== formDeclarationLevel + 1) {
               formDeclaration = false;
               return index - 1;
            }
            // mark form declaration start
            if (trimmedLine.match('\\b\\w+\\s=\\s\\w+\(\\w+\)')) {
               formDeclaration = true;
               formDeclarationLevel = level;
            }

            // return the form objects declaration line index
            if (formDeclaration) {
               if (trimmedLine.match(new RegExp('procedure\\s'))) {
                  return index - 1;
               }
            }
         }

         return -1;
      };

      // find the index of the last object declaration
      const unitKey = Object.keys(pasObj)[0];
      let lines = String(pasObj[unitKey]).trim().split('\n');
      const objIndex: number = getObjectsLastLineIndex(lines);

      // declare a new line to the requested object
      const indent = String(lines[objIndex]).match(new RegExp('\\s*'))?.[0];
      let newLines = new Array();
      newLines = newLines.concat(lines.slice(0, objIndex + 1));
      newLines.push(`${indent}${objName}: ${objClass};`);
      newLines = newLines.concat(lines.slice(objIndex + 1, lines.length));
      lines = newLines;

      // update the PAS object with the new object
      pasObj[unitKey] = newLines.join('\n');
   }
   //--- PAS Remove Object
   pasRemoveObject(pasObj: any, objClass: string, objName: string) {

      // find the index of the last object declaration
      const unitKey = Object.keys(pasObj)[0];
      let lines = String(pasObj[unitKey]).trim().split('\n');

      // filter lines that are not the object declaration
      let newLines = new Array();
      if (objClass) newLines = newLines.concat(lines.filter(l => !l.trim().match(`\\b${objName}: ${objClass};`)));
      else newLines = newLines.concat(lines.filter(l => !l.trim().match(`\\b${objName}: \\w+;`)));
      lines = newLines;

      // update the PAS object with the new object
      pasObj[unitKey] = newLines.join('\n');
   }

   //--- PAS Add Method
   pasAddMethod(pasObj: any, methodType: string, methodName: string, methodParams: string, methodContent: string) {

      const getFormName = (lines: Array<string>): string => {
         for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.match('\\b\\w+\\s=\\s\\w+\(\\w+\)')) return trimmedLine.match('\\b\\w+')?.[0] || '';
         }
         return '';
      };

      const getMethodLastLineIndex = (lines: Array<string>): number => {
         let formDeclaration = false;
         let formDeclarationLevel = null;
         for (const [index, line] of lines.entries()) {
            const trimmedLine = line.trim();
            const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index

            // when form declaration ends
            if (formDeclaration && level !== formDeclarationLevel + 1) {
               formDeclaration = false;
               return index - 1;
            }
            // mark form declaration start
            if (trimmedLine.match('\\b\\w+\\s=\\s\\w+\(\\w+\)')) {
               formDeclaration = true;
               formDeclarationLevel = level;
            }

            // return the form objects declaration line index
            if (formDeclaration) {
               if (trimmedLine.match(new RegExp('procedure\\s'))) {
                  return index - 1;
               }
            }
         }

         return -1;
      };

      const getMethodDeclarationLastLineIndex = (lines: Array<string>): number => {
         let methodMatches = 0;

         for (const [index, line] of lines.entries()) {
            const trimmedLine = line.trim();
            const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index

            // mark form declaration start
            if (trimmedLine.match(new RegExp(`${methodType} ${methodName}`))) {
               methodMatches++;
            }

            // return the form objects declaration line index
            if (methodMatches >= 2) {
               const currEnd = trimmedLine.match(new RegExp('end;'));
               const next1Blank = String(lines[index + 1]).trim() === '';
               const next2End = String(lines[index + 2]).trim().includes('end.')
               const next2Method = String(lines[index + 2]).trim().includes('procedure') || String(lines[index + 2]).trim().includes('function');

               if (currEnd && next1Blank && (next2End || next2Method)) return index;
            }
         }

         return -1;
      };

      const unitKey = Object.keys(pasObj)[0];
      let lines = String(pasObj[unitKey]).trim().split('\n');
      const formName = getFormName(lines);
      // get level accordingly to the line indentation level
      let levels: any = [];
      lines.forEach(l => {
         const i1 = l.search(/\S/);
         if (!levels.filter((v: any) => v.i1 === i1).length) {
            levels.push({
               i1: i1,
               i2: levels.reverse().map((v: any, i: number) => (i1 < v.i1) ? i + 1 : null).filter((v: any) => v)[0] || levels.length
            });
         }

         levels.sort();
      });
      let newLines = new Array();
      const methodExists = String(pasObj[unitKey]).includes(`${methodType} ${methodName}`);

      // declare method
      // case method does not exists
      if (!methodExists) {

         // find the index of the last method declaration
         const methodIndex = getMethodLastLineIndex(lines);

         // declare a new line to the requested method
         const indent = String(lines[methodIndex]).match(new RegExp('\\s*'))?.[0] || '';
         newLines = new Array();
         newLines = newLines.concat(lines.slice(0, methodIndex + 1));
         newLines.push(`${indent}${methodType} ${methodName}(${methodParams});`);
         newLines = newLines.concat(lines.slice(methodIndex + 1, lines.length));
         lines = newLines;
      }
      // case method already exists
      else {

      }
      // implement method
      // case method does not exists
      if (!methodExists) {

         // declare a new lines with the method implementation
         const indent = String(lines[lines.length - 1]).match(new RegExp('\\s*'))?.[0] || '';
         newLines = new Array();
         newLines = newLines.concat(lines.slice(0, lines.length - 1));
         newLines.push(`${indent}${formName}.${methodType} ${methodName}(${methodParams});`);
         newLines.push(`${indent}begin`);
         newLines.push(`${indent}${' '.repeat(3)}${methodContent.trim()}`);
         newLines.push(`${indent}end;\n`);
         newLines = newLines.concat(lines.slice(lines.length - 1, lines.length));
         lines = newLines;
      }
      // case method already exists
      else {
         // get the last implementation line of the method
         const methodIndex = getMethodDeclarationLastLineIndex(lines);

         // declare a new lines with the method implementation
         const indent = String(lines[lines.length - 1]).match(new RegExp('\\s*'))?.[0] || '';
         newLines = new Array();
         newLines = newLines.concat(lines.slice(0, methodIndex));
         newLines.push(`\n${indent}${' '.repeat(3)}${methodContent.trim()}`);
         newLines = newLines.concat(lines.slice(methodIndex, lines.length));
         lines = newLines;
      }

      // update the PAS object with the new object
      pasObj[unitKey] = newLines.join('\n') || pasObj[unitKey];
   }
   //--- PAS Remove Method
   pasRemoveMethod(pasObj: any, methodType: string, methodName: string) {

      // // find the index of the last object declaration
      // const unitKey = Object.keys(pasObj)[0];
      // const lines = String(pasObj[unitKey]).trim().split('\n');   

      // // filter lines that are not the object declaration
      // const newLines = new Array();
      // if(objClass) newLines.push(...lines.filter(l => !l.trim().match(`\\b${objName}: ${objClass};`)));
      // else newLines.push(...lines.filter(l => !l.trim().match(`\\b${objName}: \\w+;`)));

      // // update the PAS object with the new object
      // pasObj[unitKey] = newLines.join('\n');  
   }

   //--- Extract Object by Class
   extractObjectByClass(obj: any, className: string): any {
      let result = [];

      if (obj['_objectClass'] === className) {
         result.push(obj);
      }

      for (const key in obj) {
         if (typeof obj[key] === 'object' && obj[key] !== null) {
            result = result.concat(this.extractObjectByClass(obj[key], className));
         }
      }

      return result;
   }

   //--- Apply Styles
   applyStyles(dfmObj: any, pasObj: any) {
      for (const key in dfmObj) {

         if (typeof dfmObj[key] === 'object' && dfmObj[key] !== null) {

            if (!dfmObj[key]['_objectClass']) continue;
            this.applyStyles(dfmObj[key], pasObj);

            switch (dfmObj[key]['_objectClass']) {

               // form
               case dfmObj[Object.keys(dfmObj)[0]]['_objectClass']:
                  dfmObj[key]['Align'] = 'alNone';
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['BorderWidth'] = '0';
                  dfmObj[key]['Ctl3D'] = 'False';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Left'] = '400';
                  dfmObj[key]['Position'] = 'poMainFormCenter';
                  dfmObj[key]['Top'] = '200';
                  dfmObj[key]['Width'] = '910';
                  dfmObj[key]['Height'] = '600';
                  dfmObj[key]['ParentFont'] = 'False';
                  dfmObj[key]['WindowState'] = 'wsMaximized';
                  dfmObj[key]['TextHeight'] = '15';
                  break;

               case 'TLabel':
                  dfmObj[key]['Alignment'] = 'taLeftJustify';
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';

                  break;

               case 'TRadioButton':
                  dfmObj[key]['Alignment'] = 'taRightJustify';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TCheckBox':
                  dfmObj[key]['Alignment'] = 'taRightJustify';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TEdit':
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
                  dfmObj[key]['BevelInner'] = 'bvSpace';
                  dfmObj[key]['BevelKind'] = 'bkFlat';
                  dfmObj[key]['BevelOuter'] = 'bvRaised';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Ctl3D'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Height'] = '23';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TMSEditSel':
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
                  dfmObj[key]['BevelInner'] = 'bvSpace';
                  dfmObj[key]['BevelKind'] = 'bkFlat';
                  dfmObj[key]['BevelOuter'] = 'bvRaised';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Ctl3D'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Height'] = '23';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TComboBox':
                  dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
                  dfmObj[key]['BevelInner'] = 'bvSpace';
                  dfmObj[key]['BevelKind'] = 'bkFlat';
                  dfmObj[key]['BevelOuter'] = 'bvRaised';
                  dfmObj[key]['Ctl3D'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Height'] = '23';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TMaskEdit':
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
                  dfmObj[key]['BevelInner'] = 'bvSpace';
                  dfmObj[key]['BevelKind'] = 'bkFlat';
                  dfmObj[key]['BevelOuter'] = 'bvRaised';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Ctl3D'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Height'] = '23';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TMSDateEdit':
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
                  dfmObj[key]['BevelInner'] = 'bvSpace';
                  dfmObj[key]['BevelKind'] = 'bkFlat';
                  dfmObj[key]['BevelOuter'] = 'bvRaised';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['Height'] = '23';
                  dfmObj[key]['ParentFont'] = 'False';

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TDBGrid':
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Color'] = 'clWindow';
                  dfmObj[key]['Ctl3D'] = 'False';
                  dfmObj[key]['FixedColor'] = 'clBtnFace';
                  dfmObj[key]['ParentColor'] = 'False';
                  dfmObj[key]['ParentCtl3D'] = 'False';
                  dfmObj[key]['ParentFont'] = 'False';
                  dfmObj[key]['ParentShowHint'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = '8404992';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['TitleFont'] = {};
                  dfmObj[key]['TitleFont']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['TitleFont']['Color'] = '8404992';
                  dfmObj[key]['TitleFont']['Height'] = '-11';
                  dfmObj[key]['TitleFont']['Size'] = '9';
                  dfmObj[key]['TitleFont']['Name'] = "'Segoe UI'";
                  dfmObj[key]['TitleFont']['Style'] = '[fsBold]';
                  dfmObj[key]['Options'] = '[dgEditing, dgTitles, dgIndicator, dgColumnResize, dgTabs, dgAlwaysShowSelection, dgConfirmDelete, dgCancelOnExit]';

                  dfmObj[key]['OnDrawColumnCell'] = `${key}DrawColumnCell`;
                  dfmObj[key]['OnMouseUp'] = `${key}MouseUp`;
                  dfmObj[key]['OnTitleClick'] = `${key}TitleClick`;
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}DrawColumnCell`,
                     'Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState',
                     `if Odd(${key}.datasource.dataset.recno) then
                      ${key}.canvas.brush.color := $00DADADA
                    else
                      ${key}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${key}.canvas.brush.color := $0084632B;
                      ${key}.canvas.font.color := clwhite;
                      ${key}.canvas.font.style := [fsBold];
                    end;
              
                    ${key}.canvas.FillRect(Rect);
                    ${key}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${key}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}MouseUp`,
                     'Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}TitleClick`,
                     'Column: TColumn',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TMSDBGrid':
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Color'] = 'clWindow';
                  dfmObj[key]['Ctl3D'] = 'False';
                  dfmObj[key]['FixedColor'] = 'clBtnFace';
                  dfmObj[key]['ParentColor'] = 'False';
                  dfmObj[key]['ParentCtl3D'] = 'False';
                  dfmObj[key]['ParentFont'] = 'False';
                  dfmObj[key]['ParentShowHint'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = '8404992';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['TitleFont'] = {};
                  dfmObj[key]['TitleFont']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['TitleFont']['Color'] = '8404992';
                  dfmObj[key]['TitleFont']['Height'] = '-11';
                  dfmObj[key]['TitleFont']['Size'] = '9';
                  dfmObj[key]['TitleFont']['Name'] = "'Segoe UI'";
                  dfmObj[key]['TitleFont']['Style'] = '[fsBold]';
                  dfmObj[key]['Options'] = '[dgEditing, dgTitles, dgIndicator, dgColumnResize, dgTabs, dgAlwaysShowSelection, dgConfirmDelete, dgCancelOnExit]';

                  dfmObj[key]['OnDrawColumnCell'] = `${key}DrawColumnCell`;
                  dfmObj[key]['OnMouseUp'] = `${key}MouseUp`;
                  dfmObj[key]['OnTitleClick'] = `${key}TitleClick`;

                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}DrawColumnCell`,
                     'Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState',
                     `if Odd(${key}.datasource.dataset.recno) then
                      ${key}.canvas.brush.color := $00DADADA
                    else
                      ${key}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${key}.canvas.brush.color := $0084632B;
                      ${key}.canvas.font.color := clwhite;
                      ${key}.canvas.font.style := [fsBold];
                    end;
              
                    ${key}.canvas.FillRect(Rect);
                    ${key}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${key}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}MouseUp`,
                     'Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}TitleClick`,
                     'Column: TColumn',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TStringGrid':
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Color'] = 'clWindow';
                  dfmObj[key]['Ctl3D'] = 'False';
                  dfmObj[key]['FixedColor'] = 'clBtnFace';
                  dfmObj[key]['ParentColor'] = 'False';
                  dfmObj[key]['ParentCtl3D'] = 'False';
                  dfmObj[key]['ParentFont'] = 'False';
                  dfmObj[key]['ParentShowHint'] = 'True';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = '8404992';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[fsBold]';
                  dfmObj[key]['TitleFont'] = {};
                  dfmObj[key]['TitleFont']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['TitleFont']['Color'] = '8404992';
                  dfmObj[key]['TitleFont']['Height'] = '-11';
                  dfmObj[key]['TitleFont']['Size'] = '9';
                  dfmObj[key]['TitleFont']['Name'] = "'Segoe UI'";
                  dfmObj[key]['TitleFont']['Style'] = '[fsBold]';

                  dfmObj[key]['OnDrawColumnCell'] = `${key}DrawColumnCell`;
                  dfmObj[key]['OnMouseUp'] = `${key}MouseUp`;
                  dfmObj[key]['OnTitleClick'] = `${key}TitleClick`;
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}DrawColumnCell`,
                     'Sender: TObject; const Rect: TRect; DataCol: Integer; Column: TColumn; State: TGridDrawState',
                     `if Odd(${key}.datasource.dataset.recno) then
                      ${key}.canvas.brush.color := $00DADADA
                    else
                      ${key}.canvas.brush.color := clwhite;
              
                    if (gdSelected in State) then
                    begin
                      ${key}.canvas.brush.color := $0084632B;
                      ${key}.canvas.font.color := clwhite;
                      ${key}.canvas.font.style := [fsBold];
                    end;
              
                    ${key}.canvas.FillRect(Rect);
                    ${key}.Defaultdrawcolumncell( Rect, datacol, Column, State );
              
                    ${key}.canvas.textrect( rect, rect.left + 8, Rect.top+8, Column.field.displaytext );`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}MouseUp`,
                     'Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: Integer',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `${key}TitleClick`,
                     'Column: TColumn',
                     `TDBGridPad(${key}).defaultRowHeight := 30;
                    TDBGridPad(${key}).clientHeight     := (30 * TDBGridPad(${key}).rowcount) + 30;`
                  );

                  // ask user
                  // dfmObj[key]['Width'] = '';
                  // dfmObj[key]['Left'] = '';
                  // dfmObj[key]['Top'] = '';
                  // dfmObj[key]['TabStop'] = '';
                  // dfmObj[key]['TabOrder'] = '';
                  break;

               case 'TPanel':
                  // ask user
                  //dfmObj[key]['Align'] = 'alTop';
                  dfmObj[key]['AutoSize'] = 'False';
                  dfmObj[key]['BevelInner'] = 'bvNone';
                  dfmObj[key]['BevelOuter'] = 'bvNone';
                  dfmObj[key]['BorderStyle'] = 'bsNone';
                  dfmObj[key]['Color'] = 'clWhite';
                  dfmObj[key]['Ctl3D'] = 'False';
                  dfmObj[key]['Font'] = {};
                  dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
                  dfmObj[key]['Font']['Color'] = 'clBlack';
                  dfmObj[key]['Font']['Height'] = null;
                  dfmObj[key]['Font']['Size'] = '9';
                  dfmObj[key]['Font']['Name'] = "'Segoe UI'";
                  dfmObj[key]['Font']['Style'] = '[]';
                  dfmObj[key]['ParentFont'] = 'False';
                  break;


               default:
                  break;
            }

         }
      }
   }

   //--- Add Header
   addHeader(dfmObj: any, pasObj: any) {
      const formKey = Object.keys(dfmObj)[0];
      const headerKey = 'PanelTitle';
      const labelKey = 'LabelTitle';

      // add header panel and title label
      this.pasAddObject(pasObj, 'TPanel', headerKey);
      this.pasAddObject(pasObj, 'TLabel', labelKey);

      // header panel styles
      dfmObj[formKey][headerKey] = {};
      dfmObj[formKey][headerKey]['_objectClass'] = 'TPanel';
      dfmObj[formKey][headerKey]['_order'] = '0';
      dfmObj[formKey][headerKey]['Left'] = '0';
      dfmObj[formKey][headerKey]['Top'] = '0';
      dfmObj[formKey][headerKey]['Width'] = '894';
      dfmObj[formKey][headerKey]['Height'] = '32';
      dfmObj[formKey][headerKey]['Align'] = 'alTop';
      dfmObj[formKey][headerKey]['Alignment'] = 'taLeftJustify';
      dfmObj[formKey][headerKey]['AutoSize'] = 'False';
      dfmObj[formKey][headerKey]['BevelOuter'] = 'bvNone';
      dfmObj[formKey][headerKey]['Color'] = '6766380';
      dfmObj[formKey][headerKey]['Font'] = {};
      dfmObj[formKey][headerKey]['Font']['Charset'] = 'ANSI_CHARSET';
      dfmObj[formKey][headerKey]['Font']['Color'] = 'clWhite';
      dfmObj[formKey][headerKey]['Font']['Height'] = null;
      dfmObj[formKey][headerKey]['Font']['Size'] = '10';
      dfmObj[formKey][headerKey]['Font']['Name'] = "'Segoe UI'";
      dfmObj[formKey][headerKey]['Font']['Style'] = '[fsBold]';
      dfmObj[formKey][headerKey]['ParentFont'] = 'False';
      dfmObj[formKey][headerKey]['TabOrder'] = '2';

      // title label styles
      dfmObj[formKey][headerKey][labelKey] = {};
      dfmObj[formKey][headerKey][labelKey]['_objectClass'] = 'TLabel';
      dfmObj[formKey][headerKey][labelKey]['Left'] = '40';
      dfmObj[formKey][headerKey][labelKey]['Top'] = '7';
      dfmObj[formKey][headerKey][labelKey]['Width'] = `${((dfmObj[formKey]['Caption'].length - 2) * 10).toFixed()}`; // 10 by letter
      dfmObj[formKey][headerKey][labelKey]['Height'] = '17';
      dfmObj[formKey][headerKey][labelKey]['Align'] = 'alCustom';
      dfmObj[formKey][headerKey][labelKey]['AutoSize'] = 'False';
      dfmObj[formKey][headerKey][labelKey]['Caption'] = `${dfmObj[formKey]['Caption']}`
      dfmObj[formKey][headerKey][labelKey]['Font'] = {};
      dfmObj[formKey][headerKey][labelKey]['Font']['Charset'] = 'ANSI_CHARSET';
      dfmObj[formKey][headerKey][labelKey]['Font']['Color'] = 'clWhite';
      dfmObj[formKey][headerKey][labelKey]['Font']['Height'] = null;
      dfmObj[formKey][headerKey][labelKey]['Font']['Size'] = '10';
      dfmObj[formKey][headerKey][labelKey]['Font']['Name'] = "'Segoe UI'";
      dfmObj[formKey][headerKey][labelKey]['Font']['Style'] = '[fsBold]';
      dfmObj[formKey][headerKey][labelKey]['ParentFont'] = 'False';
   }

   //--- Add Buttons
   addButtons(dfmObj: any, pasObj: any, parent: string = '') {
      for (const key in dfmObj) {
         if (typeof dfmObj[key] === 'object' && dfmObj[key] !== null) {
            if (!dfmObj[key]['_objectClass']) continue;
            this.addButtons(dfmObj[key], pasObj, dfmObj['_objectClass']);

            if (String(dfmObj[key]['_objectClass']).includes('TSpeedButton') && dfmObj['_objectClass'] === 'TPanel') {
               // buttons container panel styles
               if (parent === this.dfmForm) {
                  dfmObj['_order'] = 'Infinity';
                  dfmObj['Align'] = 'alBottom';
               } else {
                  dfmObj['Align'] = 'alTop';
               }
               // dfmObj['Left'] = '0';
               // dfmObj['Top'] = '0';
               // dfmObj['Width'] = '894';
               dfmObj['Height'] = '39';
               dfmObj['BevelOuter'] = 'bvNone';
               dfmObj['Color'] = '15132390';
               // dfmObj['TabOrder'] = '3';

               // add button panel
               this.pasAddObject(pasObj, 'TPanel', `Panel${key}`);

               // buton panel styles
               dfmObj[`Panel${key}`] = {};
               dfmObj[`Panel${key}`]['_objectClass'] = 'TPanel';
               dfmObj[`Panel${key}`]['AutoSize'] = 'False';
               dfmObj[`Panel${key}`]['Left'] = '40'; // ask user
               dfmObj[`Panel${key}`]['Top'] = '6';
               dfmObj[`Panel${key}`]['Width'] = `${(((String(dfmObj[key]['Caption']).length - 2) * 10) + 20).toFixed()}`;
               dfmObj[`Panel${key}`]['Height'] = '28';
               dfmObj[`Panel${key}`]['BevelOuter'] = 'bvNone';
               dfmObj[`Panel${key}`]['Color'] = 'clWhite';
               dfmObj[`Panel${key}`]['Font'] = {};
               dfmObj[`Panel${key}`]['Font']['Charset'] = 'ANSI_CHARSET';
               dfmObj[`Panel${key}`]['Font']['Color'] = 'clGray'; // ask user (main button is white font)
               dfmObj[`Panel${key}`]['Font']['Height'] = null;
               dfmObj[`Panel${key}`]['Font']['Size'] = '10';
               dfmObj[`Panel${key}`]['Font']['Name'] = "'Segoe UI'";
               dfmObj[`Panel${key}`]['Font']['Style'] = '[fsBold]';
               dfmObj[`Panel${key}`]['ParentFont'] = 'False';
               dfmObj[`Panel${key}`]['TabStop'] = 'True';
               // dfmObj[`Panel${key}`]['TabOrder'] = '1'; // ask user

               // remove old button and new add button panel
               this.pasRemoveObject(pasObj, dfmObj[key]['_objectClass'], key);
               this.pasAddObject(pasObj, 'TSpeedButton', key);

               // button styles
               dfmObj[`Panel${key}`][key] = {};
               dfmObj[`Panel${key}`][key] = dfmObj[key];
               dfmObj[`Panel${key}`][key]['_objectClass'] = 'TSpeedButton';
               dfmObj[`Panel${key}`][key]['Left'] = '-3';
               dfmObj[`Panel${key}`][key]['Top'] = '-3';
               dfmObj[`Panel${key}`][key]['Width'] = `${(((String(dfmObj[key]['Caption']).length - 2) * 10) + 25).toFixed()}`;
               dfmObj[`Panel${key}`][key]['Height'] = '32';
               dfmObj[`Panel${key}`][key]['Caption'] = `${dfmObj[key]['Caption']}`;
               dfmObj[`Panel${key}`][key]['Flat'] = 'True';
               dfmObj[`Panel${key}`][key]['Font'] = {};
               dfmObj[`Panel${key}`][key]['Font']['Charset'] = 'ANSI_CHARSET';
               dfmObj[`Panel${key}`][key]['Font']['Color'] = null; // ask user (main button is white font)
               dfmObj[`Panel${key}`][key]['Font']['Height'] = null;
               dfmObj[`Panel${key}`][key]['Font']['Size'] = '10';
               dfmObj[`Panel${key}`][key]['Font']['Name'] = "'Segoe UI'";
               dfmObj[`Panel${key}`][key]['Font']['Style'] = '[fsBold]';
               dfmObj[`Panel${key}`][key]['ParentFont'] = 'False';
               if (dfmObj[`Panel${key}`][key]['Glyph']) delete dfmObj[`Panel${key}`][key]['Glyph'];

               delete dfmObj[key]; // delete old button
            }
         }
      }
   }

   //--- Add Tabs Buttons
   addTabsButtons(dfmObj: any, pasObj: any) {
      for (const key in dfmObj) {
         if (typeof dfmObj[key] === 'object' && dfmObj[key] !== null) {
            if (!dfmObj[key]['_objectClass']) continue;
            this.addTabsButtons(dfmObj[key], pasObj);
            if (String(dfmObj[key]['_objectClass']) !== 'TPageControl') continue;

            const tabSheets = Object.keys(dfmObj[key])
               .filter(k => dfmObj[key][k]['_objectClass'] && dfmObj[key][k]['_objectClass'] === 'TTabSheet')
               .sort((tk1, tk2) => (dfmObj[key][tk1]['ImageIndex'] || 0) - (dfmObj[key][tk2]['ImageIndex'] || 0));
            if (!tabSheets.length) continue;

            // add buttons container
            this.pasAddObject(pasObj, 'TPanel', `PnlTabs${key}`);
            dfmObj[`PnlTabs${key}`] = {};
            dfmObj[`PnlTabs${key}`]['_objectClass'] = 'TPanel';
            dfmObj[`PnlTabs${key}`]['AutoSize'] = 'False';
            dfmObj[`PnlTabs${key}`]['Align'] = 'alCustom';
            dfmObj[`PnlTabs${key}`]['Top'] = '0';
            dfmObj[`PnlTabs${key}`]['Left'] = '0';
            dfmObj[`PnlTabs${key}`]['Height'] = '30';
            dfmObj[`PnlTabs${key}`]['Width'] = '894';
            dfmObj[`PnlTabs${key}`]['BevelOuter'] = 'bvNone';
            dfmObj[`PnlTabs${key}`]['Color'] = 'clWhite';
            dfmObj[`PnlTabs${key}`]['Font'] = {};
            dfmObj[`PnlTabs${key}`]['Font']['Charset'] = 'ANSI_CHARSET';
            dfmObj[`PnlTabs${key}`]['Font']['Color'] = 'clWhite';
            dfmObj[`PnlTabs${key}`]['Font']['Height'] = null;
            dfmObj[`PnlTabs${key}`]['Font']['Size'] = '10';
            dfmObj[`PnlTabs${key}`]['Font']['Name'] = "'Segoe UI'";
            dfmObj[`PnlTabs${key}`]['Font']['Style'] = '[fsBold]';
            dfmObj[`PnlTabs${key}`]['ParentFont'] = 'False';
            dfmObj[`PnlTabs${key}`]['TabStop'] = 'True';

            tabSheets.forEach((tk, i) => {
               // add button container
               this.pasAddObject(pasObj, 'TPanel', `Pnl${tk}`);
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['_objectClass'] = 'TPanel';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['AutoSize'] = 'False';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Align'] = 'alLeft';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Top'] = '0';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Left'] = '0';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Height'] = '30';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Width'] = `${(((String(dfmObj[key][tk]['Caption']).length - 2) * 7) + 5).toFixed()}`;
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['BevelOuter'] = 'bvNone';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['BorderStyle'] = 'bsSingle';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Color'] = 'clWhite';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font'] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Charset'] = 'ANSI_CHARSET';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Color'] = 'clWhite';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Height'] = null;
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Size'] = '10';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Name'] = "'Segoe UI'";
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['Font']['Style'] = '[fsBold]';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['ParentFont'] = 'False';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['TabStop'] = 'True';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`]['TabOrder'] = `${dfmObj[key][tk]['ImageIndex'] || 0}`;

               // add active marker
               this.pasAddObject(pasObj, 'TPanel', `PnlMarker${tk}`);
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['_objectClass'] = 'TPanel';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['AutoSize'] = 'False';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Align'] = 'alTop';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Top'] = '0';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Left'] = '0';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Height'] = '3';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Width'] = null;
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['BevelOuter'] = 'bvNone';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Color'] = 'clWhite';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font'] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Charset'] = 'ANSI_CHARSET';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Color'] = 'clWhite';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Height'] = null;
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Size'] = '10';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Name'] = "'Segoe UI'";
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['Font']['Style'] = '[fsBold]';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['ParentFont'] = 'False';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`PnlMarker${tk}`]['TabStop'] = 'False';

               // add button
               this.pasAddObject(pasObj, 'TSpeedButton', `Btn${tk}`);
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['_objectClass'] = 'TSpeedButton';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Top'] = '-3';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Left'] = '-3';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Height'] = '32';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Width'] = `${(((String(dfmObj[key][tk]['Caption']).length - 2) * 7) + 10).toFixed()}`;

               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Caption'] = dfmObj[key][tk]['Caption'];
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Flat'] = 'True';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font'] = {};
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Charset'] = 'ANSI_CHARSET';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Color'] = '6766380';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Height'] = null;
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Size'] = '10';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Name'] = "'Segoe UI'";
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['Font']['Style'] = '[fsBold]';
               dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['ParentFont'] = 'False';

               // add tab button method
               this.pasAddMethod(pasObj,
                  'procedure',
                  `Btn${tk}Click`,
                  'Sender: TObject',
                  `${key}.ActivePageIndex := ${dfmObj[key][tk]['ImageIndex'] || 0};

                PnlMarker${tk}.color := $00673F2C; // azul
                ${tabSheets
                     .filter(k => k !== tk)
                     .map(k => `PnlMarker${k}.color := $00E6E6E6; //cinza`)
                     .join('\n')
                  }`
               );

               // to grids that are inside tab, add grid resizer method
               const getGrids = (obj: any): any => {
                  let grids: any = [];
                  for (const key in obj) {
                     if (!obj[key]['_objectClass']) continue;
                     if (obj[key]['_objectClass'] !== 'TPageControl') grids = grids.concat(getGrids(obj[key]));
                     if (obj[key]['_objectClass'].includes('Grid')) grids.push(key);
                  }
                  return grids;
               };
               const grids = getGrids(dfmObj[key][tk]);
               grids.forEach((gk: any) => {
                  this.pasAddMethod(pasObj,
                     'procedure',
                     `Btn${tk}Click`,
                     'Sender: TObject',
                     `TDBGridPad(${gk}).defaultRowHeight := 30;
                    TDBGridPad(${gk}).clientHeight     := (30 * TDBGridPad(${gk}).rowcount) + 30;`
                  );
               });
            });

            // adds tabs buttons to form show method
            this.pasAddMethod(pasObj,
               'procedure',
               `FormShow`,
               'Sender: TObject',
               `
              ${key}.ActivePageIndex := 0;
              ${tabSheets.map((tk, i) => `${key}.pages[${i}].TabVisible := false;`).join('\n')}
              Btn${tabSheets[0]}Click(Sender);
              `
            );
         }
      }
   }

   //--- Semi Automatic Conversion
   async semiAutoConversion(dfmObj: any) {
      await this.semiAutoFieldsAndLabels(dfmObj);
      await this.semiAutoButtons(dfmObj);
   }
   async semiAutoFieldsAndLabels(dfmObj: any) {
      const getOrders = (obj: any, className: string) => {
         const tabOrders = Object
            .keys(obj)
            ?.filter(k => obj[k]['_objectClass'] && (
               (isLabel(obj[k]['_objectClass']) && isLabel(className)) ||
               (isField(obj[k]['_objectClass']) && isField(className))
            ))
            ?.map((k, i) => i)
            || [0];
         return tabOrders;
      };
      const getSizes = () => {
         const sizes = [{ name: 'col-12', value: 810 }, { name: 'col-6', value: 400 }, { name: 'col-4', value: 263 }, { name: 'col-3', value: 195 }, { name: 'col-2', value: 126 }];
         return sizes;
      };
      const isLabel = (className: string) => {
         const classes = ['TLabel'];
         return classes.includes(className);
      };
      const isField = (className: string) => {
         const classes = ['TEdit', 'TMSEdit'];
         return classes.includes(className);
      };

      const setTopAndLeft = (obj: any) => {
         let accumlatedWidth = 0;
         let row = 1;

         // set labels top and left
         accumlatedWidth = 0;
         row = 1;
         Object.keys(obj)
            .filter(k => obj[k]['_objectClass'] && obj[k]['_order'] && isLabel(obj[k]['_objectClass']))
            .sort((key1, key2) => obj[key1]['_order'] - obj[key2]['_order'])
            .forEach((k, i) => {

               if ((accumlatedWidth + Number(obj[k]['Width']) + 30) >= 910) {
                  row++;
                  accumlatedWidth = 0;
               }

               obj[k]['Top'] = (((row - 1) * 50) + 10).toFixed();
               obj[k]['Left'] = 40 + accumlatedWidth;

               accumlatedWidth += Number(obj[k]['Width']) + 10;
            });

         // set fields top and left
         accumlatedWidth = 0;
         row = 1;
         Object.keys(obj)
            .filter(k => obj[k]['_objectClass'] && obj[k]['_order'] && isField(obj[k]['_objectClass']))
            .sort((key1, key2) => obj[key1]['_order'] - obj[key2]['_order'])
            .forEach((k, i) => {

               if ((accumlatedWidth + Number(obj[k]['Width']) + 30) >= 910) {
                  row++;
                  accumlatedWidth = 0;
               }

               obj[k]['Top'] = (((row - 1) * 50) + 27).toFixed();
               obj[k]['Left'] = 40 + accumlatedWidth;

               accumlatedWidth += Number(obj[k]['Width']) + 10;
            });

         return obj;
      };

      const ask = async (obj: any, parent: string | null = null, startIndex: number | null = null) => {
         let keysFiltered = Object.keys(obj)
            .filter(k => obj[k]['_objectClass'] && (isLabel(obj[k]['_objectClass']) && isField(obj[k]['_objectClass'])));

         for (const key in obj) {
            if (!obj[key]['_objectClass']) continue;
            await ask(obj[key], key);
            if ((!isLabel(obj[key]['_objectClass']) && !isField(obj[key]['_objectClass'])) || parent === 'PanelTitle') continue;

            const parentEl = document.querySelector('#parent-output');
            const classEl = document.querySelector('#class-output');
            const nameEl = document.querySelector('#name-output');
            const captionEl = document.querySelector('#caption-output');
            const orderEl = document.querySelector('#order-input');
            const widthEl = document.querySelector('#width-input');

            const prevBtn = document.querySelector('#ui-prev');
            const nextBtn = document.querySelector('#ui-next');
            if (!parentEl || !classEl || !nameEl || !captionEl || !orderEl || !widthEl || !prevBtn || !nextBtn) break;

            // show obj class and name
            parentEl.innerHTML = parent || '';
            classEl.innerHTML = obj[key]['_objectClass'];
            nameEl.innerHTML = key;
            captionEl.innerHTML = obj[key]['Caption'] || '';

            // add tab order options
            orderEl.innerHTML = getOrders(obj, obj[key]['_objectClass'])
               .map(o => `<option value="${o}">${o}</option>`)
               .join('\n');
            // add size options
            widthEl.innerHTML = getSizes()
               .map(s => `<option value="${s.value}">${s.name}</option>`)
               .join('\n');
            (widthEl as HTMLSelectElement).value = '400';


            // wait user confirmation
            (orderEl as HTMLElement).focus();
            const resp = await new Promise((res, rej) => {
               // prevBtn.addEventListener('click', function event1() {
               //    prevBtn.removeEventListener('click', event1)
               //    rej();
               // })
               nextBtn.addEventListener('click', function event2() {
                  nextBtn.removeEventListener('click', event2)
                  res('');
               })
            });

            // set user values
            obj[key]['Width'] = Number((widthEl as HTMLSelectElement).value);
            obj[key]['_order'] = (orderEl as HTMLSelectElement).value;
            if (!isLabel(obj[key]['_objectClass'])) obj[key]['TabOrder'] = (orderEl as HTMLSelectElement).value;

            if (keysFiltered.indexOf(key) === keysFiltered.length - 1) setTopAndLeft(obj);

            // show obj class and name
            parentEl.innerHTML = '';
            classEl.innerHTML = '';
            nameEl.innerHTML = '';
            captionEl.innerHTML = '';
            (orderEl as HTMLSelectElement).value = '-1';
            orderEl.innerHTML = '<option value="-1">-1</option>';
            (widthEl as HTMLSelectElement).value = '-1';
            widthEl.innerHTML = '<option value="0">col-0</option>'
         }
      };

      await ask(dfmObj);
   }
   async semiAutoButtons(dfmObj: any) {
      const getOrders = (obj: any, className: string) => {
         const tabOrders = Object
            .keys(obj)
            ?.filter(k => obj[k]['_objectClass'] && (
               (isButtonPanel(obj[k]) && isButtonPanel(obj[k]))
            ))
            ?.map((k, i) => i)
            || [0];
         return tabOrders;
      };
      const isButton = (className: string) => {
         const classes = ['TSpeedButton'];
         return classes.includes(className);
      };
      const isButtonPanel = (obj: any) => {
         return isButton(obj[Object.keys(obj)
            .filter(k => obj[k]['_objectClass'])[0]]?.['_objectClass']);
      };

      const setLeft = (obj: any) => {
         let accumlatedWidth = 0;
         let row = 1;

         // set buttons buttons left
         accumlatedWidth = 0;
         row = 1;
         Object.keys(obj)
            .filter(k => obj[k]['_objectClass'] && obj[k]['_order'] && isButtonPanel(obj[k]))
            .sort((key1, key2) => obj[key1]['_order'] - obj[key2]['_order'])
            .forEach((k, i) => {
               if ((accumlatedWidth + Number(obj[k]['Width']) + 30) >= 910) {
                  row++;
                  accumlatedWidth = 0;
               }

               obj[k]['Top'] = (((row - 1) * 28) + 6).toFixed();
               obj[k]['Left'] = 40 + accumlatedWidth;

               if (obj[k]['_order'] === '0') {
                  obj[k]['Color'] = '6766380';
                  obj[k]['Font']['Color'] = 'clWhite';
               }

               accumlatedWidth += Number(obj[k]['Width']) + 10;
            });


         return obj;
      };

      const ask = async (obj: any, parent?: string, startIndex?: number) => {
         let keysFiltered = Object.keys(obj)
            .filter(k => obj[k]['_objectClass'] && isButtonPanel(obj[k]));


         for (const key in obj) {
            if (!obj[key]['_objectClass']) continue;
            await ask(obj[key], key);
            if (!isButtonPanel(obj[key])) continue;

            const parentEl = document.querySelector('#parent-output');
            const classEl = document.querySelector('#class-output');
            const nameEl = document.querySelector('#name-output');
            const captionEl = document.querySelector('#caption-output');
            const orderEl = document.querySelector('#order-input');
            const widthEl = document.querySelector('#width-input');

            const prevBtn = document.querySelector('#ui-prev');
            const nextBtn = document.querySelector('#ui-next');
            if (!parentEl || !classEl || !nameEl || !captionEl || !orderEl || !widthEl || !prevBtn || !nextBtn) break;

            // show obj class and name
            (parentEl as HTMLElement).innerHTML = parent || '';
            classEl.innerHTML = obj[key]['_objectClass'];
            nameEl.innerHTML = key;
            (captionEl as HTMLElement).innerHTML = obj[key]['Caption'] || '';

            // add tab order options
            orderEl.innerHTML = getOrders(obj, obj[key]['_objectClass'])
               .map(o => `<option value="${o}">${o}</option>`)
               .join('\n');
            // add size options
            (widthEl as HTMLSelectElement).value = '-1';
            widthEl.innerHTML = '<option value="0">col-0</option>';
            (widthEl as HTMLSelectElement).value = '400';


            // wait user confirmation
            (orderEl as HTMLElement).focus();
            const resp = await new Promise((res, rej) => {
               // prevBtn.addEventListener('click', function event1() {
               //    prevBtn.removeEventListener('click', event1)
               //    rej();
               // })
               nextBtn.addEventListener('click', function event2() {
                  nextBtn.removeEventListener('click', event2)
                  res('');
               })
            });

            // set user values
            obj[key]['_order'] = (orderEl as HTMLSelectElement).value;
            obj[key]['TabOrder'] = (orderEl as HTMLSelectElement).value;

            if (keysFiltered.indexOf(key) === keysFiltered.length - 1) setLeft(obj);

            // show obj class and name
            parentEl.innerHTML = '';
            classEl.innerHTML = '';
            nameEl.innerHTML = '';
            captionEl.innerHTML = '';
            (orderEl as HTMLSelectElement).value = '-1';
            orderEl.innerHTML = '<option value="-1">-1</option>';
            (widthEl as HTMLSelectElement).value = '-1';
            widthEl.innerHTML = '<option value="0">col-0</option>'
         }
      };

      await ask(dfmObj);
   }


   //--- Copy .PAS Output to Clipboard
   copyPasOutputToClipboard() {
      const el_1 = document.querySelector('#pas-output');
      if (!el_1) return;

      this.copyToClipboard((el_1 as HTMLTextAreaElement).value);
   }
   //--- Copy .DFM Output to Clipboard
   copyDfmOutputToClipboard() {
      const el_1 = document.querySelector('#dfm-output');
      if (!el_1) return;

      this.copyToClipboard((el_1 as HTMLTextAreaElement).value);
   }
   //--- Copy to Clipboard
   copyToClipboard(text: string) {
      navigator.clipboard.writeText(text)
         .then((copy) => {
            // console.log('Text copied to clipboard');
         })
         .catch((err) => {
            // console.error('Failed to copy text: ', err);
         });
   }

   //--- Loading
   loading(on: boolean) {
      let el = document.querySelector('#loading-container');
      if (!el) {
         el = document.createElement('div');
         el.id = 'loading-container';
         el.innerHTML = '<span id="loader"></span>';
         document.body.appendChild(el);
      }

      if (!on) (el as HTMLElement).style.display = 'none';
      else (el as HTMLElement).style.display = '';
   }
   // setTimeout(() => loading(true), 1500)

   //--- default settings
   defSettings() {
      if(!document) return;
      
      this.fastConversion = false;

      const defPasInput = `
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
        MessageDlg('Campo com preenchimento obrigatório.', mtWarning, [mbOk], 0);
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
          if MessageDlg('Confirma alteração deste registro?', mtConfirmation, [mbYes,mbNo], 0)= mrYes then
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
        // Seleciona os Itens do Romaneio já cadastrados ...
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

        // Seleciona os Itens do Romaneio não cadastrados ...
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
        // Seleciona os Itens do Romaneio não cadastrados ...
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
              Showmessage('Nào há pedidos selecionados.');
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
        MessageDlg('Pedido Não Cadastrado',mterror,[mbok],0);
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
        Showmessage('Atenção !!! - Todos os pedidos selecionados serão retirados deste romaneio.');

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
    `;
      const defDfmInput = `
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
    `;

      const el_1 = document.querySelector('#pas-input');
      const el_2 = document.querySelector('#dfm-input');
      const el_3 = document.querySelector('#fast-conversion');
      if (!el_1 || !el_2 || !el_3) return;

      (el_1 as HTMLTextAreaElement).value = defPasInput.trim();
      (el_2 as HTMLTextAreaElement).value = defDfmInput.trim();
      if (this.fastConversion) (el_3 as HTMLInputElement).checked;
   }
}
