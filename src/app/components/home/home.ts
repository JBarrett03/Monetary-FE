import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
/**
 * Home component - the landing page displayed to unauthenticated users.
 * Provides information about the application and links to login and create account.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
 * Customer's first name
 */
  firstName: string = '';

  /**
   * Customer's last name
   */
  lastName: string = '';

  /**
   * Card brand for display purposes (e.g., Visa, MasterCard)
   */
  cardBrand: string = '';

  /**
   * Constructor for the Home component. It injects the AccountService to allow fetching account data from the API.
   * @param accountService The service used to interact with account-related API endpoints.
   * @param cdr ChangeDetectorRef - Reference to manually trigger change detection when needed
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef) { }

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
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No default account set. Please set a default account in your account settings.';
      }
    });
  }

  /**
   * Utility method to mask the account number for display purposes. It replaces all but the last 4 digits with '••••'.
   * If the account number is not available, it returns a placeholder string.
   * @param accountNumber The full account number to be masked.
   * @returns A masked version of the account number for display.
   */
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '•••• •••• •••• ••••';

    const clean = accountNumber.replace(/\s/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

}
