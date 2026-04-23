import { Routes } from '@angular/router';
import { Forms } from '@components/forms/forms';
import { Home } from '@components/home/home';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { LocationDetails } from '@components/location-details/location-details';
import { LocationForm } from '@components/location-form/location-form';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    title: 'Home Page',
    children: [
      {
        path: 'edit',

        component: LocationForm,
        title: 'edit',
      },

      {
        path: 'edit/:id',
        component: LocationForm,
        title: 'Edit Location',
      },
    ],
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/location-details/location-details').then((m) => m.LocationDetails),
    //component: LocationDetails,
    title: 'location Details Page    ',
  },
  {
    path: 'linkedSignals',

    component: LinkedSignalDemo,
    title: 'linked signal page',
  },
  {
    path: 'forms',
    component: Forms,
    title: 'forms demo',
  },
];
