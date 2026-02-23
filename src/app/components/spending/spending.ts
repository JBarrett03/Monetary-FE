import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { Pie } from '../charts/pie/pie';
import { HorizontalBar } from '../charts/horizontal-bar/horizontal-bar';
import { MatSelectModule } from '@angular/material/select';
import { Line } from '../charts/line/line';
import html2pdf from 'html2pdf.js';

/**
 * Spending component - displays budget and spending analytics with interactive charts.
 * Provides two views: 'savings' (remaining budget) and 'spent' (amount spent from budget).
 * Uses Highcharts to visualize budget breakdown and spending patterns.
 * Includes slide-in panel animation for viewing details and data export capability.
 */
@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, Pie, HorizontalBar, Line, MatSelectModule],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})

/**
 * Component logic for budget analytics and spending visualization.
 * Toggles between savings and spending views, loads account data, and renders Highcharts visualizations.
 */
export class Spending {

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  /**
   * Constructor for Spending component.
   * @param accountService Service for fetching account and budget data
   * @param transactionService Service for fetching transaction data
   */
  constructor(private accountService: AccountService, private transactionService: TransactionService) { }

  /**
 * The account object containing account information such as balance, account number,
 * currency, and account type (e.g., 'savings', 'checking'). Null until account data is loaded.
 */
  account: any | null = null;

  /**
   * The active view for spending analytics, which can be 'savings', 'spent', or null (no view).
   * This variable controls which spending analytics view is currently displayed to the user.
   */
  activeView: 'savings' | 'spent' | null = null;

  /**
   * Calculated primary chart value for the selected mode.
   */
  primaryValue = 0;

  /**
   * Calculated remaining chart value for the selected mode.
   */
  remainingValue = 0;

  /**
   * List of available time periods for filtering analytics data.
   */
  period_list = ['Weekly', 'Monthly', 'Yearly', 'Custom'];

  /**
   * The currently selected chart type for displaying analytics data.
   * Can be 'Pie', 'Bar', or 'Line'. Defaults to 'Pie'.
   */
  selectedChartType: 'Pie' | 'Bar' | 'Line' | null = null;

  /**
   * List of available chart types for selection in the UI.
   */
  chart_type_list = ['Pie', 'Bar', 'Line'];

  /**
 * Input property for category data to be displayed in the horizontal bar chart.
 * This is an array of objects, each containing a category name and its corresponding value.
 */
  categoryData: { name: string, value: number }[] = [];

  /**
   * List of account analytics data for all accounts, used to display multiple charts if needed.
   * Each entry contains account ID, account name, primary value, and remaining value for the chart.
   */
  accountAnalytics: { accountId: string, accountName: string, primaryValue: number, remainingValue: number }[] = [];

  /**
   * Method to generate a PDF report of the current chart view. Uses the html2pdf library to capture the chart container
   * and save it as a PDF file named 'spending_report.pdf'. Configures options for PDF generation such as margins,
   * image quality, and page format.
   */
  generatePDF(): void {
    if (!this.chartContainer?.nativeElement) return;

    const content = this.chartContainer.nativeElement;
    const options = {
      margin: 10,
      filename: 'spending_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    (html2pdf as any)().set(options).from(content).save();
  }

  /**
   * Method to show the savings view, which displays analytics related to money saved.
   * Sets the activeView variable to 'savings' to trigger the display of the savings analytics.
   */
  showSavings() {
    this.activeView = 'savings';
    this.loadSavingsChart();
  }

  /**
   * Method to show the spent view, which displays analytics related to money spent.
   * Sets the activeView variable to 'spent' to trigger the display of the spending analytics.
   */
  showSpent() {
    this.activeView = 'spent';
    this.loadSpendingChart();
    this.loadCategoryData('out');
  }

  /**
   * Method to close the currently active view and return to the default state with no analytics displayed.
   * Sets the activeView variable to null, which hides any active analytics view.
   */
  closeView() {
    this.activeView = null;
  }

  /**
   * Loads the pie chart data for either savings or spending based on the provided direction.
   * Fetches account and transaction summary data to calculate primary and remaining values for the chart.
   * @param direction 'in' for savings, 'out' for spending
   */
  loadChart(direction: 'in' | 'out') {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    this.primaryValue = 0;
    this.remainingValue = 0;
    this.accountAnalytics = [];

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const budgetAccounts = accounts.filter(a => a?.budget?.amount);

      if (budgetAccounts.length === 0) return;

      let goal = 0;
      let actual = 0;
      let completed = 0;

      budgetAccounts.forEach(account => {
        goal += Number(account.budget.amount);
        this.transactionService.getTransactionSummary(userId, account._id, direction).subscribe(summary => {
          actual += Number(summary?.totalAmount || 0);
          const accountBalance = Number(summary?.totalAmount || 0);
          const accountGoal = Number(account.budget.amount);

          this.accountAnalytics.push({
            accountId: account._id,
            accountName: account.nickname || account.accountNumber,
            primaryValue: accountBalance,
            remainingValue: Math.max(accountGoal - accountBalance, 0)
          })
          completed += 1;

          if (completed === budgetAccounts.length) {
            this.primaryValue = actual;
            this.remainingValue = Math.max(goal - actual, 0);
          }
        });
      });
    });
  }

  /**
  * Loads the savings chart data and updates chart input values.
   */
  loadSavingsChart() {
    this.loadChart('in');
  }

  /**
   * Loads the spending chart data and updates chart input values.
   */
  loadSpendingChart() {
    this.loadChart('out');
  }

  /**
   * Event handler for when the user changes the selected time period for analytics data.
   * Reloads the chart data based on the new time period selection.
   * @param event The event object containing information about the selected time period
   */
  onPeriodChange(event: any) {
    this.loadChart(this.activeView === 'savings' ? 'in' : 'out');
  }

  /**
   * Event handler for when the user changes the selected chart type for analytics data.
   * Updates the selectedChartType variable to reflect the new selection, which triggers a change in the displayed chart.
   * @param event The event object containing information about the selected chart type
   */
  onChartTypeChange(event: any) {
    this.selectedChartType = event.value;
    if (this.selectedChartType === 'Bar') {
      const direction = this.activeView === 'savings' ? 'in' : 'out';
      this.loadCategoryData(direction);
    }
  }

  /**
 * Loads category summary data for the specified transaction direction and updates the categoryData input for the horizontal bar chart.
 * Fetches account data and then retrieves category summaries for each account, aggregating totals by category.
 * @param direction 'in' for savings categories, 'out' for spending categories
 */
  loadCategoryData(direction: 'in' | 'out') {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const totals: Record<string, number> = {};
      let completed = 0;

      if (!accounts || accounts.length === 0) {
        this.categoryData = [];
        return;
      }

      accounts.forEach(account => {
        this.transactionService.getCategorySummary(userId, account._id, direction).subscribe(data => {
          data.forEach((item: any) => {
            totals[item.category] = (totals[item.category] || 0) + Number(item.totalAmount || 0);
          });
          completed += 1;

          if (completed === accounts.length) {
            this.categoryData = Object.entries(totals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
          }
        });
      });
    });
  }
}
