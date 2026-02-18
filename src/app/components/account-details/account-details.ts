import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';
import { MatProgressBarModule } from '@angular/material/progress-bar';
/**
 * AccountDetails component - displays comprehensive information for a single account.
 * Shows account balance, transaction history, and budget management.
 * Enables users to add transactions, manage budgets with configurable periods, set default accounts,
 * and archive accounts. Provides category-based transaction filtering and search capabilities.
 */
@Component({
  standalone: true,
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe, MatProgressBarModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})

/**
 * Component logic for managing account details, budgets, and transactions.
 * Handles account display, transaction management, budget creation/editing, and filtering.
 */
export class AccountDetails implements OnInit {

  /**
   * The account object containing account information such as balance, account number,
   * currency, and account type (e.g., 'savings', 'checking'). Null until account data is loaded.
   */
  account: any | null = null;

  /**
   * Array of transaction objects associated with this account. Each transaction contains
   * details such as type (credit/debit), amount, description, merchant, and timestamp.
   */
  transactions: any[] = [];

  /**
   * Error message displayed to the user when operations fail or data cannot be loaded.
   * Null when no error is present.
   */
  error: string | null = null;

  /**
   * Controls the visibility of the transaction filter UI. When true, displays category
   * dropdown and custom search input for filtering transactions.
   */
  showFilter: boolean = false;

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
   * Controls visibility of the budget form. When true, displays form for entering
   * budget amount, period selection, and optional custom date range.
   */
  showBudgetForm: boolean = false;

  /**
   * The monetary amount for the budget. Set by user in the budget form.
   * Null until user enters a value.
   */
  budgetAmount: number | null = null;

  /**
   * The period over which the budget applies. Valid values are 'weekly', 'monthly',
   * 'annual', or 'custom'. When set to 'custom', startDate and endDate are used.
   */
  budgetPeriod: string = '';

  /**
   * The start date for a custom budget period. Only used when budgetPeriod is set to 'custom'.
   * Format: ISO 8601 date string (YYYY-MM-DD)
   */
  startDate: string = '';

  /**
   * The end date for a custom budget period. Only used when budgetPeriod is set to 'custom'.
   * Format: ISO 8601 date string (YYYY-MM-DD)
   */
  endDate: string = '';

  /**
 * List of accounts
 */
  accounts_list: any[] = [];

  /**
 * Indicates whether the card information is complete for display purposes.
 */
  cardComplete: boolean = false;

  /**
 * Card brand for display purposes (e.g., Visa, MasterCard)
 */
  cardBrand: string = '';

  /**
 * Menu open state
 */
  menuOpen = false;

