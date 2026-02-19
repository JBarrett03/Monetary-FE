import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ACCOUNT_CATEGORIES } from '../../constants/account-categories';
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
   * List of all accounts (used for filtering)
   */
  allAccounts: any[] = [];

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
   * List of all available account categories imported from the constants file.
   * Used to populate the category dropdown filter in the UI.
   */
  categories = ACCOUNT_CATEGORIES;

  /**
 * Category selected from the dropdown menu for filtering accounts.
 * Cleared when user inputs a custom search term.
 */
  selectedCategory: string = '';

  /**
   * Custom category entered by the user for filtering accounts.
   * Clears the selectedCategory when used.
   */
  customCategory: string = '';

  /**
 * Controls the visibility of the transaction filter UI. When true, displays category
 * dropdown and custom search input for filtering transactions.
 */
  showFilter: boolean = false;

  /**
   * Creates an instance of Accounts component.
   * @param accountService Service for account operations.
   * @param userService Service for user operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public utility: UtilityService
  ) { }

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
        this.allAccounts = accounts;
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
 * Toggles the visibility of the transaction filter UI.
 * When hiding the filter, also clears any active filter selections
 * (selected category and custom search term).
 * @returns void
 */
  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  applyFilter() {
    const search = (this.customCategory || this.selectedCategory || '').toLowerCase().trim();

    if (!search) {
      this.accounts_list = [...this.allAccounts];
      return;
    }

    this.accounts_list = this.allAccounts.filter(account =>
      account.accountType?.toLowerCase().includes(search) ||
      account.nickname?.toLowerCase().includes(search)
    );
    this.cdr.detectChanges();
  }

  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }
}