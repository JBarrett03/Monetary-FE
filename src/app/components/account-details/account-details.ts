import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})

export class AccountDetails implements OnInit {

  account: any | null = null;

  transactions: any[] = [];

  error: string | null = null;

  showFilter: boolean = false;

  categories = TRANSACTION_CATEGORIES;

  showBudgetForm: boolean = false;

  budgetAmount: number | null = null;

  budgetPeriod: string = '';

  startDate: string = '';

  endDate: string = '';

  menuOpen = false;

  showSortOptions: boolean = false;

  sortOptions: 'createdAtAsc' | 'createdAtDesc' | null = null;

  showTransactionForm: boolean = false;

  description: string = '';

  merchant: string = '';

  amount: number | null = null;

  cardBrand: string = '';

  selectedCategory: string = '';

  customCategory: string = '';

  protected snackBar = inject(MatSnackBar);

  private showSnackBar(message: string, panelClass: string = '', duration: number = 3000) {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      panelClass: panelClass ? [panelClass] : undefined
    });
  }

  private handleError(message: string) {
    this.error = message;
    this.cdr.detectChanges();
  }

  constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

  ngOnInit() {
    const userId = this.utility.getUserId();
    const accountId = this.route.snapshot.paramMap.get('accountId');
    if (!userId || !accountId) {
      this.handleError('Invalid user or account ID');
      return;
    }
    sessionStorage.setItem('accountId', accountId);
    this.accountService.getAccount(userId, accountId).subscribe({
      next: (account) => {
        this.account = account;
        const milestone = this.utility.checkSavingsProgress(account);
        if (milestone) {
          const toastNotification: Record<number, string> = {
            25: "Congratulations! You've reached 25% of your savings goal!",
            50: "Halfway there! 50% saved — keep going!",
            75: "Amazing! 75% of your goal achieved!",
            100: "Goal complete! You reached your savings target!"
          };
          this.showSnackBar(toastNotification[milestone], 'snackbar-success', 5000);
        }
        this.cdr.detectChanges();
      },
      error: () => this.handleError('Account not found')
    });
    this.accountService.getAccountTransactions(userId, accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: () => this.handleError('Could not load transactions')
    });
  }



  openTransaction(transactionId: string) {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    this.router.navigate(['/accounts', accountId, 'transactions', transactionId]);
  }

  openTransactionForm() {
    this.showTransactionForm = true;
  }

  closeTransactionForm() {
    this.showTransactionForm = false;
    this.description = '';
    this.merchant = '';
    this.amount = null;
  }

  addTransaction() {
    const userId = this.utility.getUserId();
    const accountId = this.utility.getAccountId();
    if (!userId || !accountId) return;
    if (!this.description || !this.amount || !this.merchant) {
      this.showSnackBar('Please fill in all fields', 'snackbar-error');
      return;
    }
    const amount = Math.abs(Number(this.amount));
    if (isNaN(amount) || amount <= 0) {
      this.showSnackBar('Please enter a valid positive number for the amount.', 'snackbar-error');
      return;
    }
    const transaction = {
      direction: 'out' as 'in' | 'out',
      type: 'debit',
      amount: amount,
      description: this.description,
      merchant: this.merchant,
      cardBrand: this.cardBrand,
    };
    this.accountService.addTransaction(userId, accountId, transaction).subscribe({
      next: () => {
        this.refreshAccountData(userId, accountId);
        this.showSnackBar('Transaction added successfully', 'snackbar-success');
        this.closeTransactionForm();
      },
      error: () => this.showSnackBar('Failed to add transaction', 'snackbar-error')
    });
  }

  refreshAccountData(userId: string, accountId: string) {
    this.accountService.getAccount(userId, accountId).subscribe(account => {
      this.account = account;
      this.cdr.detectChanges();
    })

    this.accountService.getAccountTransactions(userId, accountId).subscribe(transaction => {
      this.transactions = transaction;
      this.cdr.detectChanges();
    })
  }

  archiveAccount() {
    const confirmArchive = confirm('Are you sure you want to archive this account?');
    if (!confirmArchive) return;
    const userId = this.utility.getUserId();
    const accountId = this.utility.getAccountId();
    if (!userId || !accountId) {
      this.handleError('Invalid user or account');
      return;
    }
    this.accountService.archiveAccount(userId, accountId).subscribe({
      next: () => {
        this.showSnackBar('Account archived successfully', 'snackbar-success');
        this.router.navigate(['/accounts']);
      },
      error: () => this.handleError('Failed to archive account')
    });
  }

  setAsDefault() {
    const userId = this.utility.getUserId();
    const accountId = this.utility.getAccountId();
    if (!userId || !accountId) return;
    this.account.isDefault = true;
    this.accountService.setDefaultAccount(userId, accountId).subscribe({
      next: () => {
        this.showSnackBar('Default account set successfully', 'snackbar-success');
        this.cdr.detectChanges();
      },
      error: () => this.handleError('Failed to set default account')
    })
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
      this.customCategory = '';
      this.selectedCategory = '';
    }
  }

  addBudget() {
    this.showBudgetForm = !this.showBudgetForm;
  }

  selectBudgetPeriod(period: string) {
    this.budgetPeriod = period;
  }

  submitBudget() {
    const userId = this.utility.getUserId();
    const accountId = this.utility.getAccountId();
    if (!userId || !accountId) {
      this.handleError('Invalid user or account');
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
          this.showSnackBar('Budget set successfully', 'snackbar-success');
          this.cdr.detectChanges();
        });
      },
      error: () => this.showSnackBar('Failed to set budget', 'snackbar-error')
    });
  }

  get budgetProgress(): number {
    if (!this.account?.budget?.amount) return 0;

    const spent = this.account.balance || 0;
    const budgetAmount = this.account.budget.amount;

    const percentage = (spent / budgetAmount) * 100;
    return Math.min(percentage, 100);
  }

  get isBudgetExceeded(): boolean {
    if (!this.account?.budget?.amount) return false;
    return (this.account.balance || 0) > this.account.budget.amount;
  }

  closeBudgetForm() {
    this.showBudgetForm = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  applySort(option: 'createdAtAsc' | 'createdAtDesc') {
    this.sortOptions = option;
    switch (option) {
      case 'createdAtAsc':
        this.transactions = [...this.transactions].sort(
          (a, b) => this.utility.toTime(a.createdAt) - this.utility.toTime(b.createdAt)
        );
        break;
      case 'createdAtDesc':
        this.transactions = [...this.transactions].sort(
          (a, b) => this.utility.toTime(b.createdAt) - this.utility.toTime(a.createdAt)
        );
        break;
    }
    this.cdr.detectChanges();
  }

  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }

  goBackToAccounts() {
    this.router.navigate(['/accounts']);
  }
}