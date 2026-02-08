import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../services/user-data';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

/**
 * The User component is responsible for displaying the details of a specific user based on the user ID provided in the route parameters. It retrieves the user data from the UserService and handles the display logic accordingly.
 */
@Component({
  selector: 'app-user',
  imports: [CommonModule],
  providers: [UserService, UserData],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

/**
 * The User class defines the component logic for displaying user details. It initializes an empty user list and retrieves the user data based on the user ID from the route parameters when the component is initialized.
 */
export class User {

  /**
   * user_list is an array that holds the details of the user to be displayed. It is initialized as an empty array and will be populated with the user data retrieved from the UserService based on the user ID from the route parameters.
   */
  user_list: any = [];

  /**
   * The constructor injects the UserData service, UserService, and ActivatedRoute to enable data retrieval and access to route parameters.
   * @param userData - An instance of the UserData service for managing user-related data.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   * @param route - An instance of ActivatedRoute for accessing route parameters.
   */
  constructor(private userData: UserData, private userService: UserService, private route: ActivatedRoute) { }

  /**
   * The ngOnInit lifecycle hook is called when the component is initialized. It retrieves the user ID from the route parameters and uses the UserService to fetch the user data. The retrieved user data is then stored in the user_list array for display in the template.
   */
  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUser(userId).subscribe(
        (response: any) => {
          this.user_list = response ? [response] : [];
        },
        (error: any) => {
          this.user_list = [];
        }
      );
    }
  }
}