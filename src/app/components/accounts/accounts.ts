import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * The Accounts component is responsible for displaying the account-related information and functionality within the application. It serves as a placeholder for the accounts section of the application, where users can view and manage their account details.
 */
@Component({
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})

/**
 * The Accounts class defines the component logic for the accounts section of the application. Currently, it does not contain any specific functionality or properties, but it serves as a foundation for future development of account-related features and interactions within the application.
 */
export class Accounts implements OnInit {

  /**
   * List of accounts
   */
  accounts_list: any[] = [];

  /**
   * The constructor injects the AccountService for managing account-related operations, ChangeDetectorRef for manually triggering change detection, and Router for navigation purposes. These dependencies are essential for implementing the functionality of the accounts section and ensuring that the component can interact with the account data and navigate to other parts of the application as needed.
   * @param accountService - An instance of the AccountService for managing account-related operations.
   * @param cdr - ChangeDetectorRef for manually triggering change detection.
   * @param router - Router for navigation purposes.
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, private router: Router) { }

  /**
 * Initializes the component and loads the list of accounts for the user.
 * @returns void
 */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Opens the account details page for a specific account.
   * @param accountId The ID of the account to open.
   * @returns void
   */
  addAccount() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error('No userId found in sessionStorage');
      return;
    }

    const accountType = prompt('Account type (e.g. Current, Savings):');
    const currency = prompt('Currency (e.g. GBP, USD):');

    if (!accountType || !currency) {
      return;
    }

    const account = {
      accountType,
      currency,
    };

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe({
          next: (accounts) => {
            this.accounts_list = accounts;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Failed to add account', err);
      }
    });
  }

  toggleMenu() {
    this.router.navigate(['/manage-accounts']);
  }
}
