import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
  host: {
    '(document.keydown.escape)': 'handleEscape',
  },
})
export class LocationForm {
  panelVisible = signal<boolean>(false);
  controlScrolling = '';
  private readonly scroll_hidden = 'hidden';
  private readonly auto_scroll = 'auto';
  private locationService = inject(LocationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private locationRouter = inject(Location);

  form!: FormGroup;
  isEditMode = false;
  currentId: number | null = null;

  ngOnInit() {
    const idParam =
      this.route.snapshot.paramMap.get('id') || this.route.parent?.snapshot.paramMap.get('id');

    this.currentId = idParam ? Number(idParam) : null;
    this.isEditMode = this.currentId !== null;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      photo: ['', Validators.required],
      availableUnits: [0, [Validators.required, Validators.min(1)]],
      wifi: [false],
      laundry: [false],
    });

    if (this.isEditMode && this.currentId !== null) {
      const location = this.locationService.getLocationForId(this.currentId);
      if (location) {
        this.form.patchValue(location);
      }
    }

    this.showPanel();
  }
  private setBodyScroll(lock: boolean) {
    document.body.style.overflow = lock ? this.scroll_hidden : this.auto_scroll;
  }

  showPanel() {
    this.panelVisible.set(true);
    this.setBodyScroll(true);
  }

  hidePanel() {
    if (!this.confirmDiscard()) return;

    this.panelVisible.set(false);
    this.setBodyScroll(false);

    if (this.isEditMode && this.currentId !== null) {
      this.locationRouter.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
  // showPanel() {
  //   this.panelVisible.set(true);

  //   document.body.style.overflow = 'hidden';
  // }

  // hidePanel() {
  //   if (!this.confirmDiscard()) return; // stops if user cancels

  //   this.panelVisible.set(false);
  //   document.body.style.overflow = 'auto';

  //   if (this.isEditMode && this.currentId !== null) {
  //     this.locationRouter.back();
  //   } else {
  //     this.router.navigate(['/home']);
  //   }
  // }

  
  confirmDiscard(): boolean {
    if (this.form.dirty) {
      return confirm('You have unsaved changes. Discard them?');
    }
    return true;
  }

  handleEscape() {
    if (this.panelVisible()) {
      this.hidePanel();
    }
  }
  submitted = false;
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;

    let location: HousingLocationInfo;

    if (this.isEditMode && this.currentId !== null) {
      location = {
        id: this.currentId,
        deleted: false,
        ...formValue,
      };

      this.locationService.updateLocation(location);
    } else {
      const length = this.locationService.getAllLocations()().length;

      location = {
        id: length,
        deleted: false,
        ...formValue,
      };

      this.locationService.addLocation(location);
    }
    this.submitted = false;
    this.form.reset();
    this.hidePanel();
  }
}
