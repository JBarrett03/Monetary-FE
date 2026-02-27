import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ACCOUNT_CATEGORIES } from '../../constants/account-categories';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * The Accounts component is responsible for displaying a list of the user's financial accounts and providing functionality to manage those accounts. It allows users to view their accounts, add new accounts, filter accounts by category, and navigate to account details or management pages. The component interacts with the AccountService to fetch and manage account data, and with the UserService to retrieve user information. It also uses the UtilityService for common utility functions. The component's template and styles are defined in separate HTML and CSS files, respectively.
 */
@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})

/**
 * The Accounts class implements the OnInit interface and defines the logic for managing and displaying the user's financial accounts. It initializes the component by fetching user details and account information from the backend API using the UserService and AccountService. The class provides methods for adding new accounts, toggling menus, applying filters to the account list, and navigating to other pages for managing accounts. It also handles user interactions such as showing/hiding forms and menus, and updating the UI based on changes to the account data.
 */
export class Accounts implements OnInit {

  /**
   * The accounts_list property holds the list of accounts retrieved from the backend API. It is initialized as an empty array and is populated with account data when the component initializes. This property is used to display the user's accounts in the UI and can be filtered based on user input.
   */
  accounts_list: any[] = [];

  /**
   * The allAccounts property holds the complete list of accounts retrieved from the backend API. It is used as a reference to reset the accounts_list when filters are cleared. This allows the component to maintain the original list of accounts while allowing users to filter and view a subset of accounts based on their criteria.
   */
  allAccounts: any[] = [];

  /**
   * The menuOpen property is a boolean that indicates whether the options menu for managing accounts is currently open or closed. It is used to toggle the visibility of the menu in the UI when the user clicks on the menu button. When menuOpen is true, the options menu is displayed; when it is false, the menu is hidden.
   */
  menuOpen = false;

  /**
   * The firstName property holds the first name of the user. It is retrieved from the backend API using the UserService when the component initializes. This property is used to personalize the UI by displaying the user's first name in greetings or other relevant sections of the accounts page.
   */
  firstName: string = '';

  /**
   * The lastName property holds the last name of the user. It is retrieved from the backend API using the UserService when the component initializes. This property can be used in conjunction with the firstName property to display the user's full name in the UI, providing a more personalized experience on the accounts page.
   */
  lastName: string = '';

  /**
   * The cardBrand property holds the brand of a credit card when adding a new credit card account. It is used in the addAccount method to specify the type of credit card being added (e.g., Visa, MasterCard, American Express). This property allows users to provide additional information about their credit card accounts, which can be useful for categorization and display purposes in the UI.
   */
  cardBrand: string = '';

  /**
   * The cardComplete property is a boolean that indicates whether the credit card information entered by the user is complete and valid. It is used to enable or disable the submission of the add account form when adding a new credit card account. When cardComplete is true, it indicates that all required credit card fields have been filled out correctly, allowing the user to proceed with adding the account. If cardComplete is false, it indicates that there are missing or invalid fields in the credit card information, preventing the user from submitting the form until the information is complete and valid.
   */
  cardComplete: boolean = false;

  /**
   * The showAddAccountForm property is a boolean that indicates whether the form for adding a new account is currently visible in the UI. It is used to toggle the display of the add account form when the user clicks on the "Add Account" button. When showAddAccountForm is true, the form is displayed; when it is false, the form is hidden.
   */
  showAddAccountForm: boolean = false;

  /**
   * The newAccountType property holds the type of a new account being added by the user. It is used in the addAccount method to create a new account with the specified type. This property allows users to specify the type of their accounts (e.g., checking, savings, credit) when adding a new account, which is important for categorizing and managing their financial accounts effectively.
   */
  newAccountType: string = '';

  /**
   * The newAccountCurrency property holds the currency type for a new account being added by the user. It is used in the addAccount method to create a new account with the specified currency. This property allows users to specify the currency for their accounts, which is important for financial tracking and reporting. When a user fills out the form to add a new account, they can select or enter the desired currency, and this value will be included in the account creation request sent to the backend API.
   */
  newAccountCurrency: string = '';

  /**
   * The newAccountNickname property holds the nickname for a new account being added by the user. It is used in the addAccount method to create a new account with the specified nickname. If the user does not provide a nickname, it defaults to "New Account". This property allows users to personalize their accounts by giving them custom names that are easier to recognize in the UI.
   */
  newAccountNickname: string = '';

  /**
   * The categories property holds a list of predefined account categories that can be used for filtering accounts. It is imported from the ACCOUNT_CATEGORIES constant and is used in the UI to provide users with options for categorizing and filtering their accounts based on type or other criteria defined in the categories.
   */
  categories = ACCOUNT_CATEGORIES;

