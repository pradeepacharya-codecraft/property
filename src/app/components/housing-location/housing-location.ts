// // import { Component, inject, input, output } from '@angular/core';
// // import { HousingLocationInfo } from '../../models/housing-location-info';
// // import { LocationService } from '../../services/location-service';
// // import { BASE_URL } from '../../services/location-service';
// // @Component({
// //   selector: 'app-housing-location',
// //   imports: [],
// //   templateUrl: './housing-location.html',
// //   styleUrl: './housing-location.css',

// //   // providers: [{ provide: LocationService, useClass: LocationService }],
// // })
// // export class HousingLocation {
// //   housingLocation = input.required<HousingLocationInfo>();
// //   selected = input<boolean>();
// //   locationService = inject(LocationService);
// //   baseUrl = inject(BASE_URL);
// //   select = output<HousingLocationInfo>();

// //   handleClick() {
// //     this.select.emit(this.housingLocation());
// //     console.log('baseUrl in HousingLocation component:', this.baseUrl);
// //   }
// // }
// import { Component, inject, input, output } from '@angular/core';
// import { HousingLocationInfo } from '../../models/housing-location-info';
// import { LocationService, BASE_URL } from '../../services/location-service';

// @Component({
//   selector: 'app-housing-location',
//   imports: [],
//   templateUrl: './housing-location.html',
//   styleUrl: './housing-location.css',
// })
// export class HousingLocation {
//   housingLocation = input.required<HousingLocationInfo>();

//   // selection state from parent view model
//   selected = input.required<boolean>();

//   select = output<HousingLocationInfo>();

//   locationService = inject(LocationService);
//   baseUrl = inject(BASE_URL);

//   handleClick() {
//     this.select.emit(this.housingLocation());
//   }
// }
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';

@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();

  
  selected = input.required<boolean>();


  isEditMode = input<boolean>(false);

  select = output<HousingLocationInfo>();

  locationService = inject(LocationService);
  baseUrl = inject(BASE_URL);
  router = inject(Router); // 

  handleClick() {
    this.select.emit(this.housingLocation());
  }

  
  editLocation(event: Event) {
    event.stopPropagation(); 

    const id = this.housingLocation().id;

    this.router.navigate(['/home/edit', id]);
  }
}
