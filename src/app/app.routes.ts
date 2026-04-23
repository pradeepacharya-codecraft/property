import { Routes } from '@angular/router';
import { Home } from '@components/home/home';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { LocationDetails } from '@components/location-details/location-details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'details/:id',
    component: LocationDetails,
    title: 'location Details Page    ',
  },
  {
    path: 'linkedSignals',
    component: LinkedSignalDemo,
    title: 'linked signal page',
  },
];
