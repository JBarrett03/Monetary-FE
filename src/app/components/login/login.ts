import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth-service';

/**
 * Login component - handles user authentication and session initialization.
 * Presents a login form for collecting email and password credentials.
 * Authenticates users via the backend API and initializes the session with user data upon successful login.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, MatSnackBarModule],
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

  protected snackBar = inject(MatSnackBar);

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
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  /**
   * Handles login form submission.
   * Sends user credentials to the backend API and handles the response.
   */
  onSubmit() {
    this.http.post<any>('http://localhost:5000/api/v1.0/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.login(res.userId, res.token);
        this.snackBar.open('Login successful', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Please fill in all required fields.', 'OK', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

}
