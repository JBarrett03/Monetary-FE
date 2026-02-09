import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

/**
 * UserDetails component for displaying individual user details.
 * 
 * This component retrieves and displays user information based on the user ID
 * provided in the route parameters.
 */
@Component({
  selector: 'app-user',
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
  standalone: true,
  imports: [CommonModule]
})
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
   * Constructor for the User component.
   * @param userService Service for retrieving user data
   * @param route Activated route for accessing route parameters
   * @param router Router for navigation
   */
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }

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

  /**
 * Logs out the current user.
 */
  logout(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the user is logged in.
   * @returns True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userId');
  }

}
