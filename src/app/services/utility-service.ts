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

  formatTransactionDate(dateString: string): string {
    if (!dateString) return '';

    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return dateString;

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);

    const suffix = day >= 11 && day <= 13 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th';
    const month = new Date(year, monthIndex).toLocaleString('en-GB', { month: 'long' });

    return `${month} ${day}${suffix}`;
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
}
