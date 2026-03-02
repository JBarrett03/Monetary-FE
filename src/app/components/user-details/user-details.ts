import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, RouterModule]
})

export class UserDetails implements OnInit {

  user_list: any = [];

  error: string | null = null;

  showEditModal: boolean = false;

  editFirstName = '';

  editLastName = '';

  editEmail = '';

  editPhone = '';

  editAddress = '';

  changePasswordModal: boolean = false;

  currentPassword = '';

  newPassword = '';

  showPassword: boolean = false;

  showUserMenu = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) { }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');

    if (!userId) {
      this.error = 'Invalid user ID';
      return;
    }

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user_list = [user];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load user details';
        this.cdr.detectChanges();
      }
    })
  }

  editUser() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const user = this.user_list[0];

    this.editFirstName = user.firstName;
    this.editLastName = user.lastName;
    this.editEmail = user.email;
    this.editPhone = user.phone;
    this.editAddress = user.address;
    this.showEditModal = true;
  }

  submitEdit() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const updatedUser = {
      firstName: this.editFirstName,
      lastName: this.editLastName,
      email: this.editEmail,
      phone: this.editPhone,
      address: this.editAddress
    };

    this.userService.editUser(userId, updatedUser).subscribe({
      next: () => {
        this.userService.getUser(userId).subscribe({
          next: (updated) => {
            this.user_list = [updated];
            this.showEditModal = false;
            this.snackBar.open('Account updated successfully', 'Dismiss', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Failed to update user details';
        this.snackBar.open('Failed to update account', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.cdr.detectChanges();
      }
    });
  }

  submitPasswordChange() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    this.closePasswordModal();

    this.userService.changePassword(userId, this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.snackBar.open('Password changed successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: () => {
        this.snackBar.open('Failed to change password', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.cdr.detectChanges();
      }
    });
  }

  changePassword() {
    this.changePasswordModal = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closePasswordModal() {
    this.changePasswordModal = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userId');
  }

}
