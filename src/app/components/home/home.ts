import { Component, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { inject } from '@angular/core';
import { LocationService } from '../../services/location-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',

  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  locationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  housingLocationList: HousingLocationInfo[] = [];
  router = inject(Router);

  ngOnInit() {
    this.housingLocationList = this.locationService.getAllHousingLocations();
  }

  onSelect(selected: HousingLocationInfo) {
    console.log('housing location is clicked', selected.name);
    this.router.navigate(['details', selected.id]);
    this.housingLocationList = [
      selected,
      ...this.housingLocationList.filter((item) => item.id !== selected.id),
    ];
  }
  handleCheckbox(event: Event) {
    console.log('check box is clicked', (event.target as HTMLInputElement).checked);
    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));
  }
}
