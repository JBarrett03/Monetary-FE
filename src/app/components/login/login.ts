import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  email: string = '';

  password: string = '';

  showLoginModal = true;

  protected snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.http.post<any>('http://localhost:5000/api/v1.0/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        sessionStorage.clear();
        sessionStorage.setItem('userId', res.userId);
        sessionStorage.setItem('token', res.token);
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

  closeLogin() {
    this.showLoginModal = false;
    this.router.navigate(['/']);
  }

}
