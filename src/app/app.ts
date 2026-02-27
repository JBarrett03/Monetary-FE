import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { AuthService } from './services/auth-service';

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
 * The App class is the root component of the application.
 * It provides the main layout structure with navigation and routed content display.
 */
export class App {
  constructor(private authService: AuthService) { }

  @HostListener('window:mousemove') onMouseMove() {
    this.authService.simulateUserActivity();
  }

  @HostListener('window:keypress') onKeyPress() {
    this.authService.simulateUserActivity();
  }
}
