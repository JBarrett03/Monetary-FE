import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
import { FilterPipe } from '../../pipes/filter-pipe';
import { TRANSACTION_CATEGORIES } from '../../constants/transaction-categories';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * The AccountDetails component is responsible for displaying the details of a specific account, including its transactions, and providing functionality to manage the account. It retrieves the account information and transactions from the backend API using the AccountService, and allows users to add new transactions, set budgets, and archive the account. The component also includes filtering and sorting options for transactions, as well as error handling for various operations. It uses Angular's reactive programming model to handle asynchronous data retrieval and updates the UI accordingly.
 */
@Component({
  standalone: true,
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe, MatProgressBarModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})

/**
 * The AccountDetails class is the TypeScript component class for the AccountDetails component. It implements the OnInit interface, which means it has a lifecycle hook method called ngOnInit that is called when the component is initialized. The class contains properties to hold the account details, transactions, error messages, filter options, budget information, and menu state. It also has methods to handle various actions such as opening a transaction, adding a transaction, archiving the account, setting it as default, toggling filters and menus, applying sorting options, and submitting budget information. The class interacts with the AccountService to fetch and manipulate account data, and uses ChangeDetectorRef to trigger UI updates when data changes.
 */
export class AccountDetails implements OnInit {

  /**
   * The account property is used to store the details of the specific account being viewed. It is initialized as null and will be populated with the account data retrieved from the backend API when the component is initialized. The account object may contain properties such as accountType, balance, currency, nickname, budget, and other relevant information about the account. This property is essential for displaying the account details in the UI and for performing operations related to the account, such as adding transactions or setting budgets.
   */
  account: any | null = null;

  /**
   * The transactions property is an array that holds the list of transactions associated with the account. It is initialized as an empty array and will be populated with transaction data retrieved from the backend API when the component is initialized. Each transaction object in the array may contain properties such as amount, description, merchant, date, category, and other relevant information about the transaction. This property is crucial for displaying the transaction history of the account in the UI and for allowing users to interact with individual transactions (e.g., viewing details or adding new transactions).
    */
  transactions: any[] = [];

  /**
   * The error property is used to store any error messages that may occur during the retrieval of account details or transactions, or during any operations performed on the account (e.g., adding a transaction, setting a budget). It is initialized as null and will be updated with appropriate error messages if any issues arise while interacting with the backend API or performing actions on the account. This property is important for providing feedback to the user about any problems that may occur and for improving the overall user experience by informing them of issues in a clear and concise manner.
    */
  error: string | null = null;

  /**
   * The showFilter property is a boolean that indicates whether the filter options for transactions are currently visible in the UI. It is used to toggle the display of the filter options when the user clicks on the "Filter" button. When showFilter is true, the filter options are displayed; when it is false, the filter options are hidden. This property allows users to easily access and apply filters to their transaction list, and also provides a way to quickly hide the filter options when they are not needed, keeping the UI clean and organized.
    */
  showFilter: boolean = false;

  /**
   * The categories property holds a list of predefined transaction categories that can be used for filtering transactions or categorizing new transactions. It is initialized with the TRANSACTION_CATEGORIES constant, which is imported from a separate file. This property provides users with a set of common categories to choose from when managing their transactions, making it easier to organize and analyze their spending habits. Users can select from these categories when adding new transactions or applying filters to view specific types of transactions in their account details.
    */
  categories = TRANSACTION_CATEGORIES;

  /**
   * The customCategory property is a string that allows users to enter a custom category for filtering transactions. It is used in conjunction with the selectedCategory property to determine which category filter to apply when the user selects a category from the predefined list or enters a custom category. If the user enters a custom category, this property will hold that value, and the applyFilter method will use it to filter the transactions displayed in the UI. This feature provides flexibility for users to categorize their transactions in a way that best suits their needs, especially if the predefined categories do not cover all possible transaction types they may have.
    */
  customCategory: string = '';

  /**
   * The selectedCategory property is a string that holds the currently selected category for filtering transactions. It is used in conjunction with the showFilter property to determine which category filter to apply when the user selects a category from the predefined list. When a user selects a category, this property is updated with the selected category value, and the applyFilter method uses this value to filter the transactions displayed in the UI. This allows users to easily view transactions that belong to a specific category, helping them analyze their spending patterns and manage their finances more effectively.
    */
  selectedCategory: string = '';

