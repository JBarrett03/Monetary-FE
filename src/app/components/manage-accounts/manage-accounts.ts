import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';

@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './manage-accounts.html',
  styleUrl: './manage-accounts.css',
})

export class ManageAccounts implements OnInit {

  accounts_list: any[] = [];

  archived_list: any[] = [];

  isReordering = false;

  showingArchived = false;

  openMenu: string | null = null;

  showSortOptions: boolean = false;

  firstName: string = '';

  lastName: string = '';

  cardBrand: string = '';

  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, public utility: UtilityService) { }

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

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.accounts_list,
      event.previousIndex,
      event.currentIndex
    );
    this.cdr.detectChanges();
  }

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

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

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

  toggleMenu(accountId: string) {
    this.openMenu = this.openMenu === accountId ? null : accountId;
  }

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