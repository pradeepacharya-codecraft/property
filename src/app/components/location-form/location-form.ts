import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
})
export class LocationForm {
  PanelSignal = signal<boolean>(false);

  private locationService = inject(LocationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  locationRouter = inject(Location);
  isEditMode = false;
  currentId: number | null = null;

  ngOnInit() {
    // handle BOTH cases (details + home)
    const idParam =
      this.route.snapshot.paramMap.get('id') || this.route.parent?.snapshot.paramMap.get('id');

    this.currentId = idParam ? Number(idParam) : null;
    this.isEditMode = this.currentId !== null;

    // form
    this.form = this.fb.group({
      name: [''],
      city: [''],
      state: [''],
      photo: [''],
      availableUnits: [0],
      wifi: [false],
      laundry: [false],
    });

    // patch
    if (this.isEditMode && this.currentId !== null) {
      const location = this.locationService.getLocationForId(this.currentId);

      if (location) {
        this.form.patchValue(location);
      }
    }

    this.showPanel();
  }

  showPanel() {
    this.PanelSignal.set(true);
  }

  hidePanel() {
    this.PanelSignal.set(false);

    if (this.isEditMode && this.currentId !== null) {
      // go back to /details/:id OR /home (handled by route structure)

      this.locationRouter.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    let location: HousingLocationInfo;

    if (this.isEditMode && this.currentId !== null) {
      // EDIT
      location = {
        id: this.currentId,
        deleted: false,
        ...formValue,
      };

      this.locationService.updateLocation(location);
    } else {
      // ADD
      const length = this.locationService.getAllLocations()().length;

      location = {
        id: length,
        deleted: false,
        ...formValue,
      };

      this.locationService.addLocation(location);
    }

    this.form.reset();
    this.hidePanel(); // ✅ ONLY navigation here
  }
}
