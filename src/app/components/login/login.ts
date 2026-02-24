import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/**
 * Login component - handles user authentication and session initialization.
 * Presents a login form for collecting email and password credentials.
 * Authenticates users via the backend API and initializes the session with user data upon successful login.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

/**
 * Component logic for user authentication.
 * Manages login form input, validation, and authentication flow.
 */
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
   * Error message to display in case of login failure
   */
  errorMessage: string = '';

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
        sessionStorage.setItem('userId', res.userId);
        sessionStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log("Login error:", err);
        this.errorMessage = err.error?.error || 'Login failed. Please try again.'
      }
    });
  }

}
