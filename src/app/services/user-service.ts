import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * The UserService class provides methods for fetching user data from a backend API.
 * It includes methods to get a list of users with pagination and to get details of a specific user by ID.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * The UserService class is responsible for making HTTP requests to the backend API to retrieve user data.
 * It includes methods for fetching a paginated list of users and fetching details of a specific user by ID.
 */
export class UserService {

  /**
   * The pageSize property defines the number of users to be fetched per page when retrieving a list of users. It is set to 3 by default.
   */
  pageSize: number = 3;

  /**
   * The constructor injects the HttpClient service, which is used to make HTTP requests to the backend API.
   * @param http The HttpClient instance used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * The getUsers method retrieves a paginated list of users from the backend API.
   * It takes a page number as an argument and returns an Observable that emits the response from the API.
   * @param page The page number for which to retrieve users.
   * @returns An Observable that emits the response from the API containing the list of users for the specified page.
   */
  getUsers(page: number) {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users?pn=' + page + '&ps=' + this.pageSize);
  }

  /**
   * The getUser method retrieves the details of a specific user by their ID from the backend API.
   * It takes a user ID as an argument and returns an Observable that emits the response from the API.
   * @param id The ID of the user to retrieve.
   * @returns An Observable that emits the response from the API containing the details of the specified user.
   */
  getUser(id: any) {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users/' + id);
  }

}

