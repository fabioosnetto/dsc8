import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConverterComponent implements OnInit, OnDestroy {
  @Input('fileGroup') dfm_js$: Subject<any>;
  private _dfm_js: any;
  
  public objects: Array<{
  parent: string,
  children: Array<{
    name: string,
    class: string,
    path: Array<string>,
    parent: string,
    caption?: string;
    order: number,
    width: { id: number, name: string, value: number } | number
  }>}>;
  public selectedObject: {
    name: string,
    class: string,
    path: Array<string>,
    parent: string,
    caption?: string,
    order: number,
    width: { id: number, name: string, value: number } | number
  } | null;
  public orders: Array<number>;
  public sizes: Array<{ id: number, name: string, value: number }>;

  constructor(
    private _cdr: ChangeDetectorRef
  ) {
    this.dfm_js$ = new Subject<any>();
    this._dfm_js = null;
    this.dfm_js$.subscribe((dfm_js) => {
      this._dfm_js = dfm_js;
      this.objects = this._getObjects(this._dfm_js);
      this._cdr.detectChanges();
    });
    this.objects = new Array();
    this.selectedObject = null;
    this.orders = new Array();
    this.sizes = this._getSizes();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dfm_js$.unsubscribe();
  }

  //--- Selected Object Comparsion Function
  selectedObjectCompareFn(c1: {
    name: string,
    class: string,
    path: Array<string>,
    parent: string,
    caption?: string,
    order: number,
    width: { id: number, name: string, value: number } | number
  } | null, c2: {
    name: string,
    class: string,
    path: Array<string>,
    parent: string,
    caption?: string,
    order: number,
    width: { id: number, name: string, value: number } | number
  } | null): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }
  //--- On Selected Object Change
  public onSelectedObjectChange(): void {
    // update orders by object type
    this.orders = new Array();
    if(!this.selectedObject) return;
    const {parent, child} = this._getObjectByPath(this.selectedObject.path);
    const parentBtnCase = this._getObjectByPath(this.selectedObject.path.slice(0,-1)).parent;
    this.orders = this._getOrdersByObjectType(this.isButton(this.selectedObject.class) ? parentBtnCase : parent, child);
  }
  //--- On Order Change
  public onOrderChange(): void {
    this._updateSelObjProperties();
  }
  //--- On Width Change
  public onWidthChage(): void {
    this._updateSelObjProperties();
  }
  //--- Update Selected Object Properties
  private _updateSelObjProperties(): void {
    if(!this.selectedObject) return;

    // set top and left
    const setTopAndLeft = (parent: any, childObjType: 'label' | 'field' | 'button') => {
      const rowMultiplier = childObjType !== 'button' ? 50 : 28;
      const rowMargin = childObjType === 'label' ? 10 : ( childObjType === 'field' ? 27 : 6);
      let accumlatedWidth = 0;
      let row = 1;

      Object.keys(parent)
      .filter(k => parent[k]['_objectClass'] && parent[k]['_order'] && (
        (childObjType === 'label' && this.isLabel(parent[k]['_objectClass'])) ||
        (childObjType === 'field' && this.isField(parent[k]['_objectClass'])) ||
        (childObjType === 'button' && this.isButtonPanel(parent[k]))
      ))
      .sort((key1, key2) => parent[key1]['_order'] - parent[key2]['_order'])
      .forEach((k, i) => {
        if((accumlatedWidth + Number(parent[k]['Width']) + 30) >= 910) {
          row++;
          accumlatedWidth = 0;
        }

        parent[k]['Top'] = `${(((row - 1) * rowMultiplier) + rowMargin).toFixed()}`;
        parent[k]['Left'] = `${40 + accumlatedWidth}`;

        accumlatedWidth += Number(parent[k]['Width']) + 10;
      });
    };

    // recursive call to access and modify object by path keys 
    const recursiveCall = (obj: any, pathKeyIndex: number) => {
      if(!this.selectedObject || !defObj) return;
      
      // iterate over objects 'til the target object
      for (const key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
          
          // each key in path, call the next key
          if(key === this.selectedObject.path[pathKeyIndex] && obj[key]['_objectClass']) recursiveCall(obj[key], pathKeyIndex+1);

          // all path keys was used, the target object is found
          if(pathKeyIndex === (this.selectedObject.path.length)) {
            
            // set order/tab order
            if(this.selectedObject.order > -1) {
              obj['_order'] = `${this.selectedObject.order}`;
              if(!this.isLabel(this.selectedObject.class) && !this.isButton(this.selectedObject.class)) obj['TabOrder'] = `${this.selectedObject.order-1}`;
            } else {
              obj['_order'] = defObj.order > -1 ? `${defObj.order}` : null;
              if(!this.isLabel(this.selectedObject.class) && !this.isButton(this.selectedObject.class)) obj['TabOrder'] = defObj.order > -1 ? `${defObj.order}` : null; // fix issue -> obj tab order must be restaured and not turned null
            }

            if(!this.isButton(this.selectedObject.class)) { 
              // set width
              if(typeof this.selectedObject.width !== 'number') obj['Width'] = `${this.selectedObject.width.value}`;
              // else obj['Width'] = `${this.selectedObject.width.value}`; // fix issue -> obj tab order must be restaured and not turned null
            } else if(this.selectedObject.order === 1) obj['Font']['Color'] = 'clWhite';

            break; // stop execution when target object is achieved
          }
          // one path keys leftover, the parent object is found
          else if(pathKeyIndex === (this.selectedObject.path.length-1)) {

            if(!this.isButton(this.selectedObject.class)) {
              // set top and left
              setTopAndLeft(obj, 'label');
              setTopAndLeft(obj, 'field');
            }
            // the button container case
            else {
              if(this.selectedObject.order > 0) {
                obj['_order'] = `${this.selectedObject.order}`;
                obj['TabOrder'] = `${this.selectedObject.order-1}`;
              }
              // set the main button
              if(this.selectedObject.order === 1) {
                obj['Color'] = '6766380';
                obj['Font']['Color'] = 'clWhite';
              }
            }

          }
          // two path keys leftover, the parent of parent object is found
          else if(pathKeyIndex === (this.selectedObject.path.length-2)) {
            
            // modify buttons here (current object === buttons container)
            if(this.isButton(this.selectedObject.class)) {
              // set top and left
              setTopAndLeft(obj, 'button');
            }

          }

        }
      }
    };


    // directly modify the dfm js object
    // update order, width, top and left (and more) properties
    const defObj = this._getDefaultObject();
    recursiveCall(this._dfm_js, 0);
    this.dfm_js$.next(this._dfm_js); // emit the new dfm js object
  }

  //--- Get Orders
  private _getOrdersByObjectType(parentObj: any, childObj: any): Array<number> {
    const orders = Object.keys(parentObj)
    .filter(k => {
      return parentObj[k]['_objectClass'] && (
      (this.isLabel(parentObj[k]['_objectClass']) && this.isLabel(childObj['_objectClass'])) ||
      (this.isField(parentObj[k]['_objectClass']) && this.isField(childObj['_objectClass'])) ||
      (this.isButtonPanel(parentObj[k]) && this.isButton(childObj['_objectClass']))
    )});
    return Array.from({length: orders.length}, (_, i) => i + 1);
  };
  //--- Get Sizes
  private _getSizes(): Array<{ id: number, name: string, value: number }> {
    const sizes = [
      { id: 0, name: 'col-12 | 100%', value: 810 },
      { id: 1, name: 'col-6 | 50%', value: 400 },
      { id: 2, name: 'col-4 | 33.337%', value: 263 },
      { id: 3, name: 'col-3 | 25%', value: 195 },
      { id: 4, name: 'col-2 | 16.667%', value: 126 }
    ];
    return sizes;
  };


  public isLabel(className: string){
    const classes = ['TLabel'];
    return classes.includes(className);
  };
  public isField(className: string){
    const classes = ['TEdit', 'TMSEdit', 'TMSEditSel', 'TComboBox', 'TMaskEdit', 'TMSDateEdit', 'TDBText', 'TDBEdit', 'TDBMemo', 'TMSDBEditNum', 'TMSDBFind', 'TMSEditFind', 'TMSFindIncZ', 'TDBCheckBox'];
    return classes.includes(className);
  };
  public isButton(className: string){
    const classes = ['TButton', 'TBitBtn', 'TDBSpeedButton', 'TSpeedButton', 'TMSButton'];
    return classes.includes(className);
  };
  public isButtonPanel(obj: any){
    return this.isButton(obj[Object.keys(obj)
      .filter(k => obj[k]['_objectClass'])[0]]?.['_objectClass']);
  };

  //--- Get Objects
  private _getObjects(dfm_js: any): Array<{
    parent: string,
    children: Array<{
      name: string,
      class: string,
      path: Array<string>,
      parent: string,
      caption?: string;
      order: number,
      width: { id: number, name: string, value: number } | number
    }>
  }> {
    
    const recursiveCall = (obj: any, parent1?: string, parent2?: string, path: Array<string> = []): Array<{
      parent: string,
      children: Array<{
        name: string,
        class: string,
        path: Array<string>,
        parent: string,
        caption?: string;
        order: number,
        width: { id: number, name: string, value: number } | number
    }>}> => {
      let allChildren: Array<{
        name: string,
        class: string,
        path: Array<string>,
        parent: string,
        caption?: string;
        order: number,
        width: { id: number, name: string, value: number } | number
      }> = [];

      for (const key in obj) {
        if (!obj[key] || !obj[key]['_objectClass']) continue;
    
        // Recursively collect children from nested objects
        allChildren = allChildren.concat(
          recursiveCall(obj[key], key, parent1, path.concat([key]))
            .flatMap(parentObj => parentObj.children)
        );
    
        // Only process objects of certain types
        if ((!this.isLabel(obj[key]['_objectClass']) && !this.isField(obj[key]['_objectClass']) && !this.isButton(obj[key]['_objectClass'])) || parent1 === 'PanelTitle') continue;
    
        const objParent = !this.isButton(obj[key]['_objectClass']) ? parent1 || '' : parent2 || '';
    
        allChildren.push({
          name: key,
          class: obj[key]['_objectClass'],
          path: path.concat(key) || [],
          parent: objParent,
          caption: obj[key]['Caption'] || '',
          order: obj[key]['_order'] && !isNaN(obj[key]['_order']) ? Number(obj[key]['_order']) : -1,
          width: this.sizes.filter(s => s.value === Number(obj[key]['Width']))[0] || -1
        });
      }
    
      // At the end of recursion, group by parent
      return groupByParent(allChildren);
    }
    // Helper function to group children by their parent
    const groupByParent = (children: Array<{
      name: string,
      class: string,
      path: Array<string>,
      parent: string,
      caption?: string;
      order: number,
      width: { id: number, name: string, value: number } | number
    }>) => {
      // Group objects by parent
      return children.reduce((grouped: Array<{
        parent: string,
        children: Array<{
          name: string,
          class: string,
          path: Array<string>,
          parent: string,
          caption?: string;
          order: number,
          width: { id: number, name: string, value: number } | number
        }>
      }>, child) => {
        // Find if the parent already exists
        let parentObj = grouped.find(v => v.parent === child.parent);
        
        // If parent doesn't exist, create a new group for it
        if (!parentObj) {
          parentObj = { parent: child.parent, children: [] };
          grouped.push(parentObj);
        }
        
        // Push the child to the parent's children array
        parentObj.children.push(child);

        return grouped;
      }, []);
    };


    return recursiveCall(dfm_js);
  }
  //--- Get Object By Path
  private _getObjectByPath(path: Array<string>): { parent: any, child: any } {
    let child = this._dfm_js;
    let parent = child;
    for (const [index, key] of path.entries()) {
      if(!child[key]) {
        child = null;
        break;
      }

      child = child[key];
      if(index === (path.length-2)) parent = child;
    }
    return { parent: parent, child: child };
  }
  //--- Get Default Object
  private _getDefaultObject(): {
    name: string,
    class: string,
    path: Array<string>,
    parent: string,
    caption?: string;
    order: number,
    width: { id: number, name: string, value: number } | number
  } | null {
    for (const [index1, parent] of this.objects.entries()) {
      for (const [index2, child] of parent.children.entries()) {
        if(this.selectedObject?.name === child.name) {
          return child;
        }
      }
    }

    return null;
  }

  //--- Prev Object
  prevObject(): void {
    for (const [index1, parent] of this.objects.entries()) {
      for (const [index2, child] of parent.children.entries()) {
        if(this.selectedObject?.name === child.name) {
          if(index2 > 0) this.selectedObject = this.objects[index1].children[index2-1];
          else if(index1 > 0) this.selectedObject = this.objects[index1-1].children[this.objects[index1-1].children.length-1];
          else this.selectedObject = this.objects[this.objects.length-1].children[this.objects[this.objects.length-1].children.length-1];

          this.onSelectedObjectChange();
          return;
        }
      }
    }
  }
  //--- Next Object
  nextObject(): void {
    for (const [index1, parent] of this.objects.entries()) {
      for (const [index2, child] of parent.children.entries()) {
        if(this.selectedObject?.name === child.name) {
          if(index2 < (parent.children.length - 1)) this.selectedObject = this.objects[index1].children[index2+1];
          else if(index1 < (this.objects.length - 1)) this.selectedObject = this.objects[index1+1].children[0];
          else this.selectedObject = this.objects[0].children[0];

          this.onSelectedObjectChange();
          return;
        }
      }
    }
  }
}
