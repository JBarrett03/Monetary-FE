import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { Pie } from '../charts/pie/pie';
import { HorizontalBar } from '../charts/horizontal-bar/horizontal-bar';
import { MatSelectModule } from '@angular/material/select';
import { Line } from '../charts/line/line';
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
  selectedChartType: 'Pie' | 'Bar' | 'Line' = 'Pie';

  /**
   * List of available chart types for selection in the UI.
   */
  chart_type_list = ['Pie', 'Bar', 'Line'];

  /**
   * Method to show the savings view, which displays analytics related to money saved.
   * Sets the activeView variable to 'savings' to trigger the display of the savings analytics.
   */
  showSavings() {
    this.activeView = 'savings';
    setTimeout(() => {
      this.loadSavingsChart();
    });
  }

  /**
   * Method to show the spent view, which displays analytics related to money spent.
   * Sets the activeView variable to 'spent' to trigger the display of the spending analytics.
   */
  showSpent() {
    this.activeView = 'spent';
    setTimeout(() => {
      this.loadSpendingChart();
    });
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
  }
}
