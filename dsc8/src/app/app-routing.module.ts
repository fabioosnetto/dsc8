import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './layout/content/content.component';
import { TabsComponent } from './layout/tabs/component/tabs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  
  { path: '', redirectTo: '/tab', pathMatch: 'full' },

  /* dsc8-v2 */
  {
    path: 'dsc8v2',
    loadChildren: () => import('./dsc8-v2/dsc8-v2.module').then(m => m.Dsc8V2Module)
  },

  /* content */
  {
    path: '',
    component: ContentComponent,
    children: [

      /* tabs */
      {
        path: 'tab',
        component: TabsComponent,
        children: [

          { path: '', redirectTo: 'home', pathMatch: 'full' },

          {
            path: 'home',
            loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
          },

          {
            path: ':file/:extension',
            loadChildren: () => import('./file-viewer/file-viewer.module').then(m => m.FileViewerModule)
          },
          
        ]
      }

    ]
  },

  { path: '**', redirectTo: '/tab' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
