import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-map-frame',
  templateUrl: './map-frame.component.html',
  styleUrls: ['./map-frame.component.scss'],
})
export class MapFrameComponent implements OnChanges {
  @Input() city: string = ''; // Nombre de la ciudad
  @Input() country: string = ''; // Nombre del país

  ngOnChanges(): void {
    this.mapUrl;
  }

  get mapUrl(): string {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDkMxz0jtkbS1UPiuBptT-nDWkNttgsDwE&q=${this.city},${this.country}`;
  }
}
