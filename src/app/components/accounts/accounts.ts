import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Accounts component displays all user accounts as Stripe-styled cards.
 * Users can view account details, add new accounts, and navigate to the manage accounts page.
 */
@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {

  /**
   * List of accounts
   */
  accounts_list: any[] = [];

  /**
   * Menu open state
   */
  menuOpen = false;

  /**
   * Creates an instance of Accounts component.
   * @param accountService Service for account operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, private router: Router) { }

  /**
   * Initializes the component and loads the list of accounts for the user.
   */
  async ngOnInit() {
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
      }
    });
  }

  /**
   * Adds a new account for the user.
   * Prompts the user for account type and currency, then creates the account via the service.
   */
  addAccount() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    const accountType = prompt('Account type (e.g. Current, Savings):');
    const currency = prompt('Currency (e.g. GBP, USD):');

    if (!accountType || !currency) return;

    const account = { accountType, currency };

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe({
          next: (accounts) => {
            this.accounts_list = accounts;
            this.cdr.detectChanges();
          },
        });
      },
    });
  }

  /**
   * Toggles the kebab menu visibility for adding and managing accounts.
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Navigates to the manage accounts page and closes the menu.
   */
  goToManageAccounts() {
    this.toggleMenu();
    this.router.navigate(['/manage-accounts']);
  }

  /**
   * Masks the account number for display purposes.
   * @param accountNumber The full account number.
   * @returns The masked account number.
   */
  /**
   * Masks an account number for secure display, showing only the last 4 digits.
   * @param accountNumber The account number to mask.
   * @returns A masked account number string.
   */
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '•••• •••• •••• ••••';

    const clean = accountNumber.replace(/\s/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }
}