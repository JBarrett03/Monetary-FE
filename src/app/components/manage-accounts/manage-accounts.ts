import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';

/**
 * The ManageAccounts component is responsible for displaying and managing the user's accounts. It allows users to view their accounts, sort them based on different criteria (e.g., balance, opened date), and manage archived accounts. The component also provides functionality for reordering accounts using drag-and-drop and restoring archived accounts. It interacts with the AccountService to fetch account data and perform actions such as saving the new order of accounts or restoring archived accounts. The component also uses the UserService to fetch user information and the UtilityService for any utility functions needed within the component.
 */
@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './manage-accounts.html',
  styleUrl: './manage-accounts.css',
})

/**
 * The ManageAccounts class implements the OnInit lifecycle hook and contains properties and methods for managing the user's accounts. It includes properties for storing the list of accounts, archived accounts, sorting options, and user information. The class also contains methods for handling drag-and-drop reordering of accounts, saving the new order, toggling sort options, applying sorting based on different criteria, showing archived accounts, toggling account menus, and restoring archived accounts. The class interacts with the AccountService to perform API calls related to account management and uses the ChangeDetectorRef to trigger change detection when data is updated.
 */
export class ManageAccounts implements OnInit {

  /**
   * The accounts_list property holds the list of active accounts for the user. It is initialized as an empty array and is populated with account data retrieved from the backend API when the component is initialized. This property is used to display the user's accounts in the UI and allows for operations such as sorting and reordering of accounts.
   */
  accounts_list: any[] = [];

  /**
   * The archived_list property holds the list of archived accounts for the user. Similar to accounts_list, it is initialized as an empty array and is populated with archived account data retrieved from the backend API when the user chooses to view archived accounts. This property is used to display archived accounts in the UI and allows users to manage their archived accounts, such as restoring them back to active status.
   */
  archived_list: any[] = [];

  /**
   * The isReordering property is a boolean flag that indicates whether the user is currently in the process of reordering their accounts. It is initialized as false and is set to true when the user initiates the sorting/reordering process. This property can be used in the UI to conditionally display certain elements or provide feedback to the user while they are reordering their accounts.
   */
  isReordering = false;

  /**
   * The showingArchived property is a boolean flag that indicates whether the user is currently viewing their archived accounts. It is initialized as false and is set to true when the user chooses to view archived accounts. This property can be used in the UI to conditionally display the archived accounts section and hide the active accounts section when the user is viewing archived accounts.
   */
  showingArchived = false;

  /**
   * The openMenu property holds the ID of the account for which the options menu is currently open. It is initialized as null and is updated when the user toggles the options menu for a specific account. This property allows the component to track which account's menu is open and can be used to conditionally display the options menu in the UI for the corresponding account.
   */
  openMenu: string | null = null;

  /**
   * The showSortOptions property is a boolean flag that indicates whether the sorting options for accounts are currently visible in the UI. It is initialized as false and is toggled when the user interacts with the UI to show or hide the sorting options. This property can be used to conditionally display the sorting options in the UI, allowing users to choose how they want to sort their accounts (e.g., by balance, by opened date).
   */
  showSortOptions: boolean = false;

  /**
   * The firstName property holds the first name of the user. It is initialized as an empty string and is populated with the user's first name retrieved from the backend API when the component is initialized. This property can be used in the UI to display a personalized greeting or to show the user's name in various parts of the account management interface.
   */
  firstName: string = '';

  /**
   * The lastName property holds the last name of the user. Similar to firstName, it is initialized as an empty string and is populated with the user's last name retrieved from the backend API when the component is initialized. This property can be used in conjunction with firstName to display the user's full name in the UI, providing a more personalized experience for the user when managing their accounts.
   */
  lastName: string = '';

  /**
   * The cardBrand property holds the brand of the card associated with the account (e.g., Visa, MasterCard). It is initialized as an empty string and can be populated with the card brand information retrieved from the backend API when account data is fetched. This property can be used in the UI to display the card brand next to the account information, providing users with a visual cue about which card is associated with each account.
   */
  cardBrand: string = '';

