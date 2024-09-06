import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileViewerRoutingModule } from './file-viewer-routing.module';
import { FileViewerComponent } from './component/file-viewer.component';


@NgModule({
  declarations: [
    FileViewerComponent
  ],
  imports: [
    CommonModule,
    FileViewerRoutingModule
  ],
  exports: [
    FileViewerComponent
  ]
})
export class FileViewerModule { }
