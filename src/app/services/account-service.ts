import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AccountService {

  private baseUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient) { }

  getAccounts(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts`);
  }

  getAccount(userId: string, accountId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}`);
  }

  addAccount(userId: string, account: { accountType: string, currency: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/${userId}/accounts`, account);
  }

  addBalance(userId: string, accountId: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userId}/accounts/${accountId}`, { amount });
  }


  getAccountTransactions(userId: string, accountId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`);
  }

  addTransaction(userId: string, accountId: string, transaction: { direction: 'in' | 'out', type: string, amount: number, description: string, merchant: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/${userId}/accounts/${accountId}/transactions`, transaction);
  }

  saveAccountOrder(userId: string, order: { accountId: string, order: number }[]) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/order-accounts`, order
    );
  }

  archiveAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}`, {});
  }

  getArchivedAccounts(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/accounts/archived`);
  }

  restoreArchivedAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}/restore`, {});
  }

  setBudget(userId: string, accountId: string, budget: any) {
    return this.http.post(`${this.baseUrl}/users/${userId}/accounts/${accountId}/budget`, budget);
  }

  getAccountByNumber(userId: string, accountNumber: string, sortCode: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/by-number/${accountNumber}?sortCode=${sortCode}`);
  }

  setDefaultAccount(userId: string, accountId: string) {
    return this.http.put(`${this.baseUrl}/users/${userId}/accounts/${accountId}/set-default`, {});
  }

  getDefaultAccount(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/accounts/default`);
  }
}
