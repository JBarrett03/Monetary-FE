import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-horizontal-bar',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './horizontal-bar.html',
  styleUrl: './horizontal-bar.css',
})
export class HorizontalBar implements OnChanges {

  @Input() mode: 'savings' | 'spent' = 'savings';
  @Input() primaryValue = 0;
  @Input() remainingValue = 0;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['mode'] && !changes['primaryValue'] && !changes['remainingValue']) return;

    this.createBarChart();
  }

  private createBarChart() {
    const isSavings = this.mode === 'savings';
    const primaryLabel = isSavings ? 'Saved' : 'Spent';

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Overview'
      },
      xAxis: {
        categories: [primaryLabel, 'Remaining']
      },
      series: [{
        type: 'bar',
        data: [this.primaryValue, this.remainingValue]
      }]
    };
    this.updateFlag = true;
  }
}