import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ACCOUNT_CATEGORIES } from '../../constants/account-categories';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})

export class Accounts implements OnInit {

  accounts_list: any[] = [];

  allAccounts: any[] = [];

  menuOpen = false;

  showAddAccountForm: boolean = false;

  newAccountType: string = '';

  newAccountCurrency: string = '';

  newAccountNickname: string = '';

  categories = ACCOUNT_CATEGORIES;

  selectedCategory: string = '';

  customCategory: string = '';

  showFilter: boolean = false;

  protected snackBar = inject(MatSnackBar);

  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, public utility: UtilityService) { }

  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.allAccounts = accounts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
      }
    });
  }

  addAccount() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    if (!this.showAddAccountForm) {
      this.showAddAccountForm = true;
      return;
    }

    if (!this.newAccountType || !this.newAccountCurrency) return;

    const account = {
      accountType: this.newAccountType,
      currency: this.newAccountCurrency,
      nickname: this.newAccountNickname || 'New Account'
    }

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe(accounts => {
          this.accounts_list = accounts;
          this.showAddAccountForm = false;
          this.newAccountType = '';
          this.newAccountCurrency = '';
          this.newAccountNickname = '';
          this.snackBar.open('Account added successfully', 'Dismiss', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.cdr.detectChanges();
        })
      }
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToManageAccounts() {
    this.toggleMenu();
    this.router.navigate(['/manage-accounts']);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  applyFilter() {
    const search = (this.customCategory || this.selectedCategory || '').toLowerCase().trim();

    if (!search) {
      this.accounts_list = [...this.allAccounts];
      return;
    }

    this.accounts_list = this.allAccounts.filter(account =>
      account.accountType?.toLowerCase().includes(search) ||
      account.nickname?.toLowerCase().includes(search)
    );
    this.cdr.detectChanges();
  }

  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }
}