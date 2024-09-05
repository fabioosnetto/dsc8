export class FileClass {
   [fileKey: string]: {content: string};

   constructor();
   constructor(files: FileClass);
   constructor(files: Array<{name: string; content: string}>);
   constructor(p1?: FileClass | Array<{name: string; content: string}>) {
      // not empty constructor
      if(p1) {
         // existent instance constructor
         if(p1 instanceof FileClass) {
            for (const fk in p1) {
               if (Object.prototype.hasOwnProperty.call(p1, fk)) {
                  this[fk] = p1[fk];
               }
            }
         }
         // array object constructor
         else if(Array.isArray(p1)) {
            for (const file of p1) { this[file.name] = {content: file.content}; }
         }
      }
   }
}