  /**
   * The showBudgetForm property is a boolean that indicates whether the form for setting a budget is currently visible in the UI. It is used to toggle the display of the budget form when the user clicks on the "Set Budget" button. When showBudgetForm is true, the form is displayed; when it is false, the form is hidden. This property allows users to easily access the budget setting functionality when they want to set or update their budget for the account, while keeping the UI clean and organized by hiding the form when it is not needed.
    */
  showBudgetForm: boolean = false;

  /**
   * The budgetAmount property is a number that holds the amount for the budget that the user wants to set for the account. It is used in the submitBudget method to construct the budget object that will be sent to the backend API when the user submits the budget form. This property allows users to specify their desired budget amount, which can help them manage their spending and stay within their financial goals. The value of this property is typically entered by the user in an input field in the UI, and it is important for ensuring that the correct budget amount is applied to the account when setting or updating the budget.
    */
  budgetAmount: number | null = null;

  /**
   * The budgetPeriod property is a string that holds the selected period for the budget that the user wants to set for the account. It is used in the submitBudget method to construct the budget object that will be sent to the backend API when the user submits the budget form. This property allows users to specify the time frame for their budget (e.g., monthly, weekly, custom), which can help them manage their finances more effectively by setting appropriate budget limits based on their spending patterns and financial goals. The value of this property is typically selected by the user from a dropdown or set of options in the UI, and it is important for ensuring that the correct budget period is applied to the account when setting or updating the budget. 
   */
  budgetPeriod: string = '';

  /**
   * The startDate property is a string that holds the start date for a custom budget period when the user selects "custom" as the budget period. It is used in the submitBudget method to construct the budget object that will be sent to the backend API when the user submits the budget form. This property allows users to specify the starting point of their custom budget period, which can help them manage their finances more effectively by setting budget limits based on specific time frames that align with their financial goals and spending habits. The value of this property is typically entered by the user in a date input field in the UI, and it is important for ensuring that the correct start date is applied to the account when setting or updating a custom budget.
    */
  startDate: string = '';

  /**
   * The endDate property is a string that holds the end date for a custom budget period when the user selects "custom" as the budget period. It is used in the submitBudget method to construct the budget object that will be sent to the backend API when the user submits the budget form. This property allows users to specify the ending point of their custom budget period, which can help them manage their finances more effectively by setting budget limits based on specific time frames that align with their financial goals and spending habits. The value of this property is typically entered by the user in a date input field in the UI, and it is important for ensuring that the correct end date is applied to the account when setting or updating a custom budget.
    */
  endDate: string = '';

  /**
   * The accounts_list property is an array that holds the list of accounts associated with the user. It is initialized as an empty array and will be populated with account data retrieved from the backend API when the component is initialized. Each account object in the array may contain properties such as accountType, balance, currency, nickname, and other relevant information about the account. This property is essential for displaying the list of accounts in the UI and for allowing users to interact with their accounts (e.g., viewing details, adding transactions, setting budgets). It serves as a central data structure for managing and displaying the user's accounts within the AccountDetails component.
   */
  accounts_list: any[] = [];

  /**
   * The cardComplete property is a boolean that indicates whether the credit card information form is complete. It is used to enable or disable the submission of the form based on whether all required fields have been filled out correctly. When cardComplete is true, the form can be submitted; when it is false, the form submission is disabled. This property helps ensure that users provide all necessary information before attempting to add or update a credit card, reducing the likelihood of errors and improving the overall user experience.
   */
  cardComplete: boolean = false;

  /**
   * The cardBrand property is a string that holds the brand of the credit card being added or updated. It is used to display the appropriate card brand logo in the UI and may also be used for validation purposes when processing credit card information. This property allows users to easily identify the type of credit card they are working with (e.g., Visa, MasterCard, American Express) and can enhance the visual appeal of the UI by showing the corresponding card brand logo.
   */
  cardBrand: string = '';

  /**
   * The menuOpen property is a boolean that indicates whether the options menu for the account details is currently open in the UI. It is used to toggle the display of the options menu when the user clicks on the menu button (e.g., three dots or "Options" button). When menuOpen is true, the options menu is displayed; when it is false, the options menu is hidden. This property allows users to easily access additional actions and settings related to their account details, such as sorting transactions, managing accounts, or accessing other features, while keeping the UI clean and organized by hiding the options menu when it is not needed.
   */
  menuOpen = false;

