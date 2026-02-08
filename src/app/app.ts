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
  templateUrl: './app.html',
  styleUrl: './app.css'
})

/**
 * The App class defines the main application component. It includes a title property that is initialized as a signal with the value 'Monetary'.
 */
export class App {
  
}
