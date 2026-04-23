import { TestBed } from '@angular/core/testing';

import { LocationService } from './location-service';
import { HousingLocation } from '@components/housing-location/housing-location';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


// locations = signal<HousingLocationInfo[]>(this.housingLocationList);

// addLocation(location:HousingLocationInfo){
//   const currre
// }