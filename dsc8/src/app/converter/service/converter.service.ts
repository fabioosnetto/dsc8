import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FileGroupClass } from '../classes/files/file-group.class';
import { FileClass } from '../classes/files/file.class';
import { ConverterComponent } from '../component/converter.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  private _converterComponent!: ComponentRef<ConverterComponent>;

  private _files: FileGroupClass;
  private _modifiedFiles: FileGroupClass;
  public files$: Subject<FileGroupClass>;
  public modifiedFiles$: Subject<FileGroupClass>;

  constructor(
    // private _viewContainerRef: ViewContainerRef
  ) {
    this._files = new FileGroupClass();
    this._modifiedFiles = new FileGroupClass()
    this.files$ = new Subject<FileGroupClass>();
    this.modifiedFiles$ = new Subject<FileGroupClass>();
  }


  get files(): FileGroupClass { return this._files; }
  set files(files: FileGroupClass){ this._files = files; }
  
  get modifiedFiles(): FileGroupClass { return this._modifiedFiles; }
  set modifiedFiles(files: FileGroupClass){ this._modifiedFiles = files; }

  public getFileByName(fileName: string, state: 'original' | 'modified' = 'original'): FileClass | null {
    const files = state === 'original' ? this._files : this._modifiedFiles;
    let   file = new FileClass();
    const gk = fileName.split('.').slice(0,-1).join('');
    if(!files[gk]) return null;

    file = {...files[gk]};
    Object.keys(file).forEach(k => { if(k !== fileName) delete file[k]; });
    
    if(!Object.keys(file).length) return null;
    return file;
  }


  public async executeFileAction(fileGroup: FileGroupClass, action: 'convert' | 'download'): Promise<void> {
    switch (action) {
      // convert file group
      case 'convert':
        const fileGroup_modified = await this.convert(fileGroup);
        Object.keys(fileGroup_modified).forEach(gk => {  
          if(this._modifiedFiles[gk]) this._modifiedFiles[gk] = {};
          this._modifiedFiles[gk] = fileGroup_modified[gk];
        });
        // this.modifiedFiles$.next(this._modifiedFiles);
      break;
    
      // download file group
      case 'download':
        const fileGroupToDownload: FileGroupClass = new FileGroupClass();
        Object.keys(this._modifiedFiles)
        .filter(gk => Object.keys(fileGroup).includes(gk))
        .forEach(gk => {
          if(!fileGroupToDownload[gk]) fileGroupToDownload[gk] = {};
          fileGroupToDownload[gk] = this._modifiedFiles[gk]
        });

        this.downloadFileGroup(fileGroupToDownload);
      break;

      default:
      break;
    }
  }


  public async convert(fileGroup: FileGroupClass): Promise<FileGroupClass> {
    const files = fileGroup[Object.keys(fileGroup)[0]];
    const pasFileName = Object.keys(files).filter(k => k.split('.').slice(-1).join('') === 'pas')[0];
    const dfmFileName = Object.keys(files).filter(k => k.split('.').slice(-1).join('') === 'dfm')[0];

    const pasFile: FileClass = new FileClass([{ name: pasFileName, content: files[pasFileName].content }]);
    const dfmFile: FileClass = new FileClass([{ name: dfmFileName, content: files[dfmFileName].content }]);
    let pasFile_modified = new FileClass();
    let dfmFile_modified = new FileClass();

    const pas_txt = Object.values(pasFile)[0].content;
    const dfm_txt = Object.values(dfmFile)[0].content;
    const pas_js: any = this.pasToJs(pas_txt);
    const dfm_js: any = this.dfmToJs(dfm_txt);
    const dfmForm = dfm_js[Object.keys(dfm_js)[0]]['_objectClass'];

    // apply styles
    this.applyStyles(dfm_js, pas_js);
    this.addHeader(dfm_js, pas_js);
    this.addButtons(dfm_js, pas_js, dfmForm);
    this.addTabsButtons(dfm_js, pas_js);
    // await this.semiAutoConversion(dfm_js)

    // provide result
    pasFile_modified = new FileClass([{ name: Object.keys(pasFile)[0], content: this.jsToPAS(pas_js) }]);
    dfmFile_modified = new FileClass([{ name: Object.keys(dfmFile)[0], content: this.jsToDfm(dfm_js) }]);

    return new FileGroupClass([pasFile_modified, dfmFile_modified]);
  }


  //--- DFM to Javascript
  public dfmToJs(dfmText: string) {
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
  public jsToDfm(jsObj: string) {

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
        sortedObj[key] = (typeof value === 'object' && value !== null && value['_objectClass']) ? sortJs(value) : value;
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
  public pasToJs(pasText: string) {
    const obj: any = {};
    obj[String(pasText).match(new RegExp('unit\\s(\\w+)'))?.[1] || ''] = `${pasText}`;

    return obj;
  }
  //--- Javascript to PAS
  public jsToPAS(jsText: string) {
    const unitKey: any = Object.keys(jsText)?.[0];
    return jsText[unitKey];
  }



  //--- PAS Add Object
  pasAddObject(pasObj: any, objClass: string, objName: string): boolean {

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

    // verify for an existent object
    if(lines.findIndex(l => l.trim() === `${objName}: ${objClass};`) > -1) return false;

    // declare a new line to the requested object
    const indent = String(lines[objIndex]).match(new RegExp('\\s*'))?.[0];
    let newLines = new Array();
    newLines = newLines.concat(lines.slice(0, objIndex + 1));
    newLines.push(`${indent}${objName}: ${objClass};`);
    newLines = newLines.concat(lines.slice(objIndex + 1, lines.length));
    lines = newLines;

    // update the PAS object with the new object
    pasObj[unitKey] = newLines.join('\n');
    return true;
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

    const getMethodDeclarationLastLineIndex = (lines: Array<string>, formName: string): number => {
      let methodMatches = false;

      for (const [index, line] of lines.entries()) {
        const trimmedLine = line.trim();
        const level = levels.filter((v: any) => v.i1 === line.search(/\S/))[0].i2; // Finds the first non-whitespace character index

        // mark form declaration start
        if (trimmedLine.match(new RegExp(`${methodType} ${formName}.${methodName}`))) {
          methodMatches = true;
        }

        // return the form objects declaration line index
        if (methodMatches) {
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
      newLines.push(`${indent}${methodType} ${formName}.${methodName}(${methodParams});`);
      newLines.push(`${indent}begin`);
      newLines.push(`${indent}${' '.repeat(3)}${methodContent.trim()}`);
      newLines.push(`${indent}end;\n`);
      newLines = newLines.concat(lines.slice(lines.length - 1, lines.length));
      lines = newLines;
    }
    // case method already exists
    else {
      // get the last implementation line of the method
      const methodIndex = getMethodDeclarationLastLineIndex(lines, formName);

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
        const currentClass = dfmObj[key]['_objectClass'];
        this.applyStyles(dfmObj[key], pasObj);

        switch (currentClass) {

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

          // text, radio, check
          case 'TLabel':
          case 'TDBText':
          case 'TRadioButton':
          case 'TCheckBox':
          case 'TDBCheckBox':
            if(currentClass === 'TLabel' || currentClass === 'TDBText') {
              dfmObj[key]['Alignment'] = 'taLeftJustify';
              dfmObj[key]['AutoSize'] = 'False';
            }
            dfmObj[key]['Font'] = {};
            dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
            dfmObj[key]['Font']['Color'] = 'clBlack';
            dfmObj[key]['Font']['Height'] = null;
            dfmObj[key]['Font']['Size'] = '9';
            dfmObj[key]['Font']['Name'] = "'Segoe UI'";
            dfmObj[key]['Font']['Style'] = '[fsBold]';
            dfmObj[key]['Height'] = '15';
            dfmObj[key]['ParentFont'] = 'False';
          break;

          // fields
          case 'TEdit':
          case 'TDBEdit':
          case 'TMSDBEditNum':
          case 'TMSDateEdit':
          case 'TMSDBFind':
          case 'TMSEdit':
          case 'TMSEditFind':
          // case 'TMSFindIncZ':
          case 'TMSEditSel':
          case 'TMaskEdit':
          case 'TComboBox':
          case 'TDBMemo':
            if(currentClass === 'TMSDateEdit') dfmObj[key]['Alignment'] = 'taCenter';
            if(currentClass === 'TMSDBEditNum' || currentClass === 'TMSDBFind' || currentClass === 'TMSEditFind' || currentClass === 'TMSEditSel' || currentClass === 'TDBMemo') dfmObj[key]['Alignment'] = 'taLeftJustify';
            
            if(currentClass !== 'TComboBox' && currentClass !== 'TDBMemo') dfmObj[key]['AutoSize'] = 'False';
            dfmObj[key]['BevelEdges'] = '[beLeft,beTop,beRight,beBottom]';
            dfmObj[key]['BevelInner'] = 'bvSpace';
            dfmObj[key]['BevelKind'] = 'bkFlat';
            dfmObj[key]['BevelOuter'] = 'bvRaised';
            if(currentClass !== 'TComboBox') dfmObj[key]['BorderStyle'] = 'bsNone';
            if(currentClass !== 'TMSDateEdit') dfmObj[key]['Ctl3D'] = 'True';
            dfmObj[key]['Font'] = {};
            dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
            dfmObj[key]['Font']['Color'] = 'clBlack';
            dfmObj[key]['Font']['Height'] = null;
            dfmObj[key]['Font']['Size'] = '9';
            dfmObj[key]['Font']['Name'] = "'Segoe UI'";
            dfmObj[key]['Font']['Style'] = '[]';
            dfmObj[key]['Height'] = '23';
            if(currentClass !== 'TMSDateEdit') dfmObj[key]['ParentFont'] = 'False';

            // fields with label shape
            if(currentClass === 'TMSDBFind' || currentClass === 'TMSEditFind' || currentClass === 'TMSEditSel') {
              dfmObj[key]['LabelShape'] = 'True';

              if(currentClass === 'TMSDBFind') {
                dfmObj[key]['LabelSpacing'] = '5';
                dfmObj[key]['LabelWidth'] = '250';
              }
              if(currentClass === 'TMSEditFind') dfmObj[key]['DisplayWidth'] = '250';
            }
          break;

          // grids
          case 'TDBGrid':
          case 'TMSDBGrid':
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
            if(currentClass !== 'TStringGrid') dfmObj[key]['Options'] = '[dgEditing, dgTitles, dgIndicator, dgColumnResize, dgTabs, dgAlwaysShowSelection, dgConfirmDelete, dgCancelOnExit]';

            // add procedures (OnDrawColumnCell, OnMouseUp, OnTitleClick)
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
          break;

          // panels
          case 'TPanel':
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
          case 'TGroupBox':
            dfmObj[key]['Caption'] = `'   ${String(dfmObj[key]['Caption']).split("'").join('').trim()}   '`;
            dfmObj[key]['Color'] = 'clWhite';
            dfmObj[key]['Ctl3D'] = 'True';
            dfmObj[key]['Font'] = {};
            dfmObj[key]['Font']['Charset'] = 'ANSI_CHARSET';
            dfmObj[key]['Font']['Color'] = 'clBlack';
            dfmObj[key]['Font']['Height'] = null;
            dfmObj[key]['Font']['Size'] = '9';
            dfmObj[key]['Font']['Name'] = "'Segoe UI'";
            dfmObj[key]['Font']['Style'] = '[fsBold]';
            dfmObj[key]['ParentFont'] = 'False';
            dfmObj[key]['Left'] = '0';
            dfmObj[key]['Width'] = `${dfmObj['Width']}`;
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
  addButtons(dfmObj: any, pasObj: any, dfmForm: string, parent?: string) {
    for (const key in dfmObj) {
      if (typeof dfmObj[key] === 'object' && dfmObj[key] !== null) {
        if (!dfmObj[key]['_objectClass']) continue;
        this.addButtons(dfmObj[key], pasObj, dfmForm, dfmObj['_objectClass']);

        if(['TButton', 'TBitBtn', 'TDBSpeedButton', 'TSpeedButton', 'TMSButton'].includes(String(dfmObj[key]['_objectClass'])) && dfmObj['_objectClass'] === 'TPanel') {
          
          // container panel is only for buttons
          const isButtonsContainer = !Object.keys(dfmObj).some(k => dfmObj[k]['_objectClass'] && !['TButton', 'TBitBtn', 'TDBSpeedButton', 'TSpeedButton', 'TMSButton', 'TPanel'].includes(dfmObj[k]['_objectClass']));
          if(isButtonsContainer) {
            // buttons container panel styles
            if (parent === dfmForm) {
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
          }

          // add button panel
          // if the panel is existent, means the button is still converted
          if(!this.pasAddObject(pasObj, 'TPanel', `Panel${key}`)) continue;

          // buton panel styles
          dfmObj[`Panel${key}`] = {};
          dfmObj[`Panel${key}`]['_objectClass'] = 'TPanel';
          dfmObj[`Panel${key}`]['AutoSize'] = 'False';
          dfmObj[`Panel${key}`]['Left'] = '40'; // ask user
          dfmObj[`Panel${key}`]['Top'] = '6';
          dfmObj[`Panel${key}`]['Width'] = `${(((String(dfmObj[key]['Caption']).length - 2) * 10) + 20).toFixed()}`;
          dfmObj[`Panel${key}`]['Height'] = '28';
          dfmObj[`Panel${key}`]['BevelOuter'] = 'bvNone';
          dfmObj[`Panel${key}`]['Color'] = isButtonsContainer ? 'clWhite' : '15132390';
          dfmObj[`Panel${key}`]['Cursor'] = 'crHandPoint';
          dfmObj[`Panel${key}`]['Font'] = {};
          dfmObj[`Panel${key}`]['Font']['Charset'] = 'ANSI_CHARSET';
          dfmObj[`Panel${key}`]['Font']['Color'] = isButtonsContainer ? '5789784' : '5789784';
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
          dfmObj[`Panel${key}`][key]['_objectClass'] = 'TSpeedButton';
          dfmObj[`Panel${key}`][key]['Left'] = '-3';
          dfmObj[`Panel${key}`][key]['Top'] = '-3';
          dfmObj[`Panel${key}`][key]['Width'] = `${(((String(dfmObj[key]['Caption']).length - 2) * 10) + 25).toFixed()}`;
          dfmObj[`Panel${key}`][key]['Height'] = '32';
          dfmObj[`Panel${key}`][key]['Caption'] = `${dfmObj[key]['Caption']}`;
          dfmObj[`Panel${key}`][key]['Cursor'] = 'crHandPoint';
          dfmObj[`Panel${key}`][key]['Enabled'] = `${dfmObj[key]['Enabled']}`;
          dfmObj[`Panel${key}`][key]['Flat'] = 'True';
          dfmObj[`Panel${key}`][key]['Font'] = {};
          dfmObj[`Panel${key}`][key]['Font']['Charset'] = 'ANSI_CHARSET';
          dfmObj[`Panel${key}`][key]['Font']['Color'] = isButtonsContainer ? '5789784' : '5789784';
          dfmObj[`Panel${key}`][key]['Font']['Height'] = null;
          dfmObj[`Panel${key}`][key]['Font']['Size'] = '10';
          dfmObj[`Panel${key}`][key]['Font']['Name'] = "'Segoe UI'";
          dfmObj[`Panel${key}`][key]['Font']['Style'] = '[fsBold]';
          dfmObj[`Panel${key}`][key]['ParentFont'] = 'False';
          dfmObj[`Panel${key}`][key]['Visible'] = `${dfmObj[key]['Visible']}`;
          dfmObj[`Panel${key}`][key]['OnClick'] = `${dfmObj[key]['OnClick']}`;

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
        dfmObj[`PnlTabs${key}`]['_order'] = Infinity;
        dfmObj[`PnlTabs${key}`]['AutoSize'] = 'False';
        dfmObj[`PnlTabs${key}`]['Align'] = 'alCustom';
        dfmObj[`PnlTabs${key}`]['Top'] = `${dfmObj[key]['Top']}`;
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
        // add buttons container spacer
        // back spacer (height)
        this.pasAddObject(pasObj, 'TPanel', `PnlTabs${key}Spacer1`);
        dfmObj[`PnlTabs${key}Spacer1`] = {};
        dfmObj[`PnlTabs${key}Spacer1`]['_objectClass'] = 'TPanel';
        dfmObj[`PnlTabs${key}Spacer1`]['_order'] = '0';
        dfmObj[`PnlTabs${key}Spacer1`]['AutoSize'] = 'False';
        dfmObj[`PnlTabs${key}Spacer1`]['Align'] = 'alTop';
        dfmObj[`PnlTabs${key}Spacer1`]['Top'] = `${dfmObj[key]['Top']}`;
        dfmObj[`PnlTabs${key}Spacer1`]['Left'] = '0';
        dfmObj[`PnlTabs${key}Spacer1`]['Height'] = '27';
        dfmObj[`PnlTabs${key}Spacer1`]['Width'] = '894';
        dfmObj[`PnlTabs${key}Spacer1`]['BevelOuter'] = 'bvNone';
        dfmObj[`PnlTabs${key}Spacer1`]['Color'] = 'clWhite';
        dfmObj[`PnlTabs${key}Spacer1`]['Font'] = {};
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Charset'] = 'ANSI_CHARSET';
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Color'] = 'clWhite';
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Height'] = null;
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Size'] = '10';
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Name'] = "'Segoe UI'";
        dfmObj[`PnlTabs${key}Spacer1`]['Font']['Style'] = '[fsBold]';
        dfmObj[`PnlTabs${key}Spacer1`]['ParentFont'] = 'False';
        dfmObj[`PnlTabs${key}Spacer1`]['TabStop'] = 'True';

        // left spacer (left)
        this.pasAddObject(pasObj, 'TPanel', `PnlTabs${key}Spacer2`);
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`] = {};
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['_objectClass'] = 'TPanel';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['_order'] = '0';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['AutoSize'] = 'False';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Align'] = 'alLeft';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Top'] = `${dfmObj[key]['Top']}`;
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Left'] = '0';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Height'] = '30';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Width'] = '10';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['BevelOuter'] = 'bvNone';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Color'] = 'clWhite';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font'] = {};
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Charset'] = 'ANSI_CHARSET';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Color'] = 'clWhite';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Height'] = null;
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Size'] = '10';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Name'] = "'Segoe UI'";
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['Font']['Style'] = '[fsBold]';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['ParentFont'] = 'False';
        dfmObj[`PnlTabs${key}`][`PnlTabs${key}Spacer2`]['TabStop'] = 'True';

        tabSheets.forEach((tk, i) => {
          // add scrollbox
          if(Object.keys(dfmObj[key][tk]).findIndex(k => dfmObj[key][tk][k] && dfmObj[key][tk][k]['_objectClass'] === 'TScrollBox') < 0) {
            const tsObjsKeys = Object.keys(dfmObj[key][tk])
            .filter(k => dfmObj[key][tk][k] && dfmObj[key][tk][k]['_objectClass']); // tab sheet objects keys
            const sbKey = `ScrollBox_${tk}`; // scroll box key

            this.pasAddObject(pasObj, 'TScrollBox', `${sbKey}`);
            dfmObj[key][tk][sbKey] = {};
            dfmObj[key][tk][sbKey]['_objectClass'] = 'TScrollBox';
            dfmObj[key][tk][sbKey]['_order'] = '0';
            dfmObj[key][tk][sbKey]['Left'] = '0';
            dfmObj[key][tk][sbKey]['Top'] = '0';
            dfmObj[key][tk][sbKey]['Align'] = 'alClient';
            dfmObj[key][tk][sbKey]['AutoScroll'] = 'True';
            dfmObj[key][tk][sbKey]['AutoSize'] = 'False';
            dfmObj[key][tk][sbKey]['BevelEdges'] = '[]';
            dfmObj[key][tk][sbKey]['BevelInner'] = 'bvNone';
            dfmObj[key][tk][sbKey]['BevelKind'] = 'bkNone';
            dfmObj[key][tk][sbKey]['BevelOuter'] = 'bvNone';
            dfmObj[key][tk][sbKey]['BevelWidth'] = '1';
            dfmObj[key][tk][sbKey]['BorderStyle'] = 'bsNone';
            dfmObj[key][tk][sbKey]['Ctl3D'] = 'False';
            dfmObj[key][tk][sbKey]['Color'] = 'clWhite';
            dfmObj[key][tk][sbKey]['Font'] = {};
            dfmObj[key][tk][sbKey]['Font']['Charset'] = 'ANSI_CHARSET';
            dfmObj[key][tk][sbKey]['Font']['Color'] = 'clWhite';
            dfmObj[key][tk][sbKey]['Font']['Height'] = null;
            dfmObj[key][tk][sbKey]['Font']['Size'] = '9';
            dfmObj[key][tk][sbKey]['Font']['Name'] = "'Segoe UI'";
            dfmObj[key][tk][sbKey]['Font']['Style'] = '[]';
            dfmObj[key][tk][sbKey]['ParentFont'] = 'False';
            dfmObj[key][tk][sbKey]['TabStop'] = 'False';
            dfmObj[key][tk][sbKey]['TabOrder'] = '0';

            // remove objects from tab sheet and assign it to the scrollbox
            tsObjsKeys.forEach(k => {
              dfmObj[key][tk][sbKey][k] = dfmObj[key][tk][k];
              delete dfmObj[key][tk][k];
            });
          }

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
          dfmObj[`PnlTabs${key}`][`Pnl${tk}`][`Btn${tk}`]['OnClick'] = `Btn${tk}Click`;

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
              if (!obj[key]?.['_objectClass']) continue;
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
              TDBGridPad(${gk}).clientHeight     := (30 * TDBGridPad(${gk}).rowcount) + 30;
              `
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
        .filter(k => obj[k]['_objectClass'] && (isLabel(obj[k]['_objectClass']) || isField(obj[k]['_objectClass'])));

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

        // the last item into a panel
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
      })
      .catch((err) => {
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


  //--- Toggle Converter Component
  public toggleConverter(viewContainerRef: ViewContainerRef, fileGroup: FileGroupClass): void {
    // close current context menu
    if(this._converterComponent) {
      this._converterComponent.instance.dfm_js$.unsubscribe();
      this._converterComponent.destroy();
    }
    // create the context menu
    this._converterComponent = viewContainerRef.createComponent(ConverterComponent);

    // get current modified file group
    const currModifiedfileGroup: FileGroupClass = new FileGroupClass();
    Object.keys(this._modifiedFiles)
    .filter(gk => Object.keys(fileGroup).includes(gk))
    .forEach(gk => {
      if(!currModifiedfileGroup[gk]) currModifiedfileGroup[gk] = {};
      currModifiedfileGroup[gk] = this._modifiedFiles[gk]
    });
    const files = currModifiedfileGroup[Object.keys(currModifiedfileGroup)[0]];
    const dfmFileName = Object.keys(files).filter(k => k.split('.').slice(-1).join('') === 'dfm')[0];
    const dfmFile: FileClass = new FileClass([{ name: dfmFileName, content: files[dfmFileName].content }]);

    const dfm_txt = Object.values(dfmFile)[0].content;
    const dfm_js: any = this.dfmToJs(dfm_txt);

    this._converterComponent.instance.dfm_js$.next(dfm_js);

    // update the modified .dfm accordingly to the converter component changes
    this._converterComponent.instance.dfm_js$.subscribe(dfm_js => {

      Object.keys(this._modifiedFiles)
      .filter(gk => Object.keys(fileGroup).includes(gk))
      .forEach(gk => {
        this._modifiedFiles[gk][Object.keys(this._modifiedFiles[gk]).filter(k => k.split('.').slice(-1).join('') === 'dfm')[0]].content = this.jsToDfm(dfm_js);
      });

      this.modifiedFiles$.next(this._modifiedFiles);
    });
  }

  //--- Download a File Group
  public downloadFileGroup(fileGroup: FileGroupClass): void {
    Object.keys(fileGroup).forEach(gk => {
      for (const fk in fileGroup[gk]) {
        if (Object.prototype.hasOwnProperty.call(fileGroup[gk], fk)) {
          const blob = new Blob([fileGroup[gk][fk].content], { type: 'text/plain' }); // create the blob content
          
          // create and click the download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fk}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }
    });
  }
}
