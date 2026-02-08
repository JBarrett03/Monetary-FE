import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service for user-related operations.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Class representing the UserService.
 */
export class UserService {

  /**
   * API URL for user operations.
   */
  private apiUrl = 'http://localhost:5000/api/v1.0/users';

  /**
   * Creates an instance of UserService.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetch all users from the API.
   * @returns An observable containing all users
   */
  getUsers() {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Fetch a user by their ID from the API.
   * @param id The ID of the user to retrieve
   * @returns An observable containing the user data
   */
  getUser(id: any) {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users/' + id);
  }

  /**
 * Creates a new user.
 * @param user User data to be created.
 * @returns Observable of the HTTP response.
 */
  createUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }

  /**
 * Edits an existing user's details.
 * @param userId The ID of the user to be edited.
 * @param updatedUser The updated user data.
 * @returns Observable of the HTTP response.
 */
  editUser(userId: string, updatedUser: { firstName: string, lastName: string, email: string, phone: string, address: string }) {
    const formData = new FormData();
    formData.append('firstName', updatedUser.firstName);
    formData.append('lastName', updatedUser.lastName);
    formData.append('email', updatedUser.email);
    formData.append('phone', updatedUser.phone);
    formData.append('address', updatedUser.address);

    return this.http.put(`${this.apiUrl}/${userId}`, formData);
  }
}
