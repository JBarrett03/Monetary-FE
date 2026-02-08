import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * The ManageAccounts component is responsible for providing an interface for managing user accounts within the application. It serves as a placeholder component that can be expanded upon in the future to include functionality for creating, editing, and deleting user accounts. The component is decorated with the @Component decorator, which defines its selector, template URL, and style URL.
 */
@Component({
  selector: 'app-manage-accounts',
  imports: [RouterModule, DragDropModule],
  templateUrl: './manage-accounts.html',
  styleUrl: './manage-accounts.css',
})

/**
 * The ManageAccounts component is responsible for providing an interface for managing user accounts within the application. It serves as a placeholder component that can be expanded upon in the future to include functionality for creating, editing, and deleting user accounts. The component is decorated with the @Component decorator, which defines its selector, template URL, and style URL.
 */
export class ManageAccounts implements OnInit {

  /**
 * List of accounts
 */
  accounts_list: any[] = [];

  /**
 * Menu open state
 */
  isReordering = false;

    /**
   * Archived accounts open state
   */
  showingArchived = false;

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
      }
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
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.isReordering = true;
    this.showingArchived = false;
    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      }
    })
  }
}