  /**
   * The constructor for the ManageAccounts component is responsible for injecting the necessary services and dependencies required for the component to function properly. It takes in the AccountService for fetching and managing account data, the UserService for fetching user information, the ChangeDetectorRef for manually triggering change detection when data is updated, the Router for navigating between routes, and the UtilityService for any utility functions needed within the component. These injected services are essential for handling data retrieval, navigation, and UI updates within the ManageAccounts component.
   * @param accountService - The AccountService used for fetching and managing account data from the backend.
   * @param userService - The UserService used for fetching user information from the backend.
   * @param cdr - The ChangeDetectorRef used for manually triggering change detection when data is updated.
   * @param router - The Router used for navigating between routes within the application.
   * @param utility - The UtilityService that provides utility functions for use within the component.
   */
  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, public utility: UtilityService) { }

  /**
   * The ngOnInit method is a lifecycle hook that is called after the component has been initialized. In this method, the component retrieves the userId from session storage to fetch the user's information and their accounts. It uses the UserService to get the user's first and last name, and the AccountService to fetch the list of active accounts for the user. If any of the API calls fail, it handles errors appropriately (e.g., by logging them or setting error messages). The method also ensures that change detection is triggered after data is updated to reflect the changes in the UI.
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
   * The drop method is an event handler for the drag-and-drop functionality provided by the Angular CDK. It is called when a user drops an account item into a new position in the list. The method takes in a CdkDragDrop event, which contains information about the previous and current index of the dragged item. The method uses the moveItemInArray function from the Angular CDK to update the order of accounts in the accounts_list array based on the new position of the dragged item. After updating the order, it triggers change detection to update the UI and reflect the new order of accounts.
   * @param event - The CdkDragDrop event that contains information about the drag-and-drop action, including previous and current index of the dragged item.
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
   * The saveOrder method is responsible for saving the new order of accounts after the user has rearranged them using drag-and-drop. It retrieves the userId from session storage and constructs an updated order array that contains the accountId and its new order index for each account in the accounts_list. It then calls the saveAccountOrder method of the AccountService to send the updated order to the backend API. If the API call is successful, it resets the isReordering flag and refreshes the accounts list by navigating to the accounts route. If there is an error during the API call, it logs the error to the console.
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
   * The toggleSortOptions method is responsible for toggling the visibility of the sorting options in the user interface. When this method is called (e.g., when the user clicks a "Sort" button), it updates the showSortOptions boolean property to either show or hide the sorting options. This allows users to choose how they want to sort their accounts (e.g., by balance, by opened date) when the sorting options are visible in the UI.
   */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  /**
   * The applySort method is responsible for sorting the accounts based on the selected sorting option. It takes in an option parameter that specifies the sorting criteria (e.g., balance ascending, balance descending, opened date ascending, opened date descending). Based on the selected option, it sorts the accounts_list array accordingly using JavaScript's array sort method. After sorting the accounts, it triggers change detection to update the UI and reflect the new order of accounts based on the selected sorting criteria.
   * @param option - The sorting option that specifies how to sort the accounts (e.g., 'balanceAsc', 'balanceDesc', 'openedAtAsc', 'openedAtDesc').
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
   * The sortAccounts method is responsible for initiating the sorting process for the user's accounts. It retrieves the userId from session storage and checks if it exists. If the userId is not found, the method returns early. Otherwise, it sets the isReordering flag to true, hides the archived accounts, and triggers change detection. It then calls the getAccounts method of the AccountService to fetch the user's accounts and updates the accounts_list with the retrieved data, followed by triggering change detection to update the UI.
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
   * The showArchivedAccounts method is responsible for displaying the user's archived accounts. It retrieves the userId from session storage and checks if it exists. If the userId is not found, the method returns early. Otherwise, it sets the showingArchived flag to true, hides the reordering options, and triggers change detection. It then calls the getArchivedAccounts method of the AccountService to fetch the user's archived accounts and updates the archived_list with the retrieved data, followed by triggering change detection to update the UI and display the archived accounts.
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
   * The toggleMenu method is responsible for toggling the visibility of the options menu for a specific account. It takes in the accountId as a parameter and checks if the openMenu property is currently set to that accountId. If it is, it sets openMenu to null (closing the menu); otherwise, it sets openMenu to the accountId (opening the menu). This allows users to click on an account's options button to show or hide the options menu for that account in the UI.
   * @param accountId - The ID of the account for which to toggle the options menu.
   */
  toggleMenu(accountId: string) {
    this.openMenu = this.openMenu === accountId ? null : accountId;
  }

  /**
   * The restoreArchivedAccount method is responsible for restoring an archived account back to active status. It takes in the accountId of the archived account to be restored. The method retrieves the userId from session storage and checks if it exists. If the userId is not found, the method returns early. Otherwise, it calls the restoreArchivedAccount method of the AccountService to send a request to the backend API to restore the archived account. If the API call is successful, it removes the restored account from the archived_list, closes any open menus, and refreshes the accounts list by fetching the updated list of accounts from the backend. If there is an error during the API call, it logs the error to the console.
   * @param accountId - The ID of the archived account to be restored.
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