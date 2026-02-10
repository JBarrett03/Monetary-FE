import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AccountService } from '../../services/account-service';

/**
 * ManageAccounts component
 */
@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './manage-accounts.html',
  styleUrl: './manage-accounts.css',
})

/**
 * ManageAccounts class
 */
export class ManageAccounts implements OnInit {

  /**
   * List of accounts
   */
  accounts_list: any[] = [];

  /**
   * List of archived accounts
   */
  archived_list: any[] = [];

  /**
   * Flag indicating if the component is in reordering mode.
   */
  isReordering = false;

  /**
   * Archived accounts open state
   */
  showingArchived = false;

  /**
   * Currently open menu for an account
   */
  /**
   * Currently open menu ID for an account (kebab menu).
   */
  openMenu: string | null = null;

  /**
   * Flag indicating if the sort options dropdown is visible.
   */
  showSortOptions: boolean = false;

  sortOptions: 'balanceAsc' | 'balanceDesc' | 'openedAtAsc' | 'openedAtDesc' | 'updatedAtAsc' | 'updatedAtDesc' | null = null;

  /**
   * Constructor for the ManageAccounts component.
   * @param accountService Service for account operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, private router: Router) { }

  /**
   * Initializes the component.
   * @returns void
   */
  ngOnInit() {
    // Accounts will be loaded when user clicks "Reorder Accounts" or "Archived accounts"
  }

  /**
   * Handles the drop event when reordering accounts.
   * @param event The drag and drop event containing the previous and current index of the item.
   * @returns void
   */
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.accounts_list,
      event.previousIndex,
      event.currentIndex
    );
    this.cdr.detectChanges();
  }

  /**
   * Saves the new order of accounts after reordering.
   * @returns void
   */
  saveOrder() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    const updatedOrder = this.accounts_list.map((acc, index) => ({
      accountId: acc._id,
      order: index
    }));

    this.accountService.saveAccountOrder(userId, updatedOrder).subscribe({
      next: () => {
        this.isReordering = false;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/accounts']);
        });
      },
      error: (err) => {
        console.error('Failed to save account order', err)
      }
    })
  }

  /**
   * Toggles the display of sort options.
   * @returns void
   */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  /**
   * Applies the selected sort option to the accounts list.
   * Currently supports sorting by balance (ascending or descending).
   * @param option The sort option to apply ('balanceAsc' or 'balanceDesc').
   * @returns void
   */
  applySort(option: 'balanceAsc' | 'balanceDesc' | 'openedAtAsc' | 'openedAtDesc' | 'updatedAtAsc' | 'updatedAtDesc') {
    this.sortOptions = option;

    switch (option) {
      case 'balanceAsc':
        this.accounts_list = [...this.accounts_list].sort(
          (a,b) => (a.availableBalance ?? 0) - (b.availableBalance ?? 0)
        );
        break;

      case 'balanceDesc':
        this.accounts_list = [...this.accounts_list].sort(
          (a,b) => (b.availableBalance ?? 0) - (a.availableBalance ?? 0)
        );
        break;
    }
    this.cdr.detectChanges();
  }

  /**
   * Enables reordering mode and loads accounts from the service.
   * @returns void
   */
  sortAccounts() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.isReordering = true;
    this.showingArchived = false;
    this.cdr.detectChanges();
    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      }
    })
  }

  /**
   * Shows archived accounts.
   * @returns void
   */
  showArchivedAccounts() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      return;
    }

    this.showingArchived = true;
    this.isReordering = false;
    this.cdr.detectChanges();
    this.accountService.getArchivedAccounts(userId).subscribe({
      next: (accounts) => {
        this.archived_list = accounts;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Toggles the kebab menu visibility for a specific account.
   * @param accountId The ID of the account whose menu should be toggled.
   * @returns void
   */
  toggleMenu(accountId: string) {
    this.openMenu = this.openMenu === accountId ? null : accountId;
  }

  /**
   * Restores an archived account back to the active accounts list.
   * @param accountId The ID of the account to be restored.
   * @returns void
   */
  restoreArchivedAccount(accountId: string) {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      return;
    }

    this.accountService.restoreArchivedAccount(userId, accountId).subscribe({
      next: () => {
        this.archived_list = this.archived_list.filter(acc => acc._id !== accountId);
        this.openMenu = null;

        this.accountService.getAccounts(userId).subscribe({
          next: (accounts) => {
            this.accounts_list = accounts;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Failed to restore archived account', err);
      }
    });
  }
}