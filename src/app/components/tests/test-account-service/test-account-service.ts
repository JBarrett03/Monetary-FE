import { Component, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../../services/account-service';

@Component({
  selector: 'app-test-account-service',
  imports: [],
  providers: [AccountService],
  templateUrl: './test-account-service.html',
  styleUrl: './test-account-service.css',
})

export class TestAccountService {

  test_output: string[] = [];

  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef) { }

  userId = '6985caceef72e64ca33d5914';
  accountId = '69a0a4e327d2b3dd85058978';

  ngOnInit() {
    this.testGetAccounts();
    this.testGetAccount();
    this.testAddAccount();
    this.testAddBalance();
    this.testGetAccountTransactions();
    this.testAddTransaction();
    this.saveAccountOrder();
    this.testArchiveAccount();
    this.testGetArchivedAccounts();
    this.testRestoreArchivedAccount();
    this.testSetBudget();
    this.testGetAccountByNumber();
    this.setDefaultAccount();
    this.getDefaultAccount();
  }

  private testGetAccounts() {
    this.accountService.getAccounts(this.userId).subscribe((response: any) => {
      if (response && Array.isArray(response)) {
        this.test_output.push("Get accounts... PASS");
      } else {
        this.test_output.push("Get accounts... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testGetAccount() {
    this.accountService.getAccount(this.userId, this.accountId).subscribe((response: any) => {
      if (response && typeof response === 'object') {
        this.test_output.push("Get account... PASS");
      } else {
        this.test_output.push("Get account... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testAddAccount() {
    const newAccount = {
      accountType: 'savings',
      currency: 'GBP'
    };

    this.accountService.addAccount(this.userId, newAccount).subscribe((response: any) => {
      if (response && response._id) {
        this.test_output.push("Add account... PASS");
      } else {
        this.test_output.push("Add account... FAIL");
      }
      this.cdr.detectChanges();
    })
  }

  private testAddBalance() {
    const balance = {
      amount: 1000,
      date: new Date().toISOString()
    };

    this.accountService.addBalance(this.userId, this.accountId, balance.amount).subscribe((response: any) => {
      if (response && response.newBalance !== undefined) {
        this.test_output.push("Add balance... PASS");
      } else {
        this.test_output.push("Add balance... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testGetAccountTransactions() {
    this.accountService.getAccountTransactions(this.userId, this.accountId).subscribe((response: any) => {
      if (response && Array.isArray(response)) {
        this.test_output.push("Get account transactions... PASS");
      } else {
        this.test_output.push("Get account transactions... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testAddTransaction() {
    const newTransaction = {
      direction: 'in' as const,
      type: 'Salary',
      amount: 2000,
      description: 'Monthly salary',
      merchant: 'Employer Inc.'
    };

    this.accountService.addTransaction(this.userId, this.accountId, newTransaction).subscribe({
      next: (response: any) => {
        if (response && (response._id || response.message || response.newBalance !== undefined)) {
          this.test_output.push("Add transaction... PASS");
        } else {
          this.test_output.push("Add transaction... FAIL");
        }
        this.cdr.detectChanges();
      }
    })
  }

  private saveAccountOrder() {
    const order = [
      { accountId: this.accountId, order: 0 }
    ];

    this.accountService.saveAccountOrder(this.userId, order).subscribe((response: any) => {
      if (response?.message === 'Account order updated successfully') {
        this.test_output.push("Save account order... PASS");
      } else {
        this.test_output.push("Save account order... FAIL");
      }
      this.cdr.detectChanges();
    })
  }

  private testArchiveAccount() {
    this.accountService.archiveAccount(this.userId, this.accountId).subscribe((response: any) => {
      if (response && response.message === 'Account archived successfully') {
        this.test_output.push("Archive account... PASS");
      } else {
        this.test_output.push("Archive account... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testGetArchivedAccounts() {
    this.accountService.getArchivedAccounts(this.userId).subscribe((response: any) => {
      if (response && Array.isArray(response)) {
        this.test_output.push("Get archived accounts... PASS");
      } else {
        this.test_output.push("Get archived accounts... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testRestoreArchivedAccount() {
    this.accountService.restoreArchivedAccount(this.userId, this.accountId).subscribe((response: any) => {
      if (response && response.message === 'Account restored successfully') {
        this.test_output.push("Restore archived account... PASS");
      } else {
        this.test_output.push("Restore archived account... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testSetBudget() {
    const budget = {
      amount: 500,
      period: 'monthly'
    };

    this.accountService.setBudget(this.userId, this.accountId, budget).subscribe((response: any) => {
      if (response && response.message === 'Budget set successfully') {
        this.test_output.push("Set budget... PASS");
      } else {
        this.test_output.push("Set budget... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testGetAccountByNumber() {
    this.accountService.getAccountByNumber(this.userId, '1234567890123456', '12-34-56').subscribe((response: any) => {
      if (response && typeof response === 'object') {
        this.test_output.push("Get account by number... PASS");
      } else {
        this.test_output.push("Get account by number... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private setDefaultAccount() {
    this.accountService.setDefaultAccount(this.userId, this.accountId).subscribe((response: any) => {
      if (response?.message === 'Default Account Set') {
        this.test_output.push("Set default account... PASS");
      } else {
        this.test_output.push("Set default account... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private getDefaultAccount() {
    this.accountService.getDefaultAccount(this.userId).subscribe((response: any) => {
      if (response && typeof response === 'object') {
        this.test_output.push("Get default account... PASS");
      } else {
        this.test_output.push("Get default account... FAIL");
      }
      this.cdr.detectChanges();
    });
  }
}
