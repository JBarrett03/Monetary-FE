import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-create-account',
  imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})

export class CreateAccount {

  firstName: string = '';

  lastName: string = '';

  email: string = '';

  password: string = '';

  phone: string = '';

  address: string = '';

  DOB: string = '';

  showCreateAccountModal = true;

  protected snackBar = inject(MatSnackBar);

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    const new_user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      DOB: this.DOB
    };

    this.userService.createUser(new_user).subscribe({
      next: (res: any) => {
        sessionStorage.clear();
        sessionStorage.setItem('userId', res.id);
        sessionStorage.setItem('isLoggedIn', 'true');
        this.snackBar.open('Account created successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/accounts']);
      },
      error: () => {
        this.snackBar.open('Please fill in all required fields.', 'OK', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  closeCreateAccount() {
    this.showCreateAccountModal = false;
    this.router.navigate(['/']);
  }

}
