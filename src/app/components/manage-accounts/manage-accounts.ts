import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, Subject, switchMap, startWith } from 'rxjs';
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
   * List of accounts observable
   */
  accounts$!: Observable<any[]>;

  /**
   * List of archived accounts observable
   */
  archived_list$!: Observable<any[]>;

  /**
   * Menu open state
   */
  isReordering = false;

  /**
   * Archived accounts open state
   */
  showingArchived = false;

  /**
   * Subject to trigger refresh
   */
  private refresh$ = new Subject<void>();

  /**
   * Local copy of accounts for drag-drop
   */
  accounts_list: any[] = [];

  /**
   * Constructor for the ManageAccounts component.
   * @param accountService Service for account operations.
   * @param router Router for navigation.
   */
  constructor(private accountService: AccountService, private router: Router) { }

  /**
   * Initializes the component and loads the list of accounts for the user.
   * @returns void
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accounts$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() => this.accountService.getAccounts(userId))
    );

    this.accounts$.subscribe(accounts => {
      this.accounts_list = accounts;
    });
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
      error: (err) => {
        console.error('Failed to save account order', err);
      },
      complete: () => {
        this.isReordering = false;
        this.router.navigate(['/accounts']);
      }
    });
  }

  /**
  * Sorts accounts.
  * @returns void
  */
  sortAccounts() {
    this.isReordering = true;
    this.showingArchived = false;
    this.refresh$.next();
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
    this.archived_list$ = this.accountService.getArchivedAccounts(userId);
  }
}
