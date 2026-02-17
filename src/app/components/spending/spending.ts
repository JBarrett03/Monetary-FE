import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

/**
 * Spending component - placeholder for spending analytics features.
 * This component is intended for displaying spending summaries, charts, and analysis.
 * Currently serves as a foundation for future development.
 */
@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})

/**
 * Spending class - the component logic for the spending page.
 * To be implemented with spending analysis and visualization features.
 */
export class Spending {

  /**
 * Constructor for Spending component. Currently does not perform any initialization. 
 */
  constructor(private accountService: AccountService) { }

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
   * Chart options for configuring the appearance and data of the Highcharts charts.
   * This object will be populated with the appropriate configuration when loading the savings chart.
   */
  chartOptions: Highcharts.Options = {};

  chartRef: Highcharts.Chart | null = null;

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

      if (this.chartRef) {
        this.chartRef.reflow();
      }
    }, 450);
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

  loadSavingsChart() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) {
      return;
    }

    this.accountService.getAccount(userId, accountId).subscribe(account => {
      if (!account.budget) return;

      const totalBudget = account.budget.amount;
      const spent = account.budgetSpent || 0;
      const remaining = account.budgetRemaining || totalBudget;

      this.chartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Savings Budget Overview'
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y:.2f})'
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
    });
  }

}
