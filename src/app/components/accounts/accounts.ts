import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { RouterUpgradeInitializer } from '@angular/router/upgrade';

/**
 * Accounts component
 */
@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})

/**
 * Accounts component
 */
export class Accounts implements OnInit {

  /**
   * List of accounts
   */
  accounts_list: any[] = [];

  /**
   * Menu open state
   */
  menuOpen = false;

  stripePromise = loadStripe('pk_test_51SzPZRRbAdc196bvjhyhoH9wDafvymCQLd6FKlIsFfmwpHSEfCpxjunxCa7u8YnfgeYaGNBUvIiCPNvbD9laVluD00XckoBEY6');

  card!: StripeCardElement;
  cardBrand: string = 'card';
  cardComplete: boolean = false;
  accountNumber: string = '';
  maskedAccountNumber: string = '';

  /**
   * Creates an instance of Accounts component.
   * @param accountService Service for account operations.
   * @param cdr Change detector reference.
   * @param router Router for navigation.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef, private router: Router, private http: HttpClient) { }

  /**
   * Initializes the component and loads the list of accounts for the user.
   * @returns void
   */
  async ngOnInit() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.accountService.getAccounts(userId).subscribe({
      next: (accounts) => {
        this.accounts_list = accounts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
      }
    });

    if (userId) {
      this.accountService.getAccounts(userId).subscribe({
        next: (accounts) => {
          if (accounts && accounts.length > 0) {
            this.accountNumber = accounts[0].accountNumber;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Failed to load account number', err);
        }
      });
    }

    const stripe = await this.stripePromise;
    if (!stripe) return;

    const elements = stripe.elements();

    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: 'Inter, system-ui, sans-serif',
          '::placeholder': { color: '#aab7c4' }
        }
      }
    });

    this.card.mount('#card-element');

    this.card.on('change', event => {
      this.cardComplete = event.complete;
      this.cardBrand = event.brand ?? 'card';
    });
  }

  async pay() {
    if (!this.cardComplete) return;

    const stripe = await this.stripePromise;
    if (!stripe) return;

    const res = await firstValueFrom(
      this.http.post<any>(
        'http://localhost:5000/api/v1.0/payments/create-intent',
        { amount: 1000 }
      )
    );

    const result = await stripe?.confirmCardPayment(
      res.clientSecret,
      {
        payment_method: {
          card: this.card
        }
      }
    );

    if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment successful!', result.paymentIntent.id);
    }
  }

  /**
   * Adds a new account for the user.
   * Prompts for account type and currency, then creates the account via the service.
   * @returns void
   */
  addAccount() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    const accountType = prompt('Account type (e.g. Current, Savings):');
    const currency = prompt('Currency (e.g. GBP, USD):');

    if (!accountType || !currency) return;

    const account = { accountType, currency };

    this.accountService.addAccount(userId, account).subscribe({
      next: () => {
        this.accountService.getAccounts(userId).subscribe({
          next: (accounts) => {
            this.accounts_list = accounts;
            this.cdr.detectChanges();
          },
        });
      },
    });
  }

  /**
   * Toggles the menu open state.
   * @returns void
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Navigates to manage accounts page and closes the menu.
   * @returns void
   */
  goToManageAccounts() {
    this.toggleMenu();
    this.router.navigate(['/manage-accounts']);
  }

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '•••• •••• •••• ••••';

    const clean = accountNumber.replace(/\s/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }
}