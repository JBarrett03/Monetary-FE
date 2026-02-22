import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Navigation component - displays application navigation links and user authentication status.
 * Shows the app menu with links to main pages (home, accounts, payments, spending).
 * Displays user profile information and authentication state in the header.
 */
@Component({
  selector: 'app-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

/**
 * Component logic for application navigation.
 * Manages navigation links visibility based on user authentication state.
 */
export class Navigation {

  /**
   * Checks if the user is logged in.
   * @returns True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userId');
  }

  /**
   * Retrieves the current user ID from session storage.
   * @returns The user ID or null if not found.
   */
  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

}