  /**
   * The selectedCategory property holds the currently selected category for filtering accounts. It is used in conjunction with the customCategory property to determine the effective category filter applied to the accounts_list. When a user selects a category from a dropdown or enters a custom category, this property is updated accordingly, and the applyFilter method uses it to filter the accounts displayed in the UI based on the selected or entered category.
   */
  selectedCategory: string = '';

  /**
   * The customCategory property holds a custom category entered by the user for filtering accounts. It is used in conjunction with the selectedCategory property to determine the effective category filter applied to the accounts_list. When a user enters a custom category in an input field, this property is updated, and the applyFilter method uses it to filter the accounts displayed in the UI based on the custom category entered by the user.
   */
  customCategory: string = '';

  /**
   * The showFilter property is a boolean that indicates whether the filter options for accounts are currently visible in the UI. It is used to toggle the display of the filter options when the user clicks on a "Filter" button. When showFilter is true, the filter options are displayed; when it is false, the filter options are hidden. This allows users to easily access and apply filters to their account list to find specific accounts based on categories or other criteria.
   */
  showFilter: boolean = false;

  protected snackBar = inject(MatSnackBar);

  /**
   * The constructor for the Accounts component injects several services that are used to manage account data, user information, and utility functions. The AccountService is used to interact with the backend API for fetching and managing accounts, while the UserService is used to retrieve user details. The ChangeDetectorRef is used to trigger change detection when data is updated, ensuring that the UI reflects the latest information. The Router is used for navigation between different pages in the application, and the UtilityService provides common utility functions that can be used across the component.
   * @param accountService - The service responsible for managing account data and interactions with the backend API.
   * @param userService - The service responsible for retrieving user details.
   * @param cdr - The ChangeDetectorRef used to trigger change detection.
   * @param router - The Router used for navigation between pages.
   * @param utility - The UtilityService providing common utility functions.
   */
  constructor(private accountService: AccountService, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, public utility: UtilityService) { }

  /**
   * The ngOnInit method is a lifecycle hook that is called when the component is initialized. It retrieves the userId from session storage and uses it to fetch the user's details and accounts from the backend API. The method subscribes to the observables returned by the UserService and AccountService to handle the asynchronous data retrieval. When the user details are successfully retrieved, it updates the firstName and lastName properties and triggers change detection to update the UI. When the accounts are successfully retrieved, it populates the accounts_list and allAccounts properties with the retrieved data and triggers change detection to display the accounts in the UI. If there are any errors during data retrieval, it logs them to the console.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user details', err);
      }
    });

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

  /**
   * The addAccount method is responsible for adding a new account for the user. It first checks if the userId is available in session storage. If not, it returns early. If the add account form is not currently shown, it sets the showAddAccountForm property to true to display the form and returns. If the form is already shown, it checks if the new account type and currency are provided. If either of them is missing, it returns early. Otherwise, it constructs an account object with the provided information (account type, currency, and nickname) and calls the addAccount method of the AccountService to send a request to the backend API to create the new account. If the API call is successful, it refreshes the accounts list by fetching the updated list of accounts from the backend and resets the form fields and visibility. If there is an error during the API call, it logs the error to the console.
   */
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

  /**
   * The toggleMenu method is responsible for toggling the visibility of the options menu. It simply inverts the current state of the menuOpen property, allowing the menu to be shown or hidden.
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * The goToManageAccounts method is responsible for navigating the user to the manage accounts page. It first toggles the options menu to close it, and then uses the Router to navigate to the '/manage-accounts' route. This allows users to access the manage accounts page where they can perform additional actions such as sorting, filtering, and managing their accounts in more detail.
   */
  goToManageAccounts() {
    this.toggleMenu();
    this.router.navigate(['/manage-accounts']);
  }

  /**
   * The toggleFilter method is responsible for toggling the visibility of the filter options for accounts. When this method is called (e.g., when the user clicks a "Filter" button), it updates the showFilter boolean property to either show or hide the filter options. If the filter options are being hidden, it also resets the selectedCategory and customCategory properties to clear any applied filters. This allows users to easily access and apply filters to their account list, and also provides a way to quickly clear filters and return to viewing all accounts.
   */
  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  /**
   * The applyFilter method is responsible for filtering the accounts based on the selected category or custom category entered by the user. It constructs a search string from either the customCategory or selectedCategory properties, and then filters the allAccounts array to create a new accounts_list that only includes accounts that match the search criteria. The filtering is done by checking if the account's accountType or nickname includes the search string (case-insensitive). After filtering the accounts, it triggers change detection to update the UI and display the filtered list of accounts.
    */
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

  /**
   * The effectiveCategory getter is a computed property that returns the effective category filter to be applied to the accounts list. It checks if a custom category has been entered by the user (customCategory) and returns it if it exists; otherwise, it returns the selected category (selectedCategory). This allows the component to determine which category filter to apply when filtering the accounts list, giving priority to the custom category if it is provided by the user.
   */
  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }
}