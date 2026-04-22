import { Component, computed, linkedSignal, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo, HousingLOcationView } from '../../models/housing-location-info';
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
  selectedItems = new Set<number>();
  locationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  housingLocationList: HousingLocationInfo[] = this.locationService.getAllHousingLocations();
  router = inject(Router);
  modeString = computed(
    () => ` ${this.mode() === 'normal' ? ' ' : 'you can select the housing location to DELETE '} `,
  );
  // ocationDisplay = linkedSignal<HousingLOcationView[]>(()=>{})
  onSelect(selected: HousingLocationInfo) {
    console.log('housing location is clicked', selected.name);
    if (this.mode() === 'normal') {
      this.router.navigate(['details', selected.id]);
    } else {
      if (this.selectedItems.has(selected.id)) {
        this.selectedItems.delete(selected.id);
      } else {
        this.selectedItems.add(selected.id);
      }
    }
  }
  handleCheckbox(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.mode.set(isChecked ? 'edit' : 'normal');

    if (!isChecked) {
      this.selectedItems.clear();
    }
  }
  deleteSelected() {
    if (this.mode() !== 'edit') {
      return;
    }
    if (this.selectedItems.size === 0) {
      return;
    }
    const confirmDelete = confirm('Are you sure you want to delete selected items?');
    if (!confirmDelete) {
      return;
    }
    const idsToDelete = Array.from(this.selectedItems);
    this.locationService.deleteLocations(idsToDelete);
    this.housingLocationList = this.locationService.getAllHousingLocations();
    this.selectedItems.clear();
    this.mode.set('normal');
  }
  restoreAll() {
    this.locationService.restoreLocations();
    this.housingLocationList = this.locationService.getAllHousingLocations();

    this.selectedItems.clear();
    this.mode.set('normal');
  }
}
