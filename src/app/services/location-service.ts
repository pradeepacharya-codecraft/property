import { inject, Injectable, InjectionToken, Signal, signal } from '@angular/core';
import { HousingLocationInfo } from '../models/housing-location-info';

export const BASE_URL = new InjectionToken<string>('base-url', {
  providedIn: 'root',
  factory: () => 'https://angular.dev/assets/images/tutorials/common',
});
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  static numberOfInstances = 0;
  constructor() {
    LocationService.numberOfInstances += 1;
    console.log('Number of instances of Location Service', LocationService.numberOfInstances);
  }
  private readonly baseUrl = inject(BASE_URL);
  private housingLocations: HousingLocationInfo[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
      deleted: false,
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
      deleted: false,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
      deleted: false,
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
      deleted: false,
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      photo: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
      deleted: false,
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
      deleted: false,
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      wifi: true,
      laundry: true,
      deleted: false,
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
      deleted: false,
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
      deleted: false,
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      photo: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      wifi: true,
      laundry: true,
      deleted: false,
    },
  ];

  private locations = signal<HousingLocationInfo[]>(this.housingLocations);

  getAllLocations() {
    return this.locations.asReadonly();
  }

  getLocationForId(id: number): HousingLocationInfo | undefined {
    return this.locations().find((location) => location.id === id && location.deleted === false);
  }

  searchQuery = signal('');
  deleteLocationsByIds(ids: number[]) {
    this.locations.update((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          return { ...item, deleted: true };
        }
        return item;
      }),
    );
  }

  restoreAllDeletedLocation() {
    this.locations.update((prev) =>
      prev.map((item) => {
        return {
          ...item,
          deleted: false,
        };
      }),
    );
  }

  getDeletedCount() {
    return this.locations().filter((item) => item.deleted).length;
  }
  updateLocation(updatedLocation: HousingLocationInfo) {
    this.locations.update((prev) =>
      prev.map((item) => (item.id === updatedLocation.id ? { ...item, ...updatedLocation } : item)),
    );
  }
  // getById(id: string | number): HousingLocationInfo | undefined {
  //   return this.locations().find((location) => location.id === id && location.deleted === false);
  // }
  addLocation(location: HousingLocationInfo) {
    const currentLocations = [...this.locations()];
    location.id = currentLocations.length;
    currentLocations.push(location);

    this.locations.set(currentLocations);
  }
  searchLocations(query: string): HousingLocationInfo[] {
    const q = query.trim().toLowerCase();

    if (!q) return this.locations().filter((l) => !l.deleted);

    return this.locations().filter(
      (location) =>
        !location.deleted &&
        (location.name.toLowerCase().includes(q) ||
          location.city.toLowerCase().includes(q) ||
          location.state.toLowerCase().includes(q)),
    );
  }
}
