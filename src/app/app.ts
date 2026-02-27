import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  constructor(private authService: AuthService) { }

  @HostListener('window:mousemove') onMouseMove() {
    this.authService.simulateUserActivity();
  }

  @HostListener('window:keypress') onKeyPress() {
    this.authService.simulateUserActivity();
  }
}
