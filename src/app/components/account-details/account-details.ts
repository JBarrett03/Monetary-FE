import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';

/**
 * AccountDetails component
 */
@Component({
  standalone: true,
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule],
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
  /**
   * Error message
   */
  error: string | null = null;

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
}