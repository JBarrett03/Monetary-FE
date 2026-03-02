import { Component, ChangeDetectorRef } from '@angular/core';
import { TransactionService } from '../../../services/transaction-service';

@Component({
  selector: 'app-test-transaction-service',
  imports: [],
  templateUrl: './test-transaction-service.html',
  styleUrl: './test-transaction-service.css',
})
export class TestTransactionService {

  test_output: string[] = [];

  userId = '6985caceef72e64ca33d5914';
  accountId = '69a0a4e327d2b3dd85058978'
  transactionId = '69a0a52427d2b3dd8505897a';

  constructor(private transactionService: TransactionService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.testGetAllTransactions();
    this.testGetTransaction();
    this.testGetTransactionSummary();
    this.testGetAccountTransactionSummary();
    this.testGetCategorySummary();
  }

  private testGetAllTransactions() {
    this.transactionService.getAllTransactions(this.userId, this.accountId).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.test_output.push("Get all transactions... PASS");
        } else {
          this.test_output.push("Get all transactions... FAIL");
        }
        this.cdr.detectChanges();
      },
    });
  }

  private testGetTransaction() {
    this.transactionService.getTransaction(this.userId, this.accountId, this.transactionId).subscribe({
      next: (response: any) => {
        if (response && typeof response === 'object') {
          this.test_output.push("Get transaction... PASS");
        } else {
          this.test_output.push("Get transaction... FAIL");
        }
        this.cdr.detectChanges();
      },
    });
  }

  private testGetTransactionSummary() {
    this.transactionService.getTransactionSummary(this.userId, 'in', 'Last Month').subscribe({
      next: (response: any) => {
        const success = response && typeof response.totalAmount === 'number';
        if (success) {
          this.test_output.push("Get transaction summary... PASS");
        } else {
          this.test_output.push("Get transaction summary... FAIL");
        }
        this.cdr.detectChanges();
      }
    })
  }

  private testGetAccountTransactionSummary() {
    this.transactionService.getAccountTransactionSummary(this.userId, this.accountId, 'in', 'Last Month').subscribe({
      next: (response: any) => {
        const success = response && typeof response.totalAmount === 'number';
        if (success) {
          this.test_output.push("Get account transaction summary... PASS");
        } else {
          this.test_output.push("Get account transaction summary... FAIL");
        }
        this.cdr.detectChanges();
      }
    })
  }

  private testGetCategorySummary() {
    this.transactionService.getCategorySummary(this.userId, this.accountId, 'in', 'Last Month').subscribe({
      next: (response: any) => {
        const success = Array.isArray(response) && (response.length === 0 || (response[0].category && typeof response[0].totalAmount === 'number'));
        if (success) {
          this.test_output.push("Get category summary... PASS");
        } else {
          this.test_output.push("Get category summary... FAIL");
        }
        this.cdr.detectChanges();
      }
    });
  }
}
