import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { ChangeDetectorRef } from '@angular/core';
/**
 * Payments component - placeholder for payment processing features.
 * This component is intended for handling user payments, transfers, and payment history.
 * Currently serves as a foundation for future development.
 */
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})

export class Payments implements OnInit {

  /**
   * Constructor for Payments component. Currently does not perform any initialization. 
  */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef) { }

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
 * The amount entered by the user to add to their account balance.
 * This should be a positive number. Initially set to null until the user inputs a value.
 */
  amountToAdd: number | null = null;

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
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getAccountByNumber(userId, this.confirmAccountNumber).subscribe({
      next: (account) => {
        const payeeAccountId = account._id;
        this.accountService.addBalance(userId, payeeAccountId, this.amountToAdd!).subscribe({
          next: () => {
            this.showAddBalanceForm = false;
            this.confirmAccountNumber = '';
            this.amountToAdd = null;
            this.error = null;
          },
          error: () => {
            this.error = 'Failed to add balance';
          }
        });
      },
      error: () => {
        this.error = 'Account number not found';
      }
    });
  }
}
