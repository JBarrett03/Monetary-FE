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
}