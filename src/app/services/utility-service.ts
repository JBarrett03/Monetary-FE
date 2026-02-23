import { Injectable } from '@angular/core';
import { TRANSACTION_CATEGORY_META } from '../constants/transaction-categories';

/**
 * UtilityService provides common formatting and helper methods used across multiple components.
 * Centralizes reusable utility functions to reduce code duplication.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * The UtilityService class contains methods for formatting account numbers, sort codes, transaction dates,
 * and handling numeric input. It also provides a method to retrieve metadata for transaction categories.
 * This service is designed to be injected into components that require these utility functions.
 */
export class UtilityService {
  
  /**
   * Masks an account number for secure display, showing only the last 4 digits.
   * @param accountNumber The account number to mask
   * @returns A masked account number string in the format •••• •••• •••• 1234
   */
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '•••• •••• •••• ••••';
    if (accountNumber.length < 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  }

  /**
   * Formats a sort code by adding dashes for better readability.
   * Input: "123456" → Output: "12-34-56"
   * @param sortCode The sort code to format
   * @returns The formatted sort code string
   */
  formatSortCode(sortCode: string): string {
    if (!sortCode) return '';

    const digits = sortCode.replace(/\D/g, '').slice(0, 6);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '-' + digits.slice(2);

    return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4);
  }

  /**
   * Formats a transaction date into a human-readable format with ordinal day suffix.
   * Example: "2025-02-12" → "February 12th"
   * @param dateString The date string to format (ISO 8601 format: YYYY-MM-DD hh:mm:ss)
   * @returns The formatted date string with month name and day with ordinal suffix
   */
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

  /**
   * Converts a date string to milliseconds (timestamp), with error handling.
   * Used for date comparisons in sorting operations.
   * @param value The date string to convert (handles ISO 8601 format with or without Z)
   * @returns The timestamp in milliseconds, or 0 if the value is invalid/null
   */
  toTime(value?: string): number {
    if (!value) return 0;
    const normalized = value.replace(/Z$/, '');
    const time = new Date(normalized).getTime();
    return isNaN(time) ? 0 : time;
  }

  /**
   * Formats an account number by grouping digits into blocks of four.
   * @param accountNumber The account number to format
   * @returns The formatted account number string
   */
  formatAccountNumber(accountNumber?: string | null): string {
    if (!accountNumber) return '';
    const digits = accountNumber.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  /**
   * Allows only numeric input for keydown events.
   * @param event The keydown event
   */
  numbersOnly(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (allowedKeys.includes(event.key) || /^[0-9]$/.test(event.key)) {
      return;
    }
    event.preventDefault();
  }

  /**
   * Retrieves the metadata (icon and color) for a given transaction category.
   * @param category The transaction category to look up
   * @returns An object containing the icon class and color associated with the category
   */
  getCategoryMeta(category: string): { icon: string; color: string } {
    return TRANSACTION_CATEGORY_META[category as keyof typeof TRANSACTION_CATEGORY_META] || { icon: 'fa-question-circle', color: '#9E9E9E' };
  }
}
