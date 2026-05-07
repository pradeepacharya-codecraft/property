import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {
  private destroyRef = inject(DestroyRef);

  searchControl = new FormControl('');

  search = output<string>();

  initialValue = input('');

constructor() {
  effect(() => {
    if (this.initialValue() === '') {
      this.searchControl.setValue('', { emitEvent: false });
    }
  });
  this.initSearch();
}

  private initSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => value?.trim() ?? ''),

        filter((value) => value === '' || value.length >= 3),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.search.emit(query);
      });
  }
}
