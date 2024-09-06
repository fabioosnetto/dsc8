import { FileClass } from "./file.class";

export class FileGroupClass {
   [groupKey: string]: FileClass;

   constructor();
   constructor(fileGroup: FileGroupClass);
   constructor(files: Array<FileClass>);
   constructor(p1?: FileGroupClass | Array<FileClass>) {
      // not empty constructor
      if(p1) {
         // existent instance constructor
         if(p1 instanceof FileGroupClass) {
            for (const gk in p1) {
               if (Object.prototype.hasOwnProperty.call(p1, gk)) {
                  this[gk] = p1[gk];
               }
            }
         }
         // FileClass instance constructor
         else if(Array.isArray(p1)) {
            for (const file of p1) {
               for (const key in file) {
                  if(!Object.hasOwn(file, key)) continue;
                  
                  const gk = key.split('.').slice(0, -1).join(''); // get file group
                  const fk = key; // get file name
   
                  // create file group and respective files
                  if(!this[gk]) this[gk] = {};
                  this[gk][fk] = {content: file[key].content};
               }
            }
         }
      }
   }

   //--- File List To File Group
   // * Async Constructor
   public static async fileListToFileGroup(fileList: FileList): Promise<FileGroupClass> {
      const reader = new FileReader();
      const stack: FileGroupClass = new FileGroupClass();

      for (const key in fileList) {
         if(!Object.hasOwn(fileList, key)) continue;
   
         const gk = fileList[key].name.split('.').slice(0, -1).join(''); // get file group
         const fk = fileList[key].name; // get file name
         
         // sync read to file content 
         const fc = String(await new Promise((res) => {
            reader.onload = (e) => res(e.target?.result as string);
            reader.readAsText(fileList[key]);
         }));
   
         // create file group and respective files
         if(!stack[gk]) stack[gk] = {};
         stack[gk][fk] = {content: fc};
      }

      return stack;
   }
}
