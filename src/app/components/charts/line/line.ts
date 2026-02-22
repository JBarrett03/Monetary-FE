import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

/**
 * Line component - renders a Highcharts line chart based on input data for savings or spending analytics.
 * Accepts mode ('savings' or 'spent'), primary value, and remaining value as inputs to configure the chart.
 * Dynamically updates the chart when input values change and ensures proper resizing on view changes.
 */
@Component({
  selector: 'app-line',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './line.html',
  styleUrl: './line.css',
})

/**
 * Component logic for rendering a Highcharts line chart based on input data.
 * Listens for changes to input properties and updates the chart accordingly.
 */
export class Line implements OnChanges {

  /**
   * Input property to determine the mode of the chart, which can be 'savings' or 'spent'.
   * This affects the chart title, labels, and colors used in the visualization.
   */
  @Input() mode: 'savings' | 'spent' = 'savings';

  /**
   * Input property for the primary value to be displayed in the chart (e.g., amount saved or spent).
   * This value is used to calculate the proportions in the line chart.
   */
  @Input() primaryValue = 0;

  /**
   * Input property for the remaining value to be displayed in the chart (e.g., remaining budget).
   * This value is used alongside the primary value to calculate the proportions in the line chart.
   */
  @Input() remainingValue = 0;

  /**
   * Highcharts instance used for rendering the line chart. This is passed to the HighchartsChart component in the template.
   */
  Highcharts: typeof Highcharts = Highcharts;

  /**
   * Chart options for configuring the Highcharts line chart. This object is updated based on input values and mode.
   */
  chartOptions: Highcharts.Options = {};

  /**
   * Flag to indicate when the chart should be updated. This is set to true after chart options are updated to trigger a re-render.
   */
  updateFlag = false;

  /** 
   * Lifecycle hook that is called when any data-bound property of a directive changes. 
   * @param changes An object of key/value pairs for the set of changed properties. 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) return;

    this.createLineChart();
  }

  /**
   * Method to create and configure the Highcharts line chart based on the current mode, primary value, and remaining value.
   * Sets the chart options and updates the chart to reflect the new data.
   */
  private createLineChart() {
    const isSavings = this.mode === 'savings';
    const primaryLabel = isSavings ? 'Saved' : 'Spent';

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Overview'
      },
      xAxis: {
        categories: [primaryLabel, 'Remaining']
      },
      series: [{
        type: 'line',
        data: [this.primaryValue, this.remainingValue]
      }]
    };
    this.updateFlag = true;
  }
}