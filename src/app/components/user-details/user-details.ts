import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

/**
 * The UserDetails component is responsible for displaying the details of a specific user based on the user ID provided in the route parameters. It retrieves the user data from the UserService and handles the display logic accordingly.
 */
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})

/**
 * The UserDetails class defines the component logic for displaying user details. It initializes an empty user list and retrieves the user data based on the user ID from the route parameters when the component is initialized.
 */
export class UserDetails implements OnInit {

  /**
   * Current user data
   */
  user_list: any = [];
  /**
   * Error message
   */
  error: string | null = null;

  /**
   * The constructor injects the ActivatedRoute and UserService to enable access to route parameters and retrieval of user data.
   * @param route - An instance of ActivatedRoute for accessing route parameters.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   * @param cdr - ChangeDetectorRef for manually triggering change detection.
   */
  constructor(private route: ActivatedRoute, private userService: UserService, private cdr: ChangeDetectorRef) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * Retrieves user data based on the user ID from the route parameters.
   */
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

    /**
   * Edits the current user's details.
   */
  editUser() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    const user = this.user_list[0];

    const firstName = prompt('First Name:', user.firstName);
    const lastName = prompt('Last Name:', user.lastName);
    const email = prompt('Email:', user.email);
    const phone = prompt('Phone:', user.phone);
    const address = prompt('Address:', user.address);

    if (firstName === null || lastName === null || email === null || phone === null || address === null) {
      return;
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
      phone,
      address
    };

    this.userService.editUser(userId, updatedUser).subscribe({
      next: () => {
        this.userService.getUser(userId).subscribe({
          next: (updated) => {
            this.user_list = [updated];
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Failed to update user';
        this.cdr.detectChanges();
      }
    })
  }
}
