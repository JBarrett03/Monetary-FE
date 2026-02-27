import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';

/**
 * The main application component that serves as the root of the Angular application.
 * It includes the navigation component and a router outlet for displaying routed components.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html'
})

/**
 * The App class is the root component of the application.
 * It provides the main layout structure with navigation and routed content display.
 */
export class App {
  
}