  /**
   * The showSortOptions property is a boolean that indicates whether the sorting options for transactions are currently visible in the UI. It is used to toggle the display of the sorting options when the user clicks on the "Sort" button in the options menu. When showSortOptions is true, the sorting options are displayed; when it is false, the sorting options are hidden. This property allows users to easily access and apply sorting to their transaction list, helping them organize their transactions in a way that best suits their needs (e.g., by date, amount, or category), while keeping the UI clean and organized by hiding the sorting options when they are not needed.
    */
  showSortOptions: boolean = false;

  /**
   * The sortOptions property holds the currently selected sorting option for transactions. It can have values such as 'createdAtAsc' for sorting transactions by creation date in ascending order, 'createdAtDesc' for sorting by creation date in descending order, or null if no sorting option is selected. This property is used in the applySort method to determine how to sort the transactions displayed in the UI based on the user's selection. By allowing users to choose their preferred sorting option, this property enhances the usability of the transaction list and helps users find specific transactions more easily.
    */
  sortOptions: 'createdAtAsc' | 'createdAtDesc' | null = null;

  /**
   * The constructor method is responsible for injecting the necessary services and dependencies into the AccountDetails component. It takes in the ActivatedRoute to access route parameters, the Router for navigation, the AccountService to interact with the backend API for account-related operations, the ChangeDetectorRef to trigger UI updates when data changes, and the UtilityService for any utility functions needed within the component. By injecting these services, the constructor allows the component to perform various actions such as fetching account details, managing transactions, navigating between routes, and updating the UI based on user interactions and data changes.
   */
  constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

