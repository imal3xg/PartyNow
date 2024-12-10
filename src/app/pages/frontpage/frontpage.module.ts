import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FrontpagePageRoutingModule } from './frontpage-routing.module';

import { FrontpagePage } from './frontpage.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrontpagePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FrontpagePage]
})
export class FrontpagePageModule {}
