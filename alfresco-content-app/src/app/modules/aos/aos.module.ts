import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AosEditOnlineService } from './aos.editonline.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
  	AosEditOnlineService
  ]
})
export class AosModule { }
