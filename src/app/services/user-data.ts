import { Injectable } from '@angular/core';
import userData from '../../assets/users.json';

/**
 * The UserData service is responsible for managing user-related data and providing methods to retrieve user information from a static JSON file.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * The UserData class defines the service logic for managing user-related data. It provides methods for retrieving users from the static users.json file.
 */
export class UserData {

  /**
   * The getUsers method retrieves all users from the static data.
   * @returns An array of all user objects.
   */
  getUsers() {
    return userData;
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


}
