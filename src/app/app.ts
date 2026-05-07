import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Counter } from './components/counter/counter';
import { LocationService } from './services/location-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Counter, RouterLink],
  templateUrl: './app.html',
  template: `<h1>Hello to Angularrrrrrr {{ title }}</h1>`,
  styleUrl: './app.css',
})
export class App {
  protected title = 'property-app';
  // protected readonly title = signal('property-app');
  // protected readonly title = 'property-app';
  locationService = inject(LocationService);
  ngOnInit() {
    console.log('App component initialized');
    this.title = 'pROPERTY APP RELOADED';
  }
}
