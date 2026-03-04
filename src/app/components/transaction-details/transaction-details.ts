import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction-service';
import { UtilityService } from '../../services/utility-service';
import { AccountService } from '../../services/account-service';

@Component({
  standalone: true,
  selector: 'app-transaction-details',
  imports: [CommonModule],
  templateUrl: './transaction-details.html'
})

export class TransactionDetails implements OnInit {

  transaction: any | null = null;
  
  error: string | null = null;

  accountName: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private transactionService: TransactionService, private cdr: ChangeDetectorRef, public utility: UtilityService, private accountService: AccountService) { }

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

      sessionStorage.setItem('accountId', accountId);
      this.accountService.getAccount(userId, accountId).subscribe({
        next: (account) => {
          this.accountName = account.nickname;
          this.cdr.detectChanges();
        },
        error: () => {
          this.accountName = accountId;
          this.cdr.detectChanges();
        }
      });

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

  goBackToAccount() {
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) return;

    this.router.navigate(['/accounts', accountId]);
  }
}