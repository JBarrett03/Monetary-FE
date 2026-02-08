import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * The UserService class provides methods for fetching user data from a backend API.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * The UserService class is responsible for making HTTP requests to the backend API to retrieve user data.
 */
export class UserService {

  /**
   * The constructor injects the HttpClient service, which is used to make HTTP requests to the backend API.
   * @param http The HttpClient instance used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * The getUsers method retrieves all users from the backend API.
   * @returns An Observable that emits the response from the API containing all users.
   */
  getUsers() {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users');
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

