// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapFrameComponent } from '../components/map-frame/map-frame.component';
import { SafeUrlPipe } from '../components/pipes/safe-url.pipe';
import { DateFormatPipe } from '../components/pipes/date-format.pipe';
import { ImageSelectableComponent } from './components/image-selectable/image-selectable.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MapFrameComponent, SafeUrlPipe, DateFormatPipe, ImageSelectableComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TranslateModule.forChild()],
  exports: [MapFrameComponent, SafeUrlPipe, DateFormatPipe, ImageSelectableComponent]  // Exporta MapFrameComponent para usarlo en otros módulos
})
export class SharedModule {}
