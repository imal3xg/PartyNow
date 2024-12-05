import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MapFrameComponent } from 'src/app/components/map-frame/map-frame.component';
import { SafeUrlPipe } from 'src/app/components/pipes/safe-url.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,    
  ],
  declarations: [HomePage, MapFrameComponent, SafeUrlPipe]
})
export class HomePageModule {}
