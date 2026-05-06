import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo, HousingLOcationView } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { SearchBar } from '@components/search-bar/search-bar';
import { CardLayout } from '@components/card-layout/card-layout';
@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet, SearchBar, CardLayout],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  locationService = inject(LocationService);
  router = inject(Router);
  baseUrl = inject(BASE_URL);
  mode = signal<'normal' | 'edit'>('normal');
  searchQuery = signal('');
  // signal from service
  housingLocationList = this.locationService.getAllLocations();

  modeString = computed(() =>
    this.mode() === 'normal' ? '' : 'you can select the housing location to DELETE',
  );

  locationToDisplay = linkedSignal<HousingLocationInfo[], HousingLOcationView[]>({
    source: this.housingLocationList,

    computation: (nextLocations, previous) => {
      const query = this.searchQuery().toLowerCase().trim();

      const previousSelectionMap = new Map(
        (previous?.value ?? []).map((item) => [item.id, item.selected]),
      );

      return (
        nextLocations
          // 1. remove deleted items
          .filter((location) => !location.deleted)

          // 2. search filter
          .filter(
            (location) =>
              query === '' ||
              location.name.toLowerCase().includes(query) ||
              location.city.toLowerCase().includes(query) ||
              location.state.toLowerCase().includes(query),
          )

          // 3. preserve selection state
          .map((location) => ({
            ...location,
            selected: previousSelectionMap.get(location.id) ?? false,
          }))
      );
    },
  });

  onSelect(selected: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', selected.id]);

      // clear selections when navigating
      this.locationToDisplay.set(
        this.locationToDisplay().map((vm) => ({
          ...vm,
          selected: false,
        })),
      );

      return;
    }

    // edit mode toggle selection
    this.locationToDisplay.set(
      this.locationToDisplay().map((vm) =>
        vm.id === selected.id
          ? {
              ...vm,
              selected: !vm.selected,
            }
          : vm,
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

    if (!confirm('Are you sure you want to delete selected items?')) {
      return;
    }

    this.locationService.deleteLocationsByIds(idsToDelete);

    this.mode.set('normal');
  }

  restoreAll() {
    this.locationService.restoreAllDeletedLocation();

    this.clearSelections();

    this.mode.set('normal');
  }

  addLocation() {
    this.router.navigate(['home/edit']);
  }

  selectedCount = computed(() => this.locationToDisplay().filter((x) => x.selected).length);
}
