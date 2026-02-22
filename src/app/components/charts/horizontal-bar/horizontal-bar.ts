import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

/**
 * HorizontalBar component - renders a Highcharts horizontal bar chart based on input data for savings or spending analytics.
 * Accepts mode ('savings' or 'spent'), primary value, and remaining value as inputs to configure the chart.
 * Dynamically updates the chart when input values change and ensures proper resizing on view changes.
 */
@Component({
  selector: 'app-horizontal-bar',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './horizontal-bar.html',
  styleUrl: './horizontal-bar.css',
})

/**
 * Component logic for rendering a Highcharts horizontal bar chart based on input data.
 * Listens for changes to input properties and updates the chart accordingly.
 */
export class HorizontalBar implements OnChanges {

  /**
   * Input property to determine the mode of the chart, which can be 'savings' or 'spent'.
   * This affects the chart title, labels, and colors used in the visualization.
   */
  @Input() mode: 'savings' | 'spent' = 'savings';

  /**
   * Input property for category data to be displayed in the horizontal bar chart.
   * This is an array of objects, each containing a category name and its corresponding value.
   */
  @Input() categoryData: { name: string, value: number }[] = [];

  /**
   * Highcharts instance used for rendering the horizontal bar chart. This is passed to the HighchartsChart component in the template.
   */
  Highcharts: typeof Highcharts = Highcharts;

  /**
   * Chart options for configuring the Highcharts horizontal bar chart. This object is updated based on input values and mode.
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
    if (!changes['categoryData']) return;
    this.createBarChart();
  }

  /**
   * Method to create and configure the Highcharts horizontal bar chart based on the current input values and mode.
   * Sets the chart options and updates the chart when called.
   */
  private createBarChart() {

    const categories = this.categoryData.map(category => category.name);
    const values = this.categoryData.map(category => category.value);

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Spending by Category'
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Amount'
        }
      },
      series: [{
        type: 'bar',
        name: 'Amount',
        data: values
      }]
    };
    this.updateFlag = true;
  }
}