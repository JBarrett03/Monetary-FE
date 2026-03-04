import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { UtilityService } from '../../services/utility-service';
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

export class Spending implements OnInit{

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

  totalBalance = 0;

  activeAccounts = 0;

  weeklyNet = 0;

  summaryLoaded = false;

  accountAnalytics: {
    accountId: string;
    accountName: string;
    primaryValue: number;
    remainingValue: number;
    categoryData: { name: string; value: number }[];
    remainingPercentage: number;
  }[] = [];

  showExportDropdown = false;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    public utility: UtilityService
  ) { }

  ngOnInit() {
    this.loadSummary();
  }

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

  loadChart(direction: 'in' | 'out'): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const totalBudget = this.utility.getTotalBudget(accounts);

      if (direction === 'in') {
        forkJoin({
          in: this.transactionService.getTransactionSummary(userId, 'in', this.selectedPeriod),
          out: this.transactionService.getTransactionSummary(userId, 'out', this.selectedPeriod)
        }).subscribe(({ in: inResult, out: outResult }) => {
          const netSavings = Number(inResult.totalAmount || 0) - Number(outResult.totalAmount || 0);
          const calc = this.utility.calculateRemaining(netSavings, totalBudget);
          this.primaryValue = netSavings;
          this.remainingValue = calc.remaining;
          this.remainingPercentage = calc.percentage;
        });
      } else {
        this.transactionService.getTransactionSummary(userId, 'out', this.selectedPeriod).subscribe(result => {
          const totalSpent = Number(result.totalAmount || 0);
          const calc = this.utility.calculateRemaining(totalSpent, totalBudget);
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
            out: this.transactionService.getAccountTransactionSummary(userId, account._id, 'out', this.selectedPeriod),
            categories: this.transactionService.getCategorySummary(userId, account._id, 'in', this.selectedPeriod)
          }).subscribe(({ in: inResult, out: outResult, categories }) => {
            const netSavings = Number(inResult.totalAmount || 0) - Number(outResult.totalAmount || 0);
            const budget = Number(account.budget?.amount || 0);
            const calc = this.utility.calculateRemaining(netSavings, budget);

            const formattedCategoryData = categories.map((item: any) => ({
              name: item.category,
              value: Number(item.totalAmount)
            }));

            this.accountAnalytics.push({
              accountId: account._id,
              accountName: account.nickname || account.accountNumber,
              primaryValue: netSavings,
              remainingValue: calc.remaining,
              categoryData: formattedCategoryData,
              remainingPercentage: calc.percentage
            });
          });
        } else {
          this.transactionService.getAccountTransactionSummary(userId, account._id, 'out', this.selectedPeriod)
            .subscribe(result => {
              const total = Number(result.totalAmount || 0);
              const budget = Number(account.budget?.amount || 0);
              const calc = this.utility.calculateRemaining(total, budget);

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
      this.loadChartPerAccount();
    }
  }

  toggleView() {
    if (this.activeView === 'savings') {
      this.showSpent();
    } else if (this.activeView === 'spent') {
      this.showSavings();
    }
  }

  toggleExportDropdown() {
    this.showExportDropdown = !this.showExportDropdown;
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

  generateCSV(): void {
    const rows: string[] = [];

    rows.push(`Section,Name,Primary Value,Remaining,Remaining %,Category,Amount`);
    rows.push(`Overall,Total,${this.primaryValue},${this.remainingValue},${this.remainingPercentage},,`);

    if (this.categoryData?.length) {
      this.categoryData.forEach(category => {
        rows.push(`Category Total,,,,,${category.name},${category.value}`);
      });
    }

    if (this.accountAnalytics?.length) {
      this.accountAnalytics.forEach(account => {
        rows.push(`Account,${account.accountName},${account.primaryValue},${account.remainingValue},${account.remainingPercentage},,`);

        account.categoryData?.forEach(category => {
          rows.push(`Account Category,${account.accountName},,, ,${category.name},${category.value}`);
        });
      });
    }

    const csvContent = "\uFEFF" + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    link.download = `spending-report-${this.selectedPeriod.replace(' ', '-')}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadSummary() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      this.totalBalance = accounts.reduce((sum: number, acc: any) => sum + Number(acc.balance || 0), 0);
      
      this.activeAccounts = accounts.length;

      this.transactionService.getTransactionSummary(userId, 'in', 'Last Week').subscribe(income => {
        this.transactionService.getTransactionSummary(
          userId, 'out', 'Last Week').subscribe(spending => {
            const totalIn = Number(income.totalAmount || 0);
            const totalOut = Number(spending.totalAmount || 0);

            this.weeklyNet = totalIn - totalOut;
            this.summaryLoaded = true;
          });
      });
    });
  }
}