import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

/**
 * The Authuser component is responsible for displaying the authenticated user's information. It uses the AuthService from the Auth0 Angular SDK to access the user's authentication state and details. The component's template can display user information such as name, email, and profile picture when the user is authenticated.
 */
@Component({
  selector: 'app-authuser',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './authuser.html',
  styleUrl: './authuser.css',
})

/**
 * The Authuser class defines the component logic for displaying the authenticated user's information. It injects the AuthService to access the user's authentication state and details, which can be used in the component's template to display relevant user information when the user is authenticated.
 */
export class Authuser {

  /**
   * The constructor injects the AuthService to enable access to the user's authentication state and details. This allows the component to display user information in the template when the user is authenticated.
   * @param auth - An instance of the AuthService for accessing authentication state and user details.
   */
  constructor(protected auth: AuthService) {}

}
