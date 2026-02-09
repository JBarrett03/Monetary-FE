import { Pipe, PipeTransform } from '@angular/core';

/**
 * FilterPipe is an Angular pipe that filters an array of transactions based on a search category.
 * It transforms the input array by returning only those transactions whose category includes the search term.
 */
@Pipe({
  name: 'filter',
  standalone: true
})

/**
 * The FilterPipe class implements the PipeTransform interface and defines the transform method.
 * The transform method takes an array of transactions and a search category as input, and returns a filtered array of transactions.
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