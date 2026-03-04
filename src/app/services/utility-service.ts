import { Injectable } from '@angular/core';
import { TRANSACTION_CATEGORY_META } from '../constants/transaction-categories';

@Injectable({
  providedIn: 'root',
})

export class UtilityService {

  account: any | null = null;

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '•••• •••• •••• ••••';
    if (accountNumber.length < 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  }

  formatSortCode(sortCode: string): string {
    if (!sortCode) return '';

    const digits = sortCode.replace(/\D/g, '').slice(0, 6);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '-' + digits.slice(2);

    return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4);
  }

  toTime(value?: string): number {
    if (!value) return 0;
    const normalized = value.replace(/Z$/, '');
    const time = new Date(normalized).getTime();
    return isNaN(time) ? 0 : time;
  }

  formatAccountNumber(accountNumber?: string | null): string {
    if (!accountNumber) return '';
    const digits = accountNumber.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  numbersOnly(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (allowedKeys.includes(event.key) || /^[0-9]$/.test(event.key)) {
      return;
    }
    event.preventDefault();
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  getAccountId(): string | null {
    return sessionStorage.getItem('accountId');
  }

  getTotalBudget(accounts: any[]): number {
    return accounts
      .filter(a => a?.budget?.amount)
      .reduce((sum, a) => sum + Number(a.budget.amount || 0), 0);
  }

  calculateRemaining(spent: number, budget: number): { remaining: number; percentage: number } {
    return {
      remaining: Math.max(budget - spent, 0),
      percentage: budget > 0 ? Math.round((Math.max(budget - spent, 0) / budget) * 100) : 0
    };
  }

  getCategoryMeta(category: string): { icon: string; color: string } {
    return TRANSACTION_CATEGORY_META[category as keyof typeof TRANSACTION_CATEGORY_META] || { icon: 'fa-question-circle', color: '#9E9E9E' };
  }

  checkSavingsProgress(account: any): number | void {
    if (!account?.budget?.amount) return;

    const goal = account.budget.amount;
    const currentBalance = account.balance || 0;
    const percent = Math.floor((currentBalance / goal) * 100);
    const milestones = [25, 50, 75, 90, 100];
    const storageKey = `milestones_${account._id}`;
    const reached = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const reachedMilestones = milestones.find(m => percent >= m && !reached.includes(m));

    if (!reachedMilestones) return;

    reached.push(reachedMilestones);
    localStorage.setItem(storageKey, JSON.stringify(reached));

    return reachedMilestones;
  }

  getTransactionDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
          day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  }

  getTransactionTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
