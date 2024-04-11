import { Component, OnDestroy } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HelperService } from '../services/helper.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnDestroy {
  multi = [
    {
      name: 'frequency',
      series: [
        {
          name: '2010',
          value: 8940000,
        },
        {
          name: '2011',
          value: 5000000,
        },
        {
          name: '2012',
          value: 7200000,
        },
      ],
    },
  ];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Hz';
  timeline: boolean = true;

  // colorScheme = {
  //   domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  getResults$$: Subscription | undefined;
  resultRows: [] | undefined;
  resultSeries: string[] = [];
  xAxisName = '';
  yAxisName = '';

  constructor(private helperService: HelperService) {}

  getResults() {
    this.getResults$$ = this.helperService
      .getResult('auto')
      .subscribe((resultRows) => {
        this.resultRows = resultRows;
        this.resultSeries = this.getSeriesNames(this.resultRows);
      });
  }

  getSeriesNames(resultRows: any) {
    let seriesNames: string[] = [];
    if (resultRows.length > 0) {
      let firstRow = resultRows[0];
      for (const item in firstRow) {
        if (firstRow.hasOwnProperty(item)) {
          seriesNames.push(item.toString());
        }
      }
    }
    return seriesNames;
  }

  drawChart() {}

  ngOnDestroy(): void {
    if (this.getResults$$) {
      this.getResults$$.unsubscribe();
    }
  }
}
