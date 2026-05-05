import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-location-details',
  imports: [RouterOutlet],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  route = inject(ActivatedRoute);
  router = inject(Router);
  locationService = inject(LocationService);

  currentId = signal<number>(0);

  currentIndex = 0;
  location: HousingLocationInfo | undefined;

  constructor() {
    effect(() => {
      const id = this.currentId();

      const list = this.getActiveList();

      this.currentIndex = list.findIndex((item) => item.id === id);
      this.location = list[this.currentIndex];
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.currentId.set(Number(params.get('id')));
    });
  }

  getActiveList() {
    return this.locationService
      .getAllLocations()()
      .filter((item) => !item.deleted);
  }

  goBack() {
    const list = this.getActiveList();

    if (this.currentIndex > 0) {
      this.router.navigate(['/details', list[this.currentIndex - 1].id]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  goForward() {
    const list = this.getActiveList();

    if (this.currentIndex < list.length - 1) {
      this.router.navigate(['/details', list[this.currentIndex + 1].id]);
    }
  }

  editLocation(id: number | undefined) {
    if (id === undefined) return;

    this.router.navigate(['edit'], {
      relativeTo: this.route,
    });
  }
}
