import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for account-related operations.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Class representing the AccountService.
 */
export class AccountService {

  /**
   * API URL for account operations.
   */
  private baseUrl = 'http://localhost:5000/api/v1.0';

  /**
   * Creates an instance of AccountService.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetch a list of accounts for a user from the API.
   * @param userId The ID of the user to retrieve accounts for
   * @returns An observable containing the list of accounts
   */
  getAccounts(userId: string): Observable<any[]> {
    const url = `${this.baseUrl}/users/${userId}/accounts`;
    return this.http.get<any[]>(url)
  }

  /**
   * Fetch a specific account for a user from the API.
   * @param userId The ID of the user to retrieve the account for
   * @param accountId The ID of the account to retrieve
   * @returns An observable containing the account data
   */
  getAccount(userId: string, accountId: string): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}`;
    return this.http.get<any>(url);
  }

  /**
   * Add a new account for a user via the API.
   * @param userId The ID of the user to add the account for
   * @param account The account data to be added
   * @returns An observable containing the HTTP response
   */
  addAccount(userId: string, account: { accountType: string, currency: string }): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/accounts`;

    const formData = new FormData();
    formData.append('accountType', account.accountType);
    formData.append('currency', account.currency);

    return this.http.post<any>(url, formData);
  }

  /**
   * Add balance to a specific account of a user via the API.
   * @param userId The ID of the user to add balance for
   * @param accountId The ID of the account to add balance to
   * @param amount The amount to be added to the account balance
   * @returns An observable containing the HTTP response
   */
  addBalance(userId: string, accountId: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}`;

    const formData = new FormData();
    formData.append('amount', amount.toString());

    return this.http.post<{ balance: number }>(url, formData);
  }


  /**
   * Fetch transactions for a specific account of a user from the API.
   * @param userId The ID of the user to retrieve transactions for
   * @param accountId The ID of the account to retrieve transactions for
   * @returns An observable containing the list of transactions
   */
  getAccountTransactions(userId: string, accountId: string): Observable<any[]> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`;
    return this.http.get<any[]>(url);
  }

  /**
   * Add a new transaction for a specific account of a user via the API.
  * @param userId The ID of the user to add the transaction for
  * @param accountId The ID of the account to add the transaction for
  * @param transaction The transaction data to be added
  * @returns An observable containing the HTTP response
  */
  addTransaction(userId: string, accountId: string, transaction: { type: string, amount: number, description: string, merchant: string, category: string }): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`;

    const formData = new FormData();
    formData.append('type', transaction.type);
    formData.append('amount', transaction.amount.toString());
    formData.append('description', transaction.description);
    formData.append('merchant', transaction.merchant);
    formData.append('category', transaction.category);

    return this.http.post<any>(url, formData);
  }

  /**
   * Save the order of accounts for a user via the API.
   * @param userId The ID of the user to save the account order for
   * @param order An array representing the new order of accounts
   * @returns An observable containing the HTTP response
   */
  saveAccountOrder(userId: string, order: { accountId: string, order: number }[]) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/order-accounts`, order
    );
  }

  /**
   * Archive a specific account of a user via the API.
   * @param userId The ID of the user to archive the account for
   * @param accountId The ID of the account to be archived
   * @returns An observable containing the HTTP response
   */
  archiveAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}`, {});
  }

  /**
   * Fetch archived accounts for a user from the API.
   * @param userId The ID of the user to retrieve archived accounts for
   * @returns An observable containing the list of archived accounts
   */
  getArchivedAccounts(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/archived`);
  }

}
