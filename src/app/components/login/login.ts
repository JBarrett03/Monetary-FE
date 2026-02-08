import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/**
 * Login component for user authentication.
 * 
 * This component provides a login form for users to authenticate with their
 * email and password credentials.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  /**
   * User email address
   */
  email: string = '';

  /**
   * User password
   */
  password: string = '';

  /**
   * Constructor for the Login component.
   * @param http HTTP client for making API requests
   * @param router Router for navigation
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Handles login form submission.
   * Sends user credentials to the backend API and handles the response.
   */
  onSubmit() {
    sessionStorage.clear();
    this.http.post<any>('http://localhost:5000/api/v1.0/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        sessionStorage.setItem('userId', res.id);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Invalid email or password. Please try again.');
        } else {
          console.log('Login error:', err);
        }
      }
    });
  }

}
