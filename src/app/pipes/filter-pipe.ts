import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})

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