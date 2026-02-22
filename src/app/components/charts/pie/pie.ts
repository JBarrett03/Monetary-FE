import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-pie',
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './pie.html',
  styleUrl: './pie.css',
})
export class Pie implements OnChanges {

  @Input() mode: 'savings' | 'spent' = 'savings';
  @Input() primaryValue = 0;
  @Input() remainingValue = 0;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  private chart?: Highcharts.Chart;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chart = chart;
    setTimeout(() => this.chart?.reflow(), 0);
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) return;

    this.createPieChart();

    setTimeout(() => {
      this.chart?.reflow();
    }, 0);
  }

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
