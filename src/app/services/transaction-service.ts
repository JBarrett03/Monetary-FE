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
  constructor(private http: HttpClient) {}

  getAllTransactions(userId: string, accountId: string):Observable<any[]> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`;
    return this.http.get<any[]>(url);
  }

  /**
   * Fetch a specific transaction for a user's account from the API.
   * @param userId The ID of the user to retrieve the transaction for
   * @param accountId The ID of the account to retrieve the transaction for
   * @param transactionId The ID of the transaction to retrieve
   * @returns An observable containing the transaction data
   */
  getTransaction(userId: string, accountId: string, transactionId: string): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/${transactionId}`;
    return this.http.get<any>(url);
  }
  
}
