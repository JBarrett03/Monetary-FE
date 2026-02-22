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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) {
      return;
    }

    this.createPieChart();
  }

  private createPieChart() {
    const isSavings = this.mode === 'savings';
    const title = isSavings ? 'Savings Budget Overview' : 'Spending Overview';
    const primaryLabel = isSavings ? 'Budget' : 'Spent';

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
          { name: primaryLabel, y: this.primaryValue, color: '#e53935' },
          { name: 'Remaining', y: this.remainingValue, color: '#43a047' }
        ]
      }]
    };

    this.updateFlag = true;
  }

}
