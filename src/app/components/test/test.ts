import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

/**
 * The Test component is responsible for displaying a list of all users.
 */
@Component({
  standalone: true,
  selector: 'app-test',
  providers: [UserService],
  imports: [RouterModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})

/**
 * The Test class defines the component logic for displaying a list of users. It retrieves all user data from the UserService when the component is initialized.
 */
export class Test {

  /**
   * user_list is an array that holds the list of users to be displayed.
   */
  user_list: any = [];

  /**
   * The constructor injects the UserService to enable data retrieval.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   */
  constructor(private userService: UserService) { }

  /**
   * The ngOnInit lifecycle hook is called when the component is initialized. It retrieves all users from the UserService.
   */
  ngOnInit() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.user_list = response;
      }
    )
  }


}