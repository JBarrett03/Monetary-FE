import { Pipe, PipeTransform } from '@angular/core';

/**
 * FilterPipe is an Angular pipe that filters an array of transactions based on a search term.
 * It performs a case-insensitive partial match on the transaction category field.
 * If no search term is provided, returns all transactions unfiltered.
 */
@Pipe({
  name: 'filter',
  standalone: true
})

/**
 * The FilterPipe class implements the PipeTransform interface.
 * The transform method takes an array of transactions and a search term, returning only transactions
 * whose category contains the search term (case-insensitive).
 */
export class FilterPipe implements PipeTransform {
  transform(transactions: any[], searchCategory: string): any[] {
    if (!transactions || !searchCategory) {
      return transactions;
    }

    const searchTerm = searchCategory.toLowerCase().trim();

    return transactions.filter(transaction =>
      transaction.category?.toLowerCase().includes(searchTerm)
    );
  }
}