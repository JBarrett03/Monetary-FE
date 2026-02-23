import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
/**
 * Payments component - handles balance transfers between user accounts.
 * Allows users to search for recipient accounts by account number and sort code,
 * transfer balance between accounts, and maintains a history of recent payees.
 * Includes form validation and error handling for transfer operations.
 */
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})

/**
 * Component logic for balance transfer operations.
 * Manages form state, account lookups, transfers, and recent payee tracking.
 */
export class Payments implements OnInit {

  /**
   * Constructor for Payments component.
   * @param accountService Service for account operations and balance transfers
   * @param cdr ChangeDetectorRef for manual change detection after async operations
   * @param utility UtilityService for shared utility methods
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, public utility: UtilityService) { }

  /**
 * The account object containing account information such as balance, account number,
 * currency, and account type (e.g., 'savings', 'checking'). Null until account data is loaded.
 */
  account: any | null = null;

  /**
 * Error message displayed to the user when operations fail or data cannot be loaded.
 * Null when no error is present.
 */
  error: string | null = null;

  /**
   * Boolean flag indicating whether the form for adding balance to the account is currently visible.
   * Initially set to false, meaning the form is hidden until the user chooses to open it.
   */
  showAddBalanceForm: boolean = false;

  /**
 * The account number entered by the user to confirm their identity before adding balance.
 * This should match the actual account number of the user's account for validation to succeed.
 * Initially set to an empty string until the user inputs a value.
 */
  confirmAccountNumber: string = '';

  /**
 * The sort code entered by the user to confirm their identity before adding balance.
 * This should match the actual sort code of the user's account for validation to succeed.
 * Initially set to an empty string until the user inputs a value.
 */
  confirmSortCode: string = '';

  /**
 * The amount entered by the user to add to their account balance.
 * This should be a positive number. Initially set to null until the user inputs a value.
 */
  amountToAdd: number | null = null;

  /**
   * List of recent payees for the user. This can be used to display a history of recent transactions or frequent transfer recipients.
   * Initially set to an empty array until data is loaded from the API.
   */
  recentPayees: any[] = [];

  /**
 * Lifecycle hook that is called after the component has been initialized. It retrieves the user ID and account ID from session storage,
 * then uses the AccountService to fetch the account details. If successful, it stores the account information in the component's state.
 * If either the user ID or account ID is missing, it simply returns without attempting to fetch data.
 */
  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    const storedPayees = localStorage.getItem(`recentPayees_${userId}`);
    if (storedPayees) {
      this.recentPayees = JSON.parse(storedPayees).slice(0, 3);
    }

    this.accountService.getAccount(userId, accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.cdr.detectChanges();
      }
    });
  }

  /**
 * Opens the form for adding balance to the user's account. Resets the confirmation account number and amount to add fields to their default states.
 */
  openBalanceForm() {
    this.showAddBalanceForm = true;
  }

  /**
 * Closes the form for adding balance to the user's account. Hides the form without making any changes to the account or input fields.
 */
  closeBalanceForm() {
    this.showAddBalanceForm = false;
  }

  /**
 * Adds balance to the user's account after validating the input. Checks if the user and account IDs are present,
 * verifies that the confirmed account number matches the actual account number, and ensures that the amount to add is valid.
 * If validation passes, it calls the AccountService to add the balance and updates the account information on success. Displays error messages for any validation or operation failures.
 */
  addBalance() {
    console.log("Add balance clicked")
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    if (!this.confirmAccountNumber || !this.confirmSortCode || !(this.amountToAdd && this.amountToAdd > 0)) {
      this.error = 'Please enter a valid account number, sort code, and amount';
      this.cdr.detectChanges();
      return;
    }

    const cleanAccountNumber = this.confirmAccountNumber.replace(/\s/g, '');
    const cleanSortCode = this.confirmSortCode.replace(/-/g, '');

    console.log("Before")
    this.accountService.getAccountByNumber(userId, cleanAccountNumber, cleanSortCode).subscribe({
      next: (account) => {
        console.log("AFter")
        const payeeAccountId = account._id;

        this.accountService.addBalance(userId, payeeAccountId, this.amountToAdd!).subscribe({
          next: () => {
            console.log("Inside add balance success")
            this.accountService.getAccount(userId, accountId).subscribe(updatedAccount => {
              this.account = updatedAccount;
              this.cdr.detectChanges();
            });

            const exists = this.recentPayees.find(p => p._id === payeeAccountId);

            if (!exists) {
              this.recentPayees.unshift(account);
            }

            this.recentPayees.unshift(account);
            this.recentPayees = this.recentPayees.slice(0, 3);

            localStorage.setItem(`recentPayees_${userId}`, JSON.stringify(this.recentPayees));

            this.showAddBalanceForm = false;
            this.confirmAccountNumber = '';
            this.confirmSortCode = '';
            this.amountToAdd = null;
            this.error = null;
            this.cdr.detectChanges();

            console.log("Updated account:", payeeAccountId);
            console.log("Currently viewed account:", accountId);
          },
          error: () => {
            this.error = 'Account number not found';
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Account number not found';
        this.cdr.detectChanges();
      }
    });
  }

}
