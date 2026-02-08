import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

/**
 * The User component is responsible for displaying the details of a specific user based on the user ID provided in the route parameters. It retrieves the user data from the UserService.
 */
@Component({
  selector: 'app-user',
  imports: [CommonModule],
  providers: [UserService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

/**
 * The User class defines the component logic for displaying user details. It retrieves user data from the UserService based on the user ID from the route parameters.
 */
export class User {

  /**
   * user_list is an array that holds the details of the user to be displayed.
   */
  user_list: any = [];

  /**
   * The constructor injects the UserService and ActivatedRoute.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   * @param route - An instance of ActivatedRoute for accessing route parameters.
   */
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  /**
   * The ngOnInit lifecycle hook is called when the component is initialized. It retrieves the user ID from the route parameters and uses the UserService to fetch the user data.
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