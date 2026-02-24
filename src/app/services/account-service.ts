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
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts`);
  }

  /**
   * Fetch a specific account for a user from the API.
   * @param userId The ID of the user to retrieve the account for
   * @param accountId The ID of the account to retrieve
   * @returns An observable containing the account data
   */
  getAccount(userId: string, accountId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}`);
  }

  /**
   * Add a new account for a user via the API.
   * @param userId The ID of the user to add the account for
   * @param account The account data to be added
   * @returns An observable containing the HTTP response
   */
  addAccount(userId: string, account: { accountType: string, currency: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/${userId}/accounts`, account);
  }

  /**
   * Add balance to a specific account of a user via the API.
   * @param userId The ID of the user to add balance for
   * @param accountId The ID of the account to add balance to
   * @param amount The amount to be added to the account balance
   * @returns An observable containing the HTTP response
   */
  addBalance(userId: string, accountId: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userId}/accounts/${accountId}`, { amount });
  }


  /**
   * Fetch transactions for a specific account of a user from the API.
   * @param userId The ID of the user to retrieve transactions for
   * @param accountId The ID of the account to retrieve transactions for
   * @returns An observable containing the list of transactions
   */
  getAccountTransactions(userId: string, accountId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`);
  }

  /**
   * Add a new transaction for a specific account of a user via the API.
  * @param userId The ID of the user to add the transaction for
  * @param accountId The ID of the account to add the transaction for
  * @param transaction The transaction data to be added
  * @returns An observable containing the HTTP response
  */
  addTransaction(userId: string, accountId: string, transaction: { direction: 'in' | 'out', type: string, amount: number, description: string, merchant: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`, transaction);
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

  /**
   * Restore an archived account for a user via the API.
   * @param userId The ID of the user to restore the account for
   * @param accountId The ID of the account to be restored
   * @returns An observable containing the HTTP response
   */
  restoreArchivedAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}/restore`, {});
  }

  /**
   * Set the budget for a specific account of a user via the API.
   * @param userId The ID of the user to set the budget for
   * @param accountId The ID of the account to set the budget for
   * @param budget The budget data to be set for the account
   * @return An observable containing the HTTP response
   */
  setBudget(userId: string, accountId: string, budget: any) {
    return this.http.post(`${this.baseUrl}/users/${userId}/accounts/${accountId}/budget`, budget);
  }

  /**
   * Fetch an account by its account number from the API.
   * @param userId The ID of the user to retrieve the account for
   * @param accountNumber The account number to retrieve the account for
   * @param sortCode The sort code to retrieve the account for
   * @returns An observable containing the account data
   */
  getAccountByNumber(userId: string, accountNumber: string, sortCode: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/by-number/${accountNumber}?sortCode=${sortCode}`);
  }

  /**
   * Set a specific account as the default account for a user via the API.
   * @param userId The ID of the user to set the default account for
   * @param accountId The ID of the account to be set as default
   * @returns An observable containing the HTTP response
   */
  setDefaultAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}/set-default`, {});
  }

  /**
   * Fetch the default account for a user from the API.
   * @param userId The ID of the user to retrieve the default account for
   * @returns An observable containing the default account data
   */
  getDefaultAccount(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/default`);
  }
}
