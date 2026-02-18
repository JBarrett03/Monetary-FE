import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
/**
 * Accounts component displays all user accounts as Stripe-styled cards.
 * Users can view account details, add new accounts, and navigate to the manage accounts page.
 */
@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule, FormsModule],
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
   * Indicates whether the card information is complete for display purposes.
   */
  cardComplete: boolean = false;

  /**
   * Flag to control the visibility of the add account form.
   */
  showAddAccountForm: boolean = false;

  /**
   * New account type selected by the user when adding a new account (e.g., 'savings', 'checking').
   * This value is used to specify the type of account being created when the user submits the add account form.
   */
  newAccountType: string = '';

  /**
   * New account currency selected by the user when adding a new account (e.g., 'USD', 'EUR').
   * This value is used to specify the currency of the account being created when the user submits the add account form.
   */
  newAccountCurrency: string = '';

  /**
   * New account nickname entered by the user when adding a new account.
   * This value is used to specify a custom nickname for the account being created, allowing users to easily identify their accounts in the UI.
   */
  newAccountNickname: string = '';

  /**
   * Creates an instance of Accounts component.
   * @param accountService Service for account operations.
   * @param userService Service for user operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router) { }

  /**
   * Initializes the component and loads the list of accounts and user details.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user details', err);
      }
    });

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

    if (!this.showAddAccountForm) {
      this.showAddAccountForm = true;
      return;
    }

    if (!this.newAccountType || !this.newAccountCurrency) return;

    const account = {
      accountType: this.newAccountType,
      currency: this.newAccountCurrency,
      nickname: this.newAccountNickname || 'New Account'
    }

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe(accounts => {
          this.accounts_list = accounts;
          this.showAddAccountForm = false;
          this.newAccountType = '';
          this.newAccountCurrency = '';
          this.newAccountNickname = '';
          this.cdr.detectChanges();
        })
      }
    })
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

  /**
 * Formats the confirmSortCode input by removing non-digit characters and inserting dashes every 2 characters for better readability.
 * This method is called on every input event for the confirmSortCode field to ensure consistent formatting as the user types.
 */
  formatSortCode(sortCode: string): string {
    if (!sortCode) return '';

    const digits = sortCode.replace(/\D/g, '').slice(0, 6);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '-' + digits.slice(2);

    return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4);
  }
}