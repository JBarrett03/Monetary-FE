import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

/**
 * Pie component - renders a Highcharts pie chart based on input data for savings or spending analytics.
 * Accepts mode ('savings' or 'spent'), primary value, and remaining value as inputs to configure the chart.
 * Dynamically updates the chart when input values change and ensures proper resizing on view changes.
 */
@Component({
  selector: 'app-pie',
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './pie.html',
  styleUrl: './pie.css',
})

/**
 * Component logic for rendering a Highcharts pie chart based on input data.
 * Listens for changes to input properties and updates the chart accordingly.
 */
export class Pie implements OnChanges {

  /**
   * Input property to determine the mode of the chart, which can be 'savings' or 'spent'.
   * This affects the chart title, labels, and colors used in the visualization.
   */
  @Input() mode: 'savings' | 'spent' = 'savings';

  /**
   * Input property for the primary value to be displayed in the chart (e.g., amount saved or spent).
   * This value is used to calculate the proportions in the pie chart.
   */
  @Input() primaryValue = 0;

  /**
   * Input property for the remaining value to be displayed in the chart (e.g., remaining budget).
   * This value is used alongside the primary value to calculate the proportions in the pie chart.
   */
  @Input() remainingValue = 0;

  /**
   * Highcharts instance used for rendering the pie chart. This is passed to the HighchartsChart component in the template.
   */
  Highcharts: typeof Highcharts = Highcharts;

  /**
   * Chart options for configuring the Highcharts pie chart. This object is updated based on input values and mode.
   */
  chartOptions: Highcharts.Options = {};

  /**
   * Flag to indicate when the chart should be updated. This is set to true after chart options are updated to trigger a re-render.
   */
  updateFlag = false;

  /**
   * Reference to the Highcharts chart instance, which can be used for manual updates or resizing.
   */
  private chart?: Highcharts.Chart;

  /**
   * Callback function that is called when the Highcharts chart is initialized. It receives the chart instance as an argument.
   * This function stores the chart instance in the component for later use (e.g., resizing).
   */
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chart = chart;
    setTimeout(() => this.chart?.reflow(), 0);
  };

  /**
   * Lifecycle hook that is called when any of the input properties change. It checks if relevant properties have changed and updates the chart accordingly.
   * If the mode, primary value, or remaining value changes, it calls the createPieChart method to update the chart options and trigger a re-render.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) return;

    this.createPieChart();

    setTimeout(() => {
      this.chart?.reflow();
    }, 0);
  }

  /**
   * Method to create and update the Highcharts pie chart options based on the current mode, primary value, and remaining value.
   * It configures the chart title, labels, colors, and data series according to whether the mode is 'savings' or 'spent'.
   * After updating the chart options, it sets the updateFlag to true to trigger a re-render of the chart.
   */
  private createPieChart() {
    const isSavings = this.mode === 'savings';
    const title = isSavings ? 'Savings Budget Overview' : 'Spending Overview';
    const primaryLabel = isSavings ? 'Saved' : 'Spent';
    const primaryColor = isSavings ? '#43a047' : '#e53935';
    const remainingColor = isSavings ? '#e53935' : '#43a047';

    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: title
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
          { name: primaryLabel, y: this.primaryValue, color: primaryColor },
          { name: 'Remaining', y: this.remainingValue, color: remainingColor }
        ]
      }]
    };

    this.updateFlag = true;
  }

}
