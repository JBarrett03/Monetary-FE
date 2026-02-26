import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { Pie } from '../charts/pie/pie';
import { HorizontalBar } from '../charts/horizontal-bar/horizontal-bar';
import { MatSelectModule } from '@angular/material/select';
import { Line } from '../charts/line/line';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, Pie, HorizontalBar, Line, MatSelectModule],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})
export class Spending {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  activeView: 'savings' | 'spent' | null = null;
  primaryValue = 0;
  remainingValue = 0;
  remainingPercentage = 0;

  period_list = ['Last Week', 'Last Month', 'Last Year', 'Custom'];
  selectedPeriod: string = 'Last Week';

  chart_type_list = ['Pie', 'Bar', 'Line'];
  selectedChartType: 'Pie' | 'Bar' | 'Line' | null = null;

  categoryData: { name: string; value: number }[] = [];
  accountAnalytics: {
    accountId: string;
    accountName: string;
    primaryValue: number;
    remainingValue: number;
    categoryData: { name: string; value: number }[];
    remainingPercentage: number;
  }[] = [];

  constructor(private accountService: AccountService, private transactionService: TransactionService) { }

  generatePDF(): void {
    if (!this.chartContainer?.nativeElement) return;

    setTimeout(() => {
      const options = {
        margin: 10,
        filename: 'spending_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pageBreak: { mode: ['css', 'legacy'] }
      };
      (html2pdf as any)().set(options).from(this.chartContainer.nativeElement).save();
    }, 500);
  }

  showSavings(): void {
    this.activeView = 'savings';
    this.resetChartFilters();
    this.loadSavingsChart();
    this.loadChartPerAccount();
  }

  showSpent(): void {
    this.activeView = 'spent';
    this.resetChartFilters();
    this.loadSpendingChart();
    this.loadChartPerAccount();
  }

  closeView(): void {
    this.activeView = null;
  }

  private getTotalBudget(accounts: any[]): number {
    return accounts
      .filter(a => a?.budget?.amount)
      .reduce((sum, a) => sum + Number(a.budget.amount || 0), 0);
  }

  private calculateRemaining(spent: number, budget: number): { remaining: number; percentage: number } {
    return {
      remaining: Math.max(budget - spent, 0),
      percentage: budget > 0 ? Math.round((Math.max(budget - spent, 0) / budget) * 100) : 0
    };
  }

  loadChart(direction: 'in' | 'out'): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const totalBudget = this.getTotalBudget(accounts);

      if (direction === 'in') {
        forkJoin({
          in: this.transactionService.getTransactionSummary(userId, 'in', this.selectedPeriod),
          out: this.transactionService.getTransactionSummary(userId, 'out', this.selectedPeriod)
        }).subscribe(({ in: inResult, out: outResult }) => {
          const netSavings = Number(inResult.totalAmount || 0) - Number(outResult.totalAmount || 0);
          const calc = this.calculateRemaining(netSavings, totalBudget);
          this.primaryValue = netSavings;
          this.remainingValue = calc.remaining;
          this.remainingPercentage = calc.percentage;
        });
      } else {
        this.transactionService.getTransactionSummary(userId, 'out', this.selectedPeriod).subscribe(result => {
          const totalSpent = Number(result.totalAmount || 0);
          const calc = this.calculateRemaining(totalSpent, totalBudget);
          this.primaryValue = totalSpent;
          this.remainingValue = calc.remaining;
          this.remainingPercentage = calc.percentage;
        });
      }
    });
  }

  loadChartPerAccount(): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const direction = this.activeView === 'savings' ? 'in' : 'out';

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const budgetAccounts = accounts.filter(a => a?.budget?.amount);
      this.accountAnalytics = [];

      budgetAccounts.forEach(account => {
        if (direction === 'in') {
          forkJoin({
            in: this.transactionService.getAccountTransactionSummary(userId, account._id, 'in', this.selectedPeriod),
            out: this.transactionService.getAccountTransactionSummary(userId, account._id, 'out', this.selectedPeriod)
          }).subscribe(({ in: inResult, out: outResult }) => {
            const netSavings = Number(inResult.totalAmount || 0) - Number(outResult.totalAmount || 0);
            const budget = Number(account.budget?.amount || 0);
            const calc = this.calculateRemaining(netSavings, budget);

            this.accountAnalytics.push({
              accountId: account._id,
              accountName: account.nickname || account.accountNumber,
              primaryValue: netSavings,
              remainingValue: calc.remaining,
              categoryData: [],
              remainingPercentage: calc.percentage
            });
          });
        } else {
          this.transactionService.getAccountTransactionSummary(userId, account._id, 'out', this.selectedPeriod)
            .subscribe(result => {
              const total = Number(result.totalAmount || 0);
              const budget = Number(account.budget?.amount || 0);
              const calc = this.calculateRemaining(total, budget);

              this.transactionService.getCategorySummary(userId, account._id, direction, this.selectedPeriod)
                .subscribe(categoryResult => {
                  const formattedCategoryData = categoryResult.map((item: any) => ({
                    name: item.category,
                    value: Number(item.totalAmount)
                  }));

                  this.accountAnalytics.push({
                    accountId: account._id,
                    accountName: account.nickname || account.accountNumber,
                    primaryValue: total,
                    remainingValue: calc.remaining,
                    categoryData: formattedCategoryData,
                    remainingPercentage: calc.percentage
                  });
                });
            });
        }
      });
    });
  }

  loadSavingsChart(): void {
    this.loadChart('in');
  }

  loadSpendingChart(): void {
    this.loadChart('out');
  }

  onPeriodChange(event: any): void {
    this.selectedPeriod = event.value;
    if (!this.activeView) return;

    const direction = this.activeView === 'savings' ? 'in' : 'out';
    this.loadChart(direction);
    this.loadChartPerAccount();
  }

  onChartTypeChange(event: any): void {
    this.selectedChartType = event.value;
    if (this.selectedChartType === 'Bar') {
      const direction = this.activeView === 'savings' ? 'in' : 'out';
      this.loadCategoryData(direction);
    }
  }

  loadCategoryData(direction: 'in' | 'out'): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      if (!accounts?.length) {
        this.categoryData = [];
        return;
      }

      const totals: Record<string, number> = {};
      let completed = 0;

      accounts.forEach(account => {
        this.transactionService.getCategorySummary(userId, account._id, direction, this.selectedPeriod)
          .subscribe(data => {
            data.forEach((item: any) => {
              totals[item.category] = (totals[item.category] || 0) + Number(item.totalAmount || 0);
            });

            if (++completed === accounts.length) {
              this.categoryData = Object.entries(totals)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);
            }
          });
      });
    });
  }

  resetChartFilters(): void {
    this.selectedPeriod = 'Last Week';
    this.selectedChartType = null;
  }
}