  /**
   * The ngOnInit method is a lifecycle hook that is called when the component is initialized. It retrieves the userId from session storage and the accountId from the route parameters. If either of these values is missing, it sets an error message and returns early. If both values are present, it stores the accountId in session storage for later use. The method then makes two API calls using the AccountService: one to fetch the account details and another to fetch the transactions associated with the account. For each API call, it subscribes to the observable returned by the service and handles both the success and error cases. On success, it updates the corresponding properties (account or transactions) and triggers change detection to update the UI. On error, it sets an appropriate error message and triggers change detection to display the error in the UI.
    */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account ID';
      return;
    }

    sessionStorage.setItem('accountId', accountId);

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
   * The openTransaction method is responsible for navigating the user to the details page of a specific transaction. It takes in the transactionId as a parameter, retrieves the accountId from the route parameters, and then uses the Router to navigate to the route that corresponds to the transaction details page (e.g., '/accounts/:accountId/transactions/:transactionId'). This allows users to view more detailed information about a specific transaction when they click on it in the transaction list.
    */
  openTransaction(transactionId: string) {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    this.router.navigate(['/accounts', accountId, 'transactions', transactionId]);
  }

  /**
   * The addTransaction method is responsible for adding a new transaction to the account. It first retrieves the userId and accountId from session storage. If either of these values is missing, it returns early. It then prompts the user to enter the description, amount, and merchant for the new transaction. If any of these values are missing, it returns early. The method then constructs a transaction object with the provided information and calls the addTransaction method of the AccountService to send a request to the backend API to create the new transaction. If the API call is successful, it refreshes the account details and transactions by making additional API calls to fetch the updated data. If there is an error during the API call, it sets an appropriate error message and triggers change detection to display the error in the UI.
    */
  addTransaction() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    const description = prompt('Description:');
    const amountInput = prompt('Amount:');
    const merchant = prompt('Merchant:');

    if (!description || !amountInput || !merchant) {
      return;
    }

    const amount = Math.abs(Number(amountInput));

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive number for the amount.');
      return;
    }

    const transaction: {
      direction: 'in' | 'out',
      type: string,
      amount: number,
      description: string,
      merchant: string
    } = {
      direction: 'out',
      type: 'debit',
      amount: amount,
      description,
      merchant
    };

    this.accountService.addTransaction(userId, accountId, transaction).subscribe({
      next: () => {
        this.accountService.getAccount(userId, accountId).subscribe({
          next: (account) => {
            this.account = account;

            this.accountService.getAccountTransactions(userId, accountId).subscribe({
              next: (transactions) => {
                this.transactions = transactions;
                this.cdr.detectChanges();
              }
            })
          }
        })
      },
      error: () => {
        this.error = 'Failed to add transaction';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * The archiveAccount method is responsible for archiving the current account. It first prompts the user with a confirmation dialog to ensure they want to proceed with archiving the account. If the user confirms, it retrieves the userId and accountId from session storage. If either of these values is missing, it sets an error message and returns early. It then calls the archiveAccount method of the AccountService to send a request to the backend API to archive the account. If the API call is successful, it navigates the user back to the accounts list page. If there is an error during the API call, it sets an appropriate error message and triggers change detection to display the error in the UI.
    */
  archiveAccount() {
    const confirmArchive = confirm('Are you sure you want to archive this account?');
    if (!confirmArchive) {
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account';
      return;
    }

    this.accountService.archiveAccount(userId, accountId).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: () => {
        this.error = 'Failed to archive account';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * The setAsDefault method is responsible for setting the current account as the default account for the user. It retrieves the userId and accountId from session storage. If either of these values is missing, it returns early. It then updates the local account object to set its isDefault property to true, which allows the UI to reflect the change immediately. The method then calls the setDefaultAccount method of the AccountService to send a request to the backend API to update the default account for the user. If there is an error during the API call, it sets an appropriate error message and triggers change detection to display the error in the UI. This method allows users to easily designate a specific account as their default account, which can be useful for quickly accessing it or for setting it as the primary account for transactions.
    */
  setAsDefault() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    this.account.isDefault = true;

    this.accountService.setDefaultAccount(userId, accountId).subscribe({
      next: () => {
        // already updated locally
      },
      error: () => {
        this.error = 'Failed to set default account';
      }
    })
  }

  /**
   * The toggleFilter method is responsible for toggling the visibility of the filter options for transactions. When this method is called (e.g., when the user clicks a "Filter" button), it updates the showFilter boolean property to either show or hide the filter options. If the filter options are being hidden, it also resets the selectedCategory and customCategory properties to clear any applied filters. This allows users to easily access and apply filters to their transaction list, and also provides a way to quickly clear filters and return to viewing all transactions.
    */
  toggleFilter() {
    this.showFilter = !this.showFilter;

    if (!this.showFilter) {
      this.selectedCategory = '';
      this.customCategory = '';
    }
  }

  /**
   * The effectiveCategory getter is a computed property that returns the effective category filter to be applied to the transactions list. It checks if a custom category has been entered by the user (customCategory) and returns it if it exists; otherwise, it returns the selected category (selectedCategory). This allows the component to determine which category filter to apply when filtering the transactions list, giving priority to the custom category if it is provided by the user. This getter is used in the applyFilter method to determine which category to use for filtering the transactions displayed in the UI.
    */
  get effectiveCategory(): string {
    return this.customCategory || this.selectedCategory;
  }

  /**
   * The addBudget method is responsible for toggling the visibility of the budget form. When this method is called (e.g., when the user clicks an "Add Budget" button), it updates the showBudgetForm boolean property to either show or hide the budget form. This allows users to easily access and manage their budget settings. When the form is shown, users can enter their desired budget amount and period, and when the form is hidden, it keeps the UI clean and organized by hiding the budget settings when they are not needed.
    */
  addBudget() {
    this.showBudgetForm = !this.showBudgetForm;
  }

  /**
   * The selectBudgetPeriod method is responsible for updating the budgetPeriod property based on the user's selection. When a user selects a budget period (e.g., monthly, weekly, custom) from the UI, this method is called with the selected period as an argument. It then updates the budgetPeriod property with the selected value, which is used in the submitBudget method to construct the budget object that will be sent to the backend API when the user submits the budget form. This method allows users to specify the time frame for their budget, helping them manage their finances more effectively by setting appropriate budget limits based on their spending patterns and financial goals.
    */
  selectBudgetPeriod(period: string) {
    this.budgetPeriod = period;
  }

  /**
   * The submitBudget method is responsible for submitting the budget information entered by the user to the backend API. It first retrieves the userId and accountId from session storage. If either of these values is missing, it sets an error message and returns early. It then constructs a budget object with the amount, period, and optional start and end dates (if the period is custom) based on the user's input. The method calls the setBudget method of the AccountService to send a request to the backend API to set the budget for the account. If the API call is successful, it hides the budget form, resets the budget input fields, and refreshes the account details to reflect the updated budget information. If there is an error during the API call, it sets an appropriate error message and triggers change detection to display the error in the UI. This method allows users to easily set or update their budget for the account, helping them manage their spending and stay within their financial goals.
    */
  submitBudget() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      this.error = 'Invalid user or account';
      return;
    }

    const budget = {
      amount: this.budgetAmount,
      period: this.budgetPeriod,
      startDate: this.budgetPeriod === 'custom' ? this.startDate : null,
      endDate: this.budgetPeriod === 'custom' ? this.endDate : null
    };

    this.accountService.setBudget(userId, accountId, budget).subscribe({
      next: () => {
        this.showBudgetForm = false;
        this.budgetAmount = null;
        this.startDate = '';
        this.endDate = '';

        this.accountService.getAccount(userId, accountId).subscribe(account => {
          this.account = account;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.error = 'Failed to set budget';
      }
    });
  }

  /**
   * The budgetProgress getter is a computed property that calculates the percentage of the budget remaining based on the account's budget and the amount spent. It checks if the account has a budget amount defined; if not, it returns 0. If a budget amount exists, it calculates the remaining percentage by dividing the account balance (which represents spending) by the total budget amount (account.budget.amount) and multiplying by 100 to get a percentage value. The method also ensures that the returned percentage does not exceed 100% by using Math.min. This getter is used to display a progress bar or similar UI element to visually represent how much of the budget remains, helping users understand their spending in relation to their set budget.
    */
  get budgetProgress(): number {
    if (!this.account?.budget?.amount) return 0;

    const spent = this.account.balance || 0;
    const budgetAmount = this.account.budget.amount;

    const percentage = (spent / budgetAmount) * 100;
    return Math.min(percentage, 100);
  }

  /**
   * The isBudgetExceeded getter is a computed property that checks if the account's current balance exceeds the defined budget amount. It first checks if the account has a budget amount defined; if not, it returns false, indicating that the budget is not exceeded. If a budget amount exists, it compares the account's balance (or 0 if balance is undefined) to the budget amount. If the balance exceeds the budget amount, it returns true, indicating that the budget has been exceeded; otherwise, it returns false. This getter can be used to display warnings or alerts in the UI when users have exceeded their set budget, helping them manage their finances more effectively.
    */
  get isBudgetExceeded(): boolean {
    if (!this.account?.budget?.amount) return false;
    return (this.account.balance || 0) > this.account.budget.amount;
  }

  /**
   * The closeBudgetForm method is responsible for hiding the budget form in the UI. When this method is called (e.g., when the user clicks a "Cancel" button in the budget form), it sets the showBudgetForm boolean property to false, which hides the form from view. This allows users to easily exit the budget setting process without making any changes, keeping the UI clean and organized when the budget form is not needed.
   */
  closeBudgetForm() {
    this.showBudgetForm = false;
  }

  /**
   * The toggleMenu method is responsible for toggling the visibility of the options menu for the account details. When this method is called (e.g., when the user clicks on the menu button), it updates the menuOpen boolean property to either show or hide the options menu. This allows users to easily access additional actions and settings related to their account details, such as sorting transactions, managing accounts, or accessing other features, while keeping the UI clean and organized by hiding the options menu when it is not needed.
    */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * The toggleSortOptions method is responsible for toggling the visibility of the sorting options for transactions in the options menu. When this method is called (e.g., when the user clicks on the "Sort" button in the options menu), it updates the showSortOptions boolean property to either show or hide the sorting options. This allows users to easily access and apply sorting to their transaction list, helping them organize their transactions in a way that best suits their needs (e.g., by date, amount, or category), while keeping the UI clean and organized by hiding the sorting options when they are not needed.
    */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  /**
   * The applySort method is responsible for applying the selected sorting option to the transactions list. It takes in the selected sorting option as a parameter (e.g., 'createdAtAsc' for sorting by creation date in ascending order, 'createdAtDesc' for sorting by creation date in descending order) and updates the sortOptions property with the selected option. The method then uses a switch statement to determine how to sort the transactions based on the selected option. It creates a new sorted array of transactions using the JavaScript array sort method, comparing the createdAt timestamps of the transactions to sort them accordingly. After sorting the transactions, it triggers change detection to update the UI with the newly sorted transaction list.
    */
  applySort(option: 'createdAtAsc' | 'createdAtDesc') {
    this.sortOptions = option;

    switch (option) {
      case 'createdAtAsc':
        this.transactions = [...this.transactions].sort(
          (a, b) => this.utility.toTime(a.createdAt) - this.utility.toTime(b.createdAt)
        );
        break;

      case 'createdAtDesc':
        this.transactions = [...this.transactions].sort(
          (a, b) => this.utility.toTime(b.createdAt) - this.utility.toTime(a.createdAt)
        );
        break;
    }
    this.cdr.detectChanges();
  }
}