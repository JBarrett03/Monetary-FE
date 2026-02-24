import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';

/**
 * Home component that displays the user's default account information and recent transactions. It allows users to view their account details, filter transactions by category, and navigate to transaction details. The component fetches the default account and its transactions on initialization and handles any errors that may occur during data retrieval.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

/**
 * The Home class is the main component for the home page of the application. It implements the OnInit interface to perform initialization tasks when the component is created. The class manages the state of the default account, transactions, and filtering options for displaying transaction data. It interacts with the AccountService to fetch account information and transactions, and it uses the Router to navigate to transaction details. The component also handles error states and provides a user interface for filtering transactions by category.
 */
export class Home implements OnInit {

  /**
   * The defaultAccount property holds the information of the user's default account. It is initialized to null and is populated with data retrieved from the AccountService when the component initializes. This property is used to display account details and to navigate to transaction details related to the default account.
   */
  defaultAccount: any = null;

  /**
   * The error property is used to store any error messages that may occur during the retrieval of account information or transactions. It is initialized to null and is updated with appropriate error messages if any issues arise while fetching data from the AccountService. This property is used to display error messages to the user in the UI when necessary.
   */
  error: string | null = null;

  /**
   * The firstName and lastName properties are used to store the user's first and last names, respectively. These properties can be populated with user information retrieved from the AccountService or other user-related services. They are typically used to personalize the user interface by displaying the user's name in greetings or account information sections.
   */
  firstName: string = '';

  /**
   * The lastName property is used to store the user's last name. Similar to the firstName property, it can be populated with user information and is used for personalization in the user interface. It allows the application to display the user's full name or last name in various sections of the UI, enhancing the user experience by providing a more personalized touch.
   */
  lastName: string = '';

  /**
   * The cardBrand property is used to store the brand of the user's payment card (e.g., Visa, MasterCard, etc.). This information can be retrieved from the AccountService or other related services that provide details about the user's payment methods. The cardBrand property is typically used to display the type of card associated with the account or transactions, providing users with a visual cue about their payment methods.
   */
  cardBrand: string = '';

  /**
   * The account property holds the detailed information of the user's account. It is initialized to null and is populated with data retrieved from the AccountService when the component initializes. This property is used to display comprehensive account details, including balance, transaction history, and other relevant information that may be necessary for the user to manage their finances effectively.
   */
  account: any | null = null;

  /**
   * The showFilter property is a boolean that indicates whether the transaction filter options are currently visible in the user interface. It is initialized to false, meaning that the filter options are hidden by default. When the user interacts with the UI to toggle the filter options, this property is updated accordingly to show or hide the filtering interface, allowing users to filter their transactions based on categories or other criteria.
   */
  showFilter: boolean = false;

  /**
   * The transactions property is an array that holds the list of transactions associated with the user's account. It is initialized as an empty array and is populated with transaction data retrieved from the AccountService when the component initializes. This property is used to display the user's recent transactions in the UI, allowing them to view their transaction history and details. The transactions can be filtered based on categories or other criteria using the filtering options provided in the UI.
   */
  transactions: any[] = [];

  /**
   * The categories property holds the list of transaction categories that can be used for filtering transactions in the user interface. It is initialized with the TRANSACTION_CATEGORIES constant, which contains predefined categories for transactions (e.g., Food, Entertainment, Utilities, etc.). This property is used to populate the category filter options in the UI, allowing users to select a category and filter their transactions accordingly.
   */
  categories = TRANSACTION_CATEGORIES;

  /**
   * The customCategory property is used to store a user-defined category for filtering transactions. It is initialized as an empty string and can be updated based on user input in the UI. This property allows users to create and use custom categories for their transactions, providing more flexibility in how they organize and filter their financial data. When a user enters a custom category, it can be used in conjunction with the selectedCategory property to filter transactions accordingly.
   */
  customCategory: string = '';

  /**
   * The selectedCategory property is used to store the currently selected category for filtering transactions. It is initialized as an empty string and is updated when the user selects a category from the predefined list of categories in the UI. This property works in conjunction with the customCategory property to determine the effective category used for filtering transactions. When a user selects a category, it can be used to filter the transactions displayed in the UI, allowing users to view only those transactions that belong to the selected category.
   */
  selectedCategory: string = '';

  /**
   * The Home component's constructor is responsible for injecting the necessary services and dependencies required for the component to function properly. It takes in the Router service for navigation, the AccountService for fetching account and transaction data, the ChangeDetectorRef for manually triggering change detection when data is updated, and the UtilityService for any utility functions needed within the component. These injected services are essential for handling data retrieval, navigation, and UI updates within the Home component.
   * @param router - The Router service used for navigating to different routes within the application.
   * @param accountService - The AccountService used for fetching account information and transactions from the backend.
   * @param cdr - The ChangeDetectorRef used for manually triggering change detection when data is updated.
   * @param utility - The UtilityService that provides utility functions for use within the component.
   */
  constructor(private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

  /**
   * The ngOnInit method is a lifecycle hook that is called after the component has been initialized. In this method, the component retrieves the userId and accountId from session storage to fetch the default account and its transactions. It uses the AccountService to make API calls to get the default account information and the transactions associated with the account. If any of the API calls fail, it sets appropriate error messages to be displayed in the UI. The method also ensures that change detection is triggered after data is updated to reflect the changes in the UI.
   */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    this.accountService.getDefaultAccount(userId).subscribe({
      next: (account) => {
        this.defaultAccount = account;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No default account set. Please set a default account in your account settings.';
      }
    });

    this.accountService.getAccount(userId, accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Account not found';
        this.cdr.detectChanges();
      }
    });

    this.accountService.getAccountTransactions(userId, accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not load transactions';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Method to navigate to the transaction details page for a specific transaction. This method takes in the transactionId as a parameter and uses the Router service to navigate to the route that displays the details of the selected transaction. The route is constructed using the default account's ID and the transaction ID, allowing users to view detailed information about their transactions when they click on a transaction in the UI.
   * @param transactionId - The ID of the transaction for which to display details.
   */
  openTransaction(transactionId: string) {
    if (!this.defaultAccount) {
      return;
    }
    this.router.navigate(['/accounts', this.defaultAccount._id, 'transactions', transactionId]);
  }

  /**
   * Method to toggle the visibility of the transaction filter options in the user interface. This method updates the showFilter boolean property to show or hide the filter options when the user interacts with the UI (e.g., clicking a "Filter" button). If the filter options are being hidden (i.e., showFilter is set to false), it also resets the selectedCategory and customCategory properties to their default values, ensuring that any previously applied filters are cleared when the filter options are hidden.
   */
  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  /**
   * Getter to determine the effective category for filtering transactions. This getter returns the customCategory if it is set (i.e., not an empty string), otherwise it returns the selectedCategory. This allows the component to use either a user-defined custom category or a predefined selected category for filtering transactions in the UI, providing flexibility in how users can organize and view their transaction data.
   */
  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }

}
