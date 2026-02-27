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

  @Input() categoryData: { name: string, value: number }[] = [];

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {};

  updateFlag = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['categoryData']) return;
    this.createBarChart();
  }

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