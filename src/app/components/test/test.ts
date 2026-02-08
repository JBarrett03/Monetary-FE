import { Component } from '@angular/core';
import { UserData } from '../../services/user-data';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

/**
 * The Test component is responsible for displaying a list of users with pagination functionality. It retrieves user data from the UserService and allows navigation between pages of users. The component also manages the current page state using session storage to maintain the user's position in the pagination.
 */
@Component({
  standalone: true,
  selector: 'app-test',
  providers: [UserData, UserService],
  imports: [RouterModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})

/**
 * The Test class defines the component logic for displaying a list of users with pagination. It initializes an empty user list and a page number, retrieves user data from the UserService when the component is initialized, and provides methods for navigating to the previous and next pages of users.
 */
export class Test {

  /**
   * user_list is an array that holds the list of users to be displayed. It is initialized as an empty array and will be populated with user data retrieved from the UserService based on the current page number.
   * page is a number that represents the current page in the pagination. It is initialized to 1 and can be updated when navigating between pages.
   */
  user_list: any = [];

  /**
   * page is a number that represents the current page in the pagination. It is initialized to 1 and can be updated when navigating between pages.
   */
  page: number = 1;

  /**
   * The constructor injects the UserData service and UserService to enable data retrieval and management of user-related data.
   * @param userData - An instance of the UserData service for managing user-related data.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   */
  constructor(protected userData: UserData, private userService: UserService) { }

  /**
   * The ngOnInit lifecycle hook is called when the component is initialized. It retrieves the current page number from session storage (if available) and uses the UserService to fetch the list of users for that page. The retrieved user data is then stored in the user_list array for display in the template.
   */
  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.userService.getUsers(this.page).subscribe(
      (response) => {
        this.user_list = response;
      }
    )
  }

  /**
   * The previousPage method is called when the user clicks the "Previous" button. It checks if the current page number is greater than 1, and if so, it decrements the page number, updates the session storage with the new page number, and retrieves the list of users for the new page using the UserService.
   */
  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;
      this.userService.getUsers(this.page).subscribe((response: any) =>{
        this.user_list = response;
      })
    }
  }

  /**
   * The nextPage method is called when the user clicks the "Next" button. It checks if the current page number is less than the last page number (retrieved from the UserData service), and if so, it increments the page number, updates the session storage with the new page number, and retrieves the list of users for the new page using the UserService.
   */
  nextPage() {
    if (this.page < this.userData.getLastPageNumber()) {
      this.page = this.page + 1;
      sessionStorage['page'] = this.page;
      this.userService.getUsers(this.page).subscribe((response: any) =>{
        this.user_list = response;
      })
    }
  }
}