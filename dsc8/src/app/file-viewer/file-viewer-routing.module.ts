import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileViewerComponent } from './component/file-viewer.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: '**',
        component: FileViewerComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileViewerRoutingModule { }
