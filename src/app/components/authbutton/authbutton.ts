import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

/**
 * The Authbutton component is responsible for displaying an authentication button that allows users to log in or log out using Auth0. It utilizes the AuthService to manage authentication state and provides a user interface for authentication actions.
 */
@Component({
  selector: 'app-authbutton',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './authbutton.html',
  styleUrl: './authbutton.css',
})

/**
 * The Authbutton class defines the component logic for the authentication button. It injects the AuthService to manage authentication state and the DOCUMENT token to access the global document object. The component provides methods for logging in and logging out, which are triggered by user interactions with the authentication button in the template.
 */
export class Authbutton {

  /**
   * The constructor injects the DOCUMENT token to access the global document object and the AuthService to manage authentication state. The injected services are used to facilitate authentication actions such as logging in and logging out.
   * @param document - An instance of the Document object for accessing global document properties and methods.
   * @param auth - An instance of the AuthService for managing authentication state and actions.
   */
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

}
