import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';
/**
 * Home component - displays the authenticated user's dashboard.
 * Shows the default account with card details, recent transactions, and transaction filtering/search capabilities.
 * Allows users to navigate to transaction details and manage account information.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

/**
 * Component logic for the user dashboard.
 * Manages account display, transaction loading, filtering, and navigation.
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
   * The currently selected account from sessionStorage. Used to fetch account-specific transactions.
   * Set from session storage during component initialization.
   */
  account: any | null = null;

  /**
 * Controls the visibility of the transaction filter UI. When true, displays category
 * dropdown and custom search input for filtering transactions.
 */
  showFilter: boolean = false;

  /**
 * Array of transaction objects associated with this account. Each transaction contains
 * details such as type (credit/debit), amount, description, merchant, and timestamp.
 */
  transactions: any[] = [];

  /**
   * List of all available transaction categories imported from the constants file.
   * Used to populate the category dropdown filter in the UI.
   */
  categories = TRANSACTION_CATEGORIES;

  /**
 * User-entered custom search term for filtering transactions by category or description.
 * Takes precedence over the selected category dropdown when populated.
 */
  customCategory: string = '';

  /**
   * Category selected from the dropdown menu for filtering transactions.
   * Cleared when user inputs a custom search term.
   */
  selectedCategory: string = '';

  /**
   * Constructor for the Home component. It injects the AccountService to allow fetching account data from the API.
   * @param accountService The service used to interact with account-related API endpoints.
   * @param cdr ChangeDetectorRef - Reference to manually trigger change detection when needed
   */
  constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef) { }

  /**
   * Lifecycle hook that is called after the component has been initialized. It retrieves the user ID from session storage,
   * then uses the AccountService to fetch the default account details. If successful, it stores the account information in the component's state.
   * If there is an error (such as no default account set), it sets an appropriate error message.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    this.accountService.getDefaultAccount(userId).subscribe({
      next: (account) => {
        this.defaultAccount = account;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No default account set. Please set a default account in your account settings.';
      }
    });

    this.accountService.getAccount(userId, accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Account not found';
        this.cdr.detectChanges();
      }
    });

    this.accountService.getAccountTransactions(userId, accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Could not load transactions';
        this.cdr.detectChanges();
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

  /**
 * Converts an ISO date string into a human-readable format with proper ordinal suffix.
 * Example: "2025-02-12" becomes "February 12th"
 * @param dateString The date string to format (ISO 8601 format: YYYY-MM-DD hh:mm:ss)
 * @returns The formatted date string with month name and day with ordinal suffix (e.g., "February 12th")
 */
  formatTransactionDate(dateString: string): string {
    if (!dateString) return '';

    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return dateString;

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);

    const suffix = day >= 11 && day <= 13 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th';
    const month = new Date(year, monthIndex).toLocaleString('en-GB', { month: 'long' });

    return `${month} ${day}${suffix}`;
  }

  /**
 * Navigates to the details page for the specified transaction.
 * @param transactionId The unique identifier of the transaction to display
 * @returns void
 */
  openTransaction(transactionId: string) {
    if (!this.defaultAccount) {
      return;
    }
    this.router.navigate(['/accounts', this.defaultAccount._id, 'transactions', transactionId]);
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

    /**
   * Getter that returns the active filter term for transactions.
   * Prioritizes the custom search term if user has entered one,
   * otherwise returns the selected category from the dropdown.
   * Used by the filter pipe to display matching transactions.
   * @returns The effective category or custom search term to filter transactions by
   */
  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }

}
