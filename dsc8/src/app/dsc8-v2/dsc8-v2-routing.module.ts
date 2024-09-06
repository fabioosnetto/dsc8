import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dsc8v2 } from './component/dsc8-v2.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: '**',
        component: Dsc8v2
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Dsc8V2RoutingModule { }
