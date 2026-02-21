import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { TransactionService } from '../../services/transaction-service';
/**
 * Spending component - displays budget and spending analytics with interactive charts.
 * Provides two views: 'savings' (remaining budget) and 'spent' (amount spent from budget).
 * Uses Highcharts to visualize budget breakdown and spending patterns.
 * Includes slide-in panel animation for viewing details and data export capability.
 */
@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
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
   * The active view for spending analytics, which can be 'savings', 'spent', or null (no view).
   * This variable controls which spending analytics view is currently displayed to the user.
   */
  activeView: 'savings' | 'spent' | null = null;

  /**
   * Highcharts instance for rendering charts in the spending analytics views.
   * This is used to create and display charts based on the user's spending data.
   */
  Highcharts: typeof Highcharts = Highcharts;

  /**
   * Configuration object for Highcharts chart. Contains chart type, data series, labels, and display options.
   * Updated dynamically when switching between 'savings' and 'spent' views.
   */
  chartOptions: Highcharts.Options = {};

  /**
   * Reference to the Highcharts chart instance, used for manual updates and reflowing after data changes.
   * This allows the component to programmatically control the chart rendering and ensure it updates correctly when the view changes.
   */
  chartRef: Highcharts.Chart | null = null;

  /**
   * Flag to trigger chart updates when data changes. Set to true when new data is loaded and the chart needs to be re-rendered.
   * This is used in conjunction with the chartRef to ensure that the chart updates with the latest data when the user switches views or when new transaction data is fetched.
   */
  updateFlag = false;

  /**
   * Chart callback function that is called when the Highcharts chart is initialized. It receives the chart instance as a parameter and assigns it to the chartRef variable for later use.
   * This allows the component to keep a reference to the chart instance, enabling manual updates and reflowing when necessary.
   */
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

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
  }

  /**
   * Method to close the currently active view and return to the default state with no analytics displayed.
   * Sets the activeView variable to null, which hides any active analytics view.
   */
  closeView() {
    this.activeView = null;
  }

  /**
   * Loads the savings chart data and configuration for the Highcharts instance. It retrieves the user's account information, including budget and spending data, and constructs a pie chart to visualize the breakdown of spent vs remaining budget.
   * The chart displays the percentage and amount of money spent and remaining in the user's budget, providing insights into their savings progress.
   */
  loadSavingsChart() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    this.accountService.getAccount(userId, accountId).subscribe(account => {
      if (!account.budget) return;

      const totalBudget = account.budget.amount;

      this.transactionService.getTransactionSummary(userId, accountId, 'out').subscribe(summary => {
        console.log('Transaction summary:', summary);
        const spent = summary.totalAmount || 0;
        const remaining = Math.max(totalBudget - spent, 0);

        this.chartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Savings Budget Overview'
          },
          plotOptions: {
            pie: {
              innerSize: '60%',
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.2f}'
              }
            }
          },
          series: [{
            type: 'pie',
            data: [
              { name: 'Spent', y: spent, color: '#e53935' },
              { name: 'Remaining', y: remaining, color: '#43a047' }
            ]
          }]
        };
        this.updateFlag = true;
      });
    });
  }
}
