import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';

/**
 * Manage Accounts component allows users to reorder, sort, and restore archived accounts.
 * Features include drag-and-drop reordering, sorting by balance or opened date, and restoring archived accounts.
 */
@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './manage-accounts.html',
  styleUrl: './manage-accounts.css',
})
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
   * Currently open menu ID for an account (kebab menu).
   */
  openMenu: string | null = null;

  /**
   * Flag indicating if the sort options dropdown is visible.
   */
  showSortOptions: boolean = false;

  /**
   * Customer's first name
   */
  firstName: string = '';

  /**
   * Customer's last name
   */
  lastName: string = '';

  /**
   * Card brand for display purposes (e.g., Visa, MasterCard)
   */
  cardBrand: string = '';

  /**
   * Constructor for the ManageAccounts component.
   * @param accountService Service for account operations.
   * @param userService Service for user operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, public utility: UtilityService) { }

  /**
   * Angular lifecycle hook that runs when the component is initialized.
   * Loads the user details and active accounts list.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      return;
    }

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.cdr.detectChanges();
      }
    });

    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handles the drop event when reordering accounts via drag and drop.
   * @param event The drag and drop event containing the previous and current index.
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
   * Saves the new account order after reordering and navigates back to accounts page.
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
   * Toggles the visibility of the sort options dropdown.
   */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  /**
   * Applies the selected sort option to the accounts list.
   * Supports sorting by balance or opened date in ascending or descending order.
   * @param option The sort option to apply.
   */
  applySort(option: 'balanceAsc' | 'balanceDesc' | 'openedAtAsc' | 'openedAtDesc') {
    switch (option) {
      case 'balanceAsc':
        this.accounts_list = [...this.accounts_list].sort(
          (a, b) => (a.availableBalance ?? 0) - (b.availableBalance ?? 0)
        );
        break;

      case 'balanceDesc':
        this.accounts_list = [...this.accounts_list].sort(
          (a, b) => (b.availableBalance ?? 0) - (a.availableBalance ?? 0)
        );
        break;

      case 'openedAtAsc':
        this.accounts_list = [...this.accounts_list].sort(
          (a, b) => this.utility.toTime(a.openedAt) - this.utility.toTime(b.openedAt)
        );
        break;

      case 'openedAtDesc':
        this.accounts_list = [...this.accounts_list].sort(
          (a, b) => this.utility.toTime(b.openedAt) - this.utility.toTime(a.openedAt)
        );
        break;
    }
    this.cdr.detectChanges();
  }

  /**
   * Enables reordering mode and loads accounts for reordering.
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
   * Switches to displaying archived accounts instead of active accounts.
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
   */
  toggleMenu(accountId: string) {
    this.openMenu = this.openMenu === accountId ? null : accountId;
  }

  /**
   * Restores an archived account back to the active accounts list.
   * @param accountId The ID of the account to restore.
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