import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  PanelSignal = signal<boolean>(false);
  locationService = inject(LocationService);
  route = inject(ActivatedRoute);
  baseUrl = 'assets';
  router = inject(Router);
  isEditMode = false;
  currentId: string | null = null;

  showPanel() {
    this.PanelSignal.set(true);
  }

  hidePanel() {
    this.PanelSignal.set(false);
  }

  onSubmit(form: any) {
    if (!form.valid) return;

    const formValue = form.value;

    const newLocation: HousingLocationInfo = {
      id: 0, // internal
      deleted: false, // internal

      name: formValue.name,
      city: formValue.city,
      state: formValue.state,
      photo: formValue.photo,
      availableUnits: formValue.availableUnits,

      wifi: formValue.wifi ?? false,
      laundry: formValue.laundry ?? false,
    };

    // call addLocation
    this.addLocation(newLocation);

    form.reset();
    this.hidePanel();
    this.router.navigate(['/home']);
  }
  addLocation(newLocation: HousingLocationInfo) {
    this.locationService.addLocation(newLocation);
  }
}

// import { Component, inject, signal } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
// import { HousingLocationInfo } from '../../models/housing-location-info';
// import { LocationService } from '../../services/location-service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-location-form',
//   standalone: true,
//   imports: [ReactiveFormsModule],
//   templateUrl: './location-form.html',
//   styleUrl: './location-form.css',
// })
// export class LocationForm {
//   PanelSignal = signal<boolean>(false);

//   locationService = inject(LocationService);
//   route = inject(ActivatedRoute);
//   router = inject(Router);
//   fb = inject(FormBuilder);

//   baseUrl = 'assets';

//   form!: FormGroup;

//   isEditMode = false;
//   currentId: string | null = null;

//   ngOnInit() {
//     this.showPanel();

//     // check route id
//     this.currentId = this.route.snapshot.paramMap.get('id');
//     this.isEditMode = !!this.currentId;

//     // create form
//     this.form = this.fb.group({
//       name: [''],
//       city: [''],
//       state: [''],
//       photo: [''],
//       availableUnits: [0],
//       wifi: [false],
//       laundry: [false],
//     });

//     // EDIT MODE → patch values
//     if (this.isEditMode && this.currentId) {
//       const location = this.locationService.getById(this.currentId);

//       if (location) {
//         this.form.patchValue(location);
//       }
//     }
//   }

//   showPanel() {
//     this.PanelSignal.set(true);
//   }

//   hidePanel() {
//     this.PanelSignal.set(false);
//   }

//   onSubmit() {
//     if (this.form.invalid) return;

//     const formValue = this.form.value;

//     const location: HousingLocationInfo = {
//       id: this.isEditMode && this.currentId ? this.currentId : crypto.randomUUID(),

//       deleted: false,

//       ...formValue,
//     };

//     if (this.isEditMode) {
//       this.locationService.updateLocation(location);
//     } else {
//       this.locationService.addLocation(location);
//     }

//     this.form.reset();
//     this.hidePanel();

//     this.router.navigate(['/home']);
//   }
// }
