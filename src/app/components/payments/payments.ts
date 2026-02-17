import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
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
      this.recentPayees = JSON.parse(storedPayees);
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
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    if (!this.confirmAccountNumber || !this.confirmSortCode || !this.amountToAdd || this.amountToAdd <= 0) {
      this.error = 'Please enter a valid account number, sort code, and amount';
      this.cdr.detectChanges();
      return;
    }

    this.accountService.getAccountByNumber(userId, this.confirmAccountNumber, this.confirmSortCode).subscribe({
      next: (account) => {
        const payeeAccountId = account._id;

        this.accountService.addBalance(userId, payeeAccountId, this.amountToAdd!).subscribe({
          next: () => {
            this.accountService.getAccount(userId, accountId).subscribe(updatedAccount => {
              this.account = updatedAccount;
              this.cdr.detectChanges();
            });

            const exists = this.recentPayees.find(p => p._id === payeeAccountId);

            if (!exists) {
              this.recentPayees.unshift(account);
            }

            if (this.recentPayees.length > 5) {
              this.recentPayees.pop();
            }

            localStorage.setItem(`recentPayees_${userId}`, JSON.stringify(this.recentPayees));

            this.showAddBalanceForm = false;
            this.confirmAccountNumber = '';
            this.confirmSortCode = '';
            this.amountToAdd = null;
            this.error = null;
            this.cdr.detectChanges();
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

  /**
   * Formats the confirmAccountNumber input by removing spaces and inserting dashes every 4 characters for better readability.
   * This method is called on every input event for the confirmAccountNumber field to ensure consistent formatting as the user types.
   */
  formatAccountNumber() {
    if (!this.confirmAccountNumber) {
      return;
    }

    let digits = this.confirmAccountNumber.replace(/\D/g, '');
    digits = digits.slice(0, 16);

    let formatted = '';

    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += digits[i];
    }

    this.confirmAccountNumber = formatted;
  }

  /**
   * Formats the confirmSortCode input by removing non-digit characters and inserting dashes every 2 characters for better readability.
   * This method is called on every input event for the confirmSortCode field to ensure consistent formatting as the user types.
   */
  formatSortCode() {
    if (!this.confirmSortCode) {
      return;
    }

    let digits = this.confirmSortCode.replace(/\D/g, '');
    digits = digits.slice(0, 6);

    let formatted = '';

    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 2 === 0) {
        formatted += '-';
      }
      formatted += digits[i];
    }

    this.confirmSortCode = formatted;
  }

  numbersOnly(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (allowedKeys.includes(event.key) || /^[0-9]$/.test(event.key)) {
      return;
    }

    event.preventDefault();
  }
}
