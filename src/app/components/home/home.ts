import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo, HousingLOcationView } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { SearchBar } from '@components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet, SearchBar],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  locationService = inject(LocationService);
  router = inject(Router);
  baseUrl = inject(BASE_URL);
  mode = signal<'normal' | 'edit'>('normal');

  housingLocationList = this.locationService.getAllLocations();
  searchQuery = this.locationService.searchQuery;

  private selectionMap = signal<Map<number, boolean>>(new Map());

  modeString = computed(() =>
    this.mode() === 'normal' ? '' : 'you can select the housing location to DELETE',
  );

  locationToDisplay = toSignal(
    combineLatest([
      toObservable(this.housingLocationList),
      toObservable(this.searchQuery),
      toObservable(this.selectionMap),
    ]).pipe(
      map(([locations, query, selections]) => {
        const q = query.toLowerCase().trim();

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
            selected: selections.get(location.id) ?? false,
          }));
      }),
    ),
    { initialValue: [] as HousingLOcationView[] },
  );

  onSelect(selected: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', selected.id]);
      this.selectionMap.set(new Map());
      return;
    }

    const current = new Map(this.selectionMap());
    current.set(selected.id, !current.get(selected.id));
    this.selectionMap.set(current);
  }

  handleCheckbox(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.mode.set(isChecked ? 'edit' : 'normal');
    if (!isChecked) this.clearSelections();
  }

  clearSelections() {
    this.selectionMap.set(new Map());
  }

  deleteSelected() {
    if (this.mode() !== 'edit') return;

    const idsToDelete = (this.locationToDisplay() ?? [])
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
    this.router.navigate(['home/edit']);
  }

  resetSearch() {
    this.searchQuery.set('');
  }

  selectedCount = computed(() => (this.locationToDisplay() ?? []).filter((x) => x.selected).length);
}