  /**
   * Creates an instance of the AccountDetails component.
   * @param route ActivatedRoute - Used to extract the accountId from the current route parameters
   * @param router Router - Used to navigate between routes (e.g., to transaction details or back to accounts list)
   * @param accountService AccountService - Service for fetching and managing account data, transactions, and budgets
   * @param cdr ChangeDetectorRef - Reference to manually trigger change detection when needed
   */
  constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef) { }

  /**
   * Angular lifecycle hook called after the component is initialized.
   * Fetches the userId from session storage and accountId from route parameters,
   * then loads both the account details and its associated transactions from the service.
   * Sets appropriate error messages if data cannot be loaded.
   * @returns void
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account ID';
      return;
    }

    sessionStorage.setItem('accountId', accountId);

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
   * Navigates to the details page for the specified transaction.
   * @param transactionId The unique identifier of the transaction to display
   * @returns void
   */
  openTransaction(transactionId: string) {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    this.router.navigate(['/accounts', accountId, 'transactions', transactionId]);
  }

  /**
   * Prompts the user for transaction details and adds a new transaction to the account.
   * Collects description, amount, and merchant information from the user via prompts.
   * Automatically determines transaction type (credit/debit) based on the amount sign.
   * Updates both account balance and transaction list on success.
   * @returns void
   */
  addTransaction() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account';
      return;
    }
    const description = prompt('Description:');
    const amountInput = prompt('Amount:');
    const merchant = prompt('Merchant:');

    if (!description || !amountInput || !merchant) {
      return;
    }

    const amount = Number(amountInput);

    const transaction = {
      type: amount >= 0 ? 'credit' : 'debit',
      amount,
      description,
      merchant
    };

    this.accountService.addTransaction(userId, accountId, transaction).subscribe({
      next: () => {
        this.accountService.getAccount(userId, accountId).subscribe({
          next: (account) => {
            this.account = account;

            this.accountService.getAccountTransactions(userId, accountId).subscribe({
              next: (transactions) => {
                this.transactions = transactions;
                this.cdr.detectChanges();
              }
            })
          }
        })
      },
      error: () => {
        this.error = 'Failed to add transaction';
        this.cdr.detectChanges();
      }
    });
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
   * Archives the current account after confirming with the user.
   * Displays a confirmation dialog to ensure the user intentionally wants to archive.
   * Only allows archiving if the account balance is zero. On success, navigates back
   * to the accounts list. On failure, displays an error message.
   * @returns void
   */
  archiveAccount() {
    const confirmArchive = confirm('Are you sure you want to archive this account?');
    if (!confirmArchive) {
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account';
      return;
    }

    this.accountService.archiveAccount(userId, accountId).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: () => {
        this.error = 'Failed to archive account';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Sets the current account as the default account for the user.
   * Sends a request to the AccountService to update the default account setting.
   * On success, updates the local account state to reflect the change. On failure, displays an error message.
   * @returns void
   */
  setAsDefault() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    this.account.isDefault = true;

    this.accountService.setDefaultAccount(userId, accountId).subscribe({
      next: () => {
        // already updated locally
      },
      error: () => {
        this.error = 'Failed to set default account';
      }
    })
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

  /**
   * Toggles the visibility of the budget form.
   * @returns void
   */
  addBudget() {
    this.showBudgetForm = !this.showBudgetForm;
  }

  /**
   * Updates the selected budget period.
   * @param period The budget period to set ('weekly', 'monthly', 'annual', or 'custom')
   * @returns void
   */
  selectBudgetPeriod(period: string) {
    this.budgetPeriod = period;
  }

  /**
   * Submits the budget form and saves the budget to the account.
   * Validates that user and account IDs are available, constructs a budget object
   * with the appropriate date fields based on the selected period, and sends it to
   * the AccountService. On success, clears the form and reloads account data.
   * On failure, displays an error message.
   * @returns void
   */
  submitBudget() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account';
      return;
    }

    const budget = {
      amount: this.budgetAmount,
      period: this.budgetPeriod,
      startDate: this.budgetPeriod === 'custom' ? this.startDate : null,
      endDate: this.budgetPeriod === 'custom' ? this.endDate : null
    };

    this.accountService.setBudget(userId, accountId, budget).subscribe({
      next: () => {
        this.showBudgetForm = false;
        this.budgetAmount = null;
        this.startDate = '';
        this.endDate = '';

        this.accountService.getAccount(userId, accountId).subscribe(account => {
          this.account = account;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.error = 'Failed to set budget';
      }
    });
  }

  /**
   * Calculates the percentage of the budget that has been spent based on the current account balance.
   * If no budget is set, returns 0. Otherwise, divides the account balance by the budget amount
   * and multiplies by 100 to get a percentage. Caps the returned value at 100% to avoid overflow.
   * @returns The percentage of the budget that has been spent (0-100)
   */
  get budgetProgress(): number {
    if (!this.account?.budget?.amount) return 0;

    const balance = this.account.balance || 0;
    const budgetAmount = this.account.budget.amount;

    const percentage = (balance / budgetAmount) * 100;
    return Math.min(percentage, 100);
  }

  /**
   * Determines if the account balance has exceeded the set budget.
   * Compares the current account balance against the budget amount.
   * Returns true if the balance exceeds the budget, false otherwise. If no budget is set, returns false.
   * @returns boolean indicating whether the budget has been exceeded
   */
  get isBudgetExceeded(): boolean {
    if (!this.account?.budget?.amount) return false;
    return (this.account.balance || 0) > this.account.budget.amount;
  }

  /**
   * Closes the budget form without saving any changes.
   * Resets the form fields to their default states.
   * @returns void
   */
  closeBudgetForm() {
    this.showBudgetForm = false;
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
 * Toggles the kebab menu visibility for adding and managing accounts.
 */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}