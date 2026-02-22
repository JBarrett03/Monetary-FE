import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './line.html',
  styleUrl: './line.css',
})
export class Line implements OnChanges {

  @Input() mode: 'savings' | 'spent' = 'savings';
  @Input() primaryValue = 0;
  @Input() remainingValue = 0;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) return;

    this.createLineChart();
  }

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