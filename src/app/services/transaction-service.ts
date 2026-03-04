import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {

  private baseUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient) { }

  getAllTransactions(userId: string, accountId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`);
  }

  getTransaction(userId: string, accountId: string, transactionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/${transactionId}`);
  }

  getTransactionSummary(userId: string, direction: 'in' | 'out', period?: string) {
    let url = `${this.baseUrl}/users/${userId}/transactions/summary?direction=${direction}`;

    if (period) {
      url += `&period=${period}`;
    }

    return this.http.get<any>(url);
  }

  getAccountTransactionSummary(userId: string, accountId: string, direction: 'in' | 'out', period?: string) {
    let url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/summary?direction=${direction}`;
    if (period) {
      url += `&period=${period}`;
    }

    return this.http.get<any>(url);
  }

  getCategorySummary(userId: string, accountId: string, direction: 'in' | 'out', period?: string): Observable<any> {
    let url = `${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions/category-summary?direction=${direction}`;

    if (period) {
      url += `&period=${period}`;
    }

    return this.http.get<any>(url);
  }

  getRecentTransactions(userId: string, limit: number) {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/transactions/recent?limit=${limit}`);
  }
}
