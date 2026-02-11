import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../services/account-service';
/**
 * Payments component - placeholder for payment processing features.
 * This component is intended for handling user payments, transfers, and payment history.
 * Currently serves as a foundation for future development.
 */
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})

/**
 * Payments class - the component logic for the payments page.
 * To be implemented with payment processing and transfer features.
 */
export class Payments implements OnInit {

  stripePromise = loadStripe('pk_test_51SzPZRRbAdc196bvjhyhoH9wDafvymCQLd6FKlIsFfmwpHSEfCpxjunxCa7u8YnfgeYaGNBUvIiCPNvbD9laVluD00XckoBEY6');

  card!: StripeCardElement;
  cardBrand: string = 'card';
  cardComplete: boolean = false;
  accountNumber: string = '';

  constructor(private http: HttpClient, private router: Router, private accountService: AccountService) { }

  async ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.accountService.getAccounts(userId).subscribe({
        next: (accounts) => {
          if (accounts && accounts.length > 0) {
            this.accountNumber = accounts[0].accountNumber;
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
   * Navigates to the accounts page.
   * @returns void
   */
  goToAccounts() {
    this.router.navigate(['/accounts']);
  }

  get maskedAccountNumber(): string {
    if (!this.accountNumber) {
      return '•••• •••• •••• ••••';
    }

    const cleanNumber = this.accountNumber.replace(/\s/g, '');
    const last4 = cleanNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }
}
