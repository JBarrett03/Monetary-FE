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
   * Menu open state
   */
  isReordering = false;

  /**
   * Archived accounts open state
   */
  showingArchived = false;

  /**
   * Currently open menu for an account
   */
  openMenu: string | null = null;

  showBalanceBox: boolean = false;

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
   * Toggles the reordering mode.
   * @returns void
   */
  toggleReorder() {
    this.isReordering = !this.isReordering;
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

  sortByBalance() {
    this.showBalanceBox = !this.showBalanceBox;

    if (!this.showBalanceBox) {
      return;
    }


    this.accounts_list = [...this.accounts_list].sort(
      (a, b) => (b.balance ?? 0) - (a.balance ?? 0)
    );
    this.cdr.detectChanges();
  }

  /**
  * Sorts accounts.
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
   * Toggles the menu for a specific account.
   * @param accountId The ID of the account to toggle the menu for.
   * @returns void
   */
  toggleMenu(accountId: string) {
    this.openMenu = this.openMenu === accountId ? null : accountId;
  }

  /**
   * Restores an archived account.
   * @param accountId The ID of the account to be restored.
   * @return voids
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