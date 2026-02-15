import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
/**
 * Home component - the landing page displayed to unauthenticated users.
 * Provides information about the application and links to login and create account.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

/**
 * Home class - the component logic for the home/landing page.
 */
export class Home implements OnInit {

  /**
   * The default account for the user, if available. This will be displayed on the home page if the user is logged in.
   * It contains account information such as balance, account number, currency, and account type.
   * Initially set to null until the account data is loaded from the API.
   */
  defaultAccount: any = null;

  /**
   * Error message to display if there is an issue loading the default account. This could occur if the user has no default account set.
   * Initially set to null until an error occurs.
   */
  error: string | null = null;

  /**
   * Constructor for the Home component. It injects the AccountService to allow fetching account data from the API.
   * @param accountService The service used to interact with account-related API endpoints.
   */
  constructor(private accountService: AccountService) {}

  /**
   * Lifecycle hook that is called after the component has been initialized. It retrieves the user ID from session storage,
   * then uses the AccountService to fetch the default account details. If successful, it stores the account information in the component's state.
   * If there is an error (such as no default account set), it sets an appropriate error message.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getDefaultAccount(userId).subscribe({
      next: (account) => {
        this.defaultAccount = account;
      },
      error: () => {
        this.error = 'No default account set. Please set a default account in your account settings.';
      }
    });
  }

}
