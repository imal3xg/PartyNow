// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapFrameComponent } from '../components/map-frame/map-frame.component';
import { SafeUrlPipe } from '../components/pipes/safe-url.pipe';
import { DateFormatPipe } from '../components/pipes/date-format.pipe';

@NgModule({
  declarations: [MapFrameComponent, SafeUrlPipe, DateFormatPipe],
  imports: [CommonModule],
  exports: [MapFrameComponent, SafeUrlPipe, DateFormatPipe]  // Exporta MapFrameComponent para usarlo en otros módulos
})
export class SharedModule {}
