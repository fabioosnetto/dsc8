import { Params } from '@angular/router';

/**
 * @description An object that defines a tab
 */
export class Tab {

   private _path:       string;
   private _qryParams?: Params;
   private _name:       string;
   private _data:       any;

   constructor();
   constructor(tabInstance: Tab)
   constructor(tabInstance: ITabCache)
   constructor(path: string, name: string, data?: any);
   constructor(path: string, qryParams: Params, name: string, data?: any);
   constructor(param1?: Tab | ITabCache | string, param2?: Params | string, param3?: string | any, param4?: any) {

      if(param1 !== undefined) {
         
         // tab instance
         if(param1 instanceof Tab) {
            this._path      = param1._path;
            this._qryParams = param1._qryParams;
            this._name      = param1._name;
            this._data      = param1._data;
         }
         // tab cache
         else if(typeof param1 !== 'string') {
            this._path      = param1.path;
            this._qryParams = param1.qryParams;
            this._name      = param1.name;
            this._data      = param1.data;
         }
         // tab paramaters - without query parameter
         else if(typeof param2 === 'string') {
            this._path      = param1?.trim() || '';
            this._qryParams = undefined;
            this._name      = param2?.trim() || '';
            this._data      = param3 !== undefined ? param3 : undefined;
         
         }
         // tab parametes - with query parameter
         else {
            this._path      = param1?.trim() || '';
            this._qryParams = param2 || undefined;
            this._name      = param3?.trim() || '';
            this._data      = param4 !== undefined ? param3 : undefined;
         }

      } else {
         this._path      = '';
         this._qryParams = undefined;
         this._name      = '';
         this._data      = null;
      }
   }


   public get path():      string             { return this._path;      }
   public get qryParams(): Params | undefined { return this._qryParams; }
   public get name():      string             { return this._name;      }
   public get data():      any                { return this._data;      }

   public set path(value: string)                  { this._path      = value; }
   public set qryParams(value: Params | undefined) { this._qryParams = value; }
   public set name(value: string)                  { this._name      = value; }
   public set data(value: any)                     { this._data      = value; }

   public get tabCache(): ITabCache {
      return {
         name:      this._name,
         qryParams: this._qryParams,
         path:      this._path,
         data:      this._data
      };
   }
}

export interface ITabCache {
   path:       string;
   qryParams?: Params;
   name:       string;
   data:       any;
}