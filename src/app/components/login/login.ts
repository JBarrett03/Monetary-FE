import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth-service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  email: string = '';

  protected snackBar = inject(MatSnackBar);

  password: string = '';

  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

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
