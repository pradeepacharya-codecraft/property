import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  route = inject(ActivatedRoute);
  router = inject(Router);
  locationService = inject(LocationService);

  housingLocationList: HousingLocationInfo[] = [];
  currentIndex = 0;
  location: HousingLocationInfo | undefined;

  static count = 0;

  constructor() {
    LocationDetails.count += 1;
    console.log(`There are ${LocationDetails.count} instances of Details`);
  }

  ngOnInit() {
    this.housingLocationList = this.locationService
      .getAllLocations()()
      .filter((item) => !item.deleted);

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.currentIndex = this.housingLocationList.findIndex((item) => item.id === id);

      this.location = this.housingLocationList[this.currentIndex];
    });
  }

  ngOnDestroy() {
    console.log('LocationDetails is destroyed');
    LocationDetails.count -= 1;
  }

  goBack() {
    if (this.currentIndex > 0) {
      const prevItem = this.housingLocationList[this.currentIndex - 1];
      this.router.navigate(['/details', prevItem.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  goForward() {
    if (this.currentIndex < this.housingLocationList.length - 1) {
      const nextItem = this.housingLocationList[this.currentIndex + 1];
      this.router.navigate(['/details', nextItem.id]);
    }
  }
}
