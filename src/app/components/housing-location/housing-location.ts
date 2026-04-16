import { Component, inject, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { BASE_URL } from '../../services/location-service';
@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  // providers: [{ provide: LocationService, useClass: LocationService }],
})
export class HousingLocation {
  HousingLocation() {
    throw new Error('Method not implemented.');
  }
  housingLocation = input.required<HousingLocationInfo>();
  locationService = inject(LocationService);
  baseUrl = inject(BASE_URL);
  select = output<HousingLocationInfo>();

  handleClick() {
    this.select.emit(this.housingLocation());
    console.log('baseUrl in HousingLocation component:', this.baseUrl);
  }
}
