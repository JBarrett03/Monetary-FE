import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';

/**
 * AccountDetails component
 */
@Component({
  standalone: true,
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})

/**
 * AccountDetails class
 */
export class AccountDetails implements OnInit {

  /**
   * Account data
   */
  account: any | null = null;
  /**
   * List of transactions for the account
   */
  transactions: any[] = [];
  /**
   * Error message
   */
  error: string | null = null;

  /**
   * Search category for filtering transactions
   */
  searchCategory: string = '';

  /**
   * Show filter options
   */
  showFilter: boolean = false;

  /**
   * List of transaction categories
   */
  categories = TRANSACTION_CATEGORIES;

  /**
   * Custom category for filtering transactions
   */
  customCategory: string = '';

  /**
   * Selected category for filtering transactions
   */
  selectedCategory: string = '';

  /**
   * Creates an instance of AccountDetails component.
   * @param route ActivatedRoute for accessing route parameters.
   * @param router Router for navigation.
   * @param accountService Service for account operations.
   * @param cdr Change detector reference.
   */
  constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef) { }

  /**
   * Initializes the component and loads the account details and transactions.
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
      error: () => {
        this.error = 'Account not found';
        this.cdr.detectChanges();
      }
    });

    this.accountService.getAccountTransactions(userId, accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not load transactions';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Opens the transaction details page for a specific transaction.
   * @param transactionId The ID of the transaction to open.
   * @returns void
   */
  openTransaction(transactionId: string) {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    this.router.navigate(['/accounts', accountId, 'transactions', transactionId]);
  }

  /**
   * Adds a new balance to the account.
   * @returns void
   */
  addBalance() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    const amountInput = prompt('Amount to add:');

    if (!amountInput) {
      return;
    }

    const amount = Number(amountInput);

    this.accountService.addBalance(userId, accountId, amount).subscribe({
      next: () => {
        this.accountService.getAccount(userId, accountId).subscribe({
          next: (account) => {
            this.account = account;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Failed to add balance';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Adds a new transaction to the account.
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
    const category = prompt('Category:');

    if (!description || !amountInput || !merchant || !category) {
      return;
    }

    const amount = Number(amountInput);

    const transaction = {
      type: amount >= 0 ? 'credit' : 'debit',
      amount,
      description,
      merchant,
      category
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
   * Formats a date string into a more readable format.
   * @param dateString The date string to format.
   * @returns The formatted date string.
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
   * Archives the account.
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
   * Toggles the filter options for transactions.
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
   * Gets the effective category for filtering transactions, which is either the selected category or the custom category.
   * @returns The effective category for filtering transactions.
   */
  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }
}