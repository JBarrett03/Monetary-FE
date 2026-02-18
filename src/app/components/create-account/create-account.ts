import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

/**
 * CreateAccount component - handles new user registration.
 * Presents a form for collecting user information (name, email, password, contact details, and date of birth).
 * Submits user data to the backend API and initializes the user's session upon successful registration.
 */
@Component({
  standalone: true,
  selector: 'app-create-account',
  imports: [FormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})

/**
 * Component logic for user registration.
 * Manages form input, validation, and account creation through the UserService.
 */
export class CreateAccount {

  /**
   * User's first name.
   */
  firstName: string = '';

  /**
   * User's last name.
   */
  lastName: string = '';

  /**
   * User's email address.
   */
  email: string = '';

  /**
   * User's password.
   */
  password: string = '';

  /**
   * User's phone number.
   */
  phone: string = '';

  /**
   * User's address.
   */
  address: string = '';

  /**
   * User's date of birth.
   */
  DOB: string = '';

  /**
   * Creates an instance of CreateAccount.
   * @param userService Service for user operations.
   * @param router Router for navigation.
   */
  constructor(private userService: UserService, private router: Router) { }

  /**
   * Submits the account creation form.
   */
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
        sessionStorage.setItem('userId', res.id)
        sessionStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/accounts']);
      },
      error: err => {
        console.error(err);
      }
    });
  }

}
