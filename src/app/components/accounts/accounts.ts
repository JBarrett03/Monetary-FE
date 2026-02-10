import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Accounts component
 */
@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})

/**
 * Accounts component
 */
export class Accounts implements OnInit {

  /**
   * List of accounts
   */
  accounts_list: any[] = [];

  /**
   * Menu open state
   */
  menuOpen = false;

  /**
   * Creates an instance of Accounts component.
   * @param accountService Service for account operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, private router: Router) { }

  /**
   * Initializes the component and loads the list of accounts for the user.
   * @returns void
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Adds a new account for the user.
   * Prompts for account type and currency, then creates the account via the service.
   * @returns void
   */
  addAccount() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    const accountType = prompt('Account type (e.g. Current, Savings):');
    const currency = prompt('Currency (e.g. GBP, USD):');

    if (!accountType || !currency) {
      return;
    }

    const account = {
      accountType,
      currency,
    };

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe({
          next: (accounts) => {
            this.accounts_list = accounts;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Failed to add account', err);
      }
    });
  }

  /**
   * Toggles the menu open state.
   * @returns void
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Navigates to manage accounts page and closes the menu.
   * @returns void
   */
  goToManageAccounts() {
    this.toggleMenu();
    this.router.navigate(['/manage-accounts']);
  }
}