import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})

export class Payments implements OnInit {

  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

  account: any | null = null;

  error: string | null = null;

  showAddBalanceForm: boolean = false;

  confirmAccountNumber: string = '';

  confirmSortCode: string = '';

  amountToAdd: number | null = null;

  allPayees: any[] = [];

  recentPayees: any[] = [];

  showRecentPayees: boolean = false;

  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    const storedPayees = localStorage.getItem(`recentPayees_${userId}`);
    if (storedPayees) {
      const parsedPayees = JSON.parse(storedPayees);
      this.recentPayees = parsedPayees.slice(0, 3);
      this.allPayees = parsedPayees;
    }

    this.accountService.getAccount(userId, accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.cdr.detectChanges();
      }
    });
  }

  openBalanceForm() {
    this.showAddBalanceForm = true;
  }

  closeBalanceForm() {
    this.showAddBalanceForm = false;
  }

  openShowRecentPayees() {
    this.showRecentPayees = true;
  }

  closeShowRecentPayees() {
    this.showRecentPayees = false;
  }

  addBalance() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    if (!this.confirmAccountNumber || !this.confirmSortCode || !(this.amountToAdd && this.amountToAdd > 0)) {
      this.error = 'Please enter a valid account number, sort code, and amount';
      this.cdr.detectChanges();
      return;
    }

    const cleanAccountNumber = this.confirmAccountNumber.replace(/\s/g, '');
    const cleanSortCode = this.confirmSortCode.replace(/-/g, '');

    this.accountService.getAccountByNumber(userId, cleanAccountNumber, cleanSortCode).subscribe({
      next: (account) => {
        const payeeAccountId = account._id;

        this.accountService.addBalance(userId, payeeAccountId, this.amountToAdd!).subscribe({
          next: () => {
            this.accountService.getAccount(userId, accountId).subscribe(updatedAccount => {
              this.account = updatedAccount;
              this.cdr.detectChanges();
            });

            if (!this.allPayees) {
              this.allPayees = [];
            }

            this.allPayees.unshift(account);

            localStorage.setItem(`recentPayees_${userId}`, JSON.stringify(this.allPayees));

            this.recentPayees = this.allPayees.slice(0, 3);
            this.showAddBalanceForm = false;
            this.confirmAccountNumber = '';
            this.confirmSortCode = '';
            this.amountToAdd = null;
            this.error = null;
            this.cdr.detectChanges();
          },
          error: () => {
            this.error = 'Account number not found';
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Account number not found';
        this.cdr.detectChanges();
      }
    });
  }

  showAllPayees() {
    this.showRecentPayees = true;
  }
}
