import { Injectable } from '@angular/core';
import userData from '../../assets/users.json';

/**
 * The UserData service is responsible for managing user-related data and providing methods to retrieve user information. It includes functionality for paginating user data, retrieving specific user details based on an ID, and calculating the last page number for pagination. The service uses a static JSON file (users.json) as the source of user data.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * The UserData class defines the service logic for managing user-related data. It includes methods for retrieving a paginated list of users, fetching details of a specific user based on an ID, and calculating the last page number for pagination. The service uses a static JSON file (users.json) as the source of user data and provides an interface for components to access and manipulate this data.
 */
export class UserData {

  /**
   * pageSize is a number that represents the number of users to be displayed per page in the pagination. It is initialized to 3, meaning that each page will display 3 users from the user data.
   */
  pageSize: number = 3;

  /**
   * The getUsers method retrieves a paginated list of users based on the provided page number. It calculates the starting and ending indices for the user data array based on the page number and page size, and returns a slice of the user data array corresponding to the requested page.
   * @param page - A number representing the current page for which to retrieve user data.
   * @returns An array of user objects corresponding to the requested page.
   */
  getUsers(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize;
    return userData.slice(pageStart, pageEnd);
  }

  /**
   * The getUser method retrieves the details of a specific user based on the provided user ID. It iterates through the user data array and checks for a user object that matches the provided ID. If a matching user is found, it is added to the dataToReturn array, which is then returned as the result.
   * @param id - A value representing the unique identifier of the user to be retrieved.
   * @returns An array containing the user object that matches the provided ID, or an empty array if no matching user is found.
   */
  getUser(id :any) {
    let dataToReturn: any[] = [];
    userData.forEach((user) => {
      if (user._id.$oid == id) {
        dataToReturn.push(user);
      }
    })
    return dataToReturn;
  }

  /**
   * The getLastPageNumber method calculates the last page number for pagination based on the total number of users in the user data and the defined page size. It uses the Math.ceil function to round up the result of dividing the total number of users by the page size, ensuring that any remaining users that do not fill a complete page are accounted for in an additional page.
   * @returns A number representing the last page number for pagination.
   */
  getLastPageNumber() {
    return Math.ceil(userData.length / this.pageSize);
  }
  
}
