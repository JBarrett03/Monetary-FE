import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction-service';

/**
 * TransactionDetails component
 */
@Component({
  standalone: true,
  selector: 'app-transaction-details',
  imports: [CommonModule],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.css',
})

/**
 * TransactionDetails class
 */
export class TransactionDetails implements OnInit {

  /**
   * Transaction data
   */
  transaction: any | null = null;
  /**
   * Error message
   */
  error: string | null = null;

  /**
   * Creates an instance of TransactionDetails component.
   * @param route ActivatedRoute for accessing route parameters.
   * @param transactionService Service for transaction operations.
   * @param cdr Change detector reference.
   */
  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private cdr: ChangeDetectorRef) { }

  /**
   * Initializes the component and loads the transaction details.
   * @returns void
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      this.error = 'Invalid user ID';
      this.cdr.detectChanges();
      return;
    }

    this.route.paramMap.subscribe(params => {
      const accountId = params.get('accountId');
      const transactionId = params.get('transactionId');

      if (!accountId || !transactionId) {
        this.error = 'Invalid account or transaction ID';
        this.cdr.detectChanges();
        return;
      }

      this.transactionService.getTransaction(userId, accountId, transactionId).subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Transaction not found';
          this.cdr.detectChanges();
        }
      });
    });
  }
}