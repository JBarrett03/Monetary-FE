import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {

  defaultAccount: any = null;

  error: string | null = null;

  cardBrand: string = '';

  account: any | null = null;

  showFilter: boolean = false;

  transactions: any[] = [];

  categories = TRANSACTION_CATEGORIES;

  customCategory: string = '';

  selectedCategory: string = '';

  constructor(private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

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
      error: () => {
        this.error = 'Account not found';
        this.cdr.detectChanges();
      }
    });

    this.accountService.getAccountTransactions(userId, accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not load transactions';
        this.cdr.detectChanges();
      }
    });
  }

  openTransaction(transactionId: string) {
    if (!this.defaultAccount) {
      return;
    }
    this.router.navigate(['/accounts', this.defaultAccount._id, 'transactions', transactionId]);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }

}
