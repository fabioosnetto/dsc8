import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Dsc8V2RoutingModule } from './dsc8-v2-routing.module';
import { Dsc8v2 } from './component/dsc8-v2.component';


@NgModule({
  declarations: [ Dsc8v2 ],
  imports: [
    CommonModule,
    Dsc8V2RoutingModule
  ],
  exports: [ Dsc8v2 ]
})
export class Dsc8V2Module { }
