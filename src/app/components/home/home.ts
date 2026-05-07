import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo, HousingLOcationView } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { SearchBar } from '@components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet, SearchBar,],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  locationService = inject(LocationService);
  router = inject(Router);
  baseUrl = inject(BASE_URL);
  mode = signal<'normal' | 'edit'>('normal');

  housingLocationList = this.locationService.getAllLocations();

  modeString = computed(() =>
    this.mode() === 'normal' ? '' : 'you can select the housing location to DELETE',
  );

  searchQuery = this.locationService.searchQuery;

  locationToDisplay = linkedSignal<
    { locations: HousingLocationInfo[]; query: string },
    HousingLOcationView[]
  >({
    source: computed(() => ({
      locations: this.housingLocationList(),
      query: this.searchQuery(),
    })),

    computation: ({ locations, query }, previous) => {
      const q = query.toLowerCase().trim();

      const previousSelectionMap = new Map(
        (previous?.value ?? []).map((item) => [item.id, item.selected]),
      );

      return locations
        .filter((location) => !location.deleted)
        .filter(
          (location) =>
            q === '' ||
            location.name.toLowerCase().includes(q) ||
            location.city.toLowerCase().includes(q) ||
            location.state.toLowerCase().includes(q),
        )
        .map((location) => ({
          ...location,
          selected: previousSelectionMap.get(location.id) ?? false,
        }));
    },
  });

  onSelect(selected: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', selected.id]);

      this.locationToDisplay.set(
        this.locationToDisplay().map((vm) => ({
          ...vm,
          selected: false,
        })),
      );

      return;
    }

    this.locationToDisplay.set(
      this.locationToDisplay().map((vm) =>
        vm.id === selected.id ? { ...vm, selected: !vm.selected } : vm,
      ),
    );
  }

  handleCheckbox(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.mode.set(isChecked ? 'edit' : 'normal');

    if (!isChecked) {
      this.clearSelections();
    }
  }

  clearSelections() {
    this.locationToDisplay.set(
      this.locationToDisplay().map((vm) => ({
        ...vm,
        selected: false,
      })),
    );
  }

  deleteSelected() {
    if (this.mode() !== 'edit') return;

    const idsToDelete = this.locationToDisplay()
      .filter((item) => item.selected)
      .map((item) => item.id);

    if (!idsToDelete.length) return;

    if (!confirm('Are you sure you want to delete selected items?')) return;

    this.locationService.deleteLocationsByIds(idsToDelete);
    this.mode.set('normal');
  }

  restoreAll() {
    this.locationService.restoreAllDeletedLocation();
    this.clearSelections();
    this.mode.set('normal');
  }

  addLocation() {
    // ✅ reset search so new item is visible after adding
    this.router.navigate(['home/edit']);
  }

  resetSearch() {
    this.searchQuery.set('');
  }

  selectedCount = computed(() => this.locationToDisplay().filter((x) => x.selected).length);
}
