import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for transaction-related operations.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Class representing the TransactionService.
 */
export class TransactionService {

  /**
   * Base URL for transaction operations.
   */
  private baseUrl = 'http://localhost:5000/api/v1.0';

  /**
   * Creates an instance of TransactionService.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetch all transactions for a user's account from the API.
   * @param userId The ID of the user to retrieve transactions for
   * @param accountId The ID of the account to retrieve transactions for
   * @returns An observable containing the list of transactions
   */
  getAllTransactions(userId: string, accountId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`);
  }

  /**
   * Fetch a specific transaction for a user's account from the API.
   * @param userId The ID of the user to retrieve the transaction for
   * @param accountId The ID of the account to retrieve the transaction for
   * @param transactionId The ID of the transaction to retrieve
   * @returns An observable containing the transaction data
   */
  getTransaction(userId: string, accountId: string, transactionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/${transactionId}`);
  }

  /**
   * Fetch a summary of transactions for a user's account from the API, filtered by direction (in or out).
   * @param userId The ID of the user to retrieve the transaction summary for
   * @param accountId The ID of the account to retrieve the transaction summary for
   * @param direction The direction of transactions to summarize ('in' for incoming, 'out' for outgoing)
   * @returns An observable containing the transaction summary data
   */
  getTransactionSummary(userId: string, accountId: string, direction: 'in' | 'out', period?: string) {
    let url = `${this.baseUrl}/users/${userId}/transactions/summary?direction=${direction}`;

    if (period) {
      url += `&period=${period}`;
    }

    if (accountId) {
      url += `&accountId=${accountId}`;
    }

    return this.http.get<any>(url);
  }

  /**
   * Fetch a summary of transactions by category for a user's account from the API, filtered by direction (in or out).
   * @param userId The ID of the user to retrieve the category summary for
   * @param accountId The ID of the account to retrieve the category summary for
   * @param direction The direction of transactions to summarize ('in' for incoming, 'out' for outgoing)
   * @returns An observable containing the category summary data
   */
  getCategorySummary(userId: string, accountId: string, direction: 'in' | 'out', period?: string): Observable<any> {
    let url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/category-summary?direction=${direction}`;

    if (period) {
      url += `&period=${period}`;
    }

    return this.http.get<any>(url);
  }
}
